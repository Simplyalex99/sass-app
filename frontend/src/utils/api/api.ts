import { fetchData } from '../others/fetchData'
import {
  RequestOTPBody,
  SignInBody,
  TokenBody,
  HashBody,
  HashVerifyBody,
  CreateSaltBody,
  OtpBody,
  SignOutBody,
} from '@/types/api'
import {
  requestOtpApi,
  resetPasswordApi,
  signInApi,
  hashApi,
  tokenApi,
  hashVerifyApi,
  saltApi,
  otpCodeApi,
  otpUrlApi,
  signOutApi,
} from '@/constants/api'
export const fetchEmailVerification = async (id: string | null) => {
  const result = await fetchData<RequestOTPBody>(requestOtpApi, {
    method: 'POST',
    body: JSON.stringify({ userId: id }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result.body
}
export const requestPasswordReset = async (email: string) => {
  const result = await fetchData<RequestOTPBody>(resetPasswordApi, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}

export const fetchHashToken = async (token: string) => {
  const result = await fetchData<TokenBody>(tokenApi, {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}
export const fetchHashPassword = async (token: string) => {
  const result = await fetchData<HashBody>(hashApi, {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}
export const fetchHashVerification = async (
  plainTextPassword: string,
  storedSalt: string,
  storedHashedPassword: string
) => {
  const result = await fetchData<HashVerifyBody>(hashVerifyApi, {
    method: 'POST',
    body: JSON.stringify({
      plainTextPassword,
      storedSalt,
      storedHashedPassword,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(result.body)
  return result
}

export const fetchSalt = async () => {
  const result = await fetchData<CreateSaltBody>(saltApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}
export const fetchOtpCode = async () => {
  const result = await fetchData<OtpBody>(otpCodeApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}
export const fetchOtpUrl = async (bytes: number) => {
  const result = await fetchData<OtpBody>(otpUrlApi, {
    method: 'POST',
    body: JSON.stringify({ bytes }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}

export const fetchSignOut = async () => {
  const result = await fetchData<SignOutBody>(signOutApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return result
}
