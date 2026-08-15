import { config } from "@/lib/config"
import type { EmailService, EmailMessage } from "./types"
import { ConsoleEmailService } from "./console"
import { SMTPEmailService } from "./smtp"

let _instance: EmailService | null = null

export function getEmail(): EmailService {
  if (_instance) return _instance
  if (config.email.provider === "smtp") {
    _instance = new SMTPEmailService(config.email.smtp)
  } else {
    _instance = new ConsoleEmailService()
  }
  return _instance
}

export type { EmailService, EmailMessage } from "./types"
