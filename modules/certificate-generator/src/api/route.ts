/**
 * Example Next.js App Router API route for certificate generation.
 *
 * COPY this file into your Next.js app at:
 *   src/app/api/certificates/generate/route.ts
 *
 * Then adapt the `getAccessContext` + `getUserEligibility` functions
 * to use your project's auth + database.
 *
 * This handler:
 *   1. Authenticates the user (via your session provider).
 *   2. Resolves the access context (plan + trial + entitlements).
 *   3. Checks certificate access using the centralized access-control logic.
 *   4. Verifies the user has completed the course requirements.
 *   5. Generates the PDF server-side.
 *   6. Streams the PDF to the client.
 *   7. Saves the certificate record to your database.
 *
 * SECURITY: All access decisions happen server-side. The client cannot
 * grant itself Premium access by sending fabricated plan/trial flags.
 */

import { NextRequest, NextResponse } from "next/server"
import {
  generateCertificate,
  checkCertificateAccess,
  resolveEntitlementState,
  getTrialDaysRemaining,
  type CertificateData,
  type GenerateOptions,
  type AccessContext,
  type CertificateAccessLevel,
  type CertificateStore,
  type AccessAdapter,
} from "@codemastery/certificate-generator"

// ----------------------------------------------------------------
// 1. HOST-SPECIFIC WIRING — adapt these to your project
// ----------------------------------------------------------------

/**
 * TODO: Replace with your auth session lookup.
 * Example using NextAuth:
 *   import { getServerSession } from "next-auth"
 *   import { authOptions } from "@/lib/auth"
 *   const session = await getServerSession(authOptions)
 *   return session?.user?.id ?? null
 */
async function getUserId(): Promise<string | null> {
  // Replace with your auth. Return null for guests.
  return null
}

/**
 * TODO: Replace with your database lookup.
 * Build the AccessContext from your user + trial + entitlement records.
 */
async function getAccessContext(userId: string | null): Promise<AccessContext | null> {
  if (!userId) return null
  // Example using Prisma:
  // const user = await db.user.findUnique({ where: { id: userId } })
  // const trial = await db.premiumTrial.findUnique({ where: { userId } })
  // const entitlementState = resolveEntitlementState(
  //   user.hasLifetimePremium,
  //   trial ? { status: trial.status, endsAt: trial.endsAt } : null
  // )
  // return {
  //   authenticated: true,
  //   plan: user.hasLifetimePremium ? "PREMIUM" : "NORMAL",
  //   entitlementState,
  //   trialEndsAt: trial?.endsAt,
  //   trialDaysRemaining: getTrialDaysRemaining(trial?.endsAt),
  //   hasLifetimePremium: user.hasLifetimePremium,
  // }
  return {
    authenticated: true,
    plan: "NORMAL",
    entitlementState: "NORMAL_NO_TRIAL",
    hasLifetimePremium: false,
  }
}

/**
 * TODO: Replace with your completion-requirements check.
 * Has the user actually finished all tutorials in this course/subject?
 */
async function getUserEligibility(
  userId: string,
  spec: { courseName: string; subjectName?: string }
): Promise<{ eligible: boolean; reason?: string }> {
  // Example:
  // const tutorials = await db.tutorial.findMany({ where: { subject: { slug: spec.subjectName } } })
  // const completed = await db.tutorialProgress.findMany({
  //   where: { userId, completed: true, tutorial: { subject: { slug: spec.subjectName } } },
  // })
  // if (completed.length < tutorials.length) {
  //   return { eligible: false, reason: `Complete ${tutorials.length - completed.length} more tutorials.` }
  // }
  // return { eligible: true }
  return { eligible: true } // ← replace with real check
}

/**
 * TODO: Replace with your certificate persistence.
 * Implement the CertificateStore interface using your database.
 */
const store: CertificateStore = {
  async save(record) { /* await db.certificate.create({ data: record }) */ },
  async findById(id) { /* return await db.certificate.findUnique({ where: { id } }) */ return null },
  async listByUser(userId) { /* return await db.certificate.findMany({ where: { userId } }) */ return [] },
  async exists(id) { /* return !!(await db.certificate.findUnique({ where: { id } })) */ return false },
}

// ----------------------------------------------------------------
// 2. CERTIFICATE SPEC — which certificate is being requested?
// ----------------------------------------------------------------

/**
 * The access level required for this certificate.
 * - "PUBLIC":  Anyone can generate (even guests).
 * - "FREE":     Any authenticated user.
 * - "PREMIUM":  Only Premium users (lifetime OR active trial).
 *
 * You can store this per-course in your database and look it up here.
 * For a simple setup, hardcode or derive from the request body.
 */
function getRequiredAccess(
  _courseName: string,
  _subjectName?: string
): CertificateAccessLevel {
  // Default: any authenticated user who completed the requirements.
  return "FREE"
}

// ----------------------------------------------------------------
// 3. THE ROUTE HANDLER
// ----------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()
    const { data, options } = body as {
      data: CertificateData
      options?: GenerateOptions
    }

    if (!data?.recipientName || !data?.courseName || !data?.issuerName) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: recipientName, courseName, issuerName." },
        { status: 400 }
      )
    }

    // --- 1. Authenticate + resolve access context ---
    const userId = await getUserId()
    const ctx = await getAccessContext(userId)

    // --- 2. Check certificate access ---
    const requiredAccess = getRequiredAccess(data.courseName, data.subjectName)
    const { eligible, reason: eligibilityReason } = userId
      ? await getUserEligibility(userId, { courseName: data.courseName, subjectName: data.subjectName })
      : { eligible: false, reason: "Please sign in to generate a certificate." }

    const accessResult = checkCertificateAccess(ctx, requiredAccess, eligible)

    if (!accessResult.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: accessResult.reason ?? "Access denied.",
          effectiveAccess: accessResult.effectiveAccess,
          requiredAccess: accessResult.requiredAccess,
        },
        { status: 403 }
      )
    }

    // --- 3. Generate the PDF ---
    // Pass the verification URL so the QR code on the certificate points
    // to the host's /verify/[id] page.
    const verificationUrl = options?.verificationUrl
      ?? process.env.NEXT_PUBLIC_APP_URL
      ?? "http://localhost:3000"

    const output = await generateCertificate(data, {
      ...options,
      verificationUrl,
    })

    // --- 4. Persist the certificate record ---
    if (userId) {
      await store.save({
        id: output.certificateId,
        userId,
        recipientName: data.recipientName,
        courseName: data.courseName,
        subjectName: data.subjectName,
        issuerName: data.issuerName,
        issuedAt: output.data.issuedAt!,
        expiresAt: data.expiresAt ?? null,
        verificationHash: output.verificationHash,
        grade: data.grade,
        template: options?.template ?? "classic",
        createdAt: new Date().toISOString(),
      })
    }

    // --- 5. Stream the PDF to the client ---
    return new NextResponse(Buffer.from(output.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${output.filename}"`,
        "Content-Length": String(output.bytes.length),
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (e: any) {
    console.error("[certificate-generator] Generation failed:", e)
    return NextResponse.json(
      { ok: false, error: e.message ?? "Certificate generation failed." },
      { status: 500 }
    )
  }
}
