import React from 'react'
import { Button } from '@/components'
export const Hero = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 text-balance bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)] px-4 text-center">
      <h1 className="m-4 text-6xl font-bold tracking-tight lg:text-7xl xl:text-8xl">
        Price Smarter, Sell Bigger!
      </h1>
      <p className="max-w-screen-xl text-lg lg:text-3xl">
        {' '}
        Optimize your product pricing across countries to maximize sales.
        Capture 85% of the untapped market with location-based dynamic pricing
      </p>
      <Button size="lg" className="text-lg">
        Get started for free
      </Button>
    </section>
  )
}

export default Hero
