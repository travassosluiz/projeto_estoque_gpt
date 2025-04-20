# app/routers/accounts_payable.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.accounts_payable import AccountPayable
from app.schemas.accounts_payable import (
    AccountPayableCreate,
    AccountPayableUpdate,
    AccountPayableOut,
)

router = APIRouter()

@router.post("/", response_model=AccountPayableOut)
def create_payable(account: AccountPayableCreate, db: Session = Depends(get_db)):
    db_account = AccountPayable(**account.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

@router.get("/", response_model=List[AccountPayableOut])
def get_all_payables(db: Session = Depends(get_db)):
    return db.query(AccountPayable).all()

@router.get("/{account_id}", response_model=AccountPayableOut)
def get_payable(account_id: int, db: Session = Depends(get_db)):
    account = db.query(AccountPayable).get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Payable not found")
    return account

@router.put("/{account_id}", response_model=AccountPayableOut)
def update_payable(account_id: int, update: AccountPayableUpdate, db: Session = Depends(get_db)):
    account = db.query(AccountPayable).get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Payable not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(account, field, value)
    db.commit()
    db.refresh(account)
    return account

@router.delete("/{account_id}")
def delete_payable(account_id: int, db: Session = Depends(get_db)):
    account = db.query(AccountPayable).get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Payable not found")
    db.delete(account)
    db.commit()
    return {"ok": True}
