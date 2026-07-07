from pydantic import BaseModel, EmailStr


class BusinessRegisterRequest(BaseModel):
    # User Information
    name: str
    email: EmailStr
    password: str
    role: str = "business"

    # Business Information
    business_name: str
    business_type: str
    owner_name: str
    fssai_number: str | None = None
    gst_number: str | None = None

    # Contact Information
    phone: str
    address: str
    city: str
    state: str
    pincode: str