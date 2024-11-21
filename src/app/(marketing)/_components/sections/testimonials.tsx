import React from 'react'
import Link from 'next/link'
import { ClerkSVG } from '../svgs/clerk'
import { NeonSVG } from '../svgs/neon'
const ClientsURL = {
  neon: 'https://neon.tech',
  clerk: 'https://clerk.tech',
}
export const Testimonials = () => {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container flex flex-col gap-16 px-8 py-16 md:px-16">
        <h2 className="text-balance text-center text-3xl font-medium">
          Trusted by the top modern companies
        </h2>
        <div className="grid grid-cols-2 gap-16 md:grid-cols-3 xl:grid-cols-5">
          <Link href={ClientsURL.clerk}>
            <ClerkSVG />
          </Link>
          <Link href={ClientsURL.neon}>
            <NeonSVG />
          </Link>
          <Link href={ClientsURL.clerk}>
            <ClerkSVG />
          </Link>
          <Link href={ClientsURL.neon}>
            <NeonSVG />
          </Link>
          <Link href={ClientsURL.clerk}>
            <ClerkSVG />
          </Link>
          <Link href={ClientsURL.neon}>
            <NeonSVG />
          </Link>
          <Link href={ClientsURL.clerk}>
            <ClerkSVG />
          </Link>
          <Link href={ClientsURL.neon}>
            <NeonSVG />
          </Link>
          <Link href={ClientsURL.clerk}>
            <ClerkSVG />
          </Link>
          <Link href={ClientsURL.neon} className="md:max-xl:hidden">
            <NeonSVG />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
