# app/schemas/inventories.py

from pydantic import BaseModel
from typing import Optional

class InventoryBase(BaseModel):
    product_id: int
    quantity: float

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    quantity: Optional[float] = None  # Atualização parcial

class InventoryOut(InventoryBase):
    id: int

    class Config:
        orm_mode = True
