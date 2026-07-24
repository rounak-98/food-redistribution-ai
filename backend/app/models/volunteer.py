from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    full_name = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False)

    vehicle_type = Column(String(50), nullable=False)  # Bike, Scooter, Car, Van, EV, On Foot

    vehicle_number = Column(String(30))

    city = Column(String(50), nullable=False)

    state = Column(String(50), nullable=False)

    pincode = Column(String(10), nullable=False)

    is_online = Column(Boolean, default=True)

    latitude = Column(String(30))

    longitude = Column(String(30))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")
