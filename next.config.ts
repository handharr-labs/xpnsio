import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  transpilePackages: ["@handharr-labs/forge-core", "@handharr-labs/forge-auth", "@handharr-labs/forge-web-client", "@handharr-labs/forge-web-server", "@handharr-labs/forge-ui-uno"],
  turbopack: {},
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV !== "production",
})(nextConfig);
