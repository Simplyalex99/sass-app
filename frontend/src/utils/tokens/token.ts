import { fetchHashToken } from '@/utils/api/api'

export const createHashedToken = async (token: string) => {
  const response = await fetchHashToken(token)
  return response.body
}
