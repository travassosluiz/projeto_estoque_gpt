# app/schemas/sale_items.py

from pydantic import BaseModel
from typing import Optional

class SaleItemBase(BaseModel):
    sales_invoice_id: int
    product_id: int
    quantity: float
    unit_price: float

class SaleItemCreate(SaleItemBase):
    pass

class SaleItemUpdate(BaseModel):
    quantity: Optional[float]
    unit_price: Optional[float]

class SaleItemOut(SaleItemBase):
    id: int

    class Config:
        orm_mode = True
