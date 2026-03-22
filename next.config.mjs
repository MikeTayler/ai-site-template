import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Default `frame-ancestors` when `ADMIN_APP_URL` is unset — local admin preview on common dev ports. */
const DEFAULT_LOCALHOST_FRAME_ANCESTORS = [3000, 3001, 3002].map(
  (port) => `http://localhost:${port}`,
);

/**
 * Builds CSP `frame-ancestors` sources from `ADMIN_APP_URL` (comma-separated base URLs).
 * When unset, allows `http://localhost` on ports 3000, 3001, and 3002 only.
 * When set but every entry is invalid, framing is denied (`'none'`).
 */
function frameAncestorsCspValue() {
  const raw = process.env.ADMIN_APP_URL?.trim();
  if (!raw) {
    return DEFAULT_LOCALHOST_FRAME_ANCESTORS.join(" ");
  }
  const origins = new Set();
  for (const entry of raw.split(",")) {
    const item = entry.trim();
    if (!item) continue;
    try {
      origins.add(new URL(item).origin);
    } catch {
      // skip invalid URL
    }
  }
  if (origins.size === 0) {
    return "'none'";
  }
  return [...origins].join(" ");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@ai-site/components"],
  async headers() {
    const fa = frameAncestorsCspValue();
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${fa}`,
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  webpack: (config) => {
    config.resolve.alias["@site/image"] = path.join(__dirname, "lib/siteImage.tsx");
    return config;
  },
};

export default nextConfig;
