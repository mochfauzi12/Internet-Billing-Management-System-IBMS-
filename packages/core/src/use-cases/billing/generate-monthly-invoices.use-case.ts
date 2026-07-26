import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { IPackageRepository } from '../../domain/repositories/package.repository.interface';
import { Invoice } from '../../domain/entities/invoice.entity';

export interface GenerateInvoicesRequest {
  month: number;
  year: number;
}

export class GenerateMonthlyInvoicesUseCase {
  constructor(
    private customerRepo: ICustomerRepository,
    private invoiceRepo: IInvoiceRepository,
    private packageRepo: IPackageRepository
  ) {}

  async execute(req: GenerateInvoicesRequest): Promise<{ generated: number; skipped: number }> {
    const activeCustomers = await this.customerRepo.findActiveCustomers();
    let generated = 0;
    let skipped = 0;

    const dueDate = `${req.year}-${String(req.month).padStart(2, '0')}-10`;

    for (const customer of activeCustomers) {
      // Check if customer already has an invoice for this period
      const existing = await this.invoiceRepo.findByCustomerAndPeriod(customer.id, req.month, req.year);
      if (existing) {
        skipped++;
        continue;
      }

      const pkg = await this.packageRepo.findById(customer.packageId);
      if (!pkg) {
        skipped++;
        continue;
      }

      const invoiceNumber = `INV-${req.year}-${String(req.month).padStart(2, '0')}-${String(customer.id).padStart(4, '0')}`;

      await this.invoiceRepo.create({
        invoiceNumber,
        customerId: customer.id,
        packagePrice: pkg.price,
        billingMonth: req.month,
        billingYear: req.year,
        dueDate,
        total: pkg.price,
        status: 'unpaid',
      });

      generated++;
    }

    return { generated, skipped };
  }
}
