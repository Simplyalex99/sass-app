'use client'
import { useState, useRef } from 'react'
import { Input } from '@/components'
import { v4 as uuidv4 } from 'uuid'
export const OTPInput = ({
  length = 6,
  onComplete,
}: {
  length: number
  onComplete: (param: string) => void
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '')) {
      onComplete?.(newOtp.join(''))
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex space-x-2">
      {otp.map((digit, index) => (
        <Input
          key={uuidv4()}
          type="text"
          value={digit}
          maxLength={1}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="h-16 w-16"
          min="0"
          max="9"
          pattern="\d{1}"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
        ></Input>
      ))}
    </div>
  )
}
