const MIN_PASSWORD_LENGTH = 8
const MAX_PASSWORD_LENGTH = 64
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,64}$/

export const isPasswordValid = (plainTextPassword: string): boolean => {
  if (plainTextPassword.length < MIN_PASSWORD_LENGTH) {
    return false
  }
  if (plainTextPassword.length > MAX_PASSWORD_LENGTH) {
    return false
  }
  if (!PASSWORD_REGEX.test(plainTextPassword)) {
    return false
  }
  return true
}

const hasSpecialCharacter = (str: string) => {
  const specialCharRegex = /[@.#$!%*?&]/
  return specialCharRegex.test(str)
}
const hasNumber = (str: string) => {
  const specialCharRegex = /\d/
  return specialCharRegex.test(str)
}
const hasUppercase = (str: string) => {
  const specialCharRegex = /[A-Z]/
  return specialCharRegex.test(str)
}
const hasLowercase = (str: string) => {
  const specialCharRegex = /[a-z]/
  return specialCharRegex.test(str)
}
export const validatePassword = (plainTextPassword: string): string[] => {
  const messages: Array<string> = []
  if (plainTextPassword.length < MIN_PASSWORD_LENGTH) {
    messages.push('At least 8 characters')
  }
  if (plainTextPassword.length > MAX_PASSWORD_LENGTH) {
    messages.push('Max 64 characters')
  }
  if (!hasNumber(plainTextPassword)) {
    messages.push('At least 1 number (0-9)')
  }
  if (!hasUppercase(plainTextPassword)) {
    messages.push('At least 1 uppercase')
  }
  if (!hasLowercase(plainTextPassword)) {
    messages.push('At least 1 lowercase')
  }
  if (!hasSpecialCharacter(plainTextPassword)) {
    messages.push('At least 1 special character @.#$!%*?&')
  }
  return messages
}
