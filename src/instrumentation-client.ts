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

// PostHog sets analytics cookies/localStorage, which GDPR/ePrivacy treat as
// non-essential — it only starts once the user has accepted via
// CookieConsentBanner (see src/components/cookie-consent-banner.tsx), not
// unconditionally on page load.
let posthogEnabled = false;

export function enablePostHog() {
  if (posthogEnabled || !process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthogEnabled = true;
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // We send pageviews manually below (initial + via onRouterTransitionStart)
    // instead of PostHog's own history-based auto-capture, since Next.js now
    // provides a native hook for exactly this.
    capture_pageview: false,
  });
  posthog.capture("$pageview");
}

if (
  typeof window !== "undefined" &&
  window.localStorage.getItem("cookie_consent") === "accepted"
) {
  enablePostHog();
}

export function onRouterTransitionStart(url: string) {
  if (posthogEnabled) {
    posthog.capture("$pageview", { $current_url: url });
  }
}
