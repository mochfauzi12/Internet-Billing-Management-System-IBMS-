import { Env, createContainer } from '../container';

export async function handleMonthlyBillingCron(event: ScheduledEvent, env: Env): Promise<void> {
  const container = createContainer(env);
  const now = new Date(event.scheduledTime);
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  console.log(`[Cron Trigger] Auto-generating monthly invoices for month=${month}, year=${year}...`);
  const result = await container.generateMonthlyInvoicesUseCase.execute({ month, year });
  console.log(`[Cron Trigger Completed] Generated: ${result.generated}, Skipped: ${result.skipped}`);
}
