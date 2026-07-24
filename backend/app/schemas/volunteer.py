from pydantic import BaseModel, EmailStr
from typing import Optional


class VolunteerRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    vehicle_type: str
    vehicle_number: Optional[str] = None
    city: str
    state: str
    pincode: str
    latitude: Optional[str] = None
    longitude: Optional[str] = None


class DeliveryStatusUpdate(BaseModel):
    status: str  # Accepted, In_Transit, Delivered, Rejected


class VerifyOTPRequest(BaseModel):
    otp: str
