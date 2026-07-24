from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.models.user import User
from app.models.business import Business
from app.models.donation import Donation
from app.models.ngo import NGO
from app.models.individual import Individual
from app.models.volunteer import Volunteer
from app.models.delivery import DeliveryTask
from app.models.inventory import Inventory

from app.api.auth import router as auth_router
from app.api.donation import router as donation_router
from app.api.inventory import router as inventory_router
from app.api.dashboard import router as dashboard_router
from app.api.barcode import router as barcode_router
from app.api.ngo import router as ngo_router
from app.api.business import router as business_router
from app.api.individual import router as individual_router
from app.api.volunteer import router as volunteer_router
from app.api.admin import router as admin_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FoodBridge AI API",
    description="AI-Based Food Redistribution System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(donation_router)
app.include_router(inventory_router)
app.include_router(barcode_router)
app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)
app.include_router(ngo_router)
app.include_router(business_router)
app.include_router(individual_router)
app.include_router(volunteer_router)
app.include_router(admin_router)


# Seed default admin user & initial platform demo data
@app.on_event("startup")
def seed_demo_data():
    from app.database.database import SessionLocal
    from app.auth.security import hash_password
    db = SessionLocal()
    try:
        # Seed Admin
        admin_user = db.query(User).filter(User.role == "admin").first()
        if not admin_user:
            admin_user = User(
                name="System Administrator",
                email="admin@foodbridge.com",
                password_hash=hash_password("admin123"),
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("INFO: Created Admin: admin@foodbridge.com / admin123")

        # Seed Demo Business
        biz_user = db.query(User).filter(User.email == "restaurant@foodbridge.com").first()
        if not biz_user:
            biz_user = User(
                name="Royal Palace Hotel & Bakery",
                email="restaurant@foodbridge.com",
                password_hash=hash_password("biz123"),
                role="business"
            )
            db.add(biz_user)
            db.commit()

            biz_profile = Business(
                user_id=biz_user.id,
                business_name="Royal Palace Hotel & Bakery",
                business_type="Hotel & Restaurant",
                owner_name="Rajesh Sharma",
                fssai_number="100200300400",
                gst_number="29ABCDE1234F1ZH",
                address="12 MG Road, Indiranagar",
                city="Bengaluru",
                state="Karnataka",
                pincode="560038",
                latitude="12.9716",
                longitude="77.5946"
            )
            db.add(biz_profile)
            db.commit()

            # Add sample donation
            d1 = Donation(
                business_id=biz_profile.id,
                food_name="50 Portions Veg Biryani & Paneer Curry",
                quantity=50,
                unit="Portions",
                food_category="Cooked Meal",
                expiry_date="Today before 10 PM",
                pickup_time="Today 7 PM - 9 PM",
                pickup_address="12 MG Road, Indiranagar",
                contact_person="Rajesh Sharma",
                phone="9876543210",
                status="Available"
            )
            db.add(d1)
            db.commit()

        # Seed Demo NGO
        ngo_user = db.query(User).filter(User.email == "ngo@foodbridge.com").first()
        if not ngo_user:
            ngo_user = User(
                name="Asha Food Trust & Care",
                email="ngo@foodbridge.com",
                password_hash=hash_password("ngo123"),
                role="ngo"
            )
            db.add(ngo_user)
            db.commit()

            ngo_profile = NGO(
                user_id=ngo_user.id,
                ngo_name="Asha Food Trust & Care",
                registration_number="NGO-KAR-2023-88",
                contact_person="Priya Nair",
                phone="9123456789",
                email="ngo@foodbridge.com",
                address="45 Brigade Road",
                city="Bengaluru",
                state="Karnataka",
                pincode="560001",
                latitude="12.9720",
                longitude="77.5950"
            )
            db.add(ngo_profile)
            db.commit()

        # Seed Demo Volunteer Rider
        vol_user = db.query(User).filter(User.email == "rider@foodbridge.com").first()
        if not vol_user:
            vol_user = User(
                name="Vikram Transport Rider",
                email="rider@foodbridge.com",
                password_hash=hash_password("rider123"),
                role="volunteer"
            )
            db.add(vol_user)
            db.commit()

            vol_profile = Volunteer(
                user_id=vol_user.id,
                full_name="Vikram Singh",
                phone="9988776655",
                vehicle_type="Motorcycle / Scooter",
                vehicle_number="KA-01-EV-4321",
                city="Bengaluru",
                state="Karnataka",
                pincode="560038",
                latitude="12.9715",
                longitude="77.5945",
                is_online=True
            )
            db.add(vol_profile)
            db.commit()

    except Exception as e:
        print("Error seeding demo data:", e)
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to FoodBridge AI API",
        "status": "Backend Running Successfully"
    }
