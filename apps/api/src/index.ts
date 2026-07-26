import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env, createContainer } from './container';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/customers', async (c) => {
  const container = createContainer(c.env);
  const search = c.req.query('search');
  const result = await container.customerRepository.findMany({ search });
  return c.json(result);
});

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log('Cron triggered: Generating monthly invoices...', event.cron);
  },
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    console.log('Queue triggered: Processing WA reminders...', batch.messages.length);
  },
};
