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
      try {
        await createCheckoutSession(plan);
      } catch (checkoutError) {
        if (isNextRedirectError(checkoutError)) throw checkoutError;

        setPending(false);
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : "Couldn't start checkout — you can pick a plan from Billing instead."
        );
        router.push("/dashboard");
        router.refresh();
      }
      return;
    }

    setPending(false);
    router.push("/dashboard");
    router.refresh();
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
