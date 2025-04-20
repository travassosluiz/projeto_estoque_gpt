# app/routers/purchase_items.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.purchase_items import PurchaseItem
from app.models.inventories import Inventory
from app.schemas.purchase_items import (
    PurchaseItemCreate,
    PurchaseItemUpdate,
    PurchaseItemOut,
)

router = APIRouter()

@router.post("/", response_model=PurchaseItemOut)
def create_purchase_item(item: PurchaseItemCreate, db: Session = Depends(get_db)):
    db_item = PurchaseItem(**item.dict())
    db.add(db_item)

    # Atualizar estoque
    inventory = db.query(Inventory).filter_by(product_id=item.product_id).first()
    if inventory:
        inventory.quantity += item.quantity
    else:
        inventory = Inventory(product_id=item.product_id, quantity=item.quantity)
        db.add(inventory)

    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[PurchaseItemOut])
def get_purchase_items(db: Session = Depends(get_db)):
    return db.query(PurchaseItem).all()

@router.get("/{item_id}", response_model=PurchaseItemOut)
def get_purchase_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(PurchaseItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Purchase item not found")
    return item

@router.put("/{item_id}", response_model=PurchaseItemOut)
def update_purchase_item(item_id: int, update: PurchaseItemUpdate, db: Session = Depends(get_db)):
    item = db.query(PurchaseItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Purchase item not found")

    for field, value in update.dict(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_purchase_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(PurchaseItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Purchase item not found")

    # Reduz estoque ao deletar item da nota
    inventory = db.query(Inventory).filter_by(product_id=item.product_id).first()
    if inventory:
        inventory.quantity -= item.quantity
        if inventory.quantity < 0:
            inventory.quantity = 0

    db.delete(item)
    db.commit()
    return {"ok": True}
