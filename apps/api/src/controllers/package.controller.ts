import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const packageRoutes = new Hono<{ Bindings: Env }>();

packageRoutes.get('/', async (c) => {
  const container = createContainer(c.env);
  const result = await container.packageRepository.findAll();

  // If empty database, return initial packages
  if (result.length === 0) {
    return c.json([
      { id: 1, name: 'Basic Home 10 Mbps', speed: '10 Mbps', price: 150000, description: 'Penggunaan browsing sehari-hari' },
      { id: 2, name: 'Standard Home 20 Mbps', speed: '20 Mbps', price: 250000, description: 'Streaming HD & game online' },
      { id: 3, name: 'Super Fast 50 Mbps', speed: '50 Mbps', price: 450000, description: 'Kecepatan tinggi keluarga besar' },
      { id: 4, name: 'Ultra Pro 100 Mbps', speed: '100 Mbps', price: 750000, description: 'Dedicated bandwidth kantor' },
    ]);
  }

  return c.json(result);
});

packageRoutes.post('/', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json();

  const created = await container.packageRepository.create(body);
  return c.json(created, 201);
});

packageRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const container = createContainer(c.env);
  const body = await c.req.json();

  const updated = await container.packageRepository.update(id, body);
  return c.json(updated);
});

packageRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const container = createContainer(c.env);

  const success = await container.packageRepository.delete(id);
  return c.json({ success });
});
