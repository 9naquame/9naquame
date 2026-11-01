export const PUBLIC_SITE_ORIGIN = "https://9naqua.me";

export function resolveRequestOrigin(request: Request, production: boolean) {
  if (production) return PUBLIC_SITE_ORIGIN;
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host");
  if (!host) return requestUrl.origin;
  try {
    // Next's internal development URL can use localhost for a loopback request.
    // Use the actual Host authority, never a client-supplied forwarded host.
    const browserUrl = new URL(`${requestUrl.protocol}//${host}`);
    if (
      !browserUrl.username &&
      !browserUrl.password &&
      browserUrl.pathname === "/" &&
      !browserUrl.search &&
      !browserUrl.hash
    )
      return browserUrl.origin;
  } catch {
    // An invalid authority cannot override the request URL.
  }
  return requestUrl.origin;
}
