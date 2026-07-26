import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const dashboardRoutes = new Hono<{ Bindings: Env }>();

dashboardRoutes.get('/summary', async (c) => {
  const container = createContainer(c.env);

  const customers = await container.customerRepository.findMany({ limit: 1000 });
  const activeCustomers = customers.data.filter((c) => c.status === 'active').length;
  const totalCustomers = customers.total;

  const invoices = await container.invoiceRepository.findMany({ limit: 1000 });
  const paidInvoices = invoices.data.filter((i) => i.status === 'paid').length;
  const unpaidInvoices = invoices.data.filter((i) => i.status === 'unpaid' || i.status === 'late').length;

  const currentMonthRevenue = invoices.data
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  return c.json({
    totalCustomers,
    activeCustomers,
    paidInvoices,
    unpaidInvoices,
    currentMonthRevenue,
    yearlyRevenue: currentMonthRevenue * 12,
  });
});
