from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    # User Information
    name: str
    email: EmailStr
    password: str
    role: str

    # Business Fields
    business_name: str | None = None
    business_type: str | None = None
    owner_name: str | None = None
    fssai_number: str | None = None
    gst_number: str | None = None

    # NGO Fields
    ngo_name: str | None = None
    registration_number: str | None = None
    contact_person: str | None = None

    # Common Contact Information
    phone: str
    address: str | None = None
    city: str
    state: str
    pincode: str


    # Location
    latitude: str | None = None
    longitude: str | None = None


class BusinessProfileUpdate(BaseModel):
    business_name: str | None = None
    business_type: str | None = None
    owner_name: str | None = None
    fssai_number: str | None = None
    gst_number: str | None = None
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    latitude: str | None = None
    longitude: str | None = None
    email: str | None = None