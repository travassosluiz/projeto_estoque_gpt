# app/routers/purchase_invoices.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.purchase_invoices import PurchaseInvoice
from app.schemas.purchase_invoices import (
    PurchaseInvoiceCreate,
    PurchaseInvoiceUpdate,
    PurchaseInvoiceOut,
)

router = APIRouter()

@router.post("/", response_model=PurchaseInvoiceOut)
def create_purchase(invoice: PurchaseInvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = PurchaseInvoice(**invoice.dict())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@router.get("/", response_model=List[PurchaseInvoiceOut])
def get_purchases(db: Session = Depends(get_db)):
    return db.query(PurchaseInvoice).all()

@router.get("/{invoice_id}", response_model=PurchaseInvoiceOut)
def get_purchase(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(PurchaseInvoice).get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return invoice

@router.put("/{invoice_id}", response_model=PurchaseInvoiceOut)
def update_purchase(invoice_id: int, update: PurchaseInvoiceUpdate, db: Session = Depends(get_db)):
    invoice = db.query(PurchaseInvoice).get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Purchase not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(invoice, field, value)
    db.commit()
    db.refresh(invoice)
    return invoice

@router.delete("/{invoice_id}")
def delete_purchase(invoice_id: int, db: Session = Depends(get_db)):
    invoice = db.query(PurchaseInvoice).get(invoice_id)
    if not invoice:
        raise HTTPException(status_code=404, detail="Purchase not found")
    db.delete(invoice)
    db.commit()
    return {"ok": True}
