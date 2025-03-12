'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  CardDescription,
  Label,
  Input,
} from '@/components'

import { requestPasswordReset } from '@/utils/api/api'

import { signInLink } from '@/constants/links'
type ResponseData = {
  error?: string
}
const ForgotPasswordPage = () => {
  const [isRequestSuccessful, setIsRequestSuccessful] = useState(false)
  const [responseData, setResponseData] = useState<ResponseData>({})
  const [email, setEmail] = useState('')
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const retryRequestOTPHandler = async () => {
    await requestPasswordReset(email)
  }
  const requestOTPHandler = async () => {
    const response = await requestPasswordReset(email)
    const { error } = response

    if (error) {
      setResponseData({ error })
      return
    }
    setResponseData({ error: undefined })
    setIsRequestSuccessful(true)
  }

  const { error } = responseData
  return (
    <>
      {isRequestSuccessful ? (
        <Card className="w-96 p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Email has been sent
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-center">
            Please check your inbox and click the received link to reset your
            password
          </CardDescription>
          <CardFooter className="flex items-center justify-center p-6">
            <Button className="px-8">
              <Link href={signInLink} className="text-center font-bold">
                {' '}
                sign-in
              </Link>{' '}
            </Button>
          </CardFooter>
          <CardFooter className="justify-center text-center text-xs text-muted-foreground">
            Didn&apos;t receive a link?
            <span
              className="cursor-pointer font-bold text-black"
              onClick={retryRequestOTPHandler}
            >
              &nbsp;Resend
            </span>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card className="w-96 p-6">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl">
                Forgot Password?
              </CardTitle>
              <CardDescription>
                No worries, we&apos;ll send you reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com"
                  name="email"
                  value={email}
                  onChange={onChangeHandler}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button className="w-full" onClick={requestOTPHandler}>
                Reset Password
              </Button>
            </CardFooter>
            <CardFooter className="flex items-center justify-center">
              <Link
                href={signInLink}
                className="text-center text-xs text-muted-foreground underline"
              >
                Back to sign-in
              </Link>
            </CardFooter>
            {error && (
              <CardFooter className="justify-center text-center text-xs text-red-500">
                Something went wrong. Please try again later
              </CardFooter>
            )}
          </Card>
        </>
      )}
    </>
  )
}

export default ForgotPasswordPage
