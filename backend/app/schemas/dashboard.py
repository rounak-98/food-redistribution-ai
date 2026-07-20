from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_donations: int
    available_donations: int
    inventory_items: int
    completed_pickups: int
    food_saved_kg: float
    waste_prevented_kg: float
    partner_ngos: int
    ai_health_score: int