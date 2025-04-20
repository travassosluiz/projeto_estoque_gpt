# app/utils/pdf_generator.py

from fpdf import FPDF
from io import BytesIO
from fastapi.responses import StreamingResponse

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", "B", 14)
        self.cell(0, 10, "Situação Financeira do Cliente", ln=True, align="C")

    def add_client_info(self, name):
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, f"Cliente: {name}", ln=True)

    def add_table_header(self):
        self.set_font("Arial", "B", 10)
        self.cell(40, 10, "Vencimento", 1)
        self.cell(40, 10, "Valor", 1)
        self.cell(60, 10, "Situação", 1)
        self.ln()

    def add_table_row(self, due_date, amount, paid):
        self.set_font("Arial", "", 10)
        self.cell(40, 10, due_date.strftime("%d/%m/%Y"), 1)
        self.cell(40, 10, f"R$ {amount:.2f}", 1)
        self.cell(60, 10, "Quitado" if paid else "Em aberto", 1)
        self.ln()

    def add_summary(self, total_open, total_paid):
        self.ln(5)
        self.set_font("Arial", "B", 12)
        self.cell(0, 10, f"Total em aberto: R$ {total_open:.2f}", ln=True)
        self.cell(0, 10, f"Total quitado: R$ {total_paid:.2f}", ln=True)

def generate_pdf(client_name, parcels):
    pdf = PDF()
    pdf.add_page()
    pdf.add_client_info(client_name)
    pdf.add_table_header()

    total_open = 0
    total_paid = 0

    for p in parcels:
        pdf.add_table_row(p.due_date, p.amount, p.paid)
        if p.paid:
            total_paid += p.amount
        else:
            total_open += p.amount

    pdf.add_summary(total_open, total_paid)

    buffer = BytesIO()
    pdf.output(buffer)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": f"inline; filename=cliente_{client_name}_financeiro.pdf"
    })

# app/utils/pdf_generator.py (complemento)

def generate_accounts_summary_pdf(receivables, payables):
    pdf = FPDF()
    pdf.add_page()

    def draw_section(title, data, headers, totals):
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, title, ln=True)
        pdf.set_font("Arial", "B", 10)
        for header in headers:
            pdf.cell(48, 10, header, 1)
        pdf.ln()
        pdf.set_font("Arial", "", 10)
        for row in data:
            for col in row:
                pdf.cell(48, 10, str(col), 1)
            pdf.ln()
        pdf.ln(2)
        pdf.set_font("Arial", "B", 11)
        pdf.cell(0, 10, f"Total em aberto: R$ {totals['open']:.2f}", ln=True)
        pdf.cell(0, 10, f"Total quitado: R$ {totals['paid']:.2f}", ln=True)
        pdf.ln(10)

    # Recebíveis
    rec_data = []
    rec_totals = {"open": 0, "paid": 0}
    for r in receivables:
        status = "Quitado" if r.paid else "Em aberto"
        rec_data.append([r.client.name, r.due_date.strftime("%d/%m/%Y"), f"R$ {r.amount:.2f}", status])
        if r.paid:
            rec_totals["paid"] += r.amount
        else:
            rec_totals["open"] += r.amount

    draw_section("Contas a Receber", rec_data, ["Cliente", "Vencimento", "Valor", "Status"], rec_totals)

    # Pagáveis
    pay_data = []
    pay_totals = {"open": 0, "paid": 0}
    for p in payables:
        status = "Quitado" if p.paid else "Em aberto"
        pay_data.append([p.supplier.name, p.due_date.strftime("%d/%m/%Y"), f"R$ {p.amount:.2f}", status])
        if p.paid:
            pay_totals["paid"] += p.amount
        else:
            pay_totals["open"] += p.amount

    draw_section("Contas a Pagar", pay_data, ["Fornecedor", "Vencimento", "Valor", "Status"], pay_totals)

    buffer = BytesIO()
    pdf.output(buffer)
    buffer.seek(0)

    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": "inline; filename=relatorio_financeiro.pdf"
    })
