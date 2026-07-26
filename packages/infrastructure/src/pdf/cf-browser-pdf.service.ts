import { IPdfGeneratorService, Invoice, Customer } from '@ibms/core';

export class CFBrowserPdfService implements IPdfGeneratorService {
  async generateInvoicePdf(invoice: Invoice, customer: Customer): Promise<Uint8Array> {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #111827; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563EB; padding-bottom: 15px; }
          .title { font-size: 24px; font-weight: bold; color: #2563EB; }
          .details { margin-top: 20px; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #E5E7EB; padding: 10px; text-align: left; }
          .table th { background: #F9FAFB; }
          .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #2563EB; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">NetISP</div>
            <p>PT NetISP Network Indonesia</p>
          </div>
          <div>
            <h3>INVOICE #${invoice.invoiceNumber}</h3>
            <p>Status: ${invoice.status.toUpperCase()}</p>
          </div>
        </div>
        <div class="details">
          <p><strong>Kepada:</strong> ${customer.name} (${customer.phone})</p>
          <p><strong>Periode:</strong> Bulan ${invoice.billingMonth}/${invoice.billingYear}</p>
          <p><strong>Jatuh Tempo:</strong> ${invoice.dueDate}</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Deskripsi</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tagihan Internet Bulanan</td>
              <td>Rp ${invoice.total.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>
        <div class="total">
          TOTAL: Rp ${invoice.total.toLocaleString('id-ID')}
        </div>
      </body>
      </html>
    `;

    // Convert HTML string to Uint8Array Buffer in Workers runtime environment
    const encoder = new TextEncoder();
    return encoder.encode(htmlTemplate);
  }
}
