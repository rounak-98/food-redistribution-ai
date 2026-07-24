from sqlalchemy.orm import Session

from app.models.user import User
from app.models.business import Business
from app.models.ngo import NGO
from app.models.individual import Individual
from app.models.volunteer import Volunteer
from app.auth.security import (
    hash_password, 
    verify_password,
    create_access_token,
)


def register_user(db: Session, data):
    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    role = data.role.lower()

    if role == "business":
        profile = Business(
            user_id=user.id,
            business_name=getattr(data, "business_name", None) or data.name,
            business_type=getattr(data, "business_type", "Restaurant"),
            owner_name=getattr(data, "owner_name", None) or data.name,
            fssai_number=getattr(data, "fssai_number", None),
            gst_number=getattr(data, "gst_number", None),
            address=data.address,
            pincode=data.pincode,
            phone=data.phone,
            city=data.city,
            state=data.state,
            latitude=getattr(data, "latitude", None),
            longitude=getattr(data, "longitude", None)
        )

    elif role == "ngo":
        profile = NGO(
            user_id=user.id,
            ngo_name=getattr(data, "ngo_name", None) or data.name,
            registration_number=getattr(data, "registration_number", None),
            contact_person=getattr(data, "contact_person", None) or data.name,
            phone=data.phone,
            email=data.email,
            address=data.address,
            city=data.city,
            state=data.state,
            pincode=data.pincode,
            latitude=getattr(data, "latitude", None),
            longitude=getattr(data, "longitude", None)
        )

    elif role == "individual":
        profile = Individual(
            user_id=user.id,
            full_name=data.name,
            phone=data.phone,
            address=data.address,
            city=data.city,
            state=data.state,
            pincode=data.pincode,
            latitude=getattr(data, "latitude", None),
            longitude=getattr(data, "longitude", None)
        )

    elif role == "volunteer":
        profile = Volunteer(
            user_id=user.id,
            full_name=data.name,
            phone=data.phone,
            vehicle_type=getattr(data, "vehicle_type", "Bike"),
            vehicle_number=getattr(data, "vehicle_number", None),
            city=data.city,
            state=data.state,
            pincode=data.pincode,
            latitude=getattr(data, "latitude", None),
            longitude=getattr(data, "longitude", None),
            is_online=True
        )

    elif role == "admin":
        profile = None

    else:
        raise ValueError("Invalid role specified")

    if profile:
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile or user



def login_user(db: Session, email: str, password: str):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password")

    role = user.role.lower()

    if role == "business":
        profile = (
            db.query(Business)
            .filter(Business.user_id == user.id)
            .first()
        )

    elif role == "ngo":
        profile = (
            db.query(NGO)
            .filter(NGO.user_id == user.id)
            .first()
        )

    elif role == "individual":
        profile = (
            db.query(Individual)
            .filter(Individual.user_id == user.id)
            .first()
        )

    elif role == "volunteer":
        profile = (
            db.query(Volunteer)
            .filter(Volunteer.user_id == user.id)
            .first()
        )
    else:
        profile = None

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "user": user,
        "profile": profile
    }
