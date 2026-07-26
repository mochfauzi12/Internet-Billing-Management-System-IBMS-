import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Env } from './container';

import { authRoutes } from './controllers/auth.controller';
import { customerRoutes } from './controllers/customer.controller';
import { packageRoutes } from './controllers/package.controller';
import { invoiceRoutes } from './controllers/invoice.controller';
import { paymentRoutes } from './controllers/payment.controller';
import { dashboardRoutes } from './controllers/dashboard.controller';
import { reminderRoutes } from './controllers/reminder.controller';
import { userRoutes } from './controllers/user.controller';
import { reportRoutes } from './controllers/report.controller';
import { settingRoutes } from './controllers/setting.controller';
import { processWaReminderQueue } from './queue/wa-reminder.consumer';
import { handleMonthlyBillingCron } from './cron/monthly-billing.cron';
import { handleDailyOverdueCheckCron } from './cron/overdue-check.cron';

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mounting Controllers
app.route('/api/auth', authRoutes);
app.route('/api/customers', customerRoutes);
app.route('/api/packages', packageRoutes);
app.route('/api/invoices', invoiceRoutes);
app.route('/api/payments', paymentRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/reminders', reminderRoutes);
app.route('/api/users', userRoutes);
app.route('/api/reports', reportRoutes);
app.route('/api/settings', settingRoutes);

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    if (event.cron === '0 17 1 * *') {
      ctx.waitUntil(handleMonthlyBillingCron(event, env));
    } else {
      ctx.waitUntil(handleDailyOverdueCheckCron(event, env));
    }
  },
  async queue(batch: MessageBatch<any>, env: Env): Promise<void> {
    await processWaReminderQueue(batch, env);
  },
};
