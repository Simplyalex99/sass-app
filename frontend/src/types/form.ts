export type FormDataType = {
  email: string
  plainTextPassword: string
  confirmPassword: string
}
export type FormErrorType = {
  emailError: string | null
  confirmError: string | null
  passwordErrors: string[]
}
