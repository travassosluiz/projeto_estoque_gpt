from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import engine, Base
from app.routers import clients, suppliers, products, inventories, purchase_invoices, purchase_items, sales_invoices, sale_items, accounts_receivable, accounts_payable
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
app.include_router(purchase_items.router, prefix="/purchase_items", tags=["Purchase Items"])
app.include_router(sales_invoices.router, prefix="/sales_invoices", tags=["Sales Invoices"])
app.include_router(sale_items.router, prefix="/sale_items", tags=["Sale Items"])
app.include_router(accounts_receivable.router, prefix="/accounts_receivable", tags=["Accounts Receivable"])
app.include_router(accounts_payable.router, prefix="/accounts_payable", tags=["Accounts Payable"])

# Relatórios CSV
app.include_router(export_csv.router, tags=["Export"])

# Relatórios PDF
app.include_router(reports.router, tags=["Reports"])

# Configuração de arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Rota para o index.html
@app.get("/", response_class=FileResponse)
async def read_index():
#    return "static/index.html"
    return FileResponse(path="static/index.html", media_type="text/html")

#@app.get("/")
#def read_root():
#    return {"message": "Sistema de Gestão Comercial em execução"}
