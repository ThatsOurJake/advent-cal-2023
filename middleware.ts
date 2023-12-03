import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: new Headers({ cookie: request.cookies.toString(), "x-url": request.url }),
    },
  });
};

export const config = {
  matcher: '/day/:path*',
};
