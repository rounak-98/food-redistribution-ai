from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import csv
import io
from datetime import datetime, date

from app.database.database import get_db
from app.models.inventory import Inventory
from app.models.business import Business
from app.models.user import User
from app.schemas.inventory import InventoryCreate
from app.services.inventory_service import (
    add_inventory_item,
    get_inventory
)
from app.services.donation_service import create_donation
from app.auth.security import get_current_user

router = APIRouter(
    prefix="/api/inventory",
    tags=["Inventory"]
)


@router.post("/")
def add_inventory(
    data: InventoryCreate,
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

    item = add_inventory_item(
        db,
        data
    )

    return {
        "message": "Inventory item added successfully.",
        "item_id": item.id
    }


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
        return []

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Resolve real business ID from current_user if business_id is invalid
    if not business_id or business_id == 0:
        biz = db.query(Business).filter(Business.user_id == current_user.id).first()
        if biz:
            business_id = biz.id
        else:
            raise HTTPException(status_code=404, detail="Business profile not found.")

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid .csv file."
        )

    content = await file.read()
    try:
        csv_text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        csv_text = content.decode("latin-1")

    csv_data = io.StringIO(csv_text)
    reader = csv.DictReader(csv_data)

    imported = 0
    today = date.today()

    for row in reader:
        # Strip keys and values safely
        clean_row = {str(k).strip().lower(): str(v).strip() for k, v in row.items() if k and v is not None}
        
        product_name = clean_row.get("product_name") or clean_row.get("product") or clean_row.get("name") or "Food Item"
        category = clean_row.get("category") or clean_row.get("food_category") or "General"
        quantity = clean_row.get("quantity") or "10"
        unit = clean_row.get("unit") or "pcs"
        raw_expiry = clean_row.get("expiry_date") or clean_row.get("expiry") or clean_row.get("exp_date") or str(today)

        # Parse expiry date flexibly
        expiry = today
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d", "%d/%m/%Y", "%m/%d/%Y"):
            try:
                expiry = datetime.strptime(raw_expiry, fmt).date()
                break
            except ValueError:
                continue

        days_left = (expiry - today).days

        if days_left < 0:
            status = "Expired"
        elif days_left <= 5:
            status = "Expiring Soon"
        else:
            status = "Fresh"

        item = Inventory(
            business_id=business_id,
            product_name=product_name,
            category=category,
            quantity=quantity,
            unit=unit,
            barcode=clean_row.get("barcode"),
            manufacturing_date=clean_row.get("manufacturing_date"),
            expiry_date=expiry.strftime("%Y-%m-%d"),
            purchase_date=clean_row.get("purchase_date"),
            supplier=clean_row.get("supplier"),
            storage_location=clean_row.get("storage_location"),
            image_url=clean_row.get("image_url"),
            status=status
        )

        db.add(item)
        imported += 1

    db.commit()

    return {
        "message": f"Successfully imported {imported} inventory product(s) from CSV!"
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


@router.post("/{item_id}/auto-donate")
def auto_donate_inventory_route(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Inventory).filter(Inventory.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="Inventory item not found."
        )

    # Convert inventory item to donation
    donation_data = type('DonationData', (), {
        "business_id": item.business_id,
        "food_name": item.product_name,
        "food_category": item.category,
        "quantity": f"{item.quantity} {item.unit or 'pcs'}",
        "manufacturing_date": item.manufacturing_date or str(date.today()),
        "expiry_date": item.expiry_date,
        "pickup_address": "Main Store Pickup Location",
        "pickup_time": "10:00 AM - 6:00 PM",
        "contact_person": "Inventory Manager",
        "phone": "+91 98765 43210",
        "special_instructions": "Auto-donated from surplus inventory system",
        "image_url": item.image_url
    })()

    donation = create_donation(db, donation_data)
    item.status = "Donated"
    db.commit()

    return {
        "message": f"'{item.product_name}' has been automatically donated to nearby NGOs!",
        "donation_id": donation.id
    }
