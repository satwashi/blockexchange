import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dzqgbstfdoyvaawgnbdv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cryptoicons.org",
        port: "",
        pathname: "/api/icon/**",
      },
      {
        protocol: "https",
        hostname: "images.cryptocompare.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "resources.cryptocompare.com", // ✅ add this one
        port: "",
        pathname: "/**", // ✅ allow all paths
      },
    ],
  },
  /* other config options */
};

export default nextConfig;
