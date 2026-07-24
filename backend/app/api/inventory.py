from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import csv
import io
from datetime import datetime, date
from app.auth.security import get_current_user
from app.models.user import User
from app.models.business import Business


from app.models.inventory import Inventory
from app.models.donation import Donation
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.inventory import InventoryCreate
from app.services.inventory_service import (
    add_inventory_item,
    get_inventory,
)

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"]
)


@router.post("/{item_id}/auto-donate")
def auto_donate_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")

    item = db.query(Inventory).filter(
        Inventory.id == item_id,
        Inventory.business_id == business.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    # Create automated donation listing from inventory item
    donation = Donation(
        business_id=business.id,
        food_name=item.product_name,
        food_category=item.category or "General Surplus",
        quantity=f"{item.quantity} {item.unit or 'pcs'}",
        manufacturing_date=item.manufacturing_date,
        expiry_date=item.expiry_date,
        pickup_address=f"{business.address or 'Store Address'}, {business.city or ''}, {business.state or ''}",
        pickup_time="Today (3-Hour Urgent Window)",
        contact_person=business.owner_name or "Store Manager",
        phone=business.phone or "N/A",
        special_instructions="Auto-generated donation from surplus inventory. Fresh and packaged for immediate NGO pickup.",
        image_url=item.image_url,
        status="Available"
    )

    db.add(donation)
    item.status = "Donated"
    db.commit()
    db.refresh(donation)

    return {
        "message": f"Successfully auto-donated '{item.product_name}'!",
        "donation_id": donation.id
    }



@router.post("/")
def create_inventory(
    data: InventoryCreate,
    db: Session = Depends(get_db)
):

    return add_inventory_item(
        db,
        data
    )
@router.get("/my")
def my_inventory(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    business = (
        db.query(Business)
        .filter(Business.user_id == current_user.id)
        .first()
    )

    if business is None:
        raise HTTPException(
            status_code=404,
            detail="Business profile not found."
        )
    return get_inventory(
        db,
        business.id
    )

@router.get("/{business_id}")
def inventory_list(
    business_id: int,
    db: Session = Depends(get_db)
):

    return get_inventory(
        db,
        business_id
    )

@router.post("/upload-csv/{business_id}")
async def upload_inventory_csv(
    business_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file."
        )

    content = await file.read()

    csv_data = io.StringIO(content.decode("utf-8"))

    reader = csv.DictReader(csv_data)

    imported = 0

    for row in reader:

        expiry = datetime.strptime(
            row["expiry_date"],
            "%Y-%m-%d"
        ).date()

        today = date.today()

        days_left = (expiry - today).days

        if days_left < 0:
            status = "Expired"
        elif days_left <= 5:
            status = "Expiring Soon"
        else:
            status = "Fresh"

        item = Inventory(

            business_id=business_id,

            product_name=row["product_name"],

            category=row["category"],

            quantity=row["quantity"],

            unit=row["unit"],

            barcode=row.get("barcode"),

            manufacturing_date=row.get("manufacturing_date"),

            expiry_date=row["expiry_date"],

            purchase_date=row.get("purchase_date"),

            supplier=row.get("supplier"),

            storage_location=row.get("storage_location"),

            image_url=row.get("image_url"),

            status=status

        )

        db.add(item)

        imported += 1

    db.commit()

    return {
        "message": f"{imported} inventory items imported successfully."
    }

@router.delete("/{item_id}")
def delete_inventory_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = (
        db.query(Inventory)
        .filter(Inventory.id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found."
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Inventory item discarded successfully."
    }

