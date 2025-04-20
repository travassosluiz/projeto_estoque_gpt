# app/schemas/purchase_invoices.py

from pydantic import BaseModel
from datetime import date

class PurchaseInvoiceBase(BaseModel):
    supplier_id: int
    date: date
    total: float

class PurchaseInvoiceCreate(PurchaseInvoiceBase):
    pass

class PurchaseInvoiceUpdate(PurchaseInvoiceBase):
    pass

class PurchaseInvoiceOut(PurchaseInvoiceBase):
    id: int

    class Config:
        orm_mode = True
