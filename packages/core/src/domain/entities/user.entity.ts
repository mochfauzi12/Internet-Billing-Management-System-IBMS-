export type UserRole = 'owner' | 'admin' | 'finance';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}
