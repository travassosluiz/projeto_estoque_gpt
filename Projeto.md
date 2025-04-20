# 📘 Resumo Técnico do Projeto – Sistema de Gestão Comercial

## 🧱 Visão Geral
Sistema backend completo para gestão comercial, com funcionalidades de controle de:
- Clientes
- Fornecedores
- Produtos
- Estoque
- Compras
- Vendas
- Contas a pagar e receber
- Exportação em CSV
- Relatórios financeiros em PDF

Desenvolvido em **Python** utilizando **FastAPI**, **SQLAlchemy** e banco de dados **MariaDB** (compatível com MySQL).

---

## 🧰 Tecnologias e Ferramentas
- **FastAPI**: framework principal da API REST
- **SQLAlchemy**: ORM para integração com o banco
- **MariaDB**: banco de dados relacional
- **Pydantic**: validações de dados
- **Uvicorn**: servidor ASGI para execução local
- **FPDF2**: geração de relatórios em PDF
- **dotenv**: para leitura de variáveis de ambiente

---

## 📁 Estrutura de Pastas
```
app/
├── main.py                # Ponto de entrada FastAPI
├── database.py            # Conexão com o banco
├── models/                # Modelos SQLAlchemy
├── routers/               # Rotas da API REST
├── schemas/               # Schemas Pydantic (entrada/saída)
├── utils/                 # Exportadores de CSV, geradores de PDF
```

---

## 🔌 Conexão com o Banco (.env)
```env
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestao_comercial
```

---

## 🔧 Entidades e Regras de Negócio

### Clientes / Fornecedores
- Campos básicos: nome, documento, telefone, email, status
- Validação de e-mail via `EmailStr`

### Produtos
- SKU único, preço de venda, custo, status

### Estoque (Inventory)
- Atualizado automaticamente:
  - + Ao inserir itens de **compra**
  - - Ao inserir itens de **venda**

### Compras / Vendas
- Notas (invoices) + Itens
- Controle de `purchase_items` e `sale_items`
- Validação de estoque antes de vender

### Contas a Pagar / Receber
- Vencimento, valor, status `pago` / `em aberto`

---

## 📤 Funcionalidades de Exportação

### CSV (por entidade)
- Endpoint: `/export/csv/{entidade}`
- Exemplo: `/export/csv/clients`

### Relatórios em PDF
- Situação financeira do cliente: `/reports/client-financial/{client_id}`
- Visão geral contas: `/reports/accounts-summary`

---

## 🔍 Documentação Automática
- Disponível via Swagger UI em:  
`http://[IP_DO_CONTAINER]:8000/docs`

---

## 📦 Execução

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

> Certifique-se de estar na raiz do projeto, com ambiente virtual ativado, e banco em execução.

---

## 🧭 Pendências Futuras / Extras
- [ ] Autenticação de usuário (JWT / OAuth2)
- [ ] Deploy com Docker
- [ ] Systemd ou PM2 para execução automática
- [ ] Nginx com HTTPS
- [ ] Interface frontend integrada (React/Vue)

---

## 👨‍💻 Autor
**Henrique Travassos**

Repositório: [github.com/travassosluiz/projeto_estoque_gpt](https://github.com/travassosluiz/projeto_estoque_gpt)

