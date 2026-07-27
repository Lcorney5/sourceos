"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createCheckoutSession } from "@/lib/actions/billing";
import { PLAN_KEYS, type PlanKey } from "@/lib/plans";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function isPlanKey(value: string | undefined): value is PlanKey {
  return !!value && (PLAN_KEYS as readonly string[]).includes(value);
}

// createCheckoutSession redirects internally by throwing a NEXT_REDIRECT
// error — that throw must propagate for Next's router to act on it, so it
// can't be swallowed by the catch block below. Only genuine failures (e.g.
// no Stripe price configured) should be treated as errors here.
function isNextRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function CreateWorkspaceForm({ plan }: { plan?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  // Once the workspace exists but checkout hasn't succeeded yet, re-running
  // create_workspace would fail ("User already belongs to a workspace") — so
  // instead of re-showing the workspace-name form, we switch to a retry-only
  // view that just re-attempts checkout for the same workspace.
  const [awaitingCheckout, setAwaitingCheckout] = useState(false);

  async function attemptCheckout(planKey: PlanKey) {
    try {
      await createCheckoutSession(planKey);
    } catch (checkoutError) {
      if (isNextRedirectError(checkoutError)) throw checkoutError;

      setPending(false);
      setAwaitingCheckout(true);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Couldn't start checkout. Please try again, or contact support if this keeps happening."
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.rpc("create_workspace", { workspace_name: name });

    if (error) {
      setPending(false);
      setError(error.message);
      return;
    }

    if (isPlanKey(plan)) {
      await attemptCheckout(plan);
      return;
    }

    setPending(false);
    router.push("/dashboard");
    router.refresh();
  }

  async function handleRetry() {
    if (!isPlanKey(plan)) return;
    setError(null);
    setPending(true);
    await attemptCheckout(plan);
  }

  if (awaitingCheckout) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm">
          Your workspace is set up, but we couldn&apos;t start checkout for your
          subscription, so it isn&apos;t active yet.
        </p>
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
        <Button type="button" disabled={pending} onClick={handleRetry} className="w-full">
          {pending ? "Starting checkout..." : "Retry Checkout"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Workspace Name" htmlFor="workspace-name">
        <Input
          id="workspace-name"
          required
          placeholder="e.g. Acme Goods Co."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      {error && <p className="font-mono text-xs text-rust">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating..." : "Create Workspace"}
      </Button>
    </form>
  );
}
