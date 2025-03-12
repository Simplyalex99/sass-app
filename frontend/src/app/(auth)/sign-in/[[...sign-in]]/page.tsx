'use client'
import { useState } from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Label,
  Input,
  Icons,
} from '@/components'
import { BUSINESS_NAME } from '@/constants/socials'
import { dashboardLink, forgotPasswordLink } from '@/constants/links'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { fetchSignIn } from '@/utils/api/api'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '@/utils/reactQuery/api'
import { userKey } from '@/constants/reactQuery'

const SignInPage = () => {
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  })
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: fetchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userKey] })
    },
  })
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState<undefined | string>()
  const oauthSignIn = async (provider: string) => {
    const response = await signIn(provider)
    if (response?.ok) {
      await mutateAsync()
      router.push(dashboardLink)
    }
    if (response?.error) {
      setErrorMessage('Email already exist. Try a different login method')
    }
  }
  const onChangeLoginHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedInputs = {
      ...loginCredentials,
      [e.target.name]: e.target.value,
    }
    setLoginCredentials(updatedInputs)
  }
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  const emailSignInHandler = async () => {
    const { email, password } = loginCredentials
    const { body } = await fetchSignIn(email, password)
    const { error } = body
    if (error) {
      setErrorMessage(error)
      return
    }
    router.push(dashboardLink)
  }
  const { email, password } = loginCredentials
  return (
    <Card className="p-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">
          Sign in to {BUSINESS_NAME}
        </CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button
            variant="outline"
            className="hover:bg-slate-100"
            onClick={() => oauthSignIn('github')}
          >
            <Icons.gitHub />
            GitHub
          </Button>

          <Button
            variant="outline"
            className="hover:bg-slate-100"
            onClick={() => oauthSignIn('google')}
          >
            <Icons.google />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs capitalize">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={onChangeLoginHandler}
            name="email"
          />
        </div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
          onChange={onChangeLoginHandler}
          name="password"
        />
        <div className="flex items-center gap-2">
          <Input
            id="password-checkbox"
            type="checkbox"
            className="h-4 w-6 border-none shadow-none"
            onClick={togglePasswordVisibility}
          />
          <p className="text-sm">Show Password</p>
        </div>
        <Link
          href={forgotPasswordLink}
          className="text-xs text-muted-foreground underline"
        >
          Forgot Password?
        </Link>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={emailSignInHandler}>
          Sign-in
        </Button>
      </CardFooter>
      <CardFooter>
        {errorMessage && (
          <p className="text-balance text-xs text-red-500">{errorMessage}</p>
        )}
      </CardFooter>
      <CardFooter>
        <div className="relative grid w-full items-center">
          <div className="mb-4 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs capitalize">
            <span className="bg-background px-2 text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-bold">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default SignInPage
