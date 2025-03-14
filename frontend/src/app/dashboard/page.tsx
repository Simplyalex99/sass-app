import { getUser } from '@/utils/auth/getUser'
import { redirect } from 'next/navigation'
import {
  viewProductsLink,
  createProductsLink,
  signInLink,
} from '@/constants/links'
import { NoProducts } from './_components/noProducts'
import Link from 'next/link'
import { ArrowRightIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductGrid } from './_components/ui/productGrid'
import { getCachedProducts } from '@/utils/auth/cacheFunctions'

const DashboardPage = async () => {
  const user = await getUser()
  if (!user) {
    redirect(signInLink)
  }
  const id = user.userId
  const products = await getCachedProducts(id, { limit: 6 })
  if (products.length === 0) {
    return <NoProducts />
  }
  return (
    <>
      <h2 className="mb-6 flex justify-between text-3xl font-semibold">
        <Link
          className="group flex items-center gap-2 hover:underline"
          href={viewProductsLink}
        >
          Products
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Button asChild>
          <Link href={createProductsLink}>
            <PlusIcon className="mr-2 size-4" />
            New Product
          </Link>
        </Button>
      </h2>
      <ProductGrid products={products} />
    </>
  )
}

export default DashboardPage
