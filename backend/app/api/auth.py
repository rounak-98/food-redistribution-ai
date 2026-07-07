from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.business import BusinessRegisterRequest
from app.services.auth_service import register_business

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    data: BusinessRegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        register_business(db, data)

        return {
            "message": "Business registered successfully"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )