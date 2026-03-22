import { NextResponse, type NextRequest } from "next/server";
import { contentSecurityPolicyFrameAncestors } from "./lib/frameAncestors";

/**
 * Sets `Content-Security-Policy: frame-ancestors …` on every response so `ADMIN_APP_URL`
 * is honored at request time (Vercel) — not only at `next.config` build time.
 * This template does not use Clerk or any auth middleware.
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyFrameAncestors(),
  );
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
