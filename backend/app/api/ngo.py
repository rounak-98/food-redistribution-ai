from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import math
import re

from app.database.database import get_db
from app.models.donation import Donation
from app.models.business import Business
from app.models.user import User
from app.models.ngo import NGO
from app.models.delivery import DeliveryTask
from app.models.volunteer import Volunteer
from app.auth.security import get_current_user
from app.schemas.ngo import NGOProfileUpdate

router = APIRouter(
    prefix="/api/ngo",
    tags=["NGO"]
)


def calculate_distance(lat1, lon1, lat2, lon2):
    if not all([lat1, lon1, lat2, lon2]):
        return None

    try:
        lat1 = math.radians(float(lat1))
        lon1 = math.radians(float(lon1))
        lat2 = math.radians(float(lat2))
        lon2 = math.radians(float(lon2))
    except (ValueError, TypeError):
        return None

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    earth_radius = 6371

    return round(earth_radius * c, 2)


@router.get("/all")
def get_all_ngos(db: Session = Depends(get_db)):
    ngos = db.query(NGO).all()
    return [
        {
            "id": n.id,
            "ngo_name": n.ngo_name,
            "contact_person": n.contact_person,
            "phone": n.phone,
            "address": f"{n.address}, {n.city}",
            "city": n.city,
            "latitude": n.latitude,
            "longitude": n.longitude
        }
        for n in ngos
    ]


@router.get("/dashboard-stats")
def get_ngo_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    # Available donations query
    available_donations_query = (
        db.query(Donation, Business)
        .join(Business, Donation.business_id == Business.id)
        .filter(Donation.status == "Available")
        .all()
    )
    available_count = len(available_donations_query)

    # Accepted count
    accepted_donations = (
        db.query(Donation)
        .filter(
            Donation.accepted_by_ngo_id == ngo.id,
            Donation.status.in_(["Accepted", "In Transit", "In_Transit"])
        )
        .all()
    )
    accepted_count = len(accepted_donations)

    # Completed count
    completed_donations = (
        db.query(Donation)
        .filter(
            Donation.accepted_by_ngo_id == ngo.id,
            Donation.status.in_(["Completed", "Delivered"])
        )
        .all()
    )
    completed_count = len(completed_donations)

    # Meals estimation calculation
    total_meals = 0
    for d in completed_donations:
        nums = re.findall(r'\d+', d.quantity or '')
        val = int(nums[0]) if nums else 10
        total_meals += val * 4

    for d in accepted_donations:
        nums = re.findall(r'\d+', d.quantity or '')
        val = int(nums[0]) if nums else 10
        total_meals += val * 2

    # Format recent available donations with distance calculation
    recent_available = []
    for donation, business in available_donations_query:
        dist = calculate_distance(
            ngo.latitude, ngo.longitude,
            business.latitude, business.longitude
        )
        recent_available.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "food_category": donation.food_category,
            "quantity": donation.quantity,
            "expiry_date": donation.expiry_date,
            "business_name": business.business_name,
            "distance_km": dist
        })

    recent_available.sort(
        key=lambda x: x["distance_km"] if x["distance_km"] is not None else 999999
    )

    ai_recommendations = []
    if available_count > 0:
        ai_recommendations.append(f"{available_count} surplus food donations are available near your operational region.")
    if recent_available and recent_available[0]["distance_km"] is not None:
        ai_recommendations.append(f"Closest match: '{recent_available[0]['food_name']}' ({recent_available[0]['distance_km']} km away from {recent_available[0]['business_name']}).")
    else:
        ai_recommendations.append("Keep your profile location updated to get precise distance-based donation matches.")

    return {
        "available": available_count,
        "accepted": accepted_count,
        "completed": completed_count,
        "meals": total_meals,
        "recent_donations": recent_available[:5],
        "ai_recommendations": ai_recommendations,
        "ngo_profile": {
            "ngo_name": ngo.ngo_name,
            "address": ngo.address,
            "city": ngo.city,
            "state": ngo.state,
            "pincode": ngo.pincode,
            "latitude": ngo.latitude,
            "longitude": ngo.longitude
        }
    }


@router.get("/donations")
def get_available_donations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    results = (
        db.query(Donation, Business)
        .join(Business, Donation.business_id == Business.id)
        .filter(Donation.status == "Available")
        .all()
    )

    response = []
    for donation, business in results:
        distance = calculate_distance(
            ngo.latitude, ngo.longitude,
            business.latitude, business.longitude
        )

        response.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "food_category": donation.food_category,
            "quantity": donation.quantity,
            "expiry_date": donation.expiry_date,
            "pickup_address": donation.pickup_address,
            "status": donation.status,
            "business_name": business.business_name,
            "distance_km": distance
        })

    response.sort(
        key=lambda x: x["distance_km"] if x["distance_km"] is not None else 999999
    )

    return response


