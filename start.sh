#!/bin/bash
cd /root/projeto_estoque_gpt
source venv/bin/activate
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
