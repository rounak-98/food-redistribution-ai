from pydantic import BaseModel, EmailStr
from typing import Optional


class IndividualRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    city: str
    state: str
    pincode: str
    latitude: Optional[str] = None
    longitude: Optional[str] = None


class IndividualDonationCreate(BaseModel):
    food_name: str
    food_category: str
    quantity: str
    expiry_date: str
    pickup_address: Optional[str] = None
    pickup_time: Optional[str] = None
    phone: Optional[str] = None
    special_instructions: Optional[str] = None
