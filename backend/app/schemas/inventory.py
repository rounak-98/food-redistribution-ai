from pydantic import BaseModel


class InventoryCreate(BaseModel):
    business_id: int

    product_name: str
    category: str

    quantity: str
    unit: str

    barcode: str | None = None

    manufacturing_date: str | None = None
    expiry_date: str

    purchase_date: str | None = None

    supplier: str | None = None

    storage_location: str | None = None

    image_url: str | None = None