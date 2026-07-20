from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    ngo_name = Column(String(150), nullable=False)

    registration_number = Column(String(100))

    contact_person = Column(String(100), nullable=False)

    phone = Column(String(20), nullable=False)

    email = Column(String(100))

    address = Column(String(255), nullable=False)

    city = Column(String(50), nullable=False)

    state = Column(String(50), nullable=False)

    pincode = Column(String(10), nullable=False)

    latitude = Column(String(30))

    longitude = Column(String(30))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")