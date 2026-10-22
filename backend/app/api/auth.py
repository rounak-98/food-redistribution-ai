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
        

        user_role = (result["user"].role or "").lower()

        if user_role == "business":
            profile = result.get("profile")
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
                    "id": profile.id if profile else None,
                    "business_name": profile.business_name if profile else result["user"].name,
                    "owner_name": profile.owner_name if profile else result["user"].name,
                    "phone": profile.phone if profile else "",
                    "city": profile.city if profile else "",
                    "state": profile.state if profile else "",
                }
            }

        elif user_role == "ngo":
            profile = result.get("profile")
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
                    "id": profile.id if profile else None,
                    "ngo_name": profile.ngo_name if profile else result["user"].name,
                    "contact_person": profile.contact_person if profile else result["user"].name,
                    "phone": profile.phone if profile else "",
                    "city": profile.city if profile else "",
                    "state": profile.state if profile else "",
                }
            }

        elif user_role == "individual":
            profile = result.get("profile")
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
                    "id": profile.id if profile else None,
                    "full_name": profile.full_name if profile else result["user"].name,
                    "phone": profile.phone if profile else "",
                    "city": profile.city if profile else "",
                    "state": profile.state if profile else "",
                }
            }

        elif user_role == "volunteer":
            profile = result.get("profile")
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
                    "id": profile.id if profile else None,
                    "full_name": profile.full_name if profile else result["user"].name,
                    "vehicle_type": profile.vehicle_type if profile else "Bike",
                    "phone": profile.phone if profile else "",
                    "city": profile.city if profile else "",
                    "is_online": profile.is_online if profile else True,
                }
            }

        elif user_role == "admin":
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


@router.get("/demo-accounts")
def get_demo_accounts():
    return {
        "accounts": [
            {
                "role": "business",
                "label": "Business Donor",
                "organization": "Grand Heritage Kitchen",
                "email": "restaurant@foodbridge.com",
                "password": "biz123",
                "badge": "Restaurant / Kitchen",
                "description": "Post excess food donations, manage inventory & expiry alerts"
            },
            {
                "role": "ngo",
                "label": "Verified NGO",
                "organization": "Asha Food Relief Trust",
                "email": "ngo@foodbridge.com",
                "password": "ngo123",
                "badge": "Relief & Distribution",
                "description": "Claim surplus donations, track hunger relief & log distributions"
            },
            {
                "role": "volunteer",
                "label": "Volunteer Rider",
                "organization": "Rahul Deshmukh (Motorcycle)",
                "email": "rider@foodbridge.com",
                "password": "rider123",
                "badge": "Express Delivery",
                "description": "Accept active pickups, route navigation & verify delivery OTP"
            },
            {
                "role": "individual",
                "label": "Individual Donor",
                "organization": "Amit Verma",
                "email": "individual@foodbridge.com",
                "password": "ind123",
                "badge": "Community Member",
                "description": "Donate home surplus food & view neighbourhood impact"
            },
            {
                "role": "admin",
                "label": "Super Admin",
                "organization": "FoodBridge Operations Center",
                "email": "admin@foodbridge.com",
                "password": "admin123",
                "badge": "System Master",
                "description": "System telemetry, audit ledgers, analytics & user management"
            }
        ]
    }


@router.post("/seed-demo-accounts")
def trigger_seed_demo_accounts(db: Session = Depends(get_db)):
    from app.services.auth_service import seed_core_accounts
    try:
        seed_core_accounts(db)
        return {
            "status": "success",
            "message": "All 5 core role accounts successfully verified and seeded."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    

