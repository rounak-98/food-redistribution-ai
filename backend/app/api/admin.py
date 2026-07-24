from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.database import get_db
from app.models.user import User
from app.models.business import Business
from app.models.ngo import NGO
from app.models.individual import Individual
from app.models.volunteer import Volunteer
from app.models.donation import Donation
from app.models.delivery import DeliveryTask
from app.auth.security import get_current_user

router = APIRouter(
    prefix="/api/admin",
    tags=["System Admin"]
)


def verify_admin(current_user: User = Depends(get_current_user)):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.get("/dashboard-stats")
def get_admin_dashboard_stats(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    business_count = db.query(User).filter(User.role == "business").count()
    ngo_count = db.query(User).filter(User.role == "ngo").count()
    individual_count = db.query(User).filter(User.role == "individual").count()
    volunteer_count = db.query(User).filter(User.role == "volunteer").count()

    total_donations = db.query(Donation).count()
    completed_donations = db.query(Donation).filter(Donation.status == "Completed").count()
    active_deliveries = db.query(DeliveryTask).filter(DeliveryTask.status.in_(["Accepted", "In_Transit"])).count()

    meals_saved = total_donations * 15
    co2_saved_kg = total_donations * 4.5

    return {
        "stats": {
            "total_users": total_users,
            "business_count": business_count,
            "ngo_count": ngo_count,
            "individual_count": individual_count,
            "volunteer_count": volunteer_count,
            "total_donations": total_donations,
            "completed_donations": completed_donations,
            "active_deliveries": active_deliveries,
            "meals_saved": meals_saved,
            "co2_saved_kg": co2_saved_kg
        }
    }


@router.get("/users")
def get_all_users(
    role: Optional[str] = None,
    search: Optional[str] = None,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)

    if role and role.lower() != "all":
        query = query.filter(User.role == role.lower())

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (User.name.like(search_pattern)) | (User.email.like(search_pattern))
        )

    users = query.all()
    user_list = []

    for u in users:
        u_role = u.role.lower()
        details = {}

        if u_role == "business":
            b = db.query(Business).filter(Business.user_id == u.id).first()
            if b:
                details = {
                    "business_name": b.business_name,
                    "city": b.city,
                    "phone": b.phone,
                    "type": b.business_type
                }
        elif u_role == "ngo":
            n = db.query(NGO).filter(NGO.user_id == u.id).first()
            if n:
                details = {
                    "ngo_name": n.ngo_name,
                    "city": n.city,
                    "phone": n.phone,
                    "reg_no": n.registration_number
                }
        elif u_role == "individual":
            ind = db.query(Individual).filter(Individual.user_id == u.id).first()
            if ind:
                details = {
                    "full_name": ind.full_name,
                    "city": ind.city,
                    "phone": ind.phone
                }
        elif u_role == "volunteer":
            vol = db.query(Volunteer).filter(Volunteer.user_id == u.id).first()
            if vol:
                details = {
                    "full_name": vol.full_name,
                    "vehicle": vol.vehicle_type,
                    "city": vol.city,
                    "phone": vol.phone,
                    "is_online": vol.is_online
                }

        user_list.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": str(u.created_at) if hasattr(u, "created_at") else "N/A",
            "details": details
        })

    return {"users": user_list}


@router.delete("/users/{user_id}")
def delete_user_account(
    user_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    if target_user.role.lower() == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin account")

    # Delete associated role profile
    role = target_user.role.lower()
    if role == "business":
        db.query(Business).filter(Business.user_id == user_id).delete()
    elif role == "ngo":
        db.query(NGO).filter(NGO.user_id == user_id).delete()
    elif role == "individual":
        db.query(Individual).filter(Individual.user_id == user_id).delete()
    elif role == "volunteer":
        db.query(Volunteer).filter(Volunteer.user_id == user_id).delete()

    db.delete(target_user)
    db.commit()

    return {"message": f"User account #{user_id} ({target_user.name}) deleted successfully"}


@router.get("/donations")
def get_master_donations_ledger(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    donations = db.query(Donation, Business).outerjoin(
        Business, Donation.business_id == Business.id
    ).all()

    donation_list = []
    for donation, business in donations:
        ngo_name = "N/A"
        if donation.accepted_by_ngo_id:
            ngo = db.query(NGO).filter(NGO.id == donation.accepted_by_ngo_id).first()
            if ngo:
                ngo_name = ngo.ngo_name

        donation_list.append({
            "id": donation.id,
            "food_name": donation.food_name,
            "quantity": donation.quantity,
            "category": donation.food_category,
            "donor": business.business_name if business else (donation.contact_person or "Individual Donor"),
            "ngo_recipient": ngo_name,
            "status": donation.status,
            "expiry_date": donation.expiry_date,
            "created_at": str(donation.created_at) if hasattr(donation, "created_at") else "Recent"
        })

    return {"donations": donation_list}


@router.get("/deliveries")
def get_master_deliveries_log(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    tasks = db.query(DeliveryTask, Volunteer).outerjoin(
        Volunteer, DeliveryTask.volunteer_id == Volunteer.id
    ).all()

    delivery_list = []
    for task, vol in tasks:
        delivery_list.append({
            "id": task.id,
            "donation_id": task.donation_id,
            "rider_name": vol.full_name if vol else "Unassigned Rider",
            "rider_vehicle": vol.vehicle_type if vol else "N/A",
            "pickup_address": task.pickup_address,
            "dropoff_ngo": task.dropoff_ngo_name,
            "status": task.status,
            "type": task.delivery_type
        })

    return {"deliveries": delivery_list}
