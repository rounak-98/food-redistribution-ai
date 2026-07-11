from pydantic import BaseModel


class DonationCreate(BaseModel):
    business_id: int
    food_name: str
    food_category: str
    quantity: str
    manufacturing_date: str
    expiry_date: str
    pickup_address: str
    pickup_time: str
    contact_person: str
    phone: str
    special_instructions: str | None = None
    image_url: str | None = None