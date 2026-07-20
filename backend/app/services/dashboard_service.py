from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.inventory import Inventory
from app.models.donation import Donation
from app.models.business import Business


class DashboardService:

    @staticmethod
    def get_dashboard_summary(db: Session):

        total_donations = db.query(Donation).count()

        available_donations = (
            db.query(Donation)
            .filter(Donation.status == "Available")
            .count()
        )

        inventory_items = db.query(Inventory).count()

        completed_pickups = (
            db.query(Donation)
            .filter(Donation.status == "Completed")
            .count()
        )

        partner_ngos = 0

        food_saved_kg = inventory_items * 5

        waste_prevented_kg = inventory_items * 2

        fresh = (
            db.query(Inventory)
            .filter(Inventory.status == "Fresh")
            .count()
        )

        expiring = (
            db.query(Inventory)
            .filter(Inventory.status == "Expiring Soon")
            .count()
        )

        total = inventory_items

        if total == 0:
            ai_health_score = 100
        else:
            ai_health_score = round(
                ((fresh + expiring * 0.5) / total) * 100
            )

        return {
            "total_donations": total_donations,
            "available_donations": available_donations,
            "inventory_items": inventory_items,
            "completed_pickups": completed_pickups,
            "food_saved_kg": food_saved_kg,
            "waste_prevented_kg": waste_prevented_kg,
            "partner_ngos": partner_ngos,
            "ai_health_score": ai_health_score
        }