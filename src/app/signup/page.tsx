"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      // Email confirmation is required before a session exists.
      setConfirmationSent(true);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  if (confirmationSent) {
    return (
      <AuthCard title="Check Your Inbox" subtitle="SourceOS Access" footer={null}>
        <p className="font-body text-sm text-ink">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your
          account.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Sign Up"
      subtitle="SourceOS Access"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-rust underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" htmlFor="name">
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
      <div className="my-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-ink/30" />
        <span className="font-mono text-[0.6875rem] uppercase text-muted">or</span>
        <div className="h-px flex-1 bg-ink/30" />
      </div>
      <Button type="button" variant="secondary" onClick={handleGoogle} className="w-full">
        Continue with Google
      </Button>
      <p className="mt-4 text-center font-mono text-[0.6875rem] text-muted">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-rust underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-rust underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthCard>
  );
}
