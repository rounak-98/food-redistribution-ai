from datetime import datetime
from sqlalchemy.orm import Session

from app.models.inventory import Inventory


def calculate_status(expiry_date: str):
    """
    Returns:
    Fresh
    Expiring Soon
    Expired
    """

    try:
        expiry = datetime.strptime(expiry_date, "%Y-%m-%d").date()
        today = datetime.today().date()

        days_left = (expiry - today).days

        if days_left < 0:
            return "Expired"

        elif days_left <= 5:
            return "Expiring Soon"

        else:
            return "Fresh"

    except Exception:
        return "Fresh"


def add_inventory_item(db: Session, data):

    status = calculate_status(data.expiry_date)

    item = Inventory(
        business_id=data.business_id,
        product_name=data.product_name,
        category=data.category,
        quantity=data.quantity,
        unit=data.unit,
        barcode=data.barcode,
        manufacturing_date=data.manufacturing_date,
        expiry_date=data.expiry_date,
        purchase_date=data.purchase_date,
        supplier=data.supplier,
        storage_location=data.storage_location,
        image_url=data.image_url,
        status=status
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_inventory(db: Session, business_id: int):

    return (
        db.query(Inventory)
        .filter(Inventory.business_id == business_id)
        .order_by(Inventory.created_at.desc())
        .all()
    )