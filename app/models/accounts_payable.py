# app/models/accounts_payable.py

from sqlalchemy import Column, Integer, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class AccountPayable(Base):
    __tablename__ = "accounts_payable"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    due_date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    paid = Column(Boolean, default=False)

    supplier = relationship("Supplier")
