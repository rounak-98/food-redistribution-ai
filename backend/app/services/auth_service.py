from sqlalchemy.orm import Session

from app.models.user import User
from app.models.business import Business
from app.auth.security import hash_password, verify_password
from app.models.ngo import NGO

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

    if data.role == "Business":

        profile = Business(
            user_id=user.id,
            business_name=data.business_name,
            business_type=data.business_type,
            owner_name=data.owner_name,
            fssai_number=data.fssai_number,
            gst_number=data.gst_number,
            address=data.address,
            pincode=data.pincode,
            phone=data.phone,
            city=data.city,
            state=data.state,
        )

    elif data.role == "NGO":

        profile = NGO(
            user_id=user.id,
            ngo_name=data.ngo_name,
            registration_number=data.registration_number,
            contact_person=data.contact_person,
            phone=data.phone,
            email=data.email,
            address=data.address,
            city=data.city,
            state=data.state,
            pincode=data.pincode,
        )

    else:
        raise ValueError("Invalid role")

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile

def register_ngo(db: Session, data):

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

    ngo = NGO(
        user_id=user.id,
        ngo_name=data.ngo_name,
        registration_number=data.registration_number,
        contact_person=data.contact_person,
        phone=data.phone,
        email=data.email,
        address=data.address,
        city=data.city,
        state=data.state,
        pincode=data.pincode
    )

    db.add(ngo)
    db.commit()
    db.refresh(ngo)

    return ngo

def login_user(db: Session, email: str, password: str):

    # Find user by email
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password")

    # Verify password
    if not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password")

    # Find profile based on user role
    if user.role == "Business":

        profile = (
            db.query(Business)
            .filter(Business.user_id == user.id)
            .first()
        )

    elif user.role == "NGO":

        profile = (
            db.query(NGO)
            .filter(NGO.user_id == user.id)
            .first()
    )

    else:
        profile = None


    return {
        "user": user,
        "profile": profile
    }
   

