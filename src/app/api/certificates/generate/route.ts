import { NextRequest, NextResponse } from "next/server"
import { config } from "@/lib/config"
import { err } from "@/lib/api"
import { db } from "@/lib/db"
import { CERT_STATUS } from "@/lib/certificates/types"
import { getCurrentUser } from "@/lib/session"
import {
  buildAccessContext,
  getUserEligibility,
  certificateStore,
  resolveSubjectId,
} from "@/lib/certificates/module-adapter"
import { issueSubjectCertificate } from "@/lib/certificates/issue"
import { getCertificateSettings } from "@/lib/certificates/settings"
import {
  checkCertificateAccess,
  generateCertificate,
  type CertificateData,
  type GenerateOptions,
} from "@codemastery/certificate-generator"
import { CERT_ACCENT, loadAsset } from "@/lib/certificates/pdf"

/**
 * POST /api/certificates/generate
 *
 * Module-integration route (see modules/certificate-generator/README.md).
 *
 * Body: { data: { courseName, subjectName? }, options? }
 *
 * SECURITY: the client only identifies the course. Recipient name,
 * issuer identity, certificate number, and eligibility are all derived
 * server-side from the session + database. Access decisions go through
 * checkCertificateAccess() — never client-supplied flags.
 *
 * The generate route follows the module's route.ts structure and uses
 * the host adapters from module-adapter.ts.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate + resolve access context (module's getUserId/getAccessContext)
    const userId = await getCurrentUser().then((u) => u?.id ?? null)
    const ctx = await buildAccessContext(userId)

    if (!ctx || !userId) {
      return NextResponse.json(
        { ok: false, error: "Sign in to generate your certificate.", effectiveAccess: "GUEST", requiredAccess: "FREE" },
        { status: 403 }
      )
    }

    const body = await req.json().catch(() => null)
    const data = body?.data as CertificateData | undefined
    const options = body?.options as GenerateOptions | undefined

    const spec = { courseName: data?.courseName ?? "", subjectName: data?.subjectName }
    if (!spec.courseName || !spec.subjectName) {
      return err("Missing course identifier (courseName + subjectName slug).", 422)
    }

    // 2. Find the subject (slug via subjectName, or by name via courseName)
    const subjectId = await resolveSubjectId(spec)
    if (!subjectId) return err("Unknown course.", 404)
    const subject = await db.subject.findUnique({ where: { id: subjectId }, select: { name: true, slug: true } })
    if (!subject) return err("Unknown course.", 404)

    // 3. Eligibility check (module's getUserEligibility) — server-side, all tutorials completed
    const { eligible, reason } = await getUserEligibility(userId, spec)

    // 4. Centralized access gate (module's checkCertificateAccess)
    const access = checkCertificateAccess(ctx, "FREE", eligible)
    if (!access.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: access.reason ?? reason ?? "Access denied.",
          effectiveAccess: access.effectiveAccess,
          requiredAccess: access.requiredAccess,
        },
        { status: 403 }
      )
    }

    // 5. Certificate identity: reuse the issued certificate (number) when it
    //    exists, otherwise issue it through the real issuance flow. This keeps
    //    numbering + audit consistent and makes re-downloads deterministic.
    const existing = await db.certificate.findFirst({
      where: { userId, subjectId, status: { notIn: [CERT_STATUS.REVOKED, CERT_STATUS.SUPERSEDED] } },
      orderBy: { version: "desc" },
    })
    const cert =
      existing ??
      (await issueSubjectCertificate({ userId, subjectId }).then((r) => ("cert" in r ? r.cert : null)))
    if (!cert) return err("Certificate could not be issued — try again later.", 409)

    // 6. Server-derived certificate data (client identity inputs are ignored)
    const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
    const settings = await getCertificateSettings()
    const [seal, signature] = await Promise.all([
      loadAsset("seal", settings.sealKey),
      loadAsset("signature", settings.signatureKey),
    ])
    const userName =
      user?.name && user.name.trim() ? user.name : user?.email?.split("@")[0] ?? "Student"
    let certMeta: Record<string, unknown> = {}
    try {
      certMeta = cert.metadata ? JSON.parse(cert.metadata) : {}
    } catch {
      certMeta = {}
    }

    const pdf = await generateCertificate(
      {
        recipientName: userName,
        courseName: subject.name,
        issuerName: settings.issuerName,
        issuerTagline: settings.issuerWebsite,
        issuedAt: cert.issuedAt.toISOString(),
        certificateId: cert.number,
        instructorName: settings.signatoryName,
        instructorTitle: settings.signatoryTitle,
        grade:
          typeof certMeta.completedCount === "number" && typeof certMeta.totalCount === "number"
            ? `Completed ${certMeta.completedCount} of ${certMeta.totalCount} tutorials`
            : undefined,
        completionNote:
          typeof certMeta.timeSpentMin === "number"
            ? `Total learning time: ${certMeta.timeSpentMin} minutes`
            : undefined,
      },
      {
        ...options,
        template: options?.template ?? "classic",
        accentColor: CERT_ACCENT,
        sealImage: seal,
        signatureImage: signature,
        verificationUrl: config.appUrl,
      }
    )

    // 7. Persist through the module's pluggable store (idempotent — the
    //    issuance flow already created the record).
    await certificateStore.save({
      id: cert.number,
      userId,
      recipientName: userName,
      courseName: subject.name,
      subjectName: subject.slug,
      issuerName: settings.issuerName,
      issuedAt: cert.issuedAt.toISOString(),
      verificationHash: pdf.verificationHash,
      template: options?.template ?? "classic",
      createdAt: new Date().toISOString(),
    })

    // 8. Stream the PDF
    return new NextResponse(Buffer.from(pdf.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdf.filename}"`,
        "Content-Length": String(pdf.bytes.length),
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (e: any) {
    console.error("[certificates/generate] Generation failed:", e)
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Certificate generation failed." },
      { status: 500 }
    )
  }
}