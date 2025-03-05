import crypto from 'crypto'
export const generateRandomSalt = () => {
  const randomSalt = crypto.randomBytes(16).toString('hex')
  return randomSalt
}
