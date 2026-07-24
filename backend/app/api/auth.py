from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.business import RegisterRequest
from app.schemas.login import LoginRequest
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
    data: RegisterRequest,
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
        

        if result["user"].role == "business":
            return {
                "message": "Login successful",
                "access_token": result["access_token"],
                "token_type": "bearer",
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

        elif result["user"].role == "ngo":
            return {
                "message": "Login successful",
                "access_token": result["access_token"],
                "token_type": "bearer",
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

        elif result["user"].role == "individual":
            return {
                "message": "Login successful",
                "access_token": result["access_token"],
                "token_type": "bearer",
                "user": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                    "role": result["user"].role,
                },
                "individual": {
                    "id": result["profile"].id if result["profile"] else None,
                    "full_name": result["profile"].full_name if result["profile"] else result["user"].name,
                    "phone": result["profile"].phone if result["profile"] else "",
                    "city": result["profile"].city if result["profile"] else "",
                    "state": result["profile"].state if result["profile"] else "",
                }
            }

        elif result["user"].role == "volunteer":
            return {
                "message": "Login successful",
                "access_token": result["access_token"],
                "token_type": "bearer",
                "user": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                    "role": result["user"].role,
                },
                "volunteer": {
                    "id": result["profile"].id if result["profile"] else None,
                    "full_name": result["profile"].full_name if result["profile"] else result["user"].name,
                    "vehicle_type": result["profile"].vehicle_type if result["profile"] else "Bike",
                    "phone": result["profile"].phone if result["profile"] else "",
                    "city": result["profile"].city if result["profile"] else "",
                    "is_online": result["profile"].is_online if result["profile"] else True,
                }
            }

        elif result["user"].role == "admin":
            return {
                "message": "Login successful",
                "access_token": result["access_token"],
                "token_type": "bearer",
                "user": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                    "role": result["user"].role,
                },
                "admin": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                }
            }



        else:
            return {
                "message": "Login successful",
                "access_token": result["access_token"],
                "token_type": "bearer",
                "user": {
                    "id": result["user"].id,
                    "name": result["user"].name,
                    "email": result["user"].email,
                    "role": result["user"].role,
                }
            }


    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    

