/**
 * Storage abstraction layer.
 *
 * Provides a single interface for file upload/download/delete/getUrl.
 * Implementations:
 *   - LocalStorageProvider  (default; writes to local filesystem)
 *   - S3StorageProvider      (S3-compatible object storage)
 *
 * The active provider is chosen via STORAGE_PROVIDER env var.
 * The rest of the application never imports a concrete provider directly.
 */

export interface StoredFile {
  key: string
  url: string
  size: number
  mimeType: string
}

export interface IStorageProvider {
  upload(key: string, data: Buffer, mimeType: string): Promise<StoredFile>
  read(key: string): Promise<Buffer | null>
  delete(key: string): Promise<void>
  getUrl(key: string): string
}

export interface IStorageService {
  provider: IStorageProvider
  upload(
    namespace: string,
    filename: string,
    data: Buffer,
    mimeType: string
  ): Promise<StoredFile>
}
