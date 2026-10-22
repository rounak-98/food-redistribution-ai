from pydantic import BaseModel
from typing import Optional


class DashboardSummary(BaseModel):
    total_donations: int
    available_donations: int
    inventory_items: int
    completed_pickups: int
    food_saved_kg: float
    waste_prevented_kg: float
    co2_saved_kg: Optional[float] = None
    financial_savings_inr: Optional[float] = None
    tax_deduction_estimate_inr: Optional[float] = None
    landfill_fees_saved_inr: Optional[float] = None
    partner_ngos: int
    ai_health_score: int