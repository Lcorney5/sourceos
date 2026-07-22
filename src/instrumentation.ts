import { captureRequestError } from "@sentry/nextjs";

// Runs once when a new server instance starts. Loads the Sentry config that
// matches the current runtime — no-ops in both if SENTRY_DSN isn't set (see
// sentry.server.config.ts / sentry.edge.config.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = captureRequestError;
