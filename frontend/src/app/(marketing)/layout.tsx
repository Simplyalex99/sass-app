import React from 'react'
import { Navbar } from './_components'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="selection:bg-[hsl(320,65%,52%,20%)]">
      <Navbar />
      {children}
    </div>
  )
}

export default MarketingLayout
