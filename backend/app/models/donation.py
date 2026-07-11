from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)

    business_id = Column(
        Integer,
        ForeignKey("businesses.id"),
        nullable=False
    )

    food_name = Column(String(150), nullable=False)

    food_category = Column(String(100), nullable=False)

    quantity = Column(String(50), nullable=False)

    manufacturing_date = Column(String(30))

    expiry_date = Column(String(30), nullable=False)

    pickup_address = Column(String(255), nullable=False)

    pickup_time = Column(String(50), nullable=False)

    contact_person = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False)

    special_instructions = Column(Text)

    image_url = Column(String(255))

    status = Column(
        String(30),
        default="Available"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    business = relationship("Business")