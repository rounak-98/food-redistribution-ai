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
from app.api.ml_routes import router as ml_router

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
app.include_router(ml_router)


# Seed comprehensive demo accounts & initial platform demo data across all tables and dashboards
@app.on_event("startup")
def seed_demo_data():
    from app.database.database import SessionLocal
    from app.auth.security import hash_password
    db = SessionLocal()
    try:
        # 1. Seed Admin Account
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

        # 2. Seed Business Accounts & Profiles
        biz1_user = db.query(User).filter(User.email == "restaurant@foodbridge.com").first()
        if not biz1_user:
            biz1_user = User(
                name="Royal Palace Hotel & Bakery",
                email="restaurant@foodbridge.com",
                password_hash=hash_password("biz123"),
                role="business"
            )
            db.add(biz1_user)
            db.commit()

            biz1_profile = Business(
                user_id=biz1_user.id,
                business_name="Royal Palace Hotel & Bakery",
                business_type="Hotel & Restaurant",
                owner_name="Rajesh Sharma",
                fssai_number="100200300400",
                gst_number="29ABCDE1234F1ZH",
                phone="9876543210",
                address="12 MG Road, Indiranagar",
                city="Bengaluru",
                state="Karnataka",
                pincode="560038",
                latitude="12.9716",
                longitude="77.5946"
            )
            db.add(biz1_profile)
            db.commit()

            # Seed Inventory for Business 1
            inv_items = [
                Inventory(
                    business_id=biz1_profile.id,
                    product_name="Fresh Veggie Salad Packets",
                    quantity="40",
                    unit="Portions",
                    category="Produce",
                    expiry_date="2026-07-30",
                    storage_temperature=4.5,
                    is_sealed=True,
                    spoilage_risk="Low Risk",
                    status="Fresh"
                ),
                Inventory(
                    business_id=biz1_profile.id,
                    product_name="Artisanal Wheat Bread Loaves",
                    quantity="25",
                    unit="Loaves",
                    category="Bakery",
                    expiry_date="2026-07-29",
                    storage_temperature=22.0,
                    is_sealed=True,
                    spoilage_risk="Medium Risk",
                    status="Expiring Soon"
                ),
                Inventory(
                    business_id=biz1_profile.id,
                    product_name="Steam Rice & Dal Combo",
                    quantity="60",
                    unit="Meals",
                    category="Cooked Meals",
                    expiry_date="2026-07-28",
                    storage_temperature=65.0,
                    is_sealed=True,
                    spoilage_risk="High Risk",
                    status="Fresh"
                ),
                Inventory(
                    business_id=biz1_profile.id,
                    product_name="Organic Milk Pouches",
                    quantity="30",
                    unit="Litres",
                    category="Dairy",
                    expiry_date="2026-08-01",
                    storage_temperature=3.5,
                    is_sealed=True,
                    spoilage_risk="Low Risk",
                    status="Fresh"
                )
            ]
            for item in inv_items:
                db.add(item)
            db.commit()

            # Seed Business 1 Donation
            d1 = Donation(
                business_id=biz1_profile.id,
                food_name="50 Portions Veg Biryani & Paneer Curry",
                quantity=50,
                unit="Portions",
                food_category="Cooked Meals",
                expiry_date="Today before 10 PM",
                pickup_time="Today 7 PM - 9 PM",
                pickup_address="12 MG Road, Indiranagar",
                contact_person="Rajesh Sharma",
                phone="9876543210",
                status="Available"
            )
            db.add(d1)
            db.commit()

        # Seed Business 2 (Supermarket)
        biz2_user = db.query(User).filter(User.email == "supermarket@foodbridge.com").first()
        if not biz2_user:
            biz2_user = User(
                name="FreshMart Organics Supermarket",
                email="supermarket@foodbridge.com",
                password_hash=hash_password("biz123"),
                role="business"
            )
            db.add(biz2_user)
            db.commit()

            biz2_profile = Business(
                user_id=biz2_user.id,
                business_name="FreshMart Organics Supermarket",
                business_type="Supermarket",
                owner_name="Sunil Kumar",
                fssai_number="100900800700",
                gst_number="29XYZAB5678G2ZK",
                phone="9845012345",
                address="56 Commercial Street",
                city="Bengaluru",
                state="Karnataka",
                pincode="560001",
                latitude="12.9810",
                longitude="77.6080"
            )
            db.add(biz2_profile)
            db.commit()

            d2 = Donation(
                business_id=biz2_profile.id,
                food_name="30 Crates Organic Apples & Bananas",
                quantity=30,
                unit="Crates",
                food_category="Produce",
                expiry_date="Tomorrow by 6 PM",
                pickup_time="Tomorrow 10 AM - 1 PM",
                pickup_address="56 Commercial Street",
                contact_person="Sunil Kumar",
                phone="9845012345",
                status="Available"
            )
            db.add(d2)
            db.commit()

        # 3. Seed Individual Donors
        ind1_user = db.query(User).filter(User.email == "individual@foodbridge.com").first()
        if not ind1_user:
            ind1_user = User(
                name="Ananya Roy",
                email="individual@foodbridge.com",
                password_hash=hash_password("ind123"),
                role="individual"
            )
            db.add(ind1_user)
            db.commit()

            ind1_profile = Individual(
                user_id=ind1_user.id,
                full_name="Ananya Roy",
                phone="9811223344",
                address="78 Koramangala 4th Block",
                city="Bengaluru",
                state="Karnataka",
                pincode="560034"
            )
            db.add(ind1_profile)
            db.commit()

            d3 = Donation(
                individual_id=ind1_profile.id,
                food_name="15 Homemade Stuffed Parathas",
                quantity=15,
                unit="Portions",
                food_category="Cooked Meals",
                expiry_date="Today before 9 PM",
                pickup_time="Immediate Pickup",
                pickup_address="78 Koramangala 4th Block",
                contact_person="Ananya Roy",
                phone="9811223344",
                status="Available"
            )
            db.add(d3)
            db.commit()

        # 4. Seed NGO Accounts
        ngo1_user = db.query(User).filter(User.email == "ngo@foodbridge.com").first()
        if not ngo1_user:
            ngo1_user = User(
                name="Asha Food Trust & Care",
                email="ngo@foodbridge.com",
                password_hash=hash_password("ngo123"),
                role="ngo"
            )
            db.add(ngo1_user)
            db.commit()

            ngo1_profile = NGO(
                user_id=ngo1_user.id,
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
            db.add(ngo1_profile)
            db.commit()

        # 5. Seed Volunteer Riders
        vol1_user = db.query(User).filter(User.email == "rider@foodbridge.com").first()
        if not vol1_user:
            vol1_user = User(
                name="Vikram Transport Rider",
                email="rider@foodbridge.com",
                password_hash=hash_password("rider123"),
                role="volunteer"
            )
            db.add(vol1_user)
            db.commit()

            vol1_profile = Volunteer(
                user_id=vol1_user.id,
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
            db.add(vol1_profile)
            db.commit()

            # Link a sample Claimed donation & Delivery Task for logistics demo
            claimed_d = db.query(Donation).first()
            if claimed_d:
                claimed_d.ngo_id = 1
                claimed_d.status = "Accepted"
                db.commit()

                del_task = DeliveryTask(
                    donation_id=claimed_d.id,
                    volunteer_id=vol1_profile.id,
                    pickup_address=claimed_d.pickup_address,
                    pickup_contact_name=claimed_d.contact_person,
                    pickup_contact_phone=claimed_d.phone,
                    dropoff_address="45 Brigade Road, NGO Center",
                    dropoff_ngo_name="Asha Food Trust & Care",
                    dropoff_contact_phone="9123456789",
                    status="In_Transit",
                    pickup_otp="4821",
                    delivery_otp="7913",
                    pickup_otp_verified=True,
                    delivery_otp_verified=False,
                    notes="Perishable hot food delivery in insulated thermal bag."
                )
                db.add(del_task)
                db.commit()

    except Exception as e:
        print("[SEED ERROR] Error seeding demo data:", e)
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to FoodBridge AI API",
        "status": "Backend Running Successfully"
    }
