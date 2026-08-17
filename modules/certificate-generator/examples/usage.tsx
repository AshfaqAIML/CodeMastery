/**
 * Example integration: a Next.js App Router API route + React page
 * that uses the certificate-generator module.
 *
 * COPY these patterns into your own project. Adapt the auth + DB
 * lookups to your stack.
 */

import { NextRequest, NextResponse } from "next/server"
import {
  generateCertificate,
  checkCertificateAccess,
  type CertificateData,
  type AccessResult,
} from "@codemastery/certificate-generator"

// ----------------------------------------------------------------
// Example API Route: POST /api/certificates/python-fundamentals
// ----------------------------------------------------------------

export async function POST(req: NextRequest) {
  // 1. Auth (use your own session provider)
  const userId = await getUserIdFromSession() // ← your impl
  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 })
  }

  // 2. Resolve access context (use your own DB lookups)
  const ctx = await resolveUserAccess(userId) // ← your impl

  // 3. Check completion eligibility
  //    Has the user finished ALL tutorials in the "Python Fundamentals" module?
  const { eligible, reason } = await checkPythonCompletion(userId) // ← your impl
  if (!eligible) {
    return NextResponse.json({ error: reason }, { status: 403 })
  }

  // 4. Check access: this certificate is available to any authenticated
  //    user who completed the requirements (FREE access level).
  const access = checkCertificateAccess(ctx, "FREE", eligible)
  if (!access.allowed) {
    return NextResponse.json({ error: access.reason }, { status: 403 })
  }

  // 5. Fetch the user's name
  const user = await fetchUser(userId) // ← your impl

  // 6. Generate the PDF
  const data: CertificateData = {
    recipientName: user.name,
    courseName: "Python Fundamentals",
    subjectName: "Python",
    issuerName: "CodeMastery",
    issuerTagline: "Computer Science Learning Platform",
    grade: "Passed",
    completionNote: "Completed all 8 tutorials in the Python Fundamentals module",
    instructorName: "Senior Instructor",
    instructorTitle: "CodeMastery Faculty",
  }

  const output = await generateCertificate(data, {
    template: "classic",
    accentColor: "#10b981",
    verificationUrl: process.env.NEXT_PUBLIC_APP_URL!,
  })

  // 7. Save to DB + return the PDF
  await saveCertificateRecord(output) // ← your impl

  return new NextResponse(Buffer.from(output.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${output.filename}"`,
    },
  })
}

// ----------------------------------------------------------------
// Example React Page: a "Generate Certificate" CTA
// ----------------------------------------------------------------

import { useState } from "react"
import {
  CertificateModal,
  CertificateDownloadButton,
} from "@codemastery/certificate-generator"

function CourseCompletionPage() {
  const [showCert, setShowCert] = useState(false)

  const certData: CertificateData = {
    recipientName: "Jane Doe",
    courseName: "Python Fundamentals",
    subjectName: "Python",
    issuerName: "CodeMastery",
    issuerTagline: "Computer Science Learning Platform",
    grade: "Passed",
  }

  // This would come from your API (the access check result)
  const accessResult: AccessResult | undefined = undefined

  return (
    <div>
      <h1>🎉 You completed Python Fundamentals!</h1>
      <p>You've earned a certificate of completion.</p>

      <button onClick={() => setShowCert(true)}>
        View Certificate
      </button>

      <CertificateModal
        open={showCert}
        onOpenChange={setShowCert}
        certificateData={certData}
        apiEndpoint="/api/certificates/python-fundamentals"
        options={{ template: "classic", accentColor: "#10b981" }}
        accessResult={accessResult}
        onUpgrade={() => window.location.href = "/pricing"}
      />
    </div>
  )
}

// ----------------------------------------------------------------
// Stubs — replace with your real implementations
// ----------------------------------------------------------------

async function getUserIdFromSession(): Promise<string | null> { return null }
async function resolveUserAccess(_userId: string): Promise<any> { return {} }
async function checkPythonCompletion(_userId: string): Promise<{ eligible: boolean; reason?: string }> {
  return { eligible: true }
}
async function fetchUser(_userId: string): Promise<{ name: string }> { return { name: "Jane Doe" } }
async function saveCertificateRecord(_output: any): Promise<void> {}
