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
import { BUSINESS_NAME } from '@/constants'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
const SignInPage = () => {
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    plainTextPassword: '',
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

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
  const { email, plainTextPassword } = loginCredentials
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
            onClick={() => signIn('github')}
          >
            <Icons.gitHub />
            GitHub
          </Button>

          <Button
            variant="outline"
            className="hover:bg-slate-100"
            onClick={() => signIn('google')}
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
          />
        </div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={isPasswordVisible ? 'text' : 'password'}
          name="plainTextPassword"
          value={plainTextPassword}
          onChange={onChangeLoginHandler}
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
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
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
