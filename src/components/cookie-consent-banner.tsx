"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { enablePostHog } from "@/instrumentation-client";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so visibility can only be
    // known once mounted in the browser — start hidden, reveal here to
    // avoid a server/client hydration mismatch.
    if (window.localStorage.getItem("cookie_consent") === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function accept() {
    window.localStorage.setItem("cookie_consent", "accepted");
    enablePostHog();
    setVisible(false);
  }

  function reject() {
    window.localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink bg-paper-card px-6 py-4">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed">
          We use cookies required to keep you signed in, plus optional
          analytics cookies (PostHog) to understand product usage. See our{" "}
          <Link href="/privacy" className="text-rust underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="border border-ink px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-ink/5"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-paper hover:bg-ink/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
