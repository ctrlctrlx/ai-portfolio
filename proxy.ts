import { NextRequest, NextResponse } from "next/server";
import { isValidLocale } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";

function getLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang.toLowerCase().includes("zh")) return "zh";
  return "en";
}

export function proxy(request: NextRequest) {
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
  const localeSegment = pathname.split("/")[1];

  if (!isValidLocale(localeSegment)) {
    const locale = getLocale(request);
    const newPath = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-portfolio-locale", localeSegment);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
