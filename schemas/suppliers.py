# app/schemas/suppliers.py

from pydantic import BaseModel, EmailStr
from typing import Optional

class SupplierBase(BaseModel):
    name: str
    document: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    active: Optional[bool] = True

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    pass

class SupplierOut(SupplierBase):
    id: int

    class Config:
        orm_mode = True
