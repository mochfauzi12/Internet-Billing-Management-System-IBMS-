import { Hono } from 'hono';
import { Env, createContainer } from '../container';
import { verifyPassword, hashPassword } from '@ibms/core';

export const authRoutes = new Hono<{ Bindings: Env }>();

authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  const container = createContainer(c.env);

  let user = await container.userRepository.findByEmail(email);

  // Seed default admin if database is empty
  if (!user && email === 'admin@netisp.id') {
    const passwordHash = await hashPassword('password123');
    user = await container.userRepository.create({
      name: 'Admin NetISP',
      email: 'admin@netisp.id',
      passwordHash,
      role: 'admin',
    });
  }

  if (!user) {
    return c.json({ error: 'Email atau password salah.' }, 401);
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return c.json({ error: 'Email atau password salah.' }, 401);
  }

  return c.json({
    message: 'Login berhasil.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: `mock-jwt-token-for-${user.id}`,
  });
});

authRoutes.get('/me', async (c) => {
  return c.json({
    user: {
      id: 1,
      name: 'Admin NetISP',
      email: 'admin@netisp.id',
      role: 'admin',
    },
  });
});
