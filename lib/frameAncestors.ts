/**
 * CSP `frame-ancestors` sources for the admin preview iframe (see middleware + PROJECT.md).
 */

const DEFAULT_LOCALHOST_FRAME_ANCESTORS = [3000, 3001, 3002].map(
  (port) => `http://localhost:${port}`,
);

/** Parse a comma-separated entry into an origin; accepts full URLs or `host` / `host:port` (https assumed). */
function parseOrigin(entry: string): string | null {
  const item = entry.trim();
  if (!item) return null;
  try {
    return new URL(item).origin;
  } catch {
    try {
      return new URL(`https://${item}`).origin;
    } catch {
      return null;
    }
  }
}

/**
 * Space-separated list for the CSP `frame-ancestors` directive (after the keyword).
 * Defaults to localhost:3000–3002 when `ADMIN_APP_URL` is unset.
 */
export function frameAncestorsSourceList(): string {
  const raw = process.env.ADMIN_APP_URL?.trim();
  if (!raw) {
    return DEFAULT_LOCALHOST_FRAME_ANCESTORS.join(" ");
  }
  const origins = new Set<string>();
  for (const part of raw.split(",")) {
    const origin = parseOrigin(part);
    if (origin) origins.add(origin);
  }
  if (origins.size === 0) {
    return "'none'";
  }
  return Array.from(origins).join(" ");
}

/** Full `Content-Security-Policy` header value (frame-ancestors only). */
export function contentSecurityPolicyFrameAncestors(): string {
  return `frame-ancestors ${frameAncestorsSourceList()}`;
}
