import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { setSecurityHeaders } from '@/lib/middleware/security-headers'

export async function middleware(request: NextRequest) {
  // Update Supabase session
  let response = await updateSession(request)

  // If no response from auth middleware, create one
  if (!response) {
    response = NextResponse.next()
  }

  // Apply security headers to all responses
  response = setSecurityHeaders(response)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
