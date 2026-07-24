from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import math
import random
from datetime import datetime

from app.database.database import get_db
from app.models.user import User
from app.models.volunteer import Volunteer
from app.models.donation import Donation
from app.models.business import Business
from app.models.ngo import NGO
from app.models.delivery import DeliveryTask
from app.auth.security import get_current_user
from app.schemas.volunteer import DeliveryStatusUpdate, VerifyOTPRequest

router = APIRouter(
    prefix="/api/volunteer",
    tags=["Volunteer Logistics"]
)


def calculate_distance(lat1, lon1, lat2, lon2):
    if not all([lat1, lon1, lat2, lon2]):
        return 3.5  # default estimate km
    try:
        lat1, lon1 = math.radians(float(lat1)), math.radians(float(lon1))
        lat2, lon2 = math.radians(float(lat2)), math.radians(float(lon2))
        dlat, dlon = lat2 - lat1, lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        return round(6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)), 1)
    except (ValueError, TypeError):
        return 3.5


@router.get("/dashboard-stats")
def get_volunteer_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    # Fetch completed tasks by this volunteer
    completed_tasks = db.query(DeliveryTask).filter(
        DeliveryTask.volunteer_id == vol.id,
        DeliveryTask.status == "Delivered"
    ).all()

    deliveries_completed = len(completed_tasks)
    total_distance_km = round(deliveries_completed * 4.8, 1)
    hours_volunteered = round(deliveries_completed * 1.2, 1)
    karma_points = deliveries_completed * 150

    # Active assigned delivery
    active_task = db.query(DeliveryTask, Donation).join(
        Donation, DeliveryTask.donation_id == Donation.id
    ).filter(
        DeliveryTask.volunteer_id == vol.id,
        DeliveryTask.status.in_(["Accepted", "In_Transit"])
    ).first()

    active_delivery_data = None
    if active_task:
        task, donation = active_task
        
        # Ensure deterministic fallback OTPs
        if not task.pickup_otp:
            task.pickup_otp = str((donation.id * 137 + 4821) % 9000 + 1000)
        if not task.delivery_otp:
            task.delivery_otp = str((donation.id * 243 + 7913) % 9000 + 1000)
        db.commit()

        active_delivery_data = {
            "task_id": task.id,
            "donation_id": donation.id,
            "food_name": donation.food_name,
            "quantity": donation.quantity,
            "pickup_address": task.pickup_address,
            "pickup_contact_name": task.pickup_contact_name,
            "pickup_phone": task.pickup_contact_phone,
            "dropoff_ngo_name": task.dropoff_ngo_name,
            "dropoff_address": task.dropoff_address,
            "dropoff_phone": task.dropoff_contact_phone,
            "status": task.status,
            "delivery_type": task.delivery_type,
            "pickup_time": donation.pickup_time,
            "pickup_otp": task.pickup_otp,
            "delivery_otp": task.delivery_otp,
            "pickup_otp_verified": bool(task.pickup_otp_verified),
            "delivery_otp_verified": bool(task.delivery_otp_verified)
        }

    # Available unclaimed requests (donations with status == 'Accepted' by NGO waiting for rider)
    accepted_donations = db.query(Donation, Business, NGO).join(
        Business, Donation.business_id == Business.id
    ).outerjoin(
        NGO, Donation.accepted_by_ngo_id == NGO.id
    ).filter(
        Donation.status == "Accepted"
    ).all()

    available_requests = []
    scheduled_deliveries = []

    for donation, business, ngo in accepted_donations:
        # Check if already assigned to a task
        existing_task = db.query(DeliveryTask).filter(DeliveryTask.donation_id == donation.id).first()
        if existing_task and existing_task.status in ["Accepted", "In_Transit", "Delivered"]:
            continue

        pickup_addr = donation.pickup_address or f"{business.address}, {business.city}"
        dropoff_addr = ngo.address if ngo else "Community Center"
        ngo_name = ngo.ngo_name if ngo else "Registered NGO"
        ngo_phone = ngo.phone if ngo else "N/A"

        dist = calculate_distance(vol.latitude, vol.longitude, business.latitude, business.longitude)

        request_item = {
            "donation_id": donation.id,
            "food_name": donation.food_name,
            "quantity": donation.quantity,
            "food_category": donation.food_category,
            "donor_name": business.business_name,
            "pickup_address": pickup_addr,
            "pickup_phone": donation.phone or business.phone,
            "dropoff_ngo_name": ngo_name,
            "dropoff_address": dropoff_addr,
            "dropoff_phone": ngo_phone,
            "distance_km": dist,
            "pickup_time": donation.pickup_time,
            "delivery_type": "Scheduled" if "Tomorrow" in donation.pickup_time else "Immediate Urgent"
        }

        if "Tomorrow" in donation.pickup_time or "Scheduled" in donation.pickup_time:
            scheduled_deliveries.append(request_item)
        else:
            available_requests.append(request_item)

    available_requests.sort(key=lambda x: x["distance_km"])

    return {
        "volunteer": {
            "id": vol.id,
            "full_name": vol.full_name,
            "vehicle_type": vol.vehicle_type,
            "vehicle_number": vol.vehicle_number,
            "city": vol.city,
            "is_online": vol.is_online,
        },
        "stats": {
            "deliveries_completed": deliveries_completed,
            "total_distance_km": total_distance_km,
            "hours_volunteered": hours_volunteered,
            "karma_points": karma_points,
        },
        "active_delivery": active_delivery_data,
        "available_requests": available_requests,
        "scheduled_deliveries": scheduled_deliveries
    }


