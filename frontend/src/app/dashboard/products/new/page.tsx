import { CardHeader, Card, CardTitle, CardContent } from '@/components'
import { PageWithBackButton } from '../../_components/ui/pageWithBackButton'
import { ProductDetailsForm } from '../../_components/ui/productDetailsForm'

const NewProductPage = () => {
  return (
    <PageWithBackButton
      pageTitle="Create Product"
      backButtonHref="/dashboard/products"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductDetailsForm />
        </CardContent>
      </Card>
    </PageWithBackButton>
  )
}
export default NewProductPage
