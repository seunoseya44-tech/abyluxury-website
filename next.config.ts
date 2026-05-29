import type { NextConfig } from "next";

/**
 * Derive an image remotePattern from the API URL so uploaded car images load
 * in BOTH dev (127.0.0.1:8001) and production (your real domain) automatically.
 */
function apiImagePattern() {
  try {
    const u = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001/api");
    return [
      {
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    // Next 16 blocks optimizing images from local/private IPs (SSRF protection).
    // Needed only for the local 127.0.0.1 backend; harmless in production.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      ...apiImagePattern(),
      // Dev fallbacks
      { protocol: "http", hostname: "127.0.0.1", port: "8001" },
      { protocol: "http", hostname: "localhost", port: "8001" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
