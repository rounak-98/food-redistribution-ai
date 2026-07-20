from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.business import BusinessRegisterRequest
from app.schemas.login import LoginRequest
from app.schemas.ngo import NGORegisterRequest
from app.services.auth_service import register_ngo
from app.services.auth_service import (
    register_user,
    login_user,
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
        register_user(db, data)

        return {
            "message": "User registered successfully"
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
        result = login_user(
            db,
            data.email,
            data.password
        )

        if result["user"].role == "Business":

            return {
                "message": "Login successful",
                "user": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                    "role": result["user"].role,
                },
                "business": {
                    "id": result["profile"].id,
                    "business_name": result["profile"].business_name,
                    "owner_name": result["profile"].owner_name,
                    "phone": result["profile"].phone,
                    "city": result["profile"].city,
                    "state": result["profile"].state,
                }
            }

        elif result["user"].role == "NGO":

            return {
                "message": "Login successful",
                "user": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                    "role": result["user"].role,
                },
                "ngo": {
                    "id": result["profile"].id,
                    "ngo_name": result["profile"].ngo_name,
                    "contact_person": result["profile"].contact_person,
                    "phone": result["profile"].phone,
                    "city": result["profile"].city,
                    "state": result["profile"].state,
                }
            }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    

@router.post("/register/ngo")
def register_ngo_api(
    data: NGORegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        register_ngo(db, data)

        return {
            "message": "NGO registered successfully"
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )