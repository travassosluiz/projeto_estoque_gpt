# app/routers/inventories.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.inventories import Inventory
from app.schemas.inventories import InventoryCreate, InventoryOut, InventoryUpdate

router = APIRouter()

@router.post("/", response_model=InventoryOut)
def create_inventory(entry: InventoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Inventory).filter(Inventory.product_id == entry.product_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Inventory already exists for this product")
    db_entry = Inventory(**entry.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.get("/", response_model=List[InventoryOut])
def get_inventories(db: Session = Depends(get_db)):
    return db.query(Inventory).all()

@router.get("/{inventory_id}", response_model=InventoryOut)
def get_inventory(inventory_id: int, db: Session = Depends(get_db)):
    entry = db.query(Inventory).get(inventory_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return entry

@router.put("/{inventory_id}", response_model=InventoryOut)
def update_inventory(inventory_id: int, update: InventoryUpdate, db: Session = Depends(get_db)):
    entry = db.query(Inventory).get(inventory_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Inventory not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(entry, field, value)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{inventory_id}")
def delete_inventory(inventory_id: int, db: Session = Depends(get_db)):
    entry = db.query(Inventory).get(inventory_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Inventory not found")
    db.delete(entry)
    db.commit()
    return {"ok": True}
