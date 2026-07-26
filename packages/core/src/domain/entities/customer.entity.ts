export type CustomerStatus = 'active' | 'suspend' | 'stopped';

export interface Customer {
  id: number;
  customerCode: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  packageId: number;
  status: CustomerStatus;
  subscribedAt?: string | null;
  note?: string | null;
  createdAt: string;
}
