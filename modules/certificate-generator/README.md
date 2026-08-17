# @codemastery/certificate-generator

> A portable, self-contained **certificate generator module** for Next.js. Generate beautiful PDF certificates with access control (guest / normal / premium / 12-day trial gating), verification QR codes, and pluggable templates. Drop it into any Next.js project.

![status](https://img.shields.io/badge/status-stable-success) ![license](https://img.shields.io/badge/license-MIT-green) ![stack](https://img.shields.io/badge/stack-Next.js%20%7C%20pdf--lib%20%7C%20TypeScript-blue)

---

## Why this module?

This module implements the **certificate generation** portion of a larger user-access model:

```
GUEST → no certificates
NORMAL + trial active → certificates only if genuinely eligible
NORMAL + trial expired → follows configured entitlement rules
PREMIUM → full access to eligible certificates
```

It is designed as a **standalone module** — not wired to any specific database, auth provider, or hosting platform. You provide thin adapters for your auth + DB; the module handles PDF generation, access control, and verification.

## Features

- ✅ **3 PDF templates**: classic, modern, minimal (or write your own)
- ✅ **Server-side access control**: guest / normal / premium-trial / premium-lifetime gating
- ✅ **Cryptographic verification**: SHA-256 hash + unique ID + QR code on every certificate
- ✅ **Zero font dependencies**: uses pdf-lib's built-in Helvetica/Times fonts
- ✅ **Pluggable store**: works with Prisma, Drizzle, Supabase, raw SQL — anything
- ✅ **React components**: live preview modal + download button
- ✅ **TypeScript-first**: full types included
- ✅ **Works in Node + browser**: pdf-lib is isomorphic

---

## Installation

### Option A — Copy the folder (simplest)

Copy this entire `modules/certificate-generator/` folder into your project:

```bash
cp -r modules/certificate-generator /path/to/your-project/modules/
```

Then install the two runtime dependencies:

```bash
bun add pdf-lib qrcode @types/qrcode
# or
npm install pdf-lib qrcode @types/qrcode
```

### Option B — npm package (if published)

```bash
bun add @codemastery/certificate-generator
```

---

## Quick Start

### 1. Create an API route

Copy `src/api/route.ts` to `src/app/api/certificates/generate/route.ts` in your project. Then adapt the three host-specific functions:

```ts
// src/app/api/certificates/generate/route.ts
import {
  generateCertificate,
  checkCertificateAccess,
  resolveEntitlementState,
  getTrialDaysRemaining,
} from "@codemastery/certificate-generator"

export async function POST(req: Request) {
  const { data, options } = await req.json()

  // 1. Get the user (your auth)
  const userId = await getMyUserId(req)
  const ctx = await buildAccessContext(userId) // ← your DB lookup

  // 2. Check eligibility (has the user finished the course?)
  const { eligible } = await checkCourseCompletion(userId, data.courseName)

  // 3. Check access (centralized logic — no scattered if/else)
  const access = checkCertificateAccess(ctx, "FREE", eligible)
  if (!access.allowed) {
    return Response.json({ error: access.reason }, { status: 403 })
  }

  // 4. Generate the PDF
  const output = await generateCertificate(data, {
    ...options,
    verificationUrl: process.env.NEXT_PUBLIC_APP_URL,
  })

  // 5. Save + stream
  await saveCertificateRecord(output)
  return new Response(output.bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${output.filename}"`,
    },
  })
}
```

### 2. Add the download button to a React page

```tsx
import { CertificateDownloadButton } from "@codemastery/certificate-generator"

export function CourseCompletePage() {
  return (
    <CertificateDownloadButton
      certificateData={{
        recipientName: "Jane Doe",
        courseName: "Python Fundamentals",
        issuerName: "CodeMastery",
      }}
      apiEndpoint="/api/certificates/generate"
      options={{ template: "classic", accentColor: "#10b981" }}
      onError={(msg) => alert(msg)}
    />
  )
}
```

### 3. Or use the full preview modal

```tsx
import { CertificateModal } from "@codemastery/certificate-generator"
import { useState } from "react"

