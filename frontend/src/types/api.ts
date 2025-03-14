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
export type SignInBody = {
  error?: string
  user?: {
    userId: string
  }
}
export type PasswordUpdateBody = {
  error?: string
}
export type PasswordResetBody = {
  error?: string
  message?: string
}
export type TokenBody = {
  token: string
}
export type HashBody = {
  hashedPassword: string
  salt: string
}
export type HashVerifyBody = {
  isPasswordCorrect: boolean
}
export type CreateSaltBody = {
  salt: string
}
export type OtpBody = {
  otp: string
}
export type SignOutBody = {
  error?: string
}
export type UserSessionBody = {
  user?: {
    userId?: string
  }
}
export type CreateProductBody = {
  error?: string
  message?: string
  productId?: string
}
export type UpdateProductBody = {
  error?: string
  message?: string
}
export type DeleteProductBody = {
  error?: string
  message?: string
}
