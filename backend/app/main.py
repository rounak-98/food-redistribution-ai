from fastapi import FastAPI

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