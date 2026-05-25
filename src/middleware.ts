import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  /*
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that should not be redirected
  const publicPaths = ['/', '/courses', '/faculty', '/gallery', '/contact'];
  const authPaths = ['/login', '/admin/login'];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If user has token and tries to access login, redirect them to dashboard
  if (token && authPaths.includes(pathname)) {
    // Note: Since we don't decode JWT here, we might need a way to know the role 
    // to redirect to the correct dashboard. For now, we'll let the layout handle it
    // or just let them through and let client-side handle it.
    return NextResponse.next();
  }

  // If no token and trying to access protected routes, redirect to appropriate login
  if (!token && !authPaths.includes(pathname)) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (pathname.startsWith('/student')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  */

  // TEMPORARY: Redirect all disabled dashboard and login paths to home for the exam period
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*', '/login', '/admin/login'],
};
