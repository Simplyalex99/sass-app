import { isPasswordCorrect } from './password'
import { generateRandomSalt } from './generateRandomSalt'
import { generateRandomPassword } from './generateRandomPassword'
export const mockSecureLoginAttempt = async () => {
  const minPasswordSize = 8
  const maxPasswordSize = 64
  const randomPasswordSize =
    Math.floor(Math.random() * (maxPasswordSize - minPasswordSize + 1)) +
    minPasswordSize
  const fakeUserPassword = generateRandomPassword(randomPasswordSize, 'all')
  const fakeHashedPassword = '29dcb56a3d91f7be66de7444bc7ac605'
  const { salt } = await generateRandomSalt()
  return isPasswordCorrect(fakeUserPassword, fakeHashedPassword, salt)
}
