# app/utils/csv_exporter.py

import csv
from io import StringIO
from fastapi.responses import StreamingResponse

def export_to_csv(queryset, column_names, filename="export.csv"):
    def generate():
        buffer = StringIO()
        writer = csv.writer(buffer)
        writer.writerow(column_names)
        for obj in queryset:
            writer.writerow([getattr(obj, col) for col in column_names])
        buffer.seek(0)
        yield buffer.read()

    return StreamingResponse(generate(), media_type="text/csv", headers={
        "Content-Disposition": f"attachment; filename={filename}"
    })
