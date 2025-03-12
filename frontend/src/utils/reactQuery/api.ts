import { UserSessionBody } from '@/types/api'
import { fetchData } from '../others/fetchData'
import { userSessionApi } from '@/constants/api'

export const fetchUser = async () => {
  console.log('fetching user ')
  const result = await fetchData<UserSessionBody>(userSessionApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(result.body + 'bbody')
  return result.body
}
