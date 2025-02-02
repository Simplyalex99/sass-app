import { Resend } from 'resend'
import 'dotenv/config'
export class EmailService {
  private resend: Resend
  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY must be defined')
    }

    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  async sendEmail(from: string, to: string[], subject: string, html: string) {
    const response = await this.resend.emails.send({
      from,
      to,
      subject,
      html,
    })
    return response
  }
}
