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

# Create database tables if missing
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

# Application Routers
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


# Startup initialization for default admin account
@app.on_event("startup")
def init_admin():
    from app.database.database import SessionLocal
    from app.auth.security import hash_password

    db = SessionLocal()
    try:
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
            print("[INFO] Default admin user verified.")
    except Exception as e:
        db.rollback()
        print("[INIT ADMIN ERROR]:", e)
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Welcome to FoodBridge AI API",
        "status": "Backend Running Successfully"
    }
