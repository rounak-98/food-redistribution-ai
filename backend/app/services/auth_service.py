from sqlalchemy.orm import Session

from app.models.user import User
from app.models.business import Business
from app.auth.security import hash_password, verify_password


def register_business(db: Session, data):

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

    business = Business(
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


    
    db.add(business)
    db.commit()
    db.refresh(business)

    return business



def login_business(db: Session, email: str, password: str):

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

    # Find business details
    business = (
        db.query(Business)
        .filter(Business.user_id == user.id)
        .first()
    )

    return {
        "user": user,
        "business": business
    }

   

