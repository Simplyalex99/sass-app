import React from 'react'
import {
  subscriptionTiersInOrder,
  subscriptionTiers,
  BUSINESS_NAME,
} from '@/constants'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components'
import { CheckIcon } from 'lucide-react'
import { formatCompactNumbers } from '@/helpers/formatCompactNumbers'
import { cn } from '@/utils/others/cn'

export const Pricing = () => {
  return (
    <section id="pricing" className="bg-accent/5 px-8 py-16">
      <h2 className="mx-auto text-balance text-center text-4xl font-semibold">
        Pricing software which pays itself 20x over
      </h2>
      <div className="mx-auto mt-8 grid max-w-screen-xl grid-cols-2 gap-4 lg:grid-cols-4">
        {subscriptionTiersInOrder.map((tiersInOrder) => {
          return (
            <PricingCard
              key={tiersInOrder.name}
              {...tiersInOrder}
            ></PricingCard>
          )
        })}
      </div>
    </section>
  )
}

export const PricingCard = ({
  name,
  priceInCents,
  maxNumberOfProducts,
  maxNumberOfVisits,
  canAccessAnalytics,
  canCustomizeBanner,
  canRemoveBranding,
}: (typeof subscriptionTiersInOrder)[number]) => {
  const isMostPopular = subscriptionTiers.Standard.name === name
  const isPremium = subscriptionTiers.Premium.name === name

  return (
    <Card>
      <CardHeader>
        <div
          className={`font-semibold ${isPremium ? 'text-[#755dc5]' : 'text-accent'}`}
        >
          {name}
        </div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumbers(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={isMostPopular ? 'accent' : 'default'}
          className="w-full rounded-lg py-5 text-lg font-semibold"
        >
          Get started
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <Feature className="font-bold">
          {maxNumberOfProducts === 1
            ? `${maxNumberOfProducts} product`
            : `${maxNumberOfProducts} products`}{' '}
        </Feature>
        <Feature>{BUSINESS_NAME} Discounts</Feature>
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canAccessAnalytics && <Feature>Can access analytics</Feature>}
        {canRemoveBranding && (
          <Feature>Remove {BUSINESS_NAME} branding</Feature>
        )}
      </CardFooter>
    </Card>
  )
}

export const Feature = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <CheckIcon className="size-4 rounded-full bg-accent/25 stroke-accent p-0.5"></CheckIcon>
      <span>{children}</span>
    </div>
  )
}
export default Pricing
