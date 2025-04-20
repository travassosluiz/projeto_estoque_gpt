# app/routers/reports.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.clients import Client
from app.models.accounts_receivable import AccountReceivable
from app.utils.pdf_generator import generate_pdf

router = APIRouter()

@router.get("/reports/client-financial/{client_id}")
def client_financial_report(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).get(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    parcels = db.query(AccountReceivable).filter_by(client_id=client_id).all()
    if not parcels:
        raise HTTPException(status_code=404, detail="No receivables for this client")

    return generate_pdf(client.name, parcels)
