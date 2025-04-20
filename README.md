# 📦 Sistema de Gestão Comercial

Este é o backend de um sistema de gestão comercial, desenvolvido em Python com FastAPI, SQLAlchemy e MySQL.

---

## ✅ Funcionalidades

- CRUD completo para clientes, fornecedores, produtos, estoque, compras, vendas, contas a pagar e a receber.
- Atualização automática de estoque.
- Exportação de dados em CSV.
- Geração de relatórios financeiros em PDF.
- Documentação automática via Swagger.

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/gestao-comercial.git
cd gestao-comercial

### 2. Crie e ative um ambiente virtual

python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate


### 3. Instale as dependências

pip install -r requirements.txt


### 4. Configure o banco de dados

Crie um arquivo .env com as informações de acesso:
DB_USER=root
DB_PASSWORD=suasenha
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestao_comercial

### 5. Execute o projeto

uvicorn main:app --reload

### Acesse a documentação automática em:

http://localhost:8000/docs

📊 Relatórios
PDF Cliente: /reports/client-financial/{client_id}

Resumo Financeiro: /reports/accounts-summary

CSV: /export/csv/{entidade} (ex: clients, products...)

📌 Organização do Projeto

app/
├── database.py
├── models/
├── routers/
├── schemas/
├── utils/
├── main.py
