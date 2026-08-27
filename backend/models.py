from .database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey


class Car(Base):
    __tablename__="Cars"
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    owner_id=Column(Integer,ForeignKey("Customers.id"),nullable=True,index=True)
    name=Column(String(50),nullable=False)
    fuel_type=Column(String(20),nullable=False)
    price_per_day=Column(Integer,nullable=False)
    phone=Column(String(20),nullable=True)

class Customer(Base):
    __tablename__="Customers"
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    name=Column(String(50),nullable=False)
    username=Column(String(50),nullable=False,unique=True)
    password=Column(String(255),nullable=False)

class Rental(Base):
    __tablename__="Rentals"
    # Use a surrogate PK so the same customer can rent the same car
    # more than once (different date ranges).
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    car_id=Column(Integer,ForeignKey("Cars.id"),nullable=False,index=True)
    customer_id=Column(Integer,ForeignKey("Customers.id"),nullable=False,index=True)
    date_from=Column(DateTime,nullable=False)
    date_to=Column(DateTime,nullable=False)
    total_amt=Column(Integer,nullable=False)
