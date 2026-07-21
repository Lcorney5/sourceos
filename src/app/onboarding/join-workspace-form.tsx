"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function JoinWorkspaceForm() {
  const router = useRouter();
  const [workspaceId, setWorkspaceId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error } = await supabase.rpc("join_workspace_by_id", {
      target_workspace_id: workspaceId.trim(),
    });

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
      <Field label="Workspace ID" htmlFor="workspace-id">
        <Input
          id="workspace-id"
          required
          placeholder="Paste the ID your teammate shared"
          value={workspaceId}
          onChange={(e) => setWorkspaceId(e.target.value)}
        />
      </Field>
      {error && <p className="font-mono text-xs text-rust">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Joining..." : "Join Team"}
      </Button>
    </form>
  );
}
