"use client";

import { useActionState } from "react";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/database.types";

type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];

type FormState = { status: "idle" | "success" | "error"; error: string | null };

// createSupplier redirects on success by throwing a NEXT_REDIRECT error, which
// must propagate for Next's router to act on it rather than being reported as
// a failure here (same pattern as the onboarding checkout flow).
function isNextRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest?: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export function SupplierForm({
  action,
  supplier,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  supplier?: Supplier;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_prevState, formData) => {
      try {
        await action(formData);
        return { status: "success", error: null };
      } catch (err) {
        if (isNextRedirectError(err)) throw err;
        return {
          status: "error",
          error: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        };
      }
    },
    { status: "idle", error: null }
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-xl">
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required defaultValue={supplier?.name} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location" htmlFor="location">
          <Input id="location" name="location" defaultValue={supplier?.location ?? ""} />
        </Field>
        <Field label="MOQ" htmlFor="moq">
          <Input id="moq" name="moq" type="number" min={0} defaultValue={supplier?.moq ?? ""} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Lead Time (days)" htmlFor="lead_time_days">
          <Input
            id="lead_time_days"
            name="lead_time_days"
            type="number"
            min={0}
            defaultValue={supplier?.lead_time_days ?? ""}
          />
        </Field>
        <Field label="Contact Email" htmlFor="contact_email">
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={supplier?.contact_email ?? ""}
          />
        </Field>
      </div>
      <Field label="Contact Phone" htmlFor="contact_phone">
        <Input id="contact_phone" name="contact_phone" defaultValue={supplier?.contact_phone ?? ""} />
      </Field>
      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={4} defaultValue={supplier?.notes ?? ""} />
      </Field>
      {state.status === "error" && (
        <p className="font-mono text-xs text-rust">{state.error}</p>
      )}
      {state.status === "success" && (
        <p className="font-mono text-xs text-steel">Saved.</p>
      )}
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
