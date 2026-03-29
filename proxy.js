import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'  // 👈 agrega createRouteMatcher
import { NextResponse } from 'next/server'

// 👇 muévelo ANTES de usarlo
const isPublicRoute = createRouteMatcher([
  '/login(.*)',
  '/registro(.*)',
  '/landing(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
 console.log('userId:', userId)
  console.log('url:', request.url)
  console.log('isPublic:', isPublicRoute(request))

//  if (userId && isPublicRoute(request)) {
//    return NextResponse.redirect(new URL('/user', request.url))
//  }

  if (!userId && !isPublicRoute(request)) {
    return NextResponse.redirect(new URL('/landing', request.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}