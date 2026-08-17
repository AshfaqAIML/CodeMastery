import type { Prisma } from "@prisma/client"

/**
 * Allocate the next human-readable certificate number.
 * Format: CM-YYYY-NNNNNN where YYYY is the issue year and NNNNNN a
 * per-year sequential counter stored in the single-row CertificateSequence
 * table. The counter row is updated atomically inside the caller's
 * transaction — concurrent issuances serialize on the row write, so numbers
 * never collide.
 */
export async function nextCertificateNumber(
  tx: Prisma.TransactionClient
): Promise<string> {
  const year = new Date().getUTCFullYear()

  await tx.certificateSequence.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global", year, seq: 0 },
  })

  const row = await tx.certificateSequence.findUniqueOrThrow({
    where: { id: "global" },
  })

  let seq: number
  if (row.year !== year) {
    seq = 1
    await tx.certificateSequence.update({
      where: { id: "global" },
      data: { year, seq },
    })
  } else {
    seq = (
      await tx.certificateSequence.update({
        where: { id: "global" },
        data: { seq: { increment: 1 } },
      })
    ).seq
  }

  return `CM-${year}-${String(seq).padStart(6, "0")}`
}