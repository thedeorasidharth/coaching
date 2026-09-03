import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  let role: string | null = null;

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const decodedJson = typeof Buffer !== 'undefined' 
          ? Buffer.from(payloadBase64, 'base64').toString('utf-8')
          : atob(payloadBase64);
        const payload = JSON.parse(decodedJson);
        
        // Verify expiration (exp is in seconds)
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          role = null;
        } else {
          role = payload.role || null;
        }
      }
    } catch (e) {
      console.error('Middleware token decode error:', e);
      role = null;
    }
  }

  // Auth pages behavior: redirect logged-in users to their respective dashboard if token cookie is present on Next.js origin
  if (token && role) {
    // Authenticated Student opening student login/signup -> /student/dashboard
    if ((pathname === '/login' || pathname === '/signup') && role === 'student') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    // Authenticated Admin opening student login/signup or admin login -> /admin/dashboard
    if ((pathname === '/login' || pathname === '/signup' || pathname === '/admin/login') && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // Delegate protected route authorization to DashboardLayout client-side verification
  // (required for cross-origin backend deployments where auth cookies are attached to the API origin)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/student',
    '/student/:path*',
    '/login',
    '/signup',
  ],
};
