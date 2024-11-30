import React from 'react'
import Link from 'next/link'
import { footerLinks } from '@/constants'
import { BrandLogo } from './brandLogo'
export const Footer = () => {
  return (
    <footer className="container flex flex-col items-start justify-between gap-8 pb-8 pt-16 sm:flex-row sm:gap-4">
      <Link href="/">
        <BrandLogo />
      </Link>
      <div className="flex flex-col gap-8 sm:flex-row">
        {footerLinks.map((footerLink) => {
          return <FooterLinkGroup key={footerLink.title} data={footerLink} />
        })}
      </div>
    </footer>
  )
}
const FooterLinkGroup = ({ data }: { data: (typeof footerLinks)[number] }) => {
  const { title, links } = data
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <li key={link.href} className="">
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Footer
