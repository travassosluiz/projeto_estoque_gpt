from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import clients, suppliers, products, inventories, purchase_invoices, purchase_products, sale_invoices, sale_products, accounts_receivable, accounts_payable
from app.routers import export_csv
from app.routers import reports

app = FastAPI(title="Sistema de Gestão Comercial")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criação de tabelas
Base.metadata.create_all(bind=engine)

# Registro das rotas
app.include_router(clients.router, prefix="/clients", tags=["Clients"])
app.include_router(suppliers.router, prefix="/suppliers", tags=["Suppliers"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(inventories.router, prefix="/inventories", tags=["Inventories"])
app.include_router(purchase_invoices.router, prefix="/purchase_invoices", tags=["Purchase Invoices"])
app.include_router(purchase_products.router, prefix="/purchase_products", tags=["Purchase Products"])
app.include_router(sale_invoices.router, prefix="/sale_invoices", tags=["Sale Invoices"])
app.include_router(sale_products.router, prefix="/sale_products", tags=["Sale Products"])
app.include_router(accounts_receivable.router, prefix="/accounts_receivable", tags=["Accounts Receivable"])
app.include_router(accounts_payable.router, prefix="/accounts_payable", tags=["Accounts Payable"])

# Relatórios CSV
app.include_router(export_csv.router, tags=["Export"])

# Relatórios PDF
app.include_router(reports.router, tags=["Reports"])

@app.get("/")
def read_root():
    return {"message": "Sistema de Gestão Comercial em execução"}
