import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const customerRoutes = new Hono<{ Bindings: Env }>();

customerRoutes.get('/', async (c) => {
  const container = createContainer(c.env);
  const search = c.req.query('search');
  const status = c.req.query('status') as any;
  const page = Number(c.req.query('page') || '1');
  const limit = Number(c.req.query('limit') || '10');
  const offset = (page - 1) * limit;

  const result = await container.customerRepository.findMany({
    search,
    status,
    limit,
    offset,
  });

  return c.json(result);
});

customerRoutes.post('/', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json();

  const customerCode = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

  const created = await container.customerRepository.create({
    customerCode,
    name: body.name,
    phone: body.phone,
    email: body.email,
    address: body.address,
    packageId: body.packageId || 1,
    status: body.status || 'active',
    subscribedAt: new Date().toISOString().slice(0, 10),
    note: body.note,
  });

  return c.json(created, 201);
});

customerRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const container = createContainer(c.env);
  const body = await c.req.json();

  const updated = await container.customerRepository.update(id, body);
  return c.json(updated);
});

customerRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const container = createContainer(c.env);

  const deleted = await container.customerRepository.delete(id);
  return c.json({ success: deleted });
});
