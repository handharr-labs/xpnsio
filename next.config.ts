import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
};

if (process.env.NODE_ENV === "production") {
  const withPWA = require("@ducanh2912/next-pwa").default;
  module.exports = withPWA({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
  })(nextConfig);
} else {
  module.exports = nextConfig;
}
