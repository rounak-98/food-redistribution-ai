from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.donation import Donation
from app.models.inventory import Inventory
from app.models.ngo import NGO
from app.models.delivery import DeliveryTask

def create_donation(db: Session, data):

    donation = Donation(
        business_id=data.business_id,
        food_name=data.food_name,
        food_category=data.food_category,
        quantity=data.quantity,
        manufacturing_date=data.manufacturing_date,
        expiry_date=data.expiry_date,
        pickup_address=data.pickup_address,
        pickup_time=data.pickup_time,
        contact_person=data.contact_person,
        phone=data.phone,
        special_instructions=data.special_instructions,
        image_url=data.image_url,
    )

    db.add(donation)
    db.commit()
    db.refresh(donation)

    inventory_item = (
        db.query(Inventory)
        .filter(
            Inventory.business_id == data.business_id,
            Inventory.product_name == data.food_name,
        )
        .first()
    )

    if inventory_item:
        db.delete(inventory_item)
        db.commit()

    return donation

def get_business_donations(db: Session, business_id: int):
    donations = (
        db.query(Donation)
        .filter(Donation.business_id == business_id)
        .order_by(Donation.created_at.desc())
        .all()
    )

    result = []
    for d in donations:
        ngo_name = None
        ngo_phone = None
        if d.accepted_by_ngo_id:
            ngo = db.query(NGO).filter(NGO.id == d.accepted_by_ngo_id).first()
            if ngo:
                ngo_name = ngo.ngo_name
                ngo_phone = ngo.phone

        task = db.query(DeliveryTask).filter(DeliveryTask.donation_id == d.id).first()
        p_otp = task.pickup_otp if (task and task.pickup_otp) else str((d.id * 137 + 4821) % 9000 + 1000)
        d_otp = task.delivery_otp if (task and task.delivery_otp) else str((d.id * 243 + 7913) % 9000 + 1000)

        result.append({
            "id": d.id,
            "business_id": d.business_id,
            "food_name": d.food_name,
            "food_category": d.food_category,
            "quantity": d.quantity,
            "manufacturing_date": d.manufacturing_date,
            "expiry_date": d.expiry_date,
            "pickup_address": d.pickup_address,
            "pickup_time": d.pickup_time,
            "contact_person": d.contact_person,
            "phone": d.phone,
            "special_instructions": d.special_instructions,
            "image_url": d.image_url,
            "status": d.status,
            "accepted_by_ngo_id": d.accepted_by_ngo_id,
            "ngo_name": ngo_name,
            "ngo_phone": ngo_phone,
            "pickup_otp": p_otp,
            "delivery_otp": d_otp,
            "created_at": d.created_at.isoformat() if d.created_at else None
        })
    return result

def get_dashboard_stats(db: Session, business_id: int):

    total = (
        db.query(Donation)
        .filter(Donation.business_id == business_id)
        .count()
    )

    available = (
        db.query(Donation)
        .filter(
            Donation.business_id == business_id,
            Donation.status == "Available"
        )
        .count()
    )

    completed = (
        db.query(Donation)
        .filter(
            Donation.business_id == business_id,
            Donation.status == "Completed"
        )
        .count()
    )

    return {
        "total_donations": total,
        "available_donations": available,
        "completed_pickups": completed,
    }