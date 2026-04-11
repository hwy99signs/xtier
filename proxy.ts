import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy implementation for Admin route protection.
 * Replaces the deprecated middleware.ts convention.
 */
export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const isAdminRoute = nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = nextUrl.pathname === '/admin/login';

  // Only check session for admin routes (excluding the login page itself)
  if (isAdminRoute && !isLoginRoute) {
    const session = await auth();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', nextUrl));
    }
  }

  // 2. If already logged in as admin and trying to access login page
  if (isLoginRoute) {
    const session = await auth();
    if (session?.user?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
