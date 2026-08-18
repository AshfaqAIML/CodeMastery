import type { EmailService, EmailMessage } from "./types"

/**
 * SMTP email provider using nodemailer (lazy import = optional dependency).
 * Install with: bun add nodemailer @types/nodemailer
 */
export class SMTPEmailService implements EmailService {
  private transporter: any
  constructor(
    private readonly opts: {
      host: string
      port: number
      user: string
      pass: string
      secure: boolean
      from: string
    }
  ) {}

  private async getTransporter() {
    if (this.transporter) return this.transporter
    // webpackIgnore keeps this an OPTIONAL runtime dependency: the bundler
    // skips resolving it, so the app builds even when nodemailer is not
    // installed (console provider). Enable SMTP with: bun add nodemailer
    const nodemailer = await import(/* webpackIgnore: true */ "nodemailer")
    this.transporter = nodemailer.createTransport({
      host: this.opts.host,
      port: this.opts.port,
      secure: this.opts.secure,
      auth: { user: this.opts.user, pass: this.opts.pass },
    })
    return this.transporter
  }

  async send(msg: EmailMessage): Promise<void> {
    const t = await this.getTransporter()
    await t.sendMail({
      from: msg.from ?? this.opts.from,
      to: msg.to,
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
    })
  }
}
