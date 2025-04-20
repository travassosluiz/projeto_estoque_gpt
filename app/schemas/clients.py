# app/schemas/clients.py

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class ClientBase(BaseModel):
    name: str
    document: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    birth_date: Optional[date] = None
    active: Optional[bool] = True

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int

    class Config:
        orm_mode = True
