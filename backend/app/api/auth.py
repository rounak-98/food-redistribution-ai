from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.business import BusinessRegisterRequest
from app.schemas.login import LoginRequest

from app.services.auth_service import (
    register_business,
    login_business,
)
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

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        result = login_business(
            db,
            data.email,
            data.password
        )

        return {
            "message": "Login successful",
            "user": {
                "id": result["user"].id,
                "name": result["user"].name,
                "email": result["user"].email,
                "role": result["user"].role,
            },
            "business": {
                "id": result["business"].id,
                "business_name": result["business"].business_name,
                "owner_name": result["business"].owner_name,
                "phone": result["business"].phone,
                "city": result["business"].city,
                "state": result["business"].state,
            }
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )