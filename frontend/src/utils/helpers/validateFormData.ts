import { isEmailValid } from './isEmailValid'
import { validatePassword } from './validatePasswordUtil'
import { FormDataType, FormErrorType } from '@/types/form'

const validateEmail = (email: string) => {
  if (!isEmailValid(email)) {
    return 'Invalid email'
  }
  return null
}
const validateConfirmPassword = (
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
): FormErrorType & { hasErrors: boolean } => {
  const invalidFields: FormErrorType = {
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
  const { emailError, passwordErrors, confirmError } = invalidFields
  let isInvalidData = false
  if (
    emailError !== null ||
    passwordErrors.length !== 0 ||
    confirmError !== null
  ) {
    isInvalidData = true
  }
  invalidFields.passwordErrors = result
  return { ...invalidFields, hasErrors: isInvalidData }
}

export const validateFormFields = (
  newFormData: FormDataType,
  formError: FormErrorType
): FormErrorType => {
  const formDataError = { ...formError }
  const { plainTextPassword, confirmPassword, email } = newFormData
  if (newFormData.email.length !== 0) {
    formDataError.emailError = validateEmail(email)
  } else {
    formDataError.emailError = null
  }
  if (newFormData.plainTextPassword.length !== 0) {
    formDataError.passwordErrors = validatePassword(plainTextPassword)
  } else {
    formDataError.passwordErrors = []
  }
  if (newFormData.confirmPassword.length !== 0) {
    formDataError.confirmError = validateConfirmPassword(
      plainTextPassword,
      confirmPassword
    )
  } else {
    formDataError.confirmError = null
  }

  return formDataError
}
