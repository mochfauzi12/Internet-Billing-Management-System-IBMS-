import { D1Database, R2Bucket, KVNamespace } from '@cloudflare/workers-types';
import { D1CustomerRepository } from '@ibms/db';
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

  // Infrastructure Services
  const storageService = new R2StorageService(env.INVOICE_BUCKET);
  const cacheService = new KVCacheService(env.CACHE_KV);
  const whatsAppService = new FonnteWhatsAppService(env.WA_GATEWAY_API_KEY);

  return {
    customerRepository,
    storageService,
    cacheService,
    whatsAppService,
  };
}
