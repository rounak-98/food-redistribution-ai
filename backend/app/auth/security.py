from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
SECRET_KEY = "foodbridge_ai_super_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

def create_access_token(data: dict):

    # Make a copy so we don't modify the original dictionary
    to_encode = data.copy()

    # Set token expiry time
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Add expiry to the payload
    to_encode.update({"exp": expire})

    # Create JWT token
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
        ):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        print("JWT payload:", payload)
        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception
        
        user = db.query(User).filter(User.id == int(user_id)).first()

        if user is None:
            raise credentials_exception
        print("Authenticated user:", user.id, user.email)
        return user

    except JWTError:
        raise credentials_exception