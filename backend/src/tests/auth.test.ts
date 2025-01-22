import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { generateRandomPassword } from './utils'
import app from '../server'
import { UserResponseBody } from '../../../shared/api'
import { BASE_URL } from './enums'
import { SuperTestResponse } from './types'
describe('auth:user:register', () => {
  const endpoint = '/register'
  const URL = `${BASE_URL}${endpoint}`
  const testEmail = `${uuidv4()}@hotmail.com`
  it('can register a user', async () => {
    const plainTextPassword = generateRandomPassword(8)
    const payload = { email: testEmail, plainTextPassword }
    const response: SuperTestResponse<UserResponseBody> = await request(app)
      .post(URL)
      .send(payload)
      .set('Content-Type', 'application/json')
    const body = response.body
    expect(response.status).toBe(201)
    expect(body.id)
  })
  it('cannot register a user with an existing email', async () => {
    const plainTextPassword = generateRandomPassword(8)
    const payload = { email: testEmail, plainTextPassword }
    const response: SuperTestResponse<UserResponseBody> = await request(app)
      .post(URL)
      .send(payload)
      .set('Content-Type', 'application/json')
    expect(response.status).toBe(400)
    const body = response.body
    expect(body.error)
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
      const payload = { email: testEmail, plainTextPassword: invalidPassword }
      const response: SuperTestResponse<UserResponseBody> = await request(app)
        .post(URL)
        .send(payload)
        .set('Content-Type', 'application/json')
      expect(response.status).toBe(400)
      const body = response.body
      expect(body.error)
    }
  })
})
