const SITE_URL_VARIABLE = "NEXT_PUBLIC_SITE_URL";

export function getSiteUrl(): URL | null {
  const configuredUrl = process.env[SITE_URL_VARIABLE]?.trim();
  if (!configuredUrl) return null;

  let siteUrl: URL;
  try {
    siteUrl = new URL(configuredUrl);
  } catch {
    throw new Error(`${SITE_URL_VARIABLE} must be a valid absolute URL.`);
  }

  if (
    siteUrl.protocol !== "https:" ||
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.hostname === "localhost" ||
    siteUrl.hostname === "127.0.0.1" ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error(
      `${SITE_URL_VARIABLE} must be an origin-only public HTTPS URL.`
    );
  }

  return siteUrl;
}

export function getAbsolutePageUrl(pathname: string): string | null {
  const siteUrl = getSiteUrl();
  return siteUrl ? new URL(pathname, siteUrl).toString() : null;
}
