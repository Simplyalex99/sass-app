import { productService } from '@/utils/services/db/products'
import { getUser } from '@/utils/auth/getUser'
import { redirect } from 'next/navigation'
import { signInLink } from '@/constants/links'
import { NoProducts } from './_components/noProducts'
const DashboardPage = async () => {
  const user = await getUser()
  console.log('user in dashvoard ' + JSON.stringify(user))
  if (!user) {
    redirect(signInLink)
  }
  const id = user.userId
  const products = await productService.getProducts(id)
  if (products.length === 0) {
    return <NoProducts />
  }
  return <>ok</>
}

export default DashboardPage
