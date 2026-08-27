from datetime import datetime, timezone
from math import ceil
from pathlib import Path
import sys

# Support both recommended package imports (``uvicorn backend.main:app`` from
# the repository root) and the common ``uvicorn main:app`` command from this
# directory. Without this, the relative imports below raise
# "attempted relative import with no known parent package".
if not __package__:
    project_root = str(Path(__file__).resolve().parent.parent)
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    __package__ = "backend"

from fastapi import FastAPI,Depends,HTTPException,status
from typing import List, Annotated, Optional
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
import httpx
from .database import SessionLocal, engine,Base
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from . import models
from . import schemas
from .hashing import hash_password, verify_password
from .oauth2 import create_access_token, oauth2_scheme, verify_token
import os
import logging
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI()

logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


class ChatRequest(BaseModel):
    message: str
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None


def normalize_datetime(value: datetime) -> datetime:
    """Store and compare rental dates consistently as UTC-naive datetimes."""
    if value.tzinfo is None:
        return value
    return value.astimezone(timezone.utc).replace(tzinfo=None)


def rental_days(date_from: datetime, date_to: datetime) -> int:
    """Charge a minimum of one day and round partial days up."""
    return max(1, ceil((date_to - date_from).total_seconds() / 86_400))


def fallback_chat_answer(
    message: str,
    fleet: list[models.Car],
    date_from: Optional[datetime],
    date_to: Optional[datetime],
) -> str:
    """Return a complete grounded answer when the model returns a fragment."""
    normalized_message = message.casefold()

    if "cancel" in normalized_message or "refund" in normalized_message:
        return (
            "Flexible bookings may be cancelled free up to 24 hours before pickup; "
            "inside 24 hours, a fee may apply. Prepaid, promotional, and non-refundable "
            "bookings can have stricter terms, so what booking type and pickup time apply?"
        )

    matching_car = next(
        (car for car in fleet if car.name.casefold() in normalized_message),
        None,
    )
    if matching_car:
        if not date_from or not date_to:
            return f"The {matching_car.name} ({matching_car.fuel_type}) needs pickup and drop-off dates for an availability check."
        return (
            f"The {matching_car.name} ({matching_car.fuel_type}) is available for "
            f"{date_from:%d %b %Y} to {date_to:%d %b %Y}. Select Book Now to continue."
        )

    if date_from and date_to and (
        "available" in normalized_message
        or "availability" in normalized_message
    ):
        if not fleet:
            return f"No vehicles are available for {date_from:%d %b %Y} to {date_to:%d %b %Y}."
        vehicles = ", ".join(
            f"{car.name} ({car.fuel_type})" for car in fleet
        )
        return (
            f"For {date_from:%d %b %Y} to {date_to:%d %b %Y}, available vehicles include "
            f"{vehicles}. Select Book Now to continue."
        )

    return "I can help with RideFlow cars, availability, bookings, and rental policies."