export function CourseCompletePage() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>View Certificate</button>
      <CertificateModal
        open={open}
        onOpenChange={setOpen}
        certificateData={{
          recipientName: "Jane Doe",
          courseName: "Python Fundamentals",
          issuerName: "CodeMastery",
          grade: "Passed",
        }}
        apiEndpoint="/api/certificates/generate"
        options={{ template: "classic" }}
        accessResult={accessResult} // optional — from your API
        onUpgrade={() => router.push("/pricing")}
      />
    </>
  )
}
```

---

## Access Control Model

The module implements this decision tree (per the platform spec):

```
                    ┌──────────┐
                    │  GUEST   │ ── never allowed
                    └──────────┘
                         │
                    sign in
                         ▼
              ┌─────────────────────┐
              │  NORMAL + TRIAL     │ ── allowed if genuinely eligible
              │  (first 12 days)    │    (NOT just because trial is active)
              └──────────┬──────────┘
                         │ day 13, no purchase
                         ▼
              ┌─────────────────────┐
              │  NORMAL (expired)   │ ── follows entitlement rules
              └──────────┬──────────┘
                         │ one-time purchase
                         ▼
              ┌──────────┐
              │ PREMIUM  │ ── full access (if eligible)
              │ lifetime │
              └──────────┘
```

### The single source of truth

All access decisions go through ONE function — `checkCertificateAccess()`. Never scatter `if (isPremium)` checks across your UI.

```ts
import { checkCertificateAccess, type AccessContext } from "@codemastery/certificate-generator"

const result = checkCertificateAccess(
  ctx,              // AccessContext — built server-side
  "PREMIUM",        // required access level: PUBLIC | FREE | PREMIUM
  isEligible        // has the user completed the course?
)

if (!result.allowed) {
  return showError(result.reason)
}
// → result.effectiveAccess: "GUEST" | "NORMAL" | "PREMIUM_TRIAL" | "PREMIUM"
```

### Building the AccessContext

The host project builds an `AccessContext` from its user + trial + entitlement records:

```ts
import { resolveEntitlementState, getTrialDaysRemaining, type AccessContext } from "@codemastery/certificate-generator"

async function buildAccessContext(userId: string): Promise<AccessContext> {
  // Your DB lookups:
  const user = await db.user.findUnique({ where: { id: userId } })
  const trial = await db.premiumTrial.findUnique({ where: { userId } })

  // The module's resolver centralizes the trial/expiry logic:
  const entitlementState = resolveEntitlementState(
    user.hasLifetimePremium,
    trial ? { status: trial.status, endsAt: trial.endsAt } : null
  )

  return {
    authenticated: true,
    plan: user.hasLifetimePremium ? "PREMIUM" : "NORMAL",
    entitlementState,
    trialEndsAt: trial?.endsAt,
    trialDaysRemaining: getTrialDaysRemaining(trial?.endsAt),
    hasLifetimePremium: user.hasLifetimePremium,
    suspended: user.suspended,
  }
}
```

### Security: server-side only

Access decisions MUST happen server-side. The `AccessContext` is built from your database — never from client-supplied flags. The module's `checkCertificateAccess()` is designed to be called in your API route, not in the browser.

```
❌ NEVER:  if (req.body.isPremium) generateCert()
✅ ALWAYS: const ctx = await buildAccessContext(userId)
           const result = checkCertificateAccess(ctx, "PREMIUM", eligible)
```

---

## Certificate Verification

Every certificate includes:

1. A **unique ID** (format: `CM-YYYYMMDD-XXXXXXXX`)
2. A **SHA-256 verification hash** (identity fields + server secret)
3. A **QR code** linking to your `/verify/[id]` page

### Public verification endpoint

```ts
// src/app/api/certificates/verify/[id]/route.ts
import { verifyCertificateHash, type CertificateStore } from "@codemastery/certificate-generator"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const record = await store.findById(params.id)
  if (!record) return Response.json({ valid: false }, { status: 404 })

  const hashFromQuery = new URL(req.url).searchParams.get("h")
  const valid = verifyCertificateHash({
    certificateId: record.id,
    recipientName: record.recipientName,
    courseName: record.courseName,
    issuerName: record.issuerName,
    issuedAt: record.issuedAt,
  }, record.verificationHash)

  // Optional: also check the hash from the QR code matches
  if (hashFromQuery && hashFromQuery !== record.verificationHash) {
    return Response.json({ valid: false, reason: "Hash mismatch" })
  }

  return Response.json({
    valid,
    certificate: {
      recipientName: record.recipientName,
      courseName: record.courseName,
      issuedAt: record.issuedAt,
      issuerName: record.issuerName,
    },
  })
}
```

### Set the verification secret

```bash
# .env (generate with: openssl rand -base64 32)
CERTIFICATE_VERIFY_SECRET=your-32+char-random-secret-here
```

If unset, the module logs a warning and uses an insecure dev salt (NOT for production).

---

## Pluggable Store

Implement the `CertificateStore` interface with any database:

```ts
import type { CertificateStore } from "@codemastery/certificate-generator"

