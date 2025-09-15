import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Các route cần bảo vệ
  const protectedRoutes = ['/dashboard'];
  const authRoutes = ['/auth'];
  
  const { pathname } = request.nextUrl;
  
  // Kiểm tra xem có token trong cookies không
  const token = request.cookies.get('auth-token')?.value;
  
  // Nếu đang ở trang auth và đã đăng nhập, redirect về dashboard
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Nếu truy cập route được bảo vệ mà chưa đăng nhập
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};