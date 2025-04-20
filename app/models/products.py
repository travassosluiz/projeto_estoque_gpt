# app/models/products.py

from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=True)
    sku = Column(String(50), unique=True, nullable=False)
    price = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    active = Column(Boolean, default=True)
