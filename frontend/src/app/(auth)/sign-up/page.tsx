'use client'
import { useState } from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Label,
  Input,
} from '@/components'
import { RegisterUserBody } from '@/types/api'
import { validateConfirmPassword } from '@/utils/helpers/validateFormData'
import { validatePassword } from '@/utils/helpers/validatePasswordUtil'
import { fetchData } from '@/utils/others/fetchData'
import isEmail from 'validator/lib/isEmail'

type FormError = {
  emailError: string | null
  passwordErrors: string[]
  confirmError: string | null
  onSubmitError: string | null
}
const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    plainTextPassword: '',
    confirmPassword: '',
  })
  const [formError, setFormError] = useState<FormError>({
    emailError: null,
    passwordErrors: [],
    confirmError: null,
    onSubmitError: null,
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const validateFormFields = (newFormData: typeof formData) => {
    const formDataError = { ...formError }
    const { plainTextPassword, confirmPassword, email } = newFormData
    if (newFormData.email.length !== 0 && isEmail(email)) {
      formDataError.emailError = 'Invalid email'
    } else {
      formDataError.emailError = null
    }
    if (newFormData.plainTextPassword.length !== 0) {
      formDataError.passwordErrors = validatePassword(plainTextPassword)
    } else {
      formDataError.passwordErrors = []
    }
    if (newFormData.confirmPassword.length !== 0) {
      formDataError.confirmError = validateConfirmPassword(
        plainTextPassword,
        confirmPassword
      )
    } else {
      formDataError.confirmError = null
    }

    setFormError(formDataError)
  }
  const onSubmitHandler = async () => {
    const { email, plainTextPassword, confirmPassword } = formData
    try {
      const api = '/api/register'
      const data = await fetchData<RegisterUserBody>(api, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          passwordForm: {
            plainTextPassword,
            confirmPassword,
          },
        }),
      })
      const { res } = data
      if (res.status !== 201) {
        setFormError((prev) => {
          return {
            ...prev,
            onSubmitError: 'Opps, something went wrong. Try again later.',
          }
        })
      }
      setFormError({
        emailError: null,
        passwordErrors: [],
        confirmError: null,
        onSubmitError: null,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const onChangeFormHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value }
    setFormData(newFormData)
    validateFormFields(newFormData)
  }
  const onChangeViewPassword = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }
  const onChangeViewConfirmPassword = () => {
    setIsConfirmVisible(!isConfirmVisible)
  }

  const { email, plainTextPassword, confirmPassword } = formData
  const { emailError, confirmError, passwordErrors, onSubmitError } = formError

  return (
    <Card className="w-96 p-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Sign up</CardTitle>
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
            onChange={onChangeFormHandler}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>
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
              onClick={onChangeViewPassword}
            />
            <p className="text-sm">Show Password</p>
          </div>

          {passwordErrors.length !== 0 && (
            <ul>
              {passwordErrors.map((error, index) => {
                return (
                  <li key={index} className="text-sm text-red-500">
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
              onClick={onChangeViewConfirmPassword}
            />
            <p className="text-sm">Show Password</p>
          </div>

          {confirmError !== null && (
            <p className="text-sm text-red-500">{confirmError}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSubmitHandler}>
          Create account
        </Button>
        {onSubmitError && (
          <p className="text-sm text-red-500">{onSubmitError}</p>
        )}
      </CardFooter>
    </Card>
  )
}

export default SignUpPage
