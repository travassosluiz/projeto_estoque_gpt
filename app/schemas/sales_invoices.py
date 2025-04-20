# app/schemas/sales_invoices.py

from pydantic import BaseModel
from datetime import date

class SalesInvoiceBase(BaseModel):
    client_id: int
    date: date
    total: float

class SalesInvoiceCreate(SalesInvoiceBase):
    pass

class SalesInvoiceUpdate(SalesInvoiceBase):
    pass

class SalesInvoiceOut(SalesInvoiceBase):
    id: int

    class Config:
        orm_mode = True
