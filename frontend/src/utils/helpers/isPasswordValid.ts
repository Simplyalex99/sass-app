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
