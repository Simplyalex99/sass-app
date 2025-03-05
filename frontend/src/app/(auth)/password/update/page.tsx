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
  Label,
  CardDescription,
  Input,
} from '@/components'
import { useSearchParams } from 'next/navigation'
import { PasswordUpdateBody } from '@/types/api'

import { fetchData } from '@/utils/others/fetchData'
import { v4 as uuid4 } from 'uuid'
import { passwordRequirements } from '@/constants/form'
import { updatePasswordApi } from '@/constants/api'
import { signInLink } from '@/constants/links'

import { validatePassword } from '@/helpers/validatePasswordUtil'
import { validateConfirmPassword } from '@/helpers/validateFormData'
interface IFormSubmit {
  passwordErrors: string[]
  confirmError: null | string
  onSubmitError: null | string
}

const PasswordUpdatePage = () => {
  const searchParams = useSearchParams()
  const otpParam = searchParams.get('otp') ?? ''

  const [formData, setFormData] = useState({
    plainTextPassword: '',
    confirmPassword: '',
    otp: otpParam,
  })
  const [formError, setFormError] = useState<IFormSubmit>({
    passwordErrors: [],
    confirmError: null,
    onSubmitError: null,
  })

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [onSuccess, setOnSuccess] = useState(false)
  const onSubmitHandler = async () => {
    const { otp, plainTextPassword, confirmPassword } = formData

    const confirmError = validateConfirmPassword(
      plainTextPassword,
      confirmPassword
    )
    const passwordErrors = validatePassword(plainTextPassword)

    if (confirmError !== null || passwordErrors.length !== 0) {
      setFormError((prev) => {
        return { ...prev, confirmError, passwordErrors: passwordErrors }
      })

      return
    }

    try {
      const data = await fetchData<PasswordUpdateBody>(updatePasswordApi, {
        method: 'POST',
        body: JSON.stringify({
          otp,
          passwordForm: {
            plainTextPassword,
            confirmPassword,
          },
        }),
      })
      const { body } = data

      if (body.error) {
        setFormError((prev) => {
          return {
            ...prev,
            onSubmitError: 'Opps, something went wrong. Try again later.',
          }
        })
        return
      }
      setFormError({
        passwordErrors: [],
        confirmError: null,
        onSubmitError: null,
      })
      setOnSuccess(true)
    } catch {}
  }

  const onChangeFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value }
    setFormData(newFormData)
  }
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  const toggleConfirmVisibility = () => {
    setIsConfirmVisible(!isConfirmVisible)
  }

  const { plainTextPassword, confirmPassword } = formData
  const { confirmError, passwordErrors, onSubmitError } = formError

  return (
    <>
      {onSuccess ? (
        <Card className="p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Password Updated
            </CardTitle>
          </CardHeader>
          <CardDescription className="text-center">
            <p>Your password has been updated. Please sign-in to continue</p>
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
        <Card className="w-96 p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl"> Create new password</CardTitle>
            <CardDescription>
              Your password must be different from previous used passwords.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                name="plainTextPassword"
                value={plainTextPassword}
                onChange={onChangeFormHandler}
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
              {passwordErrors.length === 0 && (
                <ul>
                  {passwordRequirements.map((requirement, index) => {
                    return (
                      <li key={index} className="text-sm">
                        &#x2022; {requirement}
                      </li>
                    )
                  })}
                </ul>
              )}
              {passwordErrors.length !== 0 && (
                <ul>
                  {passwordErrors.map((error) => {
                    return (
                      <li key={uuid4()} className="text-sm text-red-500">
                        &#x2022; {error}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-confirm">Confirm password</Label>
              <Input
                id="password-confirm"
                type={isConfirmVisible ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChangeFormHandler}
              />
              <div className="flex items-center gap-2">
                <Input
                  id="#checkbox"
                  type="checkbox"
                  className="h-4 w-6 border-none shadow-none"
                  onClick={toggleConfirmVisibility}
                />
                <p className="text-sm">Show Password</p>
              </div>

              {confirmError !== null && (
                <p className="text-sm text-red-500">{confirmError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="block">
            <Button
              className={`block w-full ${onSuccess ? 'bg-slate-600' : ''}`}
              onClick={onSubmitHandler}
              disabled={onSuccess}
            >
              Reset password
            </Button>
            {onSubmitError && (
              <p className="block pt-2 text-sm text-red-500">{onSubmitError}</p>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  )
}
export default PasswordUpdatePage
