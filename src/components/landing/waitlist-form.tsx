"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/lib/actions/waitlist";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const initialState: WaitlistState = { status: "idle" };

export function WaitlistForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);

  if (state.status === "success") {
    return (
      <p className={`stamp text-steel border-steel ${className ?? ""}`}>{state.message}</p>
    );
  }

  return (
    <form action={formAction} className={`flex flex-col gap-2 sm:flex-row ${className ?? ""}`}>
      <Input
        type="email"
        name="email"
        required
        placeholder="you@yourbrand.com"
        className="sm:w-72"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Joining..." : "Join Waitlist"}
      </Button>
      {state.status === "error" && (
        <p className="font-mono text-xs text-rust sm:self-center">{state.message}</p>
      )}
    </form>
  );
}
