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

    # Ensure demo and alternate business accounts have password biz123
    for email in ["demo@test.com", "rounakpathak9080@gmail.com"]:
        alt_user = db.query(User).filter(User.email == email).first()
        if alt_user:
            alt_user.password_hash = hash_password("biz123")
            alt_user.role = "business"
            db.commit()

    # Ensure all business accounts have their 105 inventory catalog items preserved and synced
    import os
    import json
    from app.models.inventory import Inventory
    from app.models.donation import Donation

    seed_inv_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "seed_inventory.json")
    seed_don_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database", "seed_donations.json")

    # Load inventory from database or seed file
    catalog_items = []
    source_items = db.query(Inventory).all()
    if source_items:
        seen = {}
        for it in source_items:
            if it.product_name not in seen:
                seen[it.product_name] = True
                catalog_items.append({
                    "product_name": it.product_name,
                    "category": it.category,
                    "quantity": it.quantity,
                    "unit": it.unit,
                    "barcode": it.barcode,
                    "manufacturing_date": it.manufacturing_date,
                    "expiry_date": it.expiry_date,
                    "purchase_date": it.purchase_date,
                    "supplier": it.supplier,
                    "storage_location": it.storage_location,
                    "image_url": it.image_url,
                    "status": it.status
                })
    elif os.path.exists(seed_inv_file):
        try:
            with open(seed_inv_file, "r", encoding="utf-8") as f:
                catalog_items = json.load(f)
        except Exception as e:
            print("[WARN] Error loading seed_inventory.json:", e)

    for b in db.query(Business).all():
        b_count = db.query(Inventory).filter(Inventory.business_id == b.id).count()
        if b_count == 0 and catalog_items:
            for item in catalog_items:
                db.add(Inventory(
                    business_id=b.id,
                    product_name=item["product_name"],
                    category=item["category"],
                    quantity=item["quantity"],
                    unit=item["unit"],
                    barcode=item.get("barcode"),
                    manufacturing_date=item.get("manufacturing_date"),
                    expiry_date=item["expiry_date"],
                    purchase_date=item.get("purchase_date"),
                    supplier=item.get("supplier"),
                    storage_location=item.get("storage_location"),
                    image_url=item.get("image_url"),
                    status=item.get("status", "Fresh")
                ))
            db.commit()

    # Load donations from database or seed file
    for b in db.query(Business).all():
        don_count = db.query(Donation).filter(Donation.business_id == b.id).count()
        if don_count == 0 and os.path.exists(seed_don_file):
            try:
                with open(seed_don_file, "r", encoding="utf-8") as f:
                    seed_donations = json.load(f)
                for d in seed_donations:
                    db.add(Donation(
                        business_id=b.id,
                        donor_type="business",
                        food_name=d["food_name"],
                        food_category=d["food_category"],
                        quantity=d["quantity"],
                        manufacturing_date=d.get("manufacturing_date"),
                        expiry_date=d["expiry_date"],
                        pickup_address=d.get("pickup_address", b.address),
                        pickup_time=d.get("pickup_time", "Today (Flexible)"),
                        contact_person=d.get("contact_person", b.owner_name),
                        phone=d.get("phone", b.phone),
                        special_instructions=d.get("special_instructions", ""),
                        image_url=d.get("image_url"),
                        status=d.get("status", "Available")
                    ))
                db.commit()
            except Exception as e:
                print("[WARN] Error seeding donations:", e)

    return True

