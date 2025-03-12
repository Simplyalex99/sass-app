import { fetchSalt } from '@/utils/api/api'
export const generateRandomSalt = async () => {
  const response = await fetchSalt()
  return response.body
}
