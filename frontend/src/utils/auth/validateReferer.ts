import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'

const allowedDomain = process.env.NEXT_PUBLIC_URL
if (!allowedDomain) {
  throw new Error('domain not defined')
}
interface IValidateReferer {
  isValidReferer: boolean
  error?: string
}
/**
 *
 * @param headers
 * @throws Exception
 * @returns object
 */

export const validateReferer = (headers: ReadonlyHeaders): IValidateReferer => {
  const referer = headers.get('referer')
  if (!referer) {
    return {
      error: 'Forbidden: No Referer;',
      isValidReferer: false,
    }
  }
  const refererURL = new URL(referer)
  if (refererURL.origin !== allowedDomain) {
    return {
      error: 'Forbidden: Invalid Referer',
      isValidReferer: false,
    }
  }

  return { isValidReferer: true }
}
