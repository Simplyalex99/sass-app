'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { BrandLogo, Button, SkeletonButton } from '@/components'
import { MenuSVG } from '../svgs/menu'
import { signInLink } from '@/constants/links'
import { fetchSignOut } from '@/utils/api/api'

import { signOut } from 'next-auth/react'
import { useUserSession } from '@/hooks/reactQuery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUser } from '@/utils/reactQuery/api'
import { userKey } from '@/constants/reactQuery'
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const queryClient = useQueryClient()
  const { data, isLoading } = useUserSession()

  const { mutateAsync } = useMutation({
    mutationFn: fetchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userKey] })
    },
  })
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const signOutHandler = async () => {
    signOut()
    await fetchSignOut()
    await mutateAsync()
  }

  const isSignedIn = data?.user?.userId

  return (
    <header className="fixed top-0 z-10 flex w-full bg-background/95 py-6 shadow-xl">
      <nav className="container relative flex items-center gap-10">
        <Link href="/" className="mr-auto">
          <BrandLogo />
        </Link>
        {/* Mobile */}
        <div className="block cursor-pointer md:hidden" onClick={toggleMenu}>
          <MenuSVG />
          {isMenuOpen && (
            <div className="fixed right-0 top-0 min-h-screen w-2/3 bg-background/95">
              <div className="flex flex-col items-end gap-8 px-8 py-8">
                <Link href="#" className="text-lg">
                  Features
                </Link>
                <Link href="#" className="text-lg">
                  Pricing
                </Link>
                <Link href="#" className="text-lg">
                  About
                </Link>
                <span className="text-lg">
                  {isLoading ? (
                    <SkeletonButton />
                  ) : isSignedIn ? (
                    <Button onClick={signOutHandler} className="text-lg">
                      Sign out
                    </Button>
                  ) : (
                    <Button>
                      <Link href={signInLink} className="text-lg">
                        Sign in
                      </Link>
                    </Button>
                  )}
                </span>
                <div className="text-3xl font-semibold" onClick={toggleMenu}>
                  x
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Medium & Large Screens */}
        <div className="hidden items-center md:flex md:gap-10">
          <Link href="#" className="text-lg">
            Features
          </Link>
          <Link href="#" className="text-lg">
            Pricing
          </Link>
          <Link href="#" className="text-lg">
            About
          </Link>
          <span className="text-lg">
            {isLoading ? (
              <SkeletonButton />
            ) : isSignedIn ? (
              <Button onClick={signOutHandler} className="text-lg">
                Sign out
              </Button>
            ) : (
              <Button>
                <Link href={signInLink} className="text-lg">
                  Sign in
                </Link>
              </Button>
            )}
          </span>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