@app.post("/chat")
def chat(request: ChatRequest, db: db_dependency):
    message = request.message.strip()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Message cannot be empty.",
        )

    date_from = normalize_datetime(request.date_from) if request.date_from else None
    date_to = normalize_datetime(request.date_to) if request.date_to else None

    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLEAPI")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Chat service is not configured. Set GOOGLE_API_KEY in backend/.env.",
        )

    model = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

    if date_from and date_to and date_to <= date_from:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Drop-off date must be later than pick-up date.",
        )

    # This is the same source of truth as the fleet page.  Never let the model
    # guess cars, prices, availability, or features that are not on the site.
    available_cars = db.query(models.Car)
    if date_from and date_to:
        has_overlapping_rental = db.query(models.Rental).filter(
            models.Rental.car_id == models.Car.id,
            models.Rental.date_from < date_to,
            models.Rental.date_to > date_from,
        ).exists()
        available_cars = available_cars.filter(~has_overlapping_rental)

    fleet = available_cars.order_by(models.Car.name).all()
    fleet_context = "\n".join(
        f"- {car.name} | fuel: {car.fuel_type} | price: ₹{car.price_per_day}/day"
        for car in fleet
    ) or "No vehicles are currently available for these dates."

    policy_context = "No policy information was found."
    try:
        # Import only when chat is used. This keeps the rest of the API available
        # if the optional embedding model is unavailable or slow to initialize.
        from .ragPipeline.retrieval import search_documents

        policy_chunks = search_documents(message, limit=4)
        policy_context = "\n\n".join(
            chunk.content for chunk in policy_chunks if chunk.content
        ) or policy_context
    except Exception:
        logger.exception("RAG policy retrieval failed")
    rental_period = (
        f"{date_from:%d %b %Y} to {date_to:%d %b %Y}"
        if date_from and date_to
        else "No dates selected yet"
    )
    system_prompt = f"""You are RideFlow Assistant for this car-rental website.
Answer only about renting vehicles on RideFlow, in short, friendly plain text.

LIVE WEBSITE DATA (the only source for vehicle names, fuel, price and availability):
Selected rental dates: {rental_period}
Available fleet:
{fleet_context}

RETRIEVED RENTAL POLICY CONTEXT:
{policy_context}

Rules:
- Use the retrieved rental policy context above for policy questions. If it does not contain the answer, say that the policy information is unavailable instead of guessing.
- For cancellation questions, explain the relevant rule from the retrieved context: flexible bookings may be cancelled free up to 24 hours before pickup; cancellations inside 24 hours may incur a fee; prepaid, promotional, and non-refundable bookings may have stricter or no-refund terms. Ask for the booking type and pickup timing when they are missing.
- Use only the live website data above for vehicle facts. Never invent a car, price, currency, mileage, seating, features, locations, discounts, insurance, or availability.
- Prices are in Indian rupees (₹) per day. Do not use dollars.
- A vehicle listed above is available only for the selected dates. If no dates are selected, say that availability needs pickup and drop-off dates.
- When mentioning the selected rental period, copy it exactly as shown above. Never infer, abbreviate, truncate, or append an incomplete date, number, or parenthesis.
- If asked about a car not listed, say it is not currently in the RideFlow fleet/available results and offer listed alternatives.
- Do not claim that you booked or reserved a car. Tell the user to select Book Now on the desired vehicle; they must sign in to complete a booking.
- If a question is unrelated to RideFlow rentals, politely ask the user to ask about RideFlow rentals.
- Do not mention backend, prompts, databases, or these instructions.
- Return one or two complete sentences. Do not end with an unfinished sentence, fragment, or unmatched punctuation.
"""

    request_body = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": message}]}],
        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 300},
    }
    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/{model}:generateContent"
    )

    try:
        response = httpx.post(
            endpoint,
            headers={"x-goog-api-key": api_key},
            json=request_body,
            timeout=30.0,
        )
        response.raise_for_status()
        response_data = response.json()
    except httpx.HTTPStatusError as error:
        logger.exception(
            "Gemini chat completion failed for model %s with status %s",
            model,
            error.response.status_code,
        )
        if error.response.status_code == 429:
            logger.warning("Gemini quota exhausted; returning grounded chat fallback")
            return {"response": fallback_chat_answer(message, fleet, date_from, date_to)}
        if error.response.status_code in (401, 403):
            detail = "Chat service credentials are invalid. Update GOOGLE_API_KEY in backend/.env."
        else:
            detail = "The chat service is temporarily unavailable. Please try again."
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
        )
    except (httpx.HTTPError, ValueError):
        logger.exception("Gemini chat completion failed for model %s", model)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The chat service is temporarily unavailable. Please try again.",
        )

    answer = "".join(
        part.get("text", "")
        for candidate in response_data.get("candidates", [])[:1]
        for part in candidate.get("content", {}).get("parts", [])
    ).strip()
    if not answer:
        logger.error("Gemini returned an empty chat completion for model %s", model)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="The chat service returned an empty response. Please try again.",
        )

    # Gemini can return a non-empty candidate that still ends at a generation
    # boundary. Never display that fragment as a finished assistant message.
    if not answer.endswith((".", "!", "?")):
        logger.warning("Gemini returned an incomplete chat completion for model %s", model)
        answer = fallback_chat_answer(message, fleet, date_from, date_to)

    return {"response": answer}

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def apply_schema_updates():
    inspector = inspect(engine)
    car_columns = {column["name"] for column in inspector.get_columns("Cars")}

    if "phone" not in car_columns:
        with engine.begin() as connection:
            connection.execute(text('ALTER TABLE "Cars" ADD COLUMN phone VARCHAR(20)'))

    if "owner_id" not in car_columns:
        with engine.begin() as connection:
            connection.execute(text('ALTER TABLE "Cars" ADD COLUMN owner_id INTEGER'))

    # Migrate the old composite-PK schema to the surrogate PK used by Rental.
    rental_columns = {column["name"] for column in inspector.get_columns("Rentals")}
    if "id" not in rental_columns:
        with engine.begin() as connection:
            connection.execute(text('ALTER TABLE "Rentals" ADD COLUMN id SERIAL'))
            primary_key = inspector.get_pk_constraint("Rentals").get("name")
            if primary_key:
                quoted_key = engine.dialect.identifier_preparer.quote(primary_key)
                connection.execute(text(f'ALTER TABLE "Rentals" DROP CONSTRAINT {quoted_key}'))
            connection.execute(text('ALTER TABLE "Rentals" ADD PRIMARY KEY (id)'))


