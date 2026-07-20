from pydantic import BaseModel, EmailStr


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