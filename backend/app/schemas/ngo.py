from pydantic import BaseModel, EmailStr
from typing import Optional


class NGORegisterRequest(BaseModel):
    # User
    name: str
    email: EmailStr
    password: str
    role: str

    # NGO
    ngo_name: str
    registration_number: str
    contact_person: str
    phone: str
    address: str
    city: str
    state: str
    pincode: str


class NGOProfileUpdate(BaseModel):
    ngo_name: Optional[str] = None
    registration_number: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None