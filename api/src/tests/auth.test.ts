import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { generateRandomPassword } from '../utils/helpers/generateRandomPassword'
import app from '../server'
import { BASE_URL } from './enums'
import { SuperTestResponse } from './types'
import { RegisterUserBody } from '../../../shared/api'
describe('auth:user:register', () => {
  const endpoint = '/register'
  const URL = `${BASE_URL}${endpoint}`
  const testEmail = `${uuidv4()}@hotmail.com`
  it('can register a user', async () => {
    const plainTextPassword = generateRandomPassword(8)
    const payload = {
      email: testEmail,
      passwordForm: { plainTextPassword, confirmPassword: plainTextPassword },
    }

    const response: SuperTestResponse<RegisterUserBody> = await request(app)
      .post(URL)
      .send(payload)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(response.status).toBe(201)
  })
  it('cannot register a user with an existing email', async () => {
    const plainTextPassword = generateRandomPassword(8)
    const payload = {
      email: testEmail,
      passwordForm: { plainTextPassword, confirmPassword: plainTextPassword },
    }
    const response: SuperTestResponse<RegisterUserBody> = await request(app)
      .post(URL)
      .send(payload)
      .set('Content-Type', 'application/json')

    expect(response.body.error)
  })
  it('cannot register a user with an invalid password', async () => {
    const passwordSubcedeMinLength = generateRandomPassword(4)
    const passwordExceedMaxLength = generateRandomPassword(100)
    const passwordWithLowercaseOnly = generateRandomPassword(8, 'lowercase')
    const passwordWithUppercaseOnly = generateRandomPassword(8, 'uppercase')
    const passwordWithNumbersOnly = generateRandomPassword(8, 'lowercase')
    const passwordWithSpecialCharsOnly = generateRandomPassword(
      8,
      'specialChars'
    )
    const invalidPasswords = [
      passwordSubcedeMinLength,
      passwordExceedMaxLength,
      passwordWithLowercaseOnly,
      passwordWithNumbersOnly,
      passwordWithUppercaseOnly,
      passwordWithSpecialCharsOnly,
    ]
    for (const invalidPassword of invalidPasswords) {
      const payload = {
        email: testEmail,
        passwordForm: {
          plainTextPassword: invalidPassword,
          confirmPassword: invalidPassword,
        },
      }
      const response: SuperTestResponse<RegisterUserBody> = await request(app)
        .post(URL)
        .send(payload)
        .set('Content-Type', 'application/json')

      expect(response.status).toBe(400)
      expect(response.body.error)
    }
  })
})
