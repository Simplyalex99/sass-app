const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numbers = '0123456789'
const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'
const randomLowercase = lowercase[Math.floor(Math.random() * lowercase.length)]
const randomUppercase = uppercase[Math.floor(Math.random() * uppercase.length)]
const randomNumber = numbers[Math.floor(Math.random() * numbers.length)]
const randomSpecialChar =
  specialChars[Math.floor(Math.random() * specialChars.length)]
const flagTypes = {
  lowercase: 'lowercase',
  uppercase: 'uppercase',
  numbers: 'numbers',
  specialChars: 'specialChars',
  all: 'all',
} as const

type Flag = keyof typeof flagTypes

/**
 * Ensure at least one character from each required set from flagTypes
 *
 * @param {selectedFlag} Flag - The flag type
 * @returns {string[]} A list of selected characters from flagTypes to generate a password.
 */

const passwordPrefixFactory = (selectedFlag: Flag) => {
  if (selectedFlag === flagTypes.all) {
    return [randomLowercase, randomUppercase, randomNumber, randomSpecialChar]
  }
  if (selectedFlag === flagTypes.lowercase) {
    return [randomLowercase]
  }

  if (selectedFlag === flagTypes.uppercase) {
    return [randomUppercase]
  }

  if (selectedFlag === flagTypes.numbers) {
    return [randomNumber]
  }

  return [randomSpecialChar]
}

/**
 * Generate a scope of remainning characters to use to generate a password.
 *
 * @param {selectedFlag} Flag - The flag type
 * @returns {string} A string representing the scope of characters to use to generate a password.
 */
const passwordCharactersScopeFactory = (selectedFlag: Flag) => {
  let allSelectedChars = ''
  if (selectedFlag === flagTypes.all) {
    return lowercase + uppercase + numbers + specialChars
  }
  if (selectedFlag === flagTypes.lowercase) {
    allSelectedChars += lowercase
  }

  if (selectedFlag === flagTypes.uppercase) {
    allSelectedChars += uppercase
  }

  if (selectedFlag === flagTypes.numbers) {
    allSelectedChars += numbers
  }

  if (selectedFlag === flagTypes.specialChars) {
    allSelectedChars += specialChars
  }

  return allSelectedChars
}

/**
 * Generates a random password that meets one or more the following conditions:
 * - At least 8 characters long and no more than 64 characters.
 * - Contains at least one lowercase letter, one uppercase letter,
 *   one number, and one special character.
 *
 * @param {number} length - The desired length of the password.
 * @param {Flag} flag - The desired character set(s) to include in the password.
 * @returns {string} A randomly generated password meeting the specified criteria.
 */

export const generateRandomPassword = (
  length: number,
  flag: Flag = 'all'
): string => {
  if (length < 8 || length > 64) {
    return ''
  }
  const requiredChars = passwordPrefixFactory(flag)

  // Fill the rest of the password length with random characters
  const allChars = passwordCharactersScopeFactory(flag)
  const remainingLength = length - requiredChars.length
  for (let i = 0; i < remainingLength; i++) {
    requiredChars.push(allChars[Math.floor(Math.random() * allChars.length)])
  }

  // Shuffle the password to ensure randomness
  return requiredChars.sort(() => Math.random() - 0.5).join('')
}
