# app/schemas/accounts_receivable.py

from pydantic import BaseModel
from datetime import date
from typing import Optional

class AccountReceivableBase(BaseModel):
    client_id: int
    due_date: date
    amount: float
    paid: Optional[bool] = False

class AccountReceivableCreate(AccountReceivableBase):
    pass

class AccountReceivableUpdate(BaseModel):
    due_date: Optional[date]
    amount: Optional[float]
    paid: Optional[bool]

class AccountReceivableOut(AccountReceivableBase):
    id: int

    class Config:
        orm_mode = True
