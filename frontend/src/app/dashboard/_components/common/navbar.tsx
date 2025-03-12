'use client'
import Link from 'next/link'
import { BrandLogo, Button } from '@/components'
import { fetchSignOut } from '@/utils/api/api'
import { signOut } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '@/utils/reactQuery/api'
import { userKey } from '@/constants/reactQuery'
export const NavBar = () => {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: fetchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userKey] })
    },
  })

  const signOutHandler = async () => {
    signOut()
    await fetchSignOut()
    await mutateAsync()
  }

  return (
    <header className="flex bg-background py-4 shadow">
      <nav className="container flex items-center gap-10">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        <Link href="/dashboard/products">Products</Link>
        <Link href="/dashboard/analytics">Analytics</Link>
        <Link href="/dashboard/subscription">Subscription</Link>
        <Button onClick={signOutHandler} className="text-lg">
          Sign out
        </Button>
      </nav>
    </header>
  )
}
