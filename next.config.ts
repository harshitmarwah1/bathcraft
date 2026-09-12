import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Google serves profile pictures from this host. Listing it explicitly
    // keeps next/image from becoming an open proxy for arbitrary URLs.
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
