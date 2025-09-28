// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  // ✅ Fast cookie check for wallet, trading, trade/:id

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// Match only the routes we care about
export const config = {
  matcher: ["/wallet", "/orders", "/trading"],
};
