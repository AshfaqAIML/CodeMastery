/**
 * Ambient type declarations for OPTIONAL dependencies.
 *
 * These packages are lazy-imported only when the corresponding provider is
 * selected via environment variables. They are NOT required for the core
 * platform to run. Declaring them as `any` here prevents TypeScript from
 * erroring on dynamic `import("...")` calls when the package isn't installed.
 *
 * If you install one of these packages, the real types from the package
 * will take precedence over these declarations (TypeScript resolves
 * node_modules before ambient declarations in most configurations).
 */

declare module "nodemailer" {
  const nodemailer: any
  export default nodemailer
  export const createTransport: any
}

declare module "@aws-sdk/client-s3" {
  export const S3Client: any
  export const PutObjectCommand: any
  export const GetObjectCommand: any
  export const DeleteObjectCommand: any
  export const ListObjectsV2Command: any
}

declare module "z-ai-web-dev-sdk" {
  const ZAISDK: any
  export default ZAISDK
  export const API_KEY: string | undefined
}
