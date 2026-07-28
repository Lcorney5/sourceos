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

// Never send analytics from local dev/testing — matches localhost, 127.0.0.1,
// and private-network IPs (e.g. the "Network: http://192.168.x.x:3000" address
// `next dev` prints), all of which share the same POSTHOG key as production.
function isLocalHost() {
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)
  );
}

export function enablePostHog() {
  if (posthogEnabled || !process.env.NEXT_PUBLIC_POSTHOG_KEY || isLocalHost()) return;
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
