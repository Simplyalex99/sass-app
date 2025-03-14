import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/utils/services/db/products'
import { getUser } from '@/utils/auth/getUser'
import { productDetailsSchema } from '@/lib/zod/schemas/dashboard/productDetails'
import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
import { CACHE_TAGS, revalidateDbCache } from '@/utils/auth/cache'

export const POST = async (request: NextRequest) => {
  const user = await getUser()
  const body = await request.json()

  const { success, data, error } = productDetailsSchema.safeParse(body)
  if (!success) {
    const invalidFieldsMessage = formatSchemaErrorMessages(error.issues)
    return NextResponse.json({ error: invalidFieldsMessage }, { status: 400 })
  }
  if (!user) {
    return NextResponse.json(
      { error: 'There was an error creating your product' },
      { status: 400 }
    )
  }
  try {
    const product = await productService.createProduct({
      ...data,
      userId: user.userId,
    })
    revalidateDbCache({
      tag: CACHE_TAGS.products,
      userId: user.userId,
      id: product?.productId,
    })
    return NextResponse.json(
      { message: 'Product created', productId: product?.productId },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json({}, { status: 500 })
  }
}
