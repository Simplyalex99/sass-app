import { fetchHashPassword, fetchHashVerification } from '@/utils/api/api'
/**
 *
 * @param plainTextPassword
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
 * @returns
 */
export const generateHashedPassword = async (plainTextPassword: string) => {
  const response = await fetchHashPassword(plainTextPassword)
  return response.body
}

export const isPasswordCorrect = async (
  plainTextPassword: string,
  storedHashedPassword: string,
  storedSalt: string
) => {
  if (!plainTextPassword || !storedHashedPassword || !storedSalt) {
    throw new Error('Invalid input parameters provided to isPasswordCorrect.')
  }
  const response = await fetchHashVerification(
    plainTextPassword,
    storedSalt,
    storedHashedPassword
  )
  console.log(JSON.stringify(response))
  return response.body
}
