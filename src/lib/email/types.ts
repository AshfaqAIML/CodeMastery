/**
 * Email service abstraction.
 *
 * Providers:
 *   - "console" (default) — logs emails to stdout, no real send. Good for dev.
 *   - "smtp"              — sends via SMTP (nodemailer).
 *
 * The application never imports nodemailer directly unless the SMTP provider
 * is selected, so it remains an optional dependency.
 */

export interface EmailMessage {
  to: string
  from?: string
  subject: string
  text?: string
  html?: string
}

export interface EmailService {
  send(msg: EmailMessage): Promise<void>
}
