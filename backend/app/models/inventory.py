from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.database import Base


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)

    business_id = Column(
        Integer,
        ForeignKey("businesses.id"),
        nullable=False
    )

    product_name = Column(String(150), nullable=False)

    category = Column(String(100), nullable=False)

    quantity = Column(String(50), nullable=False)

    unit = Column(String(20), nullable=False)

    barcode = Column(String(50))

    manufacturing_date = Column(String(30))

    expiry_date = Column(String(30), nullable=False)

    purchase_date = Column(String(30))

    supplier = Column(String(100))

    storage_location = Column(String(100))

    image_url = Column(String(255))

    status = Column(
        String(30),
        default="Fresh"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    business = relationship("Business")