from sqlalchemy.orm import Session

from app.models.donation import Donation
from app.models.inventory import Inventory

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
    return (
        db.query(Donation)
        .filter(Donation.business_id == business_id)
        .order_by(Donation.created_at.desc())
        .all()
    )

from sqlalchemy import func

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