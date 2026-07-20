from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import Base, engine
from app.models.user import User
from app.models.business import Business
from app.models.donation import Donation
from app.models.ngo import NGO
from app.api.auth import router as auth_router
from app.api.donation import router as donation_router
from app.api.inventory import router as inventory_router
from app.api.dashboard import router as dashboard_router
from app.models.inventory import Inventory
from app.api.barcode import router as barcode_router
from app.api.ngo import router as ngo_router

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

@app.get("/")
def home():
    return {
        "message": "Welcome to FoodBridge AI API",
        "status": "Backend Running Successfully"
    }
