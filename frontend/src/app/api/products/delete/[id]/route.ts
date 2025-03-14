import { getUser } from '@/utils/auth/getUser'
import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/utils/services/db/products'

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const user = await getUser()
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
    const rowCount = await productService.deleteProduct({
      productId,
      userId: user.userId,
    })
    if (!rowCount) {
      return NextResponse.json(
        { message: 'Error deleting product' },
        { status: 500 }
      )
    }
    return NextResponse.json({ message: 'Product deleted' }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: 'There was an error deleting your product' },
      { status: 500 }
    )
  }
}
