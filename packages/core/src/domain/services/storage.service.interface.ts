export interface IStorageService {
  uploadFile(key: string, body: ArrayBuffer | Uint8Array, contentType: string): Promise<string>;
  getFileUrl(key: string): Promise<string>;
  deleteFile(key: string): Promise<boolean>;
}
