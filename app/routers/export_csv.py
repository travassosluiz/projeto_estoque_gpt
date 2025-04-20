# app/routers/export_csv.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import clients, suppliers, products, inventories, sales_invoices, purchase_invoices
from app.utils.csv_exporter import export_to_csv

router = APIRouter()

ENTITY_MAP = {
    "clients": (clients.Client, ["id", "name", "document", "email", "phone", "birth_date", "active"]),
    "suppliers": (suppliers.Supplier, ["id", "name", "document", "email", "phone", "active"]),
    "products": (products.Product, ["id", "name", "sku", "price", "cost", "active"]),
    "inventories": (inventories.Inventory, ["id", "product_id", "quantity"]),
    "sales_invoices": (sales_invoices.SalesInvoice, ["id", "client_id", "date", "total"]),
    "purchase_invoices": (purchase_invoices.PurchaseInvoice, ["id", "supplier_id", "date", "total"]),
}

@router.get("/export/csv/{entity_name}")
def export_csv(entity_name: str, db: Session = Depends(get_db)):
    if entity_name not in ENTITY_MAP:
        raise HTTPException(status_code=404, detail="Entity not found")
    model, columns = ENTITY_MAP[entity_name]
    records = db.query(model).all()
    return export_to_csv(records, columns, filename=f"{entity_name}.csv")
