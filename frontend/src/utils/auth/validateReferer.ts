import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { NextRequest } from 'next/server'

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

export const validateReferer = (
  headers: ReadonlyHeaders,
  request: NextRequest
): IValidateReferer => {
  const referer = headers.get('referer') ?? request?.url
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
