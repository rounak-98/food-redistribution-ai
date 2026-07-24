from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class DeliveryTask(Base):
    __tablename__ = "delivery_tasks"

    id = Column(Integer, primary_key=True, index=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id"),
        nullable=False
    )

    volunteer_id = Column(
        Integer,
        ForeignKey("volunteers.id"),
        nullable=True
    )

    pickup_address = Column(String(255), nullable=False)

    pickup_contact_name = Column(String(100), nullable=False)

    pickup_contact_phone = Column(String(20), nullable=False)

    dropoff_address = Column(String(255), nullable=False)

    dropoff_ngo_name = Column(String(150), nullable=False)

    dropoff_contact_phone = Column(String(20), nullable=False)

    delivery_type = Column(String(30), default="Immediate")  # Immediate vs Scheduled

    scheduled_time = Column(String(50))

    status = Column(
        String(30),
        default="Pending_Acceptance"
    )  # Pending_Acceptance, Accepted, In_Transit, Delivered, Rejected

    # OTP Verification Fields
    pickup_otp = Column(String(10), nullable=True)  # e.g. "4821"
    delivery_otp = Column(String(10), nullable=True)  # e.g. "7913"
    pickup_otp_verified = Column(Boolean, default=False)
    delivery_otp_verified = Column(Boolean, default=False)

    notes = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    donation = relationship("Donation")
    volunteer = relationship("Volunteer")
