import { Env, createContainer } from '../container';

export async function processWaReminderQueue(batch: MessageBatch<any>, env: Env): Promise<void> {
  const container = createContainer(env);

  for (const message of batch.messages) {
    const payload = message.body;
    try {
      console.log(`[Queue Consumer] Sending WA Reminder to ${payload.customerName} (${payload.toPhone})...`);
      await container.whatsAppService.sendReminder(payload);
      message.ack();
    } catch (err) {
      console.error(`[Queue Consumer Error] Failed sending to ${payload.toPhone}:`, err);
      message.retry();
    }
  }
}
