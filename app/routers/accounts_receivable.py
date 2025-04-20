# app/routers/accounts_receivable.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.accounts_receivable import AccountReceivable
from app.schemas.accounts_receivable import (
    AccountReceivableCreate,
    AccountReceivableUpdate,
    AccountReceivableOut,
)

router = APIRouter()

@router.post("/", response_model=AccountReceivableOut)
def create_receivable(account: AccountReceivableCreate, db: Session = Depends(get_db)):
    db_account = AccountReceivable(**account.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/", response_model=List[AccountReceivableOut])
def get_all_receivables(db: Session = Depends(get_db)):
    return db.query(AccountReceivable).all()

@router.get("/{account_id}", response_model=AccountReceivableOut)
def get_receivable(account_id: int, db: Session = Depends(get_db)):
    account = db.query(AccountReceivable).get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Receivable not found")
    return account

@router.put("/{account_id}", response_model=AccountReceivableOut)
def update_receivable(account_id: int, update: AccountReceivableUpdate, db: Session = Depends(get_db)):
    account = db.query(AccountReceivable).get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Receivable not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(account, field, value)
    db.commit()
    db.refresh(account)
    return account

@router.delete("/{account_id}")
def delete_receivable(account_id: int, db: Session = Depends(get_db)):
    account = db.query(AccountReceivable).get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Receivable not found")
    db.delete(account)
    db.commit()
    return {"ok": True}
