import { Env, createContainer } from '../container';

export async function handleDailyOverdueCheckCron(event: ScheduledEvent, env: Env): Promise<void> {
  const container = createContainer(env);
  const todayStr = new Date().toISOString().slice(0, 10);

  console.log(`[Daily Overdue Cron] Checking for unpaid invoices past due date (${todayStr})...`);

  const unpaidInvoices = await container.invoiceRepository.findMany({ status: 'unpaid', limit: 1000 });
  let overdueCount = 0;

  for (const invoice of unpaidInvoices.data) {
    if (invoice.dueDate < todayStr) {
      await container.invoiceRepository.updateStatus(invoice.id, 'late');
      overdueCount++;
    }
  }

  console.log(`[Daily Overdue Cron Completed] Marked ${overdueCount} invoices as LATE.`);
}
