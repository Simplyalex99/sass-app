import { fetchData } from '../others/fetchData'
import { RequestOTPBody } from '@/types/api'
import { requestOtpApi, resetPasswordApi } from '@/constants/api'
export const fetchToken = async (id: string | null) => {
  const result = await fetchData<RequestOTPBody>(requestOtpApi, {
    method: 'POST',
    body: JSON.stringify({ userId: id }),
  })
  return result.body
}
export const requestPasswordReset = async (email: string) => {
  const result = await fetchData<RequestOTPBody>(resetPasswordApi, {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
  return result.body
}
