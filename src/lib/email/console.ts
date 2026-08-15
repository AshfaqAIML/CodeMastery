import type { EmailService, EmailMessage } from "./types"

/** Logs emails to stdout. Used in development and tests. */
export class ConsoleEmailService implements EmailService {
  async send(msg: EmailMessage): Promise<void> {
    console.log(
      `[email] to=${msg.to} subject="${msg.subject}"\n${msg.text ?? msg.html ?? ""}`
    )
  }
}
