import { fetchOtpCode, fetchOtpUrl } from '@/utils/api/api'
export const createSixDigitOTP = async () => {
  const response = await fetchOtpCode()
  return response.body.otp
}
/**
 *
 * @param bytes
 * @note max bytes is 256^6
 * @returns string
 */
export const createOTP = async (bytes: number) => {
  const response = await fetchOtpUrl(bytes)
  return response.body.otp
}
