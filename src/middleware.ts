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

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isStudentRoute = pathname.startsWith('/student');

  // Protecting Admin routes (/admin, /admin/dashboard, etc.)
  if (isAdminRoute) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protecting Student routes (/student, /student/dashboard, etc.)
  if (isStudentRoute) {
    if (!token || role !== 'student') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Auth pages behavior: ONLY redirect logged-in users away from THEIR OWN matching login pages
  if (token && role) {
    // Authenticated Student opening student login/signup -> /student/dashboard
    if ((pathname === '/login' || pathname === '/signup') && role === 'student') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    // Authenticated Admin opening admin login -> /admin/dashboard
    if (pathname === '/admin/login' && role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

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
