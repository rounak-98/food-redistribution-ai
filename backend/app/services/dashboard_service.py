from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.inventory import Inventory
from app.models.donation import Donation
from app.models.ngo import NGO


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

        partner_ngos = db.query(NGO).count()

        food_saved_kg = (completed_pickups * 25) + (total_donations * 10) + (inventory_items * 2)

        waste_prevented_kg = round(food_saved_kg * 0.85)

        # Environmental & Economic Calculations
        co2_saved_kg = round(food_saved_kg * 2.5)  # 2.5 kg CO2 per kg food saved
        financial_savings_inr = food_saved_kg * 140  # average food cost per kg
        tax_deduction_estimate_inr = round(financial_savings_inr * 0.25)  # Section 80G estimate
        landfill_fees_saved_inr = round(food_saved_kg * 18)

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
            ai_health_score = 98
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
            "co2_saved_kg": co2_saved_kg,
            "financial_savings_inr": financial_savings_inr,
            "tax_deduction_estimate_inr": tax_deduction_estimate_inr,
            "landfill_fees_saved_inr": landfill_fees_saved_inr,
            "partner_ngos": partner_ngos,
            "ai_health_score": ai_health_score
        }