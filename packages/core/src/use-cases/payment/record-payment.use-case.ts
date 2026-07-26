import { IInvoiceRepository } from '../../domain/repositories/invoice.repository.interface';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { NotFoundError, BusinessRuleViolationError } from '../../domain/errors/domain.error';

export interface RecordPaymentDTO {
  invoiceId: number;
  paymentDate: string;
  paymentMethod: string;
  amount: number;
  note?: string;
}

export class RecordPaymentUseCase {
  constructor(
    private invoiceRepo: IInvoiceRepository,
    private paymentRepo: IPaymentRepository
  ) {}

  async execute(dto: RecordPaymentDTO): Promise<Payment> {
    const invoice = await this.invoiceRepo.findById(dto.invoiceId);
    if (!invoice) {
      throw new NotFoundError('Invoice', dto.invoiceId);
    }

    if (invoice.status === 'paid') {
      throw new BusinessRuleViolationError('Tagihan ini sudah lunas.');
    }

    const payment = await this.paymentRepo.create({
      invoiceId: dto.invoiceId,
      paymentDate: dto.paymentDate,
      paymentMethod: dto.paymentMethod,
      amount: dto.amount,
      note: dto.note,
    });

    // Automatically update invoice status to paid
    await this.invoiceRepo.updateStatus(dto.invoiceId, 'paid');

    return payment;
  }
}
