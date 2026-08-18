import { config } from "@/lib/config"
import type { EmailService, EmailMessage } from "./types"
import { ConsoleEmailService } from "./console"

let _instance: EmailService | null = null

export async function getEmail(): Promise<EmailService> {
  if (_instance) return _instance
  if (config.email.provider === "smtp") {
    // Lazy-imported so nodemailer (an optional dependency) is only resolved
    // when smtp is actually selected — never at build time.
    const { SMTPEmailService } = await import("./smtp")
    _instance = new SMTPEmailService({
      ...config.email.smtp,
      from: config.email.from,
    })
  } else {
    _instance = new ConsoleEmailService()
  }
  return _instance
}

export type { EmailService, EmailMessage }
