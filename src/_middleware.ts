import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // 🔥 정적/리소스 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/solar/api') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 🔥 로그인 페이지 접근
  if (pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 🔥 로그인 안된 경우 → 로그인 페이지로
  if (!isLoggedIn && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};
