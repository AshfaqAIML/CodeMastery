import { config } from "@/lib/config"
import type { IStorageService, IStorageProvider, StoredFile } from "./types"
import { LocalStorageProvider } from "./local"
import { S3StorageProvider } from "./s3"

let _instance: StorageService | null = null

export class StorageService implements IStorageService {
  provider: IStorageProvider
  private constructor(provider: IStorageProvider) {
    this.provider = provider
  }

  static getInstance(): StorageService {
    if (_instance) return _instance
    const p = config.storage.provider
    let provider: IStorageProvider
    if (p === "s3") {
      provider = new S3StorageProvider(config.storage.s3)
    } else {
      provider = new LocalStorageProvider(
        config.storage.local.uploadDir,
        config.storage.local.publicBase
      )
    }
    _instance = new StorageService(provider)
    return _instance
  }

  async upload(
    namespace: string,
    filename: string,
    data: Buffer,
    mimeType: string
  ): Promise<StoredFile> {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_")
    const key = `${namespace}/${Date.now()}-${safeName}`
    return this.provider.upload(key, data, mimeType)
  }
}

export function getStorage(): StorageService {
  return StorageService.getInstance()
}

export type { StoredFile, IStorageProvider, IStorageService }
