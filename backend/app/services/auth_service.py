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


def seed_core_accounts(db: Session):
    accounts = [
        {
            "role": "admin",
            "email": "admin@foodbridge.com",
            "name": "System Administrator",
            "password": "admin123",
            "profile_type": None,
            "profile_data": None
        },
        {
            "role": "business",
            "email": "restaurant@foodbridge.com",
            "name": "Grand Heritage Kitchen",
            "password": "biz123",
            "profile_type": Business,
            "profile_data": {
                "business_name": "Grand Heritage Kitchen",
                "business_type": "Restaurant",
                "owner_name": "Rounak Pathak",
                "fssai_number": "11521034000123",
                "gst_number": "27AAAAA0000A1Z5",
                "phone": "9876543210",
                "address": "JM Road, Shivaji Nagar",
                "city": "Pune",
                "state": "Maharashtra",
                "pincode": "411005",
                "latitude": "18.5204",
                "longitude": "73.8567",
            }
        },
        {
            "role": "ngo",
            "email": "ngo@foodbridge.com",
            "name": "Asha Food Relief Trust",
            "password": "ngo123",
            "profile_type": NGO,
            "profile_data": {
                "ngo_name": "Asha Food Relief Trust",
                "registration_number": "MH-PUN-2021-098",
                "contact_person": "Priya Sharma",
                "phone": "9823456789",
                "email": "ngo@foodbridge.com",
                "address": "Kothrud Depot Road",
                "city": "Pune",
                "state": "Maharashtra",
                "pincode": "411038",
                "latitude": "18.5074",
                "longitude": "73.8077",
            }
        },
        {
            "role": "volunteer",
            "email": "rider@foodbridge.com",
            "name": "Rahul Deshmukh",
            "password": "rider123",
            "profile_type": Volunteer,
            "profile_data": {
                "full_name": "Rahul Deshmukh",
                "phone": "9811223344",
                "vehicle_type": "Motorcycle",
                "vehicle_number": "MH-12-AB-1234",
                "city": "Pune",
                "state": "Maharashtra",
                "pincode": "411005",
                "latitude": "18.5204",
                "longitude": "73.8567",
                "is_online": True,
            }
        },
        {
            "role": "individual",
            "email": "individual@foodbridge.com",
            "name": "Amit Verma",
            "password": "ind123",
            "profile_type": Individual,
            "profile_data": {
                "full_name": "Amit Verma",
                "phone": "9877001122",
                "address": "Viman Nagar, Lane 2",
                "city": "Pune",
                "state": "Maharashtra",
                "pincode": "411014",
                "latitude": "18.5679",
                "longitude": "73.9143",
            }
        },
    ]

    for acc in accounts:
        user = db.query(User).filter(User.email == acc["email"]).first()
        if not user:
            user = User(
                name=acc["name"],
                email=acc["email"],
                password_hash=hash_password(acc["password"]),
                role=acc["role"]
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.role = acc["role"]
            user.password_hash = hash_password(acc["password"])
            db.commit()

        if acc["profile_type"] and acc["profile_data"]:
            profile = db.query(acc["profile_type"]).filter(acc["profile_type"].user_id == user.id).first()
            if not profile:
                profile = acc["profile_type"](user_id=user.id, **acc["profile_data"])
                db.add(profile)
                db.commit()

    # Legacy individual support for user@gmail.com
    legacy_user = db.query(User).filter(User.email == "user@gmail.com").first()
    if legacy_user:
        legacy_user.password_hash = hash_password("ind123")
        legacy_user.role = "individual"
        db.commit()

    return True

