import crypto from 'crypto'

export const createCsrfToken = () => {
  return crypto.randomUUID()
}

export const createHashedCsrfToken = (csrfToken: string) => {
  return crypto.createHash('sha256').update(csrfToken).digest('hex')
}
