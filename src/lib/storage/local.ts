import { promises as fs } from "fs"
import path from "path"
import type { IStorageProvider, StoredFile } from "./types"

/**
 * Local filesystem storage. Suitable for dev and single-server deployments.
 * For multi-instance prod, switch to S3StorageProvider.
 */
export class LocalStorageProvider implements IStorageProvider {
  constructor(
    private readonly uploadDir: string,
    private readonly publicBase: string
  ) {}

  async upload(
    key: string,
    data: Buffer,
    mimeType: string
  ): Promise<StoredFile> {
    const fullPath = path.join(this.uploadDir, key)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, data)
    return {
      key,
      url: this.getUrl(key),
      size: data.length,
      mimeType,
    }
  }

  async read(key: string): Promise<Buffer | null> {
    try {
      return await fs.readFile(path.join(this.uploadDir, key))
    } catch {
      return null
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(path.join(this.uploadDir, key))
    } catch {
      /* ignore missing */
    }
  }

  getUrl(key: string): string {
    return `${this.publicBase}/${key}`.replace(/\/+/g, "/")
  }
}
