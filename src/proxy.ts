import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of paths that should only be available in preview/dev environments
const PREVIEW_ONLY_PATHS = [
  '/test-pages',
  '/canvas',
  // Add more paths here
]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if this is a preview-only path
  const isPreviewOnlyPath = PREVIEW_ONLY_PATHS.some(path => 
    pathname.startsWith(path)
  )
  
  // In production, redirect to 404 or home
  if (isPreviewOnlyPath && process.env.VERCEL_ENV === 'production') {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}