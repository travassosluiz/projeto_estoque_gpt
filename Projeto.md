# 📘 Resumo Técnico do Projeto – Sistema de Gestão Comercial

## 🧱 Visão Geral
Sistema backend completo para gestão comercial, com funcionalidades de controle de:
- Clientes
- Fornecedores
- Produtos
- Estoque
- Compras
- Vendas
- Contas a pagar e a receber
- Exportação em CSV
- Relatórios financeiros em PDF

Desenvolvido em **Python** utilizando **FastAPI**, **SQLAlchemy** e banco de dados **MariaDB** (compatível com MySQL).

---

## 🧰 Tecnologias e Ferramentas
- **FastAPI**: framework principal da API REST.
- **SQLAlchemy**: ORM para integração com o banco de dados.
- **MariaDB**: banco de dados relacional.
- **Pydantic**: validação de dados e definição de schemas.
- **Uvicorn**: servidor ASGI para execução local.
- **FPDF2**: geração de relatórios em PDF.
- **python-dotenv**: leitura de variáveis de ambiente do `.env`.

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
Exemplo de conteúdo do arquivo `.env`:
```env
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestao_comercial
```

---

## 🔧 Entidades e Lógicas Implementadas

### Clientes / Fornecedores
- Campos: nome, documento, telefone, email, status.
- Validação de email com `EmailStr`.

### Produtos
- SKU único, nome, preço de venda, custo, status (ativo/inativo).

### Estoque (Inventory)
- Atualização automática:
  - `+` ao registrar **itens de compra**.
  - `−` ao registrar **itens de venda**.

### Compras / Vendas
- Cada operação possui nota (invoice) e lista de itens.
- Controle via `purchase_items` e `sale_items`.
- **Validação de estoque antes de vender** (evita saldo negativo).

### Contas a Pagar / Receber
- Campos: valor, vencimento, status (`pago` / `em aberto`).
- (⚠️ Regras como juros, multas e atrasos ainda não implementadas.)

---

## 📤 Exportação de Dados

### CSV
- Endpoint: `/export/csv/{entidade}`
- Exemplo: `/export/csv/clients`, `/export/csv/products`

### Relatórios PDF
- Situação financeira do cliente:
  - `/reports/client-financial/{client_id}`
- Resumo geral de contas:
  - `/reports/accounts-summary`

---

## 📚 Documentação Automática
Disponível via Swagger UI:
```
http://[IP_DO_CONTAINER]:8000/docs
```
> Substituir `[IP_DO_CONTAINER]` pelo IP real do container LXC.

---

## 🚀 Execução Local
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

> Certifique-se de estar na raiz do projeto, com ambiente virtual ativado e o banco de dados MariaDB em execução.

---

## 🔭 Melhorias Futuras / Funcionalidades Planejadas
- [ ] Autenticação de usuário (JWT / OAuth2)
- [x] Execução como serviço (via Systemd)
- [ ] Nginx com HTTPS reverso
- [ ] Interface frontend integrada (React, Vue ou similar)
- [ ] Regras financeiras mais robustas (juros, multa, etc.)
- [ ] Histórico de movimentações de estoque

---

## 👨‍💻 Autor
**Henrique Travassos**  
Repositório: [github.com/travassosluiz/projeto_estoque_gpt](https://github.com/travassosluiz/projeto_estoque_gpt)
