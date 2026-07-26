import { Hono } from 'hono';
import { Env, createContainer } from '../container';
import { hashPassword } from '@ibms/core';

export const userRoutes = new Hono<{ Bindings: Env }>();

userRoutes.get('/', async (c) => {
  const container = createContainer(c.env);
  
  // Seed default admin if user table is empty
  let admin = await container.userRepository.findByEmail('admin@netisp.id');
  if (!admin) {
    const passwordHash = await hashPassword('password123');
    await container.userRepository.create({
      name: 'Admin NetISP',
      email: 'admin@netisp.id',
      passwordHash,
      role: 'owner',
    });
  }

  // Fetch mock list or D1 users
  return c.json([
    { id: 1, name: 'Admin NetISP', email: 'admin@netisp.id', role: 'owner', createdAt: '2024-01-01' },
    { id: 2, name: 'Budi Keuangan', email: 'finance@netisp.id', role: 'finance', createdAt: '2024-02-15' },
    { id: 3, name: 'Siti Admin', email: 'siti.admin@netisp.id', role: 'admin', createdAt: '2024-03-01' },
  ]);
});

userRoutes.post('/', async (c) => {
  const container = createContainer(c.env);
  const body = await c.req.json();

  const passwordHash = await hashPassword(body.password || 'password123');
  const user = await container.userRepository.create({
    name: body.name,
    email: body.email,
    passwordHash,
    role: body.role || 'admin',
  });

  return c.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }, 201);
});
