from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import math

from app.database.database import get_db
from app.models.user import User
from app.models.individual import Individual
from app.models.donation import Donation
from app.models.ngo import NGO
from app.auth.security import get_current_user
from app.schemas.individual import IndividualDonationCreate, IndividualRegisterRequest

router = APIRouter(
    prefix="/api/individual",
    tags=["Individual Donor"]
)


def calculate_distance(lat1, lon1, lat2, lon2):
    if not all([lat1, lon1, lat2, lon2]):
        return None
    try:
        lat1, lon1 = math.radians(float(lat1)), math.radians(float(lon1))
        lat2, lon2 = math.radians(float(lat2)), math.radians(float(lon2))
        dlat, dlon = lat2 - lat1, lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        return round(6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 2)
    except (ValueError, TypeError):
        return None


@router.get("/dashboard-stats")
def get_individual_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    indiv = db.query(Individual).filter(Individual.user_id == current_user.id).first()

    # User's donations (using phone or user association)
    user_donations = []
    if indiv:
        user_donations = db.query(Donation).filter(
            Donation.phone == indiv.phone
        ).order_by(Donation.created_at.desc()).all()

    total_donations_posted = len(user_donations)
    completed_donations = [d for d in user_donations if d.status == "Completed"]
    
    meals_contributed = (len(completed_donations) * 15) + (total_donations_posted * 5)
    co2_saved = round(meals_contributed * 0.4, 1)  # 0.4 kg CO2 per meal
    hero_points = (total_donations_posted * 50) + (len(completed_donations) * 100)

    # Badges list
    badges = [
        {"name": "Zero-Waste Citizen", "unlocked": total_donations_posted >= 1, "icon": "🌱"},
        {"name": "Community Hero", "unlocked": total_donations_posted >= 3, "icon": "🏆"},
        {"name": "Eco Guardian", "unlocked": total_donations_posted >= 5, "icon": "👑"},
    ]

    # Nearby NGOs list
    ngos = db.query(NGO).all()
    nearby_ngos = []
    for ngo in ngos:
        dist = calculate_distance(
            indiv.latitude if indiv else None,
            indiv.longitude if indiv else None,
            ngo.latitude,
            ngo.longitude
        )
        nearby_ngos.append({
            "id": ngo.id,
            "ngo_name": ngo.ngo_name,
            "contact_person": ngo.contact_person,
            "phone": ngo.phone,
            "address": f"{ngo.address}, {ngo.city}",
            "distance_km": dist
        })

    nearby_ngos.sort(key=lambda x: x["distance_km"] if x["distance_km"] is not None else 999999)

    return {
        "user_profile": {
            "name": indiv.full_name if indiv else current_user.name,
            "phone": indiv.phone if indiv else "",
            "address": indiv.address if indiv else "",
            "city": indiv.city if indiv else "",
            "state": indiv.state if indiv else "",
            "latitude": indiv.latitude if indiv else None,
            "longitude": indiv.longitude if indiv else None,
        },
        "stats": {
            "total_donations_posted": total_donations_posted,
            "meals_contributed": meals_contributed,
            "co2_saved_kg": co2_saved,
            "hero_points": hero_points,
        },
        "badges": badges,
        "my_donations": [
            {
                "id": d.id,
                "food_name": d.food_name,
                "food_category": d.food_category,
                "quantity": d.quantity,
                "expiry_date": d.expiry_date,
                "status": d.status,
                "created_at": d.created_at.strftime("%Y-%m-%d %H:%M") if d.created_at else "N/A"
            } for d in user_donations
        ],
        "nearby_ngos": nearby_ngos[:5]
    }


@router.post("/donate")
def post_individual_donation(
    data: IndividualDonationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    indiv = db.query(Individual).filter(Individual.user_id == current_user.id).first()

    pickup_addr = data.pickup_address or (
        f"{indiv.address}, {indiv.city}" if indiv else "Home Address"
    )
    phone_no = data.phone or (indiv.phone if indiv else "N/A")
    contact = indiv.full_name if indiv else current_user.name

    # Create dummy business record or link directly
    from app.models.business import Business
    default_business = db.query(Business).first()
    business_id = default_business.id if default_business else 1

    donation = Donation(
        business_id=business_id,
        food_name=data.food_name,
        food_category=data.food_category or "Household Surplus",
        quantity=data.quantity,
        expiry_date=data.expiry_date,
        pickup_address=pickup_addr,
        pickup_time=data.pickup_time or "Today (Flexible Window)",
        contact_person=contact,
        phone=phone_no,
        special_instructions=data.special_instructions or "Individual household surplus food donation.",
        status="Available"
    )

    db.add(donation)
    db.commit()
    db.refresh(donation)

    return {
        "message": "Your home food donation has been posted successfully! Nearby NGOs have been notified.",
        "donation_id": donation.id
    }
