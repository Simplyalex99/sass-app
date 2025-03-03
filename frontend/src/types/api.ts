export type RegisterUserBody = {
  error?: string
  userId?: string
}
export type SendEmailBody = {
  error?: string
  message?: string | null
}
export type VerifyEmailBody = {
  error?: string
  message?: string
}
export type RequestOTPBody = {
  error?: string
  message?: string
}
export type LoginBody = {
  error?: string
  user?: {
    isEmailVerified: boolean
    data?: { userId: string }
  }
}
export type PasswordUpdateBody = {
  error?: string
}
export type PasswordResetBody = {
  error?: string
  message?: string
}
