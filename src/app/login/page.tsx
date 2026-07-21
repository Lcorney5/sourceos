"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/auth-card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(searchParams.get("redirect") || "/onboarding");
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <AuthCard
      title="Log In"
      subtitle="SourceOS Access"
      footer={
        <>
          No account?{" "}
          <Link href="/signup" className="text-rust underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Logging in..." : "Log In"}
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
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
