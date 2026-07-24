"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { normalizePhoneNumber } from "@/lib/phone";

export function PhoneAuthForm({ redirectTo = "/onboarding" }: { redirectTo?: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizePhoneNumber(phone),
    });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setStep("code");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone: normalizePhoneNumber(phone),
      token: code,
      type: "sms",
    });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  if (step === "code") {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
        <Field label="Verification Code" htmlFor="otp">
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Field>
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Verifying..." : "Verify Code"}
        </Button>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setCode("");
            setError(null);
          }}
          className="font-mono text-xs text-muted underline hover:text-rust"
        >
          Use a different number
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="flex flex-col gap-4">
      <Field label="Phone Number" htmlFor="phone">
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          required
          placeholder="+1 555 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>
      {error && <p className="font-mono text-xs text-rust">{error}</p>}
      <Button type="submit" variant="secondary" disabled={pending} className="w-full">
        {pending ? "Sending code..." : "Continue with Phone"}
      </Button>
    </form>
  );
}
