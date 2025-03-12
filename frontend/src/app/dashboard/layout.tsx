import React from 'react'
import { NavBar } from './_components/common/navbar'
const MarketingLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-accent/5">
      <NavBar />
      <div className="container py-6">{children}</div>
    </div>
  )
}

export default MarketingLayout
