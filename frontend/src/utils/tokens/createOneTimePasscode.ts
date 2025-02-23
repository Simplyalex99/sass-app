import crypto from 'crypto'
export const createOneTimePasscode = () => {
  return crypto.randomInt(100000, 999999)
}
