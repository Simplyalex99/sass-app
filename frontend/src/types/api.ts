export type RegisterUserBody = {
  error?: string
  userId?: string
}
export type SendEmailBody = {
  error?: string
  message: string | null
}
export type VerifyEmailBody = {
  error?: string
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
