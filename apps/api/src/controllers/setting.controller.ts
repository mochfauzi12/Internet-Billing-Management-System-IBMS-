import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const settingRoutes = new Hono<{ Bindings: Env }>();

settingRoutes.get('/', async (c) => {
  const container = createContainer(c.env);
  const settings = await container.cacheService.get<any>('isp_settings');

  return c.json(settings || {
    companyName: 'NetISP Services',
    companyAddress: 'Jl. Melati No. 123, Cirebon, Jawa Barat',
    companyPhone: '0812-3456-7890',
    companyEmail: 'info@netisp.id',
    bankAccounts: [
      { bank: 'BCA', accountNumber: '1234567890', accountName: 'ISP NET' },
      { bank: 'Mandiri', accountNumber: '0987654321', accountName: 'ISP NET' },
    ],
    waApiKey: 'dev-fonnte-key',
  });
});

settingRoutes.post('/', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json();

  await container.cacheService.set('isp_settings', body, 31536000); // 1 year TTL
  return c.json({ message: 'Pengaturan berhasil disimpan.', settings: body });
});
