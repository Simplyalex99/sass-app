import { Resend } from 'resend'
import 'dotenv/config'
export class EmailService {
  public static resend: Resend
  public static instance: EmailService
  constructor() {
    if (new.target === EmailService) {
      throw new Error(
        'EmailService cannot be instantiated directly. Use EmailService.getInstance()'
      )
    }
  }

  static getInstance() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY must be defined')
    }
    EmailService.resend = new Resend(process.env.RESEND_API_KEY)

    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }
  async sendEmail(from: string, to: string[], subject: string, html: string) {
    const { data, error } = await EmailService.resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    return { data, error }
  }
}
