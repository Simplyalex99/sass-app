'use client'
import { useQuery } from '@tanstack/react-query'

import { fetchUser } from '@/utils/reactQuery/api'

import { userKey } from '@/constants/reactQuery'
const staleTimeInSeconds = 900
const retryTimeInSeconds = 900
export const useUserSession = () => {
  return useQuery({
    queryKey: [userKey],
    queryFn: () => fetchUser(),
    refetchInterval: retryTimeInSeconds * 1000,
    staleTime: staleTimeInSeconds * 1000,
  })
}
