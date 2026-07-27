from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os
from urllib.parse import quote_plus

# Load environment variables
load_dotenv()

# Check if direct DATABASE_URL is provided (e.g. from Render/Railway/Heroku)
env_db_url = os.getenv("DATABASE_URL")

if env_db_url:
    if env_db_url.startswith("postgres://"):
        env_db_url = env_db_url.replace("postgres://", "postgresql://", 1)
    DATABASE_URL = env_db_url
else:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "food_redistribution_db")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    
    safe_password = quote_plus(str(DB_PASSWORD)) if DB_PASSWORD else ""

    # If running on cloud environment (Render) without DB_HOST configured, use SQLite fallback
    if os.getenv("RENDER") or (not os.getenv("DB_HOST") and not os.getenv("DB_USER")):
        DATABASE_URL = "sqlite:///./foodbridge.db"
    else:
        DATABASE_URL = (
            f"mysql+pymysql://{DB_USER}:{safe_password}"
            f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        future=True,
        connect_args=connect_args
    )
    # Quick connectivity check
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"[INFO] Primary database connection ({DATABASE_URL}) unavailable. Using SQLite fallback: {e}")
    DATABASE_URL = "sqlite:///./foodbridge.db"
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        future=True,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()