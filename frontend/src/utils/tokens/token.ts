import crypto from 'crypto'

export const createCsrfToken = () => {
  return crypto.randomUUID()
}

export const createHashedToken = (csrfToken: string) => {
  return crypto.createHash('sha256').update(csrfToken).digest('hex')
}
