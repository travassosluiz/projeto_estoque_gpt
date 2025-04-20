# 📦 Sistema de Gestão Comercial
Este é o backend de um sistema de gestão comercial, desenvolvido em Python com FastAPI, SQLAlchemy e MariaDB (ou MySQL).

## ✅ Funcionalidades
CRUD completo para clientes, fornecedores, produtos, estoque, compras, vendas, contas a pagar e a receber.

Atualização automática de estoque.

Exportação de dados em CSV.

Geração de relatórios financeiros em PDF.

Documentação automática via Swagger.

## 🚀 Instalação (em Container LXC Debian)

---

### 1. Clone o repositório

```
git clone https://github.com/travassosluiz/projeto_estoque_gpt.git
cd projeto_estoque_gpt
```

### 2. Crie e ative um ambiente virtual


```
python3 -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências


```
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Instale e configure o MariaDB

```
apt install mariadb-server -y
```

Acesse o MariaDB e crie o banco de dados e o usuário:

```
mysql -u root
```

-- No prompt do MariaDB:

```
CREATE DATABASE gestao_comercial;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON gestao_comercial.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Crie o arquivo .env

Na raiz do projeto, crie um arquivo chamado .env com o seguinte conteúdo:

```
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gestao_comercial
```

### 6. Execute o projeto

```
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 🔍 Acesse a documentação

Abra no navegador:

```
http://[IP_DO_CONTAINER]:8000/docs
Substitua [IP_DO_CONTAINER] pelo IP da sua máquina LXC (ex: 192.168.1.50).
```

---

## 📊 Relatórios disponíveis

Situação financeira do cliente (PDF):
```
/reports/client-financial/{client_id}
```

Resumo geral de contas a pagar e receber (PDF):
```
/reports/accounts-summary
```

Exportação de dados em CSV:
```
/export/csv/{entidade}
Exemplo: /export/csv/clients, /export/csv/products
```

## 📁 Estrutura do Projeto
```
app/
├── main.py                # Ponto de entrada FastAPI
├── database.py            # Conexão com o banco
├── models/                # Modelos SQLAlchemy
├── routers/               # Rotas da API
├── schemas/               # Schemas Pydantic
├── utils/                 # Exportação CSV e geração de PDF
```
