from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardSummary

router = APIRouter()


@router.get(
    "/summary",
    response_model=DashboardSummary
)
def get_dashboard_summary(
    db: Session = Depends(get_db)
):
    return DashboardService.get_dashboard_summary(db)