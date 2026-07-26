import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const reminderRoutes = new Hono<{ Bindings: Env }>();

reminderRoutes.post('/send', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json().catch(() => ({}));
  const customerIds: number[] = body.customerIds || [];

  if (customerIds.length === 0) {
    // If empty array, fetch all unpaid customer invoices
    const unpaid = await container.invoiceRepository.findMany({ status: 'unpaid' });
    unpaid.data.forEach((inv) => customerIds.push(inv.customerId));
  }

  let pushedCount = 0;
  for (const customerId of customerIds) {
    const customer = await container.customerRepository.findById(customerId);
    if (!customer) continue;

    // Push job payload into Cloudflare Queue
    if (c.env.WA_REMINDER_QUEUE?.send) {
      await c.env.WA_REMINDER_QUEUE.send({
        toPhone: customer.phone,
        customerName: customer.name,
        billingMonth: 'Mei 2024',
        amount: 250000,
      });
    }

    pushedCount++;
  }

  return c.json({
    message: `Berhasil mem-push ${pushedCount} tugas reminder ke Cloudflare Queue (wa-reminder-queue).`,
    pushedCount,
  });
});
