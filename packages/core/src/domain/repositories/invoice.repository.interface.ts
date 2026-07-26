import { Invoice, InvoiceStatus } from '../entities/invoice.entity';

export interface InvoiceFilters {
  customerId?: number;
  month?: number;
  year?: number;
  status?: InvoiceStatus;
  limit?: number;
  offset?: number;
}

export interface IInvoiceRepository {
  findById(id: number): Promise<Invoice | null>;
  findByNumber(invoiceNumber: string): Promise<Invoice | null>;
  findByCustomerAndPeriod(customerId: number, month: number, year: number): Promise<Invoice | null>;
  findMany(filters?: InvoiceFilters): Promise<{ data: Invoice[]; total: number }>;
  create(data: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice>;
  updateStatus(id: number, status: InvoiceStatus): Promise<Invoice>;
  updatePdfKey(id: number, key: string): Promise<Invoice>;
}