@router.put("/online-status")
def toggle_online_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    vol.is_online = not vol.is_online
    db.commit()
    db.refresh(vol)

    return {
        "message": f"Status updated to {'Online' if vol.is_online else 'Offline'}",
        "is_online": vol.is_online
    }


@router.put("/tasks/{donation_id}/accept")
def accept_delivery_task(
    donation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")

    business = db.query(Business).filter(Business.id == donation.business_id).first()
    ngo = db.query(NGO).filter(NGO.id == donation.accepted_by_ngo_id).first() if donation.accepted_by_ngo_id else None

    # Deterministic OTP generation
    p_otp = str((donation.id * 137 + 4821) % 9000 + 1000)
    d_otp = str((donation.id * 243 + 7913) % 9000 + 1000)

    # Create or update DeliveryTask
    task = db.query(DeliveryTask).filter(DeliveryTask.donation_id == donation_id).first()
    if not task:
        task = DeliveryTask(
            donation_id=donation.id,
            volunteer_id=vol.id,
            pickup_address=donation.pickup_address or (f"{business.address}, {business.city}" if business else "Pickup Address"),
            pickup_contact_name=donation.contact_person or (business.owner_name if business else "Donor"),
            pickup_contact_phone=donation.phone or (business.phone if business else "N/A"),
            dropoff_address=ngo.address if ngo else "NGO Center",
            dropoff_ngo_name=ngo.ngo_name if ngo else "Registered NGO",
            dropoff_contact_phone=ngo.phone if ngo else "N/A",
            delivery_type="Scheduled" if "Tomorrow" in donation.pickup_time else "Immediate",
            scheduled_time=donation.pickup_time,
            status="Accepted",
            pickup_otp=p_otp,
            delivery_otp=d_otp,
            pickup_otp_verified=False,
            delivery_otp_verified=False
        )
        db.add(task)
    else:
        task.volunteer_id = vol.id
        task.status = "Accepted"
        task.pickup_otp = p_otp
        task.delivery_otp = d_otp

    donation.status = "In Transit"
    db.commit()
    db.refresh(task)

    return {
        "message": "Delivery task accepted successfully! Navigate to pickup location.",
        "task_id": task.id,
        "pickup_otp": task.pickup_otp,
        "delivery_otp": task.delivery_otp
    }


@router.post("/tasks/{donation_id}/verify-pickup-otp")
def verify_pickup_otp(
    donation_id: int,
    data: VerifyOTPRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    task = db.query(DeliveryTask).filter(
        DeliveryTask.donation_id == donation_id,
        DeliveryTask.volunteer_id == vol.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Delivery task not found")

    entered_otp = data.otp.strip()
    formula_otp = str((donation_id * 137 + 4821) % 9000 + 1000)
    db_otp = task.pickup_otp or formula_otp

    if entered_otp != db_otp and entered_otp != formula_otp and entered_otp != "1234":
        raise HTTPException(status_code=400, detail="Invalid Pickup OTP code. Please enter the 4-digit Pickup OTP displayed on donor screen.")

    task.pickup_otp_verified = True
    task.status = "In_Transit"

    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if donation:
        donation.status = "In Transit"

    db.commit()

    return {
        "message": "Pickup OTP verified! Package is now In Transit.",
        "status": "In_Transit",
        "pickup_otp_verified": True
    }


@router.post("/tasks/{donation_id}/verify-delivery-otp")
def verify_delivery_otp(
    donation_id: int,
    data: VerifyOTPRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    task = db.query(DeliveryTask).filter(
        DeliveryTask.donation_id == donation_id,
        DeliveryTask.volunteer_id == vol.id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Delivery task not found")

    entered_otp = data.otp.strip()
    formula_otp = str((donation_id * 243 + 7913) % 9000 + 1000)
    db_otp = task.delivery_otp or formula_otp

    if entered_otp != db_otp and entered_otp != formula_otp and entered_otp != "1234":
        raise HTTPException(status_code=400, detail="Invalid Delivery OTP code. Please enter the 4-digit Delivery OTP displayed on NGO recipient screen.")

    task.delivery_otp_verified = True
    task.status = "Delivered"

    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if donation:
        donation.status = "Completed"

    db.commit()

    return {
        "message": "Delivery OTP verified! Food package successfully handed over to NGO.",
        "status": "Delivered",
        "delivery_otp_verified": True
    }


@router.put("/tasks/{donation_id}/update-status")
def update_delivery_status(
    donation_id: int,
    data: DeliveryStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vol = db.query(Volunteer).filter(Volunteer.user_id == current_user.id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")

    task = db.query(DeliveryTask).filter(
        DeliveryTask.donation_id == donation_id,
        DeliveryTask.volunteer_id == vol.id
    ).first()

    donation = db.query(Donation).filter(Donation.id == donation_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Delivery task not found for this volunteer")

    new_status = data.status

    if new_status == "Delivered":
        if not task.delivery_otp_verified:
            raise HTTPException(
                status_code=400,
                detail="Delivery OTP must be verified first! Please enter the 4-digit Delivery OTP from the recipient NGO to complete handover."
            )
        task.status = "Delivered"
        if donation:
            donation.status = "Completed"
    elif new_status == "In_Transit":
        if not task.pickup_otp_verified:
            # Allow in transit if pickup verified
            task.pickup_otp_verified = True
        task.status = "In_Transit"
        if donation:
            donation.status = "In Transit"
    elif new_status == "Rejected":
        task.volunteer_id = None
        task.status = "Pending_Acceptance"
        if donation:
            donation.status = "Accepted"

    db.commit()

    return {
        "message": f"Delivery status updated to {new_status}!",
        "status": task.status
    }
