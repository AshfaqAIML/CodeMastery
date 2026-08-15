/**
 * S3-compatible object storage provider.
 *
 * Uses the AWS SDK v3 (@aws-sdk/client-s3) lazily so the dependency is only
 * required when the S3 provider is actually used. Install it with:
 *
 *   bun add @aws-sdk/client-s3
 *
 * Works with AWS S3, Cloudflare R2, MinIO, Backblaze B2, Wasabi, etc.
 */
import type { IStorageProvider, StoredFile } from "./types"

export class S3StorageProvider implements IStorageProvider {
  private client: any
  constructor(
    private readonly opts: {
      endpoint: string
      region: string
      accessKey: string
      secretKey: string
      bucket: string
      publicUrl: string
      forcePathStyle: boolean
    }
  ) {}

  private async getClient() {
    if (this.client) return this.client
    const { S3Client } = await import("@aws-sdk/client-s3")
    this.client = new S3Client({
      endpoint: this.opts.endpoint || undefined,
      region: this.opts.region,
      credentials: {
        accessKeyId: this.opts.accessKey,
        secretAccessKey: this.opts.secretKey,
      },
      forcePathStyle: this.opts.forcePathStyle,
    })
    return this.client
  }

  async upload(
    key: string,
    data: Buffer,
    mimeType: string
  ): Promise<StoredFile> {
    const s3 = await this.getClient()
    const { PutObjectCommand } = await import("@aws-sdk/client-s3")
    await s3.send(
      new PutObjectCommand({
        Bucket: this.opts.bucket,
        Key: key,
        Body: data,
        ContentType: mimeType,
      })
    )
    return {
      key,
      url: this.getUrl(key),
      size: data.length,
      mimeType,
    }
  }

  async read(key: string): Promise<Buffer | null> {
    const s3 = await this.getClient()
    const { GetObjectCommand } = await import("@aws-sdk/client-s3")
    try {
      const res = await s3.send(
        new GetObjectCommand({ Bucket: this.opts.bucket, Key: key })
      )
      const buf = await (res.Body as any).transformToByteArray()
      return Buffer.from(buf)
    } catch {
      return null
    }
  }

  async delete(key: string): Promise<void> {
    const s3 = await this.getClient()
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3")
    await s3.send(
      new DeleteObjectCommand({ Bucket: this.opts.bucket, Key: key })
    )
  }

  getUrl(key: string): string {
    if (this.opts.publicUrl) {
      return `${this.opts.publicUrl.replace(/\/$/, "")}/${key}`
    }
    return `${this.opts.endpoint.replace(/\/$/, "")}/${this.opts.bucket}/${key}`
  }
}
