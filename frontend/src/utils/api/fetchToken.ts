import { fetchData } from '../others/fetchData'
import { RequestOTPBody, SignInBody } from '@/types/api'
import { requestOtpApi, resetPasswordApi, signInApi } from '@/constants/api'
export const fetchEmailVerification = async (id: string | null) => {
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
export const fetchSignIn = async (email: string, plainTextPassword: string) => {
  const result = await fetchData<SignInBody>(signInApi, {
    method: 'POST',
    body: JSON.stringify({
      email,
      plainTextPassword,
    }),
  })
  return result
}