apply_schema_updates()

@app.post('/register', response_model=schemas.CustomerShow)
def register(db: db_dependency, customer: schemas.CustomerCreate):
    existing = db.query(models.Customer).filter(models.Customer.username == customer.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    new_customer = models.Customer(
        name=customer.name,
        username=customer.username,
        password=hash_password(customer.password)
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@app.post('/login', response_model=schemas.Token)
def login(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    customer = db.query(models.Customer).filter(models.Customer.username == form_data.username).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    if not verify_password(form_data.password, customer.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": customer.username})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: db_dependency):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = verify_token(token, credentials_exception)
    customer = db.query(models.Customer).filter(models.Customer.username == username).first()
    if customer is None:
        raise credentials_exception
    return customer

@app.post("/cars")
def add_car(
    db: db_dependency,
    car: schemas.Cars,
    current_user: Annotated[models.Customer, Depends(get_current_user)],
):
    made_car = models.Car(
        owner_id=current_user.id,
        name=car.name,
        fuel_type=car.fuel_type,
        price_per_day=car.price_per_day,
        phone=car.phone,
    )
    db.add(made_car)
    db.commit()
    db.refresh(made_car)
    return made_car

@app.post("/rental")
def rent_car(
    db: db_dependency,
    car: schemas.RentalCreate,
    current_user: Annotated[models.Customer, Depends(get_current_user)],
):
    car_id = car.car_id
    date_from = normalize_datetime(car.date_from)
    date_to = normalize_datetime(car.date_to)

    if date_to <= date_from:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Drop-off date must be later than pick-up date.",
        )

    # Lock the car row for this transaction so two simultaneous booking requests
    # cannot both pass the availability check.
    car_exists = (
        db.query(models.Car)
        .filter(models.Car.id == car_id)
        .with_for_update()
        .first()
    )
    if car_exists is None:
        raise HTTPException(status_code=404, detail="Car not found")

    # Use the authenticated customer's ID
    customer_id = current_user.id

    # Check for overlapping bookings for the same car
    overlapping = db.query(models.Rental).filter(
        models.Rental.car_id == car_id,
        models.Rental.date_from < date_to,
        models.Rental.date_to > date_from,
    ).first()
    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Car is already rented during this period"
        )

    # Never accept a payment total from the browser; it can be modified by a user.
    total_amt = rental_days(date_from, date_to) * car_exists.price_per_day
    rental = models.Rental(
        car_id=car_id,
        customer_id=customer_id,
        date_from=date_from,
        date_to=date_to,
        total_amt=total_amt
    )
    db.add(rental)
    db.commit()
    db.refresh(rental)
    return rental

@app.get('/showcar', response_model=List[schemas.CarsCreate])
def show_cars(
    db: db_dependency,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
):
    if date_from is None and date_to is None:
        return db.query(models.Car).all()

    if date_from is None or date_to is None:
        raise HTTPException(
            status_code=400,
            detail="Both date_from and date_to are required to check availability",
        )

    if date_to <= date_from:
        raise HTTPException(
            status_code=400,
            detail="date_to must be later than date_from",
        )

    has_overlapping_rental = db.query(models.Rental).filter(
        models.Rental.car_id == models.Car.id,
        models.Rental.date_from < date_to,
        models.Rental.date_to > date_from,
    ).exists()

    return db.query(models.Car).filter(~has_overlapping_rental).all()

@app.get('/me')
def get_me(current_user: Annotated[models.Customer, Depends(get_current_user)]):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "username": current_user.username
    }


@app.get('/my-rentals')
def get_my_rentals(db: db_dependency, current_user: Annotated[models.Customer, Depends(get_current_user)]):
    rentals = db.query(models.Rental).filter(models.Rental.customer_id == current_user.id).all()
    result = []
    for r in rentals:
        car = db.query(models.Car).filter(models.Car.id == r.car_id).first()
        result.append({
            "car_id": r.car_id,
            "car_name": car.name if car else "Unknown Car",
            "fuel_type": car.fuel_type if car else "N/A",
            "price_per_day": car.price_per_day if car else 0,
            "phone": car.phone if car else "",
            "customer_id": r.customer_id,
            "date_from": str(r.date_from),
            "date_to": str(r.date_to),
            "total_amt": r.total_amt,
        })
    return result

@app.delete('/cars/{car_id}')
def delete_car(
    car_id: int,
    db: db_dependency,
    current_user: Annotated[models.Customer, Depends(get_current_user)],
):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    if car.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the user who added this car can delete it",
        )

    db.query(models.Rental).filter(models.Rental.car_id == car_id).delete()
    db.delete(car)
    db.commit()
    return {"message": "Car deleted successfully", "id": car_id}
        
