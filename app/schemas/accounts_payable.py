# app/schemas/accounts_payable.py

from pydantic import BaseModel
from datetime import date
from typing import Optional

class AccountPayableBase(BaseModel):
    supplier_id: int
    due_date: date
    amount: float
    paid: Optional[bool] = False

class AccountPayableCreate(AccountPayableBase):
    pass

class AccountPayableUpdate(BaseModel):
    due_date: Optional[date]
    amount: Optional[float]
    paid: Optional[bool]

class AccountPayableOut(AccountPayableBase):
    id: int

    class Config:
        orm_mode = True
