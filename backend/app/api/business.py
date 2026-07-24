from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.business import Business
from app.models.user import User
from app.auth.security import get_current_user
from app.schemas.business import BusinessProfileUpdate

router = APIRouter(
    prefix="/api/business",
    tags=["Business Profile"]
)


@router.get("/profile")
def get_business_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")

    return {
        "id": business.id,
        "user_id": business.user_id,
        "business_name": business.business_name,
        "business_type": business.business_type,
        "owner_name": business.owner_name,
        "fssai_number": business.fssai_number,
        "gst_number": business.gst_number,
        "phone": business.phone,
        "email": current_user.email,
        "address": business.address,
        "city": business.city,
        "state": business.state,
        "pincode": business.pincode,
        "latitude": business.latitude,
        "longitude": business.longitude,
        "created_at": business.created_at.strftime("%Y-%m-%d") if business.created_at else "N/A"
    }


@router.put("/profile")
def update_business_profile(
    data: BusinessProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business profile not found")

    if data.business_name is not None:
        business.business_name = data.business_name
    if data.business_type is not None:
        business.business_type = data.business_type
    if data.owner_name is not None:
        business.owner_name = data.owner_name
    if data.fssai_number is not None:
        business.fssai_number = data.fssai_number
    if data.gst_number is not None:
        business.gst_number = data.gst_number
    if data.phone is not None:
        business.phone = data.phone
    if data.address is not None:
        business.address = data.address
    if data.city is not None:
        business.city = data.city
    if data.state is not None:
        business.state = data.state
    if data.pincode is not None:
        business.pincode = data.pincode
    if data.latitude is not None:
        business.latitude = str(data.latitude)
    if data.longitude is not None:
        business.longitude = str(data.longitude)

    if data.email is not None and data.email != current_user.email:
        current_user.email = data.email

    db.commit()
    db.refresh(business)

    return {
        "message": "Business profile updated successfully",
        "profile": {
            "id": business.id,
            "business_name": business.business_name,
            "business_type": business.business_type,
            "owner_name": business.owner_name,
            "phone": business.phone,
            "city": business.city,
            "state": business.state,
            "address": business.address,
            "pincode": business.pincode,
            "latitude": business.latitude,
            "longitude": business.longitude
        }
    }
