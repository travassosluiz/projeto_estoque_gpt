# app/routers/sale_items.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.sale_items import SaleItem
from app.models.inventories import Inventory
from app.schemas.sale_items import (
    SaleItemCreate,
    SaleItemUpdate,
    SaleItemOut,
)

router = APIRouter()

@router.post("/", response_model=SaleItemOut)
def create_sale_item(item: SaleItemCreate, db: Session = Depends(get_db)):
    # Verificar estoque antes de vender
    inventory = db.query(Inventory).filter_by(product_id=item.product_id).first()
    if not inventory or inventory.quantity < item.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    db_item = SaleItem(**item.dict())
    db.add(db_item)

    # Baixa no estoque
    inventory.quantity -= item.quantity
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[SaleItemOut])
def get_sale_items(db: Session = Depends(get_db)):
    return db.query(SaleItem).all()

@router.get("/{item_id}", response_model=SaleItemOut)
def get_sale_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(SaleItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Sale item not found")
    return item

@router.put("/{item_id}", response_model=SaleItemOut)
def update_sale_item(item_id: int, update: SaleItemUpdate, db: Session = Depends(get_db)):
    item = db.query(SaleItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Sale item not found")
    for field, value in update.dict(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_sale_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(SaleItem).get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Sale item not found")

    # Repor estoque ao remover item vendido
    inventory = db.query(Inventory).filter_by(product_id=item.product_id).first()
    if inventory:
        inventory.quantity += item.quantity

    db.delete(item)
    db.commit()
    return {"ok": True}
