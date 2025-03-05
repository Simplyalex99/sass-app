/* 'use client'
import { useQuery } from '@tanstack/react-query'

import { fetchToken } from '@/utils/api/fetchToken'

import { fetchTokenKey } from '@/constants/reactQuery'
export const useFetchToken = (id: string | null) => {
  return useQuery({
    queryKey: [fetchTokenKey, id],
    queryFn: () => fetchToken(id),
  })
}
 */
