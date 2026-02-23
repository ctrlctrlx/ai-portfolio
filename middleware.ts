import { NextRequest, NextResponse } from "next/server";

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

function getLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang.toLowerCase().includes("zh")) return "zh";
  return "en";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API routes, Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if a valid locale is already in the path
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to locale-prefixed path
  const locale = getLocale(request);
  const newPath = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(new URL(newPath, request.url));
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
