import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

// Reads SENTRY_ORG / SENTRY_PROJECT / SENTRY_AUTH_TOKEN from the environment
// automatically. Source map upload is skipped (with a build warning, not a
// failure) until those are set — safe to ship before Sentry is configured.
export default withSentryConfig(nextConfig, {
  silent: true,
});
