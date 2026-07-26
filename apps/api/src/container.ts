import { D1Database, R2Bucket, KVNamespace } from '@cloudflare/workers-types';
import {
  D1CustomerRepository,
  D1PackageRepository,
  D1InvoiceRepository,
  D1PaymentRepository,
  D1UserRepository,
} from '@ibms/db';
import { R2StorageService, KVCacheService, FonnteWhatsAppService } from '@ibms/infrastructure';
import { GenerateMonthlyInvoicesUseCase, RecordPaymentUseCase } from '@ibms/core';

export interface Env {
  DB: D1Database;
  INVOICE_BUCKET: R2Bucket;
  CACHE_KV: KVNamespace;
  WA_REMINDER_QUEUE: any;
  JWT_SECRET: string;
  WA_GATEWAY_API_KEY: string;
}

export function createContainer(env: Env) {
  // Repositories
  const customerRepository = new D1CustomerRepository(env.DB);
  const packageRepository = new D1PackageRepository(env.DB);
  const invoiceRepository = new D1InvoiceRepository(env.DB);
  const paymentRepository = new D1PaymentRepository(env.DB);
  const userRepository = new D1UserRepository(env.DB);

  // Infrastructure Services
  const storageService = new R2StorageService(env.INVOICE_BUCKET);
  const cacheService = new KVCacheService(env.CACHE_KV);
  const whatsAppService = new FonnteWhatsAppService(env.WA_GATEWAY_API_KEY);

  // Use Cases
  const generateMonthlyInvoicesUseCase = new GenerateMonthlyInvoicesUseCase(
    customerRepository,
    invoiceRepository,
    packageRepository
  );

  const recordPaymentUseCase = new RecordPaymentUseCase(
    invoiceRepository,
    paymentRepository
  );

  return {
    customerRepository,
    packageRepository,
    invoiceRepository,
    paymentRepository,
    userRepository,
    storageService,
    cacheService,
    whatsAppService,
    generateMonthlyInvoicesUseCase,
    recordPaymentUseCase,
  };
}
