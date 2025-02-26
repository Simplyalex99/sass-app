import { isEmailValid } from './isEmailValid'
import { validatePassword } from './validatePasswordUtil'

type FormDataResult = {
  emailError: string | null
  confirmError: string | null
  passwordErrors: string[]
}

export const validateEmail = (email: string) => {
  if (!isEmailValid(email)) {
    return 'Invalid email'
  }
  return null
}
export const validateConfirmPassword = (
  plainTextPassword: string,
  confirmPassword: string
) => {
  if (plainTextPassword !== confirmPassword) {
    return 'Passwords do not match'
  }
  return null
}

export const validateFormData = (
  email: string,
  plainTextPassword: string,
  confirmPassword: string
): FormDataResult => {
  const invalidFields: FormDataResult = {
    emailError: null,
    confirmError: null,
    passwordErrors: [],
  }

  invalidFields.emailError = validateEmail(email)

  invalidFields.confirmError = validateConfirmPassword(
    plainTextPassword,
    confirmPassword
  )

  const result = validatePassword(plainTextPassword)
  invalidFields.passwordErrors = result
  return invalidFields
}
