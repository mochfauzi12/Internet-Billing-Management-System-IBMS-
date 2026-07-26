import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const invoiceRoutes = new Hono<{ Bindings: Env }>();

invoiceRoutes.get('/', async (c) => {
  const container = createContainer(c.env);
  const month = c.req.query('month') ? Number(c.req.query('month')) : undefined;
  const year = c.req.query('year') ? Number(c.req.query('year')) : undefined;
  const status = c.req.query('status') as any;

  const result = await container.invoiceRepository.findMany({ month, year, status });
  return c.json(result);
});

invoiceRoutes.post('/generate', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json().catch(() => ({}));
  const month = body.month || new Date().getMonth() + 1;
  const year = body.year || new Date().getFullYear();

  const result = await container.generateMonthlyInvoicesUseCase.execute({ month, year });
  return c.json(result);
});

invoiceRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const container = createContainer(c.env);

  const invoice = await container.invoiceRepository.findById(id);
  if (!invoice) {
    return c.json({ error: 'Invoice tidak ditemukan.' }, 404);
  }

  const customer = await container.customerRepository.findById(invoice.customerId);

  return c.json({ invoice, customer });
});
