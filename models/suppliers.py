# app/models/suppliers.py

from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    document = Column(String(20), unique=True, nullable=False)  # CNPJ
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    active = Column(Boolean, default=True)
