import { Hono } from 'hono';
import { Env, createContainer } from '../container';

export const paymentRoutes = new Hono<{ Bindings: Env }>();

paymentRoutes.post('/', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json();

  const payment = await container.recordPaymentUseCase.execute({
    invoiceId: body.invoiceId,
    paymentDate: body.paymentDate || new Date().toISOString().slice(0, 10),
    paymentMethod: body.paymentMethod,
    amount: body.amount,
    note: body.note,
  });

  return c.json(payment, 201);
});
