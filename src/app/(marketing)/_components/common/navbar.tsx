'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { BrandLogo, Button } from '@/components'
import { MenuSVG } from '../svgs/menu'
export const Navbar = () => {
  const userIsLoggedIn = false
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
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
                  {userIsLoggedIn ? (
                    <Button size="lg">
                      <Link href="#" className="text-lg">
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button>
                      <Link href="#" className="text-lg">
                        Login
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
            {userIsLoggedIn ? (
              <Button size="lg">
                <Link href="#" className="text-lg">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button>
                <Link href="#" className="text-lg">
                  Login
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
