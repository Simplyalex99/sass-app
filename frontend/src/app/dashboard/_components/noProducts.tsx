import { Button } from '@/components/ui/button'
import { BUSINESS_NAME } from '@/constants/socials'
import { createProductsLink } from '@/constants/links'
import Link from 'next/link'
export const NoProducts = () => {
  return (
    <div className="mt-32 text-balance text-center">
      <h1 className="mb-2 text-4xl font-semibold">You have no products</h1>

      <p className="mb-4">
        Get started with {BUSINESS_NAME} discounts by creating a product
      </p>
      <Button size="lg" asChild>
        <Link href={createProductsLink}>Add Product</Link>
      </Button>
    </div>
  )
}
