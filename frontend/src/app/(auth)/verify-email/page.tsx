'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  CardDescription,
  OTPInput,
} from '@/components'
import { useSearchParams } from 'next/navigation'
import { fetchToken } from '@/utils/api/fetchToken'

import { fetchData } from '@/utils/others/fetchData'

import { VerifyEmailBody } from '@/types/api'
import { verifyOtpApi } from '@/constants/api'
import { signInLink } from '@/constants/links'
type ResponseData = {
  error?: string
  isLoading: boolean
}
const VerifyEmailPage = () => {
  const searchParams = useSearchParams()
  const userId = searchParams.get('id')
  const [token, setToken] = useState('')
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [resposneData, setResponseData] = useState<ResponseData>({
    isLoading: false,
  })
  const controller = new AbortController()
  const onCompleteHandler = (token: string) => {
    setToken(token)
  }
  const requestOTPHandler = async () => {
    let responseError = undefined
    setResponseData((prev) => {
      return { ...prev, isLoading: true }
    })
    const { error } = await fetchToken(userId)
    if (error) {
      responseError = error
    }
    setResponseData({ error: responseError, isLoading: false })
  }
  const onSubmitHandler = async () => {
    const { res, body } = await fetchData<VerifyEmailBody>(verifyOtpApi, {
      method: 'POST',
      body: JSON.stringify({ userId, oneTimePasscode: token }),
      signal: controller.signal,
    })
    if (res.status === 200) {
      setIsEmailVerified(true)
      return
    }
    setResponseData((prev) => {
      return { ...prev, error: body.error }
    })
  }
  useEffect(() => {
    return () => {
      controller.abort()
    }
  }, [])
  const { error, isLoading } = resposneData
  return (
    <>
      {isEmailVerified ? (
        <Card className="p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Successfully Verified
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-center">
            <p>Your email has been verified. Please sign-in to continue</p>
          </CardDescription>
          <CardFooter className="flex items-center justify-center p-6">
            <Button className="px-8">
              <Link href={signInLink} className="text-center font-bold">
                {' '}
                sign-in
              </Link>{' '}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Verification Code
            </CardTitle>
            <CardDescription className="text-center">
              {isLoading ? (
                <p className="text-sm">Please wait...</p>
              ) : (
                <p className="text-sm">
                  We have sent the verification code to the email provided
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex gap-2">
              <OTPInput length={6} onComplete={onCompleteHandler} />
            </div>
          </CardContent>

          <CardFooter>
            <div className="relative grid w-full items-center">
              <div className="relative flex justify-center capitalize">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  Didn&apos;t receive a code?{' '}
                  <span
                    className="cursor-pointer text-sm font-bold text-accent"
                    onClick={requestOTPHandler}
                  >
                    {' '}
                    RESEND CODE
                  </span>
                </span>
              </div>
            </div>
          </CardFooter>
          <CardFooter className="sm:mx-20">
            <Button className="w-full" onClick={onSubmitHandler}>
              Verify
            </Button>
          </CardFooter>
          <CardFooter>
            {error ? <p className="text-sm text-red-500">{error}</p> : <></>}
          </CardFooter>
        </Card>
      )}
    </>
  )
}

export default VerifyEmailPage
