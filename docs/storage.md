# Storage

File uploads (avatars, cover images, attachments) go through the `StorageService` abstraction (`src/lib/storage/`). The application never imports a concrete storage provider directly.

## Providers

### 1. Local filesystem (default)

Writes to `./uploads/` and serves at `/uploads/*`.

```env
STORAGE_PROVIDER=local
STORAGE_LOCAL_DIR=./uploads
STORAGE_PUBLIC_BASE=/uploads
```

Suitable for development and single-server production.

### 2. S3-compatible

Works with AWS S3, Cloudflare R2, MinIO, Backblaze B2, Wasabi, DigitalOcean Spaces, etc.

Install the SDK (only if using S3):

```bash
bun add @aws-sdk/client-s3
```

Configure:

```env
STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=https://your-bucket.s3.region.amazonaws.com
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=...
STORAGE_SECRET_KEY=...
STORAGE_BUCKET=your-bucket
STORAGE_PUBLIC_URL=https://cdn.example.com
STORAGE_S3_FORCE_PATH_STYLE=false
```

Set `STORAGE_S3_FORCE_PATH_STYLE=true` for MinIO and other path-style providers.

#### Cloudflare R2 example

```env
STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=https://<account>.r2.cloudflarestorage.com
STORAGE_REGION=auto
STORAGE_ACCESS_KEY=<r2 access key id>
STORAGE_SECRET_KEY=<r2 secret>
STORAGE_BUCKET=my-bucket
STORAGE_PUBLIC_URL=https://cdn.mydomain.com
STORAGE_S3_FORCE_PATH_STYLE=true
```

#### MinIO example (self-hosted)

```env
STORAGE_PROVIDER=s3
STORAGE_ENDPOINT=http://localhost:9000
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=minioadmin
STORAGE_SECRET_KEY=minioadmin
STORAGE_BUCKET=codemastery
STORAGE_S3_FORCE_PATH_STYLE=true
```

## Interface

```ts
interface IStorageService {
  provider: IStorageProvider
  upload(namespace: string, filename: string, data: Buffer, mimeType: string): Promise<StoredFile>
}
interface IStorageProvider {
  upload(key: string, data: Buffer, mimeType: string): Promise<StoredFile>
  read(key: string): Promise<Buffer | null>
  delete(key: string): Promise<void>
  getUrl(key: string): string
}
```

## Adding a new provider

1. Create `<provider>.ts` implementing `IStorageProvider`.
2. Register it in `src/lib/storage/index.ts` based on `config.storage.provider`.
3. Lazy-import any heavy SDK so it remains optional.

## Serving local files in production

The dev server serves `/uploads/*` from the filesystem. In a containerized deployment, mount a volume at `/app/uploads` (the Dockerfile already does this). For multi-instance deployments, use S3 instead so all instances share the same object store.
