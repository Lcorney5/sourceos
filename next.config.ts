import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  experimental: {
    // Server Actions (e.g. the supplier "Save Changes" form) are same-origin
    // only by default — Next.js rejects the request if Origin doesn't match
    // Host. This app is reachable on three hostnames (the Vercel deployment
    // URL plus the apex and www custom domain), so all three need to be
    // listed or actions silently fail on whichever isn't.
    serverActions: {
      allowedOrigins: ["sourceos-gamma.vercel.app", "souceos.com", "www.souceos.com"],
    },
  },
};

// Reads SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN from the environment
// automatically. Source map upload is skipped (with a build warning, not a
// failure) until those are set — safe to ship before Sentry is configured.
export default withSentryConfig(nextConfig, {
  silent: true,
});
