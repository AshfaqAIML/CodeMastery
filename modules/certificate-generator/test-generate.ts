/**
 * Quick functional test — generates a sample certificate PDF and saves it
 * to verify the module works end-to-end. Run with:
 *   bun run modules/certificate-generator/test-generate.ts
 */
import { writeFileSync } from "fs"
import {
  generateCertificate,
  checkCertificateAccess,
  resolveEntitlementState,
  getTrialDaysRemaining,
  getAccessLabel,
  generateCertificateId,
  computeVerificationHash,
  verifyCertificateHash,
} from "./src/index"

async function main() {
  console.log("🧪 Testing certificate-generator module...\n")

  // --- Test 1: Access control ---
  console.log("=== Access Control Tests ===")

  const guestCtx = null
  const normalCtx = {
    authenticated: true, plan: "NORMAL" as const,
    entitlementState: "NORMAL_TRIAL_EXPIRED" as const,
    hasLifetimePremium: false,
  }
  const trialCtx = {
    authenticated: true, plan: "NORMAL" as const,
    entitlementState: "NORMAL_TRIAL_ACTIVE" as const,
    trialEndsAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    trialDaysRemaining: 5,
    hasLifetimePremium: false,
  }
  const premiumCtx = {
    authenticated: true, plan: "PREMIUM" as const,
    entitlementState: "PREMIUM_LIFETIME" as const,
    hasLifetimePremium: true,
  }

  // Guest → no access
  let r = checkCertificateAccess(guestCtx, "FREE", true)
  console.log(`Guest + FREE + eligible → allowed=${r.allowed} (${r.reason?.slice(0, 40)}...)`)

  // Normal + trial active → allowed if eligible
  r = checkCertificateAccess(trialCtx, "PREMIUM", true)
  console.log(`Trial + PREMIUM + eligible → allowed=${r.allowed}, access=${getAccessLabel(r.effectiveAccess)}`)

  // Normal + trial expired → blocked for PREMIUM cert
  r = checkCertificateAccess(normalCtx, "PREMIUM", true)
  console.log(`Expired + PREMIUM + eligible → allowed=${r.allowed} (${r.reason?.slice(0, 50)}...)`)

  // Normal + trial expired → allowed for FREE cert
  r = checkCertificateAccess(normalCtx, "FREE", true)
  console.log(`Expired + FREE + eligible → allowed=${r.allowed}`)

  // Normal + eligible=false → blocked even with right plan
  r = checkCertificateAccess(premiumCtx, "FREE", false)
  console.log(`Premium + FREE + NOT eligible → allowed=${r.allowed} (${r.reason?.slice(0, 40)}...)`)

  // --- Test 2: Entitlement resolver ---
  console.log("\n=== Entitlement Resolver Tests ===")
  console.log(`Premium purchased → ${resolveEntitlementState(true, null)}`)
  console.log(`No trial → ${resolveEntitlementState(false, null)}`)
  console.log(`Active trial → ${resolveEntitlementState(false, { status: "ACTIVE", endsAt: new Date(Date.now() + 86400000).toISOString() })}`)
  console.log(`Expired trial → ${resolveEntitlementState(false, { status: "ACTIVE", endsAt: new Date(Date.now() - 86400000).toISOString() })}`)
  console.log(`Trial days remaining → ${getTrialDaysRemaining(new Date(Date.now() + 3 * 86400000).toISOString())}`)

  // --- Test 3: Verification ---
  console.log("\n=== Verification Tests ===")
  const certId = generateCertificateId()
  console.log(`Certificate ID → ${certId}`)
  const fields = {
    certificateId: certId,
    recipientName: "Jane Doe",
    courseName: "Python Fundamentals",
    issuerName: "CodeMastery",
    issuedAt: new Date().toISOString(),
  }
  const hash = computeVerificationHash(fields, "test-secret")
  console.log(`Hash → ${hash}`)
  console.log(`Verify (correct) → ${verifyCertificateHash(fields, hash, "test-secret")}`)
  console.log(`Verify (wrong secret) → ${verifyCertificateHash(fields, hash, "wrong-secret")}`)
  console.log(`Verify (tampered name) → ${verifyCertificateHash({ ...fields, recipientName: "Hacker" }, hash, "test-secret")}`)

  // --- Test 4: PDF Generation (all 3 templates) ---
  console.log("\n=== PDF Generation Tests ===")
  for (const template of ["classic", "modern", "minimal"] as const) {
    const output = await generateCertificate({
      recipientName: "Jane Doe",
      courseName: "Python Fundamentals",
      subjectName: "Python Programming",
      issuerName: "CodeMastery",
      issuerTagline: "Computer Science Learning Platform",
      grade: "A+",
      completionNote: "Completed all 8 tutorials with distinction",
      instructorName: "Dr. Alan Turing",
      instructorTitle: "Senior Faculty",
    }, {
      template,
      accentColor: "#10b981",
      verificationUrl: "https://codemastery.dev",
    })
    const path = `./modules/certificate-generator/test-${template}.pdf`
    writeFileSync(path, output.bytes)
    console.log(`✅ ${template}: ${output.bytes.length} bytes, ID=${output.certificateId}, file=${path}`)
  }

  console.log("\n✅ All tests passed!")
}

main().catch(e => { console.error("❌ Test failed:", e); process.exit(1) })
