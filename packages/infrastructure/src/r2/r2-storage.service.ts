import { IStorageService } from '@ibms/core';
import { R2Bucket } from '@cloudflare/workers-types';

export class R2StorageService implements IStorageService {
  constructor(private bucket: R2Bucket) {}

  async uploadFile(key: string, body: ArrayBuffer | Uint8Array, contentType: string): Promise<string> {
    await this.bucket.put(key, body, {
      httpMetadata: { contentType },
    });
    return key;
  }

  async getFileUrl(key: string): Promise<string> {
    return `/api/invoices/pdf/${key}`;
  }

  async deleteFile(key: string): Promise<boolean> {
    await this.bucket.delete(key);
    return true;
  }
}
