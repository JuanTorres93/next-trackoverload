import { NextRequest, NextResponse } from "next/server";

import { cookieSessionName } from "./app/api/auth/cookie";
import { AuthError } from "./domain/common/errors";
import { AppUsersRepo } from "./interface-adapters/app/repos/AppUsersRepo";
import { AppAuthService } from "./interface-adapters/app/services/AppAuthService";

export const runtime = "nodejs";

const notAllowedForLoggedInUsers = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(cookieSessionName)?.value;

  if (notAllowedForLoggedInUsers.includes(pathname)) {
    if (!token) return NextResponse.next();

    const validToken = await AppAuthService.validateToken(token);

    if (validToken) return NextResponse.redirect(new URL("/app", request.url));

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const validToken = await AppAuthService.validateToken(token);

    if (!validToken) throw new AuthError("middleware: Invalid token");

    if (pathname !== "/app/subscription") {
      const userId = await AppAuthService.getCurrentUserIdFromToken(token);
      const user = await AppUsersRepo.getUserById(userId);

      if (!user?.hasValidSubscription) {
        return NextResponse.redirect(new URL("/app/subscription", request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/app/:path*", "/auth/login", "/auth/register"],
};
