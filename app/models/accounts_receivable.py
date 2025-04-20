# app/models/accounts_receivable.py

from sqlalchemy import Column, Integer, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class AccountReceivable(Base):
    __tablename__ = "accounts_receivable"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    due_date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    paid = Column(Boolean, default=False)

    client = relationship("Client")
