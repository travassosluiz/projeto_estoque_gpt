# app/models/clients.py

from sqlalchemy import Column, Integer, String, Date, Boolean
from app.database import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    document = Column(String(20), unique=True, nullable=False)  # CPF ou CNPJ
    email = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    birth_date = Column(Date, nullable=True)
    active = Column(Boolean, default=True)
