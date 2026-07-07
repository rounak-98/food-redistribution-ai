from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        unique=True
    )

    business_name = Column(String(150), nullable=False)

    business_type = Column(String(50), nullable=False)

    owner_name = Column(String(100), nullable=False)

    fssai_number = Column(String(50))

    # NEW
    gst_number = Column(String(30))

    phone = Column(String(20), nullable=False)

    # NEW
    address = Column(String(255), nullable=False)

    city = Column(String(50), nullable=False)

    state = Column(String(50), nullable=False)

    # NEW
    pincode = Column(String(10), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User")