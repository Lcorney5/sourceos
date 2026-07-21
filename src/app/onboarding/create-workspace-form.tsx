"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function CreateWorkspaceForm() {
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

    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

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
