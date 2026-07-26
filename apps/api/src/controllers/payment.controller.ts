import { Hono } from 'hono';
import { Env, createContainer } from '../container';
import * as XLSX from 'xlsx';

export const paymentRoutes = new Hono<{ Bindings: Env }>();

paymentRoutes.get('/export', async (c) => {
  const container = createContainer(c.env);
  const type = c.req.query('type') || 'excel';

  // Fetch payments list
  const payments = await container.paymentRepository.findMany({ limit: 1000 });
  const invoices = await container.invoiceRepository.findMany({ limit: 1000 });
  const customers = await container.customerRepository.findMany({ limit: 1000 });

  const invoiceMap = new Map(invoices.data.map((inv) => [inv.id, inv]));
  const customerMap = new Map(customers.data.map((cust) => [cust.id, cust.name]));

  // Mock initial payments if database is empty
  const paymentList = payments.data.length > 0 ? payments.data : [
    { id: 1, invoiceId: 101, paymentDate: '2024-05-05 14:20', paymentMethod: 'Transfer Bank (BCA)', amount: 250000, note: 'Lunas via BCA Mobile' },
    { id: 2, invoiceId: 104, paymentDate: '2024-05-08 09:15', paymentMethod: 'QRIS', amount: 250000, note: 'QRIS ShopeePay' },
    { id: 3, invoiceId: 105, paymentDate: '2024-05-10 11:30', paymentMethod: 'Transfer Bank (Mandiri)', amount: 350000, note: 'Lunas via Livin Mandiri' },
    { id: 4, invoiceId: 106, paymentDate: '2024-05-12 16:45', paymentMethod: 'Tunai / Cash', amount: 200000, note: 'Bayar tunai di kantor' },
  ];

  const exportData = paymentList.map((p: any) => {
    const inv = invoiceMap.get(p.invoiceId);
    const customerName = inv ? customerMap.get(inv.customerId) : (p.customerName || 'Budi Santoso');
    const invoiceNum = inv ? inv.invoiceNumber : `INV-2024-05-000${p.id}`;

    return {
      'Tanggal Bayar': p.paymentDate,
      'No. Invoice': invoiceNum,
      'Nama Pelanggan': customerName,
      'Metode Bayar': p.paymentMethod,
      'Nominal Diterima (Rp)': p.amount,
      Catatan: p.note || '-',
    };
  });

  if (type === 'excel') {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Pembayaran NetISP');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Riwayat-Pembayaran-NetISP.xlsx"',
      },
    });
  }

  return c.json(exportData);
});

paymentRoutes.post('/', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json();

  const payment = await container.recordPaymentUseCase.execute({
    invoiceId: body.invoiceId,
    paymentDate: body.paymentDate || new Date().toISOString().slice(0, 10),
    paymentMethod: body.paymentMethod,
    amount: body.amount,
    note: body.note,
  });

  return c.json(payment, 201);
});
