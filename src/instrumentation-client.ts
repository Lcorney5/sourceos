import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

// Both SDKs no-op safely if their env vars aren't set — this file is safe to
// ship before either service is actually configured.

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
}

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // We send pageviews manually below (initial + via onRouterTransitionStart)
    // instead of PostHog's own history-based auto-capture, since Next.js now
    // provides a native hook for exactly this.
    capture_pageview: false,
  });
  posthog.capture("$pageview");
}

export function onRouterTransitionStart(url: string) {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture("$pageview", { $current_url: url });
  }
}