// Prisma example:
const store: CertificateStore = {
  async save(record) {
    await db.certificate.create({ data: record })
  },
  async findById(id) {
    return db.certificate.findUnique({ where: { id } })
  },
  async listByUser(userId) {
    return db.certificate.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
  },
  async exists(id) {
    return !!(await db.certificate.findUnique({ where: { id } }))
  },
}
```

---

## Templates

### Built-in templates

| Template  | Style | Best for |
|-----------|-------|----------|
| `classic` | Double-border, centered, serif/sans mix | Traditional academic certificates |
| `modern`  | Accent bars, uppercase headings, clean | Tech/bootcamp certificates |
| `minimal`| Single thin border, lots of whitespace | Modern, understated certificates |

```ts
const output = await generateCertificate(data, {
  template: "modern",
  accentColor: "#3b82f6",
})
```

### Adding a logo

```ts
import fs from "fs"
const logoBytes = fs.readFileSync("./public/logo.png")

const output = await generateCertificate(data, {
  logoImage: logoBytes, // or a base64 data URL
})
```

The logo appears at the top of the certificate (top-center in modern/minimal, top-left in classic).

### Official seal

Every certificate includes an **official seal** positioned near the signature area for a professional "raised seal" look. The seal works in two modes:

#### Mode 1 — Custom seal image (your own design)

Provide a PNG or JPEG image. It will be scaled to fit and placed on the certificate:

```ts
import fs from "fs"

const output = await generateCertificate(data, {
  sealImage: fs.readFileSync("./public/seal.png"),  // PNG or JPEG bytes
  // or a base64 data URL:
  // sealImage: "data:image/png;base64,iVBORw0KGgo...",
})
```

**Recommended seal image specs:**
- Format: PNG (with transparency) or JPEG
- Size: 300×300px or larger (square, for best results)
- The image is auto-scaled to ~65-85pt diameter on the PDF

#### Mode 2 — Generated embossed gold seal (default, no image needed)

If no `sealImage` is provided, the module generates a beautiful **embossed gold seal** automatically:

- Two concentric gold rings (outer thick, inner thin)
- Pale gold tint fill
- The issuer's initials in the center (large, bold, gold)
  - "CodeMastery" → "CO" (single word → first 2 chars)
  - "Code Mastery" → "CM" (two words → first + last initial)
  - "Code Mastery Academy" → "CA" (first + last word initial)
- "CERTIFIED" text at the top of the seal
- A 5-pointed star at the bottom
- The issue year below the star

This means every certificate looks official out of the box — no design assets required:

```ts
// No sealImage → generated gold seal is used
const output = await generateCertificate(data, {
  template: "classic",
  accentColor: "#10b981",
  verificationUrl: "https://yoursite.com",
})
```

#### Seal positioning by template

| Template | Seal position |
|----------|-------------|
| `classic` | Bottom-right, between signature and QR code |
| `modern`  | Bottom-right, left of the QR code |
| `minimal` | Bottom-center, between date and certificate ID |

The seal is rendered as vector graphics (PDF) or inline SVG (browser preview) — it's crisp at any zoom level and prints perfectly.

### Signature + layered seal (signature, digital seal, inkpad wax seal)

For a fully professional certificate, provide all three images:

```ts
import fs from "fs"

