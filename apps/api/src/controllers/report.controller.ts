import { Hono } from 'hono';
import { Env, createContainer } from '../container';
import * as XLSX from 'xlsx';

export const reportRoutes = new Hono<{ Bindings: Env }>();

reportRoutes.get('/export', async (c) => {
  const container = createContainer(c.env);
  const type = c.req.query('type') || 'excel';
  const startDate = c.req.query('startDate');
  const endDate = c.req.query('endDate');

  let invoices = (await container.invoiceRepository.findMany({ limit: 1000 })).data;
  const customers = (await container.customerRepository.findMany({ limit: 1000 })).data;

  // Filter by date range if provided
  if (startDate) {
    invoices = invoices.filter((inv) => inv.dueDate >= startDate);
  }
  if (endDate) {
    invoices = invoices.filter((inv) => inv.dueDate <= endDate);
  }

  // Map customer map for easy lookup
  const customerMap = new Map(customers.map((item) => [item.id, item.name]));

  const reportData = invoices.map((inv) => ({
    'No. Invoice': inv.invoiceNumber,
    Pelanggan: customerMap.get(inv.customerId) || `Pelanggan #${inv.customerId}`,
    'Periode Bulan': inv.billingMonth,
    'Periode Tahun': inv.billingYear,
    'Jatuh Tempo': inv.dueDate,
    'Total Tagihan (Rp)': inv.total,
    Status: inv.status.toUpperCase(),
  }));

  if (type === 'excel') {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Tagihan NetISP');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Laporan-Tagihan-NetISP.xlsx"',
      },
    });
  }

  return c.json(reportData);
});
