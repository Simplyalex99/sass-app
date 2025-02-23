import { MILLISECONDS_IN_A_SECOND } from '@/constants/jwt'
export const createCookieExpiryDateInMilliseconds = (seconds: number): Date => {
  return new Date(Date.now() + seconds * MILLISECONDS_IN_A_SECOND)
}
