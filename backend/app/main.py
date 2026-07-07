from fastapi import FastAPI

from app.database.database import Base, engine
from app.models.user import User

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FoodBridge AI API",
    description="AI-Based Food Redistribution System",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to FoodBridge AI API",
        "status": "Backend Running Successfully"
    }