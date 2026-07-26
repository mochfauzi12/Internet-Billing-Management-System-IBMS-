import { Invoice } from '../entities/invoice.entity';
import { Customer } from '../entities/customer.entity';

export interface IPdfGeneratorService {
  generateInvoicePdf(invoice: Invoice, customer: Customer): Promise<Uint8Array>;
}
