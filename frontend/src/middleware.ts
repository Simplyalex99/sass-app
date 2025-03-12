import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { ratelimit } from '@/lib/upstash/ratelimit'
import { redirect } from 'next/navigation'
import { validateTokens } from '@/utils/auth/middlewareUtil'
import { validateReferer } from '@/utils/auth/validateReferer'

export const middleware = async (request: NextRequest) => {
  const headersList = await headers()

  try {
    const { isValidReferer, error } = validateReferer(headersList, request)

    if (!isValidReferer) {
      return NextResponse.json({ error }, { status: 403 })
    }
    const userIP = (
      request.headers.get('x-forwarded-for') ?? '127.0.0.1'
    ).split(',')[0]
    const { success } = await ratelimit.limit(userIP)

    if (!success) {
      return NextResponse.json({ error: 'Too many request' }, { status: 429 })
    }

    const { isAuthenticated } = await validateTokens()

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!isAuthenticated) {
        redirect('/sign-in')
      }
      return NextResponse.next()
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { error: 'Bad Request: Malformed Referer' },
      { status: 400 }
    )
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) exluded from ?!api|
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
