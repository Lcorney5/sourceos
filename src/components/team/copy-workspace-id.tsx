"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyWorkspaceId({ workspaceId }: { workspaceId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(workspaceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between gap-4 border border-ink bg-paper p-4">
      <div>
        <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
          Workspace ID
        </p>
        <p className="font-mono text-sm text-ink">{workspaceId}</p>
        <p className="mt-1 font-mono text-xs text-muted">
          Share this ID with invited teammates so they can join via &quot;Join Team&quot;.
        </p>
      </div>
      <Button type="button" variant="secondary" onClick={handleCopy}>
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
