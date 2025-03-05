import crypto from 'crypto'
const KEY_LENGTH_BYTES = 16
const SCRYPT_CPU_COST = 8192 // 2^13
const SCRYPT_BLOCK_SIZE = 8
const SCRYPT_PARALLELIZATION = 10

/**
 *
 * @param plainTextPassword
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
 * @returns
 */
export const generateHashedPassword = (plainTextPassword: string) => {
  const salt = crypto.randomBytes(32).toString('hex')
  const hashedPassword = crypto
    .scryptSync(plainTextPassword, salt, KEY_LENGTH_BYTES, {
      N: SCRYPT_CPU_COST,
      r: SCRYPT_BLOCK_SIZE,
      p: SCRYPT_PARALLELIZATION,
    })
    .toString('hex')
  return { hashedPassword, salt }
}

export const isPasswordCorrect = (
  plainTextPassword: string,
  storedHashedPassword: string,
  storedSalt: string
) => {
  if (!plainTextPassword || !storedHashedPassword || !storedSalt) {
    throw new Error('Invalid input parameters provided to isPasswordCorrect.')
  }
  const derivedHashedPassword = crypto.scryptSync(
    plainTextPassword,
    storedSalt,
    KEY_LENGTH_BYTES,
    {
      N: SCRYPT_CPU_COST,
      r: SCRYPT_BLOCK_SIZE,
      p: SCRYPT_PARALLELIZATION,
    }
  )
  const storedHashedPasswordBuffer = Buffer.from(storedHashedPassword, 'hex')
  return crypto.timingSafeEqual(
    storedHashedPasswordBuffer,
    derivedHashedPassword
  )
}
