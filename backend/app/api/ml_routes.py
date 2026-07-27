from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database.database import get_db
from app.models.user import User
from app.models.business import Business
from app.models.ngo import NGO
from app.models.inventory import Inventory
from app.auth.security import get_current_user
from app.ml.surplus_predictor import predict_weekly_surplus, predict_spoilage_risk
from app.ml.matching_engine import rank_ngo_matches

router = APIRouter(
    prefix="/api/ml",
    tags=["Machine Learning & AI"]
)


class SpoilageRiskRequest(BaseModel):
    hours_remaining: int
    category: Optional[str] = "Cooked Meals"
    storage_temp_c: Optional[float] = 25.0
    is_sealed: Optional[bool] = True


@router.get("/forecast-surplus")
def get_ml_surplus_forecast(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    inventory_items = []
    if business:
        inventory_items = db.query(Inventory).filter(Inventory.business_id == business.id).all()

    # Call Scikit-Learn ML Model prediction
    result = predict_weekly_surplus(inventory_items)
    return result


@router.post("/spoilage-risk")
def get_ml_spoilage_risk(req: SpoilageRiskRequest):
    result = predict_spoilage_risk(
        hours_remaining=req.hours_remaining,
        category=req.category,
        storage_temp_c=req.storage_temp_c,
        is_sealed=req.is_sealed
    )
    return result


@router.get("/match-ngos")
def get_ml_ngo_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.user_id == current_user.id).first()
    donor_lat = float(business.latitude) if (business and business.latitude) else 12.9716
    donor_lng = float(business.longitude) if (business and business.longitude) else 77.5946

    ngos = db.query(NGO).all()
    ngo_data = [
        {
            "id": n.id,
            "ngo_name": n.ngo_name,
            "address": f"{n.address}, {n.city}",
            "phone": n.phone,
            "latitude": float(n.latitude) if n.latitude else 12.9800,
            "longitude": float(n.longitude) if n.longitude else 77.6050
        }
        for n in ngos
    ]

    matches = rank_ngo_matches(donor_lat, donor_lng, ngo_data)
    return {
        "donor_business": business.business_name if business else "Your Business",
        "total_matches": len(matches),
        "top_recommendations": matches[:5]
    }
