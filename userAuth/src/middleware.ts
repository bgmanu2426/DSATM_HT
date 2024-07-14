import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublic = path === '/login' || path === '/signup' || path === '/verifyEmail'

    const token = request.cookies.get('token')?.value

    if (isPublic && token) {
        return NextResponse.redirect(new URL('/home', request.nextUrl))
    }

    if (!isPublic && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/home',
        '/login',
        '/signup',
        '/verifyEmail'
    ],
}