@router.get("/donations/accepted")
def get_my_accepted_donations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    results = (
        db.query(Donation, Business, DeliveryTask, Volunteer)
        .join(Business, Donation.business_id == Business.id)
        .outerjoin(DeliveryTask, Donation.id == DeliveryTask.donation_id)
        .outerjoin(Volunteer, DeliveryTask.volunteer_id == Volunteer.id)
        .filter(
            Donation.accepted_by_ngo_id == ngo.id,
            Donation.status.in_(["Accepted", "In Transit", "In_Transit", "Delivered"])
        )
        .order_by(Donation.created_at.desc())
        .all()
    )

    response = []
    for donation, business, task, volunteer in results:
        delivery_otp = str((donation.id * 243 + 7913) % 9000 + 1000)
        if task and task.delivery_otp:
            delivery_otp = task.delivery_otp

        rider_info = None
        if volunteer and task:
            user_rider = db.query(User).filter(User.id == volunteer.user_id).first()
            rider_info = {
                "name": user_rider.name if user_rider else (volunteer.full_name or "Assigned Transport Rider"),
                "phone": volunteer.phone or "+91 99887 76655",
                "vehicle": volunteer.vehicle_type or "Bike",
                "status": task.status,
                "is_online": volunteer.is_online
            }

        response.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "food_category": donation.food_category,
            "quantity": donation.quantity,
            "expiry_date": donation.expiry_date,
            "pickup_address": donation.pickup_address,
            "pickup_time": donation.pickup_time,
            "contact_person": donation.contact_person,
            "phone": donation.phone,
            "status": donation.status,
            "delivery_otp": delivery_otp,
            "delivery_otp_verified": bool(task.delivery_otp_verified) if task else False,
            "business": {
                "business_name": business.business_name,
                "phone": business.phone
            },
            "rider": rider_info
        })

    return response


@router.get("/history")
def get_ngo_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    results = (
        db.query(Donation, Business)
        .join(Business, Donation.business_id == Business.id)
        .filter(
            Donation.accepted_by_ngo_id == ngo.id,
            Donation.status.in_(["Completed", "Delivered"])
        )
        .order_by(Donation.created_at.desc())
        .all()
    )

    history = []
    for donation, business in results:
        history.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "food_category": donation.food_category,
            "quantity": donation.quantity,
            "expiry_date": donation.expiry_date,
            "pickup_address": donation.pickup_address,
            "pickup_time": donation.pickup_time,
            "status": donation.status,
            "business_name": business.business_name,
            "business_phone": business.phone,
            "created_at": donation.created_at.strftime("%Y-%m-%d %H:%M") if donation.created_at else "N/A"
        })

    return history


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
        raise HTTPException(status_code=404, detail="Donation not found")

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    donation.status = "Accepted"
    donation.accepted_by_ngo_id = ngo.id
    db.commit()
    db.refresh(donation)

    return {"message": "Donation accepted successfully"}


@router.put("/donations/{donation_id}/complete")
def complete_donation(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    donation = db.query(Donation).filter(
        Donation.id == donation_id,
        Donation.accepted_by_ngo_id == ngo.id
    ).first()

    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found or not accepted by this NGO")

    task = db.query(DeliveryTask).filter(DeliveryTask.donation_id == donation_id).first()
    if task and not task.delivery_otp_verified:
        raise HTTPException(
            status_code=400,
            detail="Cannot complete donation yet. The transport rider must verify the 4-digit Delivery Handover OTP upon arrival!"
        )

    donation.status = "Completed"
    if task:
        task.status = "Delivered"

    db.commit()
    db.refresh(donation)

    return {"message": "Donation marked as completed successfully"}


@router.get("/profile")
def get_ngo_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    return {
        "id": ngo.id,
        "user_id": ngo.user_id,
        "ngo_name": ngo.ngo_name,
        "registration_number": ngo.registration_number,
        "contact_person": ngo.contact_person,
        "phone": ngo.phone,
        "email": ngo.email or current_user.email,
        "address": ngo.address,
        "city": ngo.city,
        "state": ngo.state,
        "pincode": ngo.pincode,
        "latitude": ngo.latitude,
        "longitude": ngo.longitude,
        "created_at": ngo.created_at.strftime("%Y-%m-%d") if ngo.created_at else "N/A"
    }


@router.put("/profile")
def update_ngo_profile(
    data: NGOProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    if data.ngo_name is not None:
        ngo.ngo_name = data.ngo_name
    if data.registration_number is not None:
        ngo.registration_number = data.registration_number
    if data.contact_person is not None:
        ngo.contact_person = data.contact_person
    if data.phone is not None:
        ngo.phone = data.phone
    if data.email is not None:
        ngo.email = data.email
    if data.address is not None:
        ngo.address = data.address
    if data.city is not None:
        ngo.city = data.city
    if data.state is not None:
        ngo.state = data.state
    if data.pincode is not None:
        ngo.pincode = data.pincode
    if data.latitude is not None:
        ngo.latitude = str(data.latitude)
    if data.longitude is not None:
        ngo.longitude = str(data.longitude)

    db.commit()
    db.refresh(ngo)

    return {
        "message": "NGO profile updated successfully",
        "profile": {
            "id": ngo.id,
            "ngo_name": ngo.ngo_name,
            "registration_number": ngo.registration_number,
            "contact_person": ngo.contact_person,
            "phone": ngo.phone,
            "email": ngo.email,
            "address": ngo.address,
            "city": ngo.city,
            "state": ngo.state,
            "pincode": ngo.pincode,
            "latitude": ngo.latitude,
            "longitude": ngo.longitude
        }
    }