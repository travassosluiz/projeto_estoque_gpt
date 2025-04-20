# app/schemas/purchase_items.py

from pydantic import BaseModel
from typing import Optional

class PurchaseItemBase(BaseModel):
    purchase_invoice_id: int
    product_id: int
    quantity: float
    unit_price: float

class PurchaseItemCreate(PurchaseItemBase):
    pass

class PurchaseItemUpdate(BaseModel):
    quantity: Optional[float]
    unit_price: Optional[float]

class PurchaseItemOut(PurchaseItemBase):
    id: int

    class Config:
        orm_mode = True
