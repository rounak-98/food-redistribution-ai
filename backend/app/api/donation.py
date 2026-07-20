from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.donation import DonationCreate
from app.services.donation_service import ( create_donation, get_business_donations, get_dashboard_stats,)
from app.auth.security import get_current_user
from app.models.user import User
from app.models.business import Business

router = APIRouter(
    prefix="/api/donations",
    tags=["Donations"]
)


@router.post("/")
def add_donation(
    data: DonationCreate,
    db: Session = Depends(get_db)
):
    donation = create_donation(db, data)

    return {
        "message": "Donation added successfully",
        "donation_id": donation.id
    }

@router.get("/business/{business_id}")
def get_donations(
    business_id: int,
    db: Session = Depends(get_db)
):
    donations = get_business_donations(db, business_id)

    return donations

@router.get("/my")
def get_my_donations(
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

    return get_business_donations(
        db,
        business.id
    )

@router.get("/dashboard/my")
def my_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    business = (
        db.query(Business)
        .filter(Business.user_id == current_user.id)
        .first()
    )

    if business is None:
        return {}

    return get_dashboard_stats(
        db,
        business.id
    )


@router.get("/dashboard/{business_id}")
def dashboard_stats(
    business_id: int,
    db: Session = Depends(get_db)
):
    return get_dashboard_stats(db, business_id)

