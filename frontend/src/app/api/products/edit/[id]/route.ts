import { productDetailsSchema } from '@/lib/zod/schemas/dashboard/productDetails'
import { getUser } from '@/utils/auth/getUser'
import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/utils/services/db/products'
import { formatSchemaErrorMessages } from '@/helpers/formatSchemaErrorsUtil'
export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = await getUser()
  const body = await request.json()
  const { success, data, error } = productDetailsSchema.safeParse(body)

  if (!success) {
    const errorMessage = formatSchemaErrorMessages(error.issues)
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
  if (!user) {
    return NextResponse.json(
      { error: 'There was an error creating your product' },
      { status: 400 }
    )
  }
  const productId = params.id
  if (!productId || !user) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  try {
    await productService.updateProduct({
      ...data,
      id: productId,
      userId: user.userId,
    })
    return NextResponse.json({ message: 'Product created' }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: 'There was an error creating your product' },
      { status: 500 }
    )
  }
}
