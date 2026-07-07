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

    # Contact
    phone: str
    city: str
    state: str