const SITE_URL_VARIABLE = "NEXT_PUBLIC_SITE_URL";
export const DEFAULT_SITE_URL = "https://ctrlctrlx.top";

export function getSiteUrl(): URL {
  const configuredUrl = process.env[SITE_URL_VARIABLE]?.trim();
  if (!configuredUrl) return new URL(DEFAULT_SITE_URL);

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

export function getAbsolutePageUrl(pathname: string): string {
  const siteUrl = getSiteUrl();
  return new URL(pathname, siteUrl).toString();
}
