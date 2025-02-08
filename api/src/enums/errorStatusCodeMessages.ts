export const INTERNAL_SERVER_ERROR = 'Internal Server Error'
export const EMAIL_ALREADY_EXISTS = 'Email already exists'
export const ACCOUNT_LOCKED = 'Account is locked. Contact support'
export const INVALID_LOGIN = 'Incorrect email or password'
export const EMAIL_UNVERFIED = 'Email is not verified'
export const TEMPORARILY_LOCKED = (remainningMinutesLocked: number) =>
  `Account locked. Try again later in ${remainningMinutesLocked} minutes`
export const VERIFCATION_ERROR_STATES = {
  invalidCode: 'Invalid code',
  locked: ACCOUNT_LOCKED,
  temporarilyLocked: TEMPORARILY_LOCKED,
  codeExpired: 'Code expired. Request a new one',
}
