# app/routers/clients.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.clients import Client
from app.schemas.clients import ClientCreate, ClientOut, ClientUpdate
from typing import List

router = APIRouter()

@router.post("/", response_model=ClientOut)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@router.get("/", response_model=List[ClientOut])
def read_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@router.get("/{client_id}", response_model=ClientOut)
def read_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).get(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=ClientOut)
def update_client(client_id: int, updated: ClientUpdate, db: Session = Depends(get_db)):
    client = db.query(Client).get(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    for field, value in updated.dict(exclude_unset=True).items():
        setattr(client, field, value)
    db.commit()
    db.refresh(client)
    return client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).get(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"ok": True}