const output = await generateCertificate(data, {
  signatureImage: fs.readFileSync("./assets/signature.png"),    // handwritten signature (PNG with transparent bg)
  sealImage: fs.readFileSync("./assets/digital-seal.png"),      // the official circular digital seal
  inkpadSealImage: fs.readFileSync("./assets/inkpad-seal.png"), // wax/inkpad texture (drawn BEHIND the digital seal)
  verificationUrl: "https://yoursite.com",
})
```

**How the three layers render:**

1. **Signature image** — placed above the signature line (centered, ~160pt wide, ~45pt tall). The printed name + title appear below the line.
2. **Inkpad/wax seal** — drawn first (behind), 15% larger than the digital seal, at 78% opacity. Creates the textured "pressed into wax" background.
3. **Digital seal** — drawn on top of the inkpad, at full opacity. The crisp, official circular seal.

This layered effect makes the certificate look like a physical document with a real wax seal.

**Image preparation tips:**
- **Signature**: PNG with transparent background (remove the white background). Aspect ratio ~2:1 (wide). 300×150px or larger.
- **Digital seal**: PNG with transparent background. Square (1:1). 300×300px or larger.
- **Inkpad seal**: PNG (transparent background recommended, or the module will attempt to show it as-is). Square. 300×300px or larger. If your image has a solid background, preprocess it to make near-white pixels transparent:
  ```python
  from PIL import Image
  img = Image.open("inkpad-seal.png").convert("RGBA")
  pixels = img.load()
  for y in range(img.height):
    for x in range(img.width):
      r, g, b, a = pixels[x, y]
      if r > 180 and g > 175 and b > 165:  # near-white
        pixels[x, y] = (255, 255, 255, 0)
  img.save("inkpad-seal-transparent.png")
  ```

**Sample assets** are included in `modules/certificate-generator/assets/`:
- `signature.png` — purple handwritten signature (transparent background)
- `digital-seal.png` — circular blue/gold official seal (transparent background)
- `inkpad-seal.png` — textured wax stamp impression (transparent background)

Use these as a starting point, or replace them with your own.

---

## API Reference

### `generateCertificate(data, options?)`

Generates a PDF certificate. Returns `{ bytes, data, certificateId, verificationHash, filename }`.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `template` | `"classic" \| "modern" \| "minimal"` | `"classic"` | Visual template |
| `pageSize` | `"A4" \| "Letter"` | `"A4"` | PDF page size |
| `orientation` | `"landscape" \| "portrait"` | `"landscape"` | Page orientation |
| `accentColor` | `string` (hex) | `"#10b981"` | Primary accent color |
| `logoImage` | `Uint8Array \| string` | — | Logo image (PNG/JPEG bytes or base64 data URL) |
| `signatureImage` | `Uint8Array \| string` | — | Handwritten signature image (PNG with transparent background). Placed above the signature line. |
| `sealImage` | `Uint8Array \| string` | — | Digital seal image (the official circular seal). If omitted, a generated gold seal is used. |
| `inkpadSealImage` | `Uint8Array \| string` | — | Inkpad/wax seal image (raw stamp texture). Placed BEHIND the digital seal at 78% opacity for a realistic "pressed into wax" effect. |
| `verificationUrl` | `string` | — | Base URL for the verification QR code |
| `customFont` | `Uint8Array` | — | Custom font for recipient name (falls back to Helvetica-Bold) |

### `checkCertificateAccess(ctx, requiredAccess, isEligible)`

Centralized access check. Returns `{ allowed, effectiveAccess, reason?, requiredAccess, trialDaysRemaining? }`.

### `resolveEntitlementState(hasLifetimePremium, trial?, now?)`

Computes the `EntitlementState` from raw records. Use this in your `AccessContext` builder.

### `getTrialDaysRemaining(trialEndsAt?, now?)`

Days remaining in a trial (0 if expired). Server-time authoritative.

### `verifyCertificateHash(fields, hash, secret?)`

Verifies a certificate is genuine. Constant-time comparison (timing-attack safe).

### Components

- `<CertificatePreview data={...} template="classic" />` — in-browser visual preview
- `<CertificateDownloadButton certificateData={...} apiEndpoint="/api/..." />` — download trigger
- `<CertificateModal open={...} certificateData={...} accessResult={...} />` — full preview + download dialog

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `CERTIFICATE_VERIFY_SECRET` | ✅ production | 32+ char random string for hash signing. Generate with `openssl rand -base64 32`. |
| `NEXT_PUBLIC_APP_URL` | optional | Base URL for the verification QR code. Falls back to `http://localhost:3000`. |

---

## File Structure

```
modules/certificate-generator/
├── README.md                       ← this file
├── package.json
├── tsconfig.json
├── examples/
│   └── usage.tsx                   ← example API route + React page
└── src/
    ├── index.ts                    ← public API
    ├── types.ts                    ← all TypeScript types
    ├── api/
    │   └── route.ts                ← example Next.js API route (copy into your app)
    ├── lib/
    │   ├── access-control.ts       ← guest/normal/premium/trial gating
    │   ├── generate.ts             ← PDF generation (pdf-lib)
    │   └── verify.ts               ← ID + hash + verification URL
    ├── components/
    │   ├── CertificatePreview.tsx
    │   ├── CertificateDownloadButton.tsx
    │   ├── CertificateModal.tsx
    │   └── format.ts
    └── templates/                  ← (template rendering lives in generate.ts)
```

---

## Integration Checklist

- [ ] Copy the module folder into your project (or `bun add` the package)
- [ ] Install `pdf-lib` + `qrcode` + `@types/qrcode`
- [ ] Copy `src/api/route.ts` to `src/app/api/certificates/generate/route.ts`
- [ ] Implement `getUserId()` with your auth provider
- [ ] Implement `getAccessContext()` with your DB (use `resolveEntitlementState`)
- [ ] Implement `getUserEligibility()` (has the user completed the course?)
- [ ] Implement `CertificateStore` (save/find/list with your DB)
- [ ] Set `CERTIFICATE_VERIFY_SECRET` in `.env`
- [ ] Set `NEXT_PUBLIC_APP_URL` for the QR code
- [ ] Add a `<CertificateModal>` or `<CertificateDownloadButton>` to your course pages
- [ ] (Optional) Create a `/verify/[id]` page for public certificate verification

---

## License

MIT. Use it freely in personal + commercial projects.
