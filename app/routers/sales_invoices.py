# app/routers/sales_invoices.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.sales_invoices import SalesInvoice
from app.schemas.sales_invoices import (
    SalesInvoiceCreate,
    SalesInvoiceUpdate,
    SalesInvoiceOut,
)

router = APIRouter()

@router.post("/", response_model=SalesInvoiceOut)
def create_sale(invoice: SalesInvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = SalesInvoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/", response_model=List[SalesInvoiceOut])
def get_sales(db: Session = Depends(get_db)):
    return db.query(SalesInvoice).all()

@router.get("/{invoice_id}", response_model=SalesInvoiceOut)
def get_sale(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(SalesInvoice).get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Sale not found")
    return invoice

@router.put("/{invoice_id}", response_model=SalesInvoiceOut)
def update_sale(invoice_id: int, update: SalesInvoiceUpdate, db: Session = Depends(get_db)):
    invoice = db.query(SalesInvoice).get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Sale not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(invoice, field, value)
    db.commit()
    db.refresh(invoice)
    return invoice

@router.delete("/{invoice_id}")
def delete_sale(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(SalesInvoice).get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Sale not found")
    db.delete(invoice)
    db.commit()
    return {"ok": True}
