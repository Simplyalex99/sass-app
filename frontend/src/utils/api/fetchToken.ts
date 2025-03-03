import { fetchData } from '../others/fetchData'
import { RequestOTPBody } from '@/types/api'
export const fetchToken = async (id: string | null) => {
  const result = await fetchData<RequestOTPBody>('/api/email/request', {
    method: 'POST',
    body: JSON.stringify({ userId: id }),
  })
  return result.body
}
