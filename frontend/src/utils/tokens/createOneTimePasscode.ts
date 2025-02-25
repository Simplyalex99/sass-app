import crypto from 'crypto'
export const createSixDigitOTP = () => {
  return crypto.randomInt(100000, 999999)
}
/**
 *
 * @param bytes
 * @note max bytes is 256^6
 * @returns string
 */
export const createOTP = (bytes: number) => {
  return crypto.randomBytes(bytes).toString()
}
