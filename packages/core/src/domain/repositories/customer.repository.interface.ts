import { Customer, CustomerStatus } from '../entities/customer.entity';

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
  packageId?: number;
  limit?: number;
  offset?: number;
}

export interface ICustomerRepository {
  findById(id: number): Promise<Customer | null>;
  findByCode(code: string): Promise<Customer | null>;
  findMany(filters?: CustomerFilters): Promise<{ data: Customer[]; total: number }>;
  findActiveCustomers(): Promise<Customer[]>;
  create(data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer>;
  update(id: number, data: Partial<Omit<Customer, 'id' | 'createdAt'>>): Promise<Customer>;
  delete(id: number): Promise<boolean>;
}
