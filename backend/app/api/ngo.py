from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.database.database import get_db
from app.models.donation import Donation
from app.models.business import Business

router = APIRouter(
    prefix="/api/ngo",
    tags=["NGO"]
)
@router.get("/donations")
def get_available_donations(db: Session = Depends(get_db)):

    donations = (
        db.query(Donation)
        .filter(Donation.status == "Available")
        .order_by(Donation.created_at.desc())
        .all()
    )

    return donations
@router.get("/donations/{donation_id}")
def get_donation_details(
    donation_id: int,
    db: Session = Depends(get_db)
):

    result = (
        db.query(Donation, Business)
        .join(Business, Donation.business_id == Business.id)
        .filter(Donation.id == donation_id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    donation, business = result

    return {
         "id": donation.id,
        "food_name": donation.food_name,
        "food_category": donation.food_category,
        "quantity": donation.quantity,
        "manufacturing_date": donation.manufacturing_date,
        "expiry_date": donation.expiry_date,
        "pickup_address": donation.pickup_address,
        "pickup_time": donation.pickup_time,
        "contact_person": donation.contact_person,
        "phone": donation.phone,
        "special_instructions": donation.special_instructions,
        "image_url": donation.image_url,
        "status": donation.status,
        "business_name": business.business_name
    }
@router.put("/donations/{donation_id}/accept")
def accept_donation(
    donation_id: int,
    db: Session = Depends(get_db)
):

    donation = (
        db.query(Donation)
        .filter(Donation.id == donation_id)
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    donation.status = "Accepted"

    db.commit()
    db.refresh(donation)

    return {
        "message": "Donation accepted successfully"
    }