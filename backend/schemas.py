from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class Cars(BaseModel):
    name:str
    fuel_type:str
    price_per_day:int
    phone: Optional[str] = None

class CarsCreate(Cars):
    id:int
    class Config:
        from_attributes=True
    
class CustomerCreate(BaseModel):
    name:str
    username:str
    password:str
    
class CustomerShow(CustomerCreate):
    id:int
    name:str
    username:str
    class Config:
        from_attributes=True

class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class rentalBase(BaseModel):
    car_id:int
    date_from: datetime
    date_to: datetime

# total_amt is intentionally excluded here — it is always computed
# server-side in main.py (rental_days * price_per_day) and must never
# be accepted from the client.
class RentalCreate(rentalBase):
    pass


