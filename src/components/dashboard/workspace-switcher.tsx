"use client";

import { useState } from "react";
import { StampBadge } from "@/components/ui/stamp-badge";
import { switchActiveWorkspace, createClientWorkspace } from "@/lib/actions/workspace";

type WorkspaceOption = {
  id: string;
  name: string;
  plan: string;
  isHome: boolean;
};

export function WorkspaceSwitcher({
  activeWorkspaceId,
  activeName,
  activePlan,
  workspaces,
  canAddClient,
}: {
  activeWorkspaceId: string;
  activeName: string;
  activePlan: string;
  workspaces: WorkspaceOption[];
  canAddClient: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [addingClient, setAddingClient] = useState(false);

  const canSwitch = workspaces.length > 1 || canAddClient;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => canSwitch && setOpen((o) => !o)}
        className="flex w-full flex-col items-start text-left"
      >
        <p className="mt-1 truncate font-mono text-xs uppercase tracking-wide text-muted">
          {activeName} {canSwitch && <span className="text-ink">▾</span>}
        </p>
        <StampBadge tone="steel" className="mt-2">
          {activePlan}
        </StampBadge>
      </button>

      {open && canSwitch && (
        <div className="absolute left-0 top-full z-10 mt-2 w-64 border border-ink bg-paper-card shadow-md">
          <ul className="flex flex-col divide-y divide-ink/20">
            {workspaces.map((ws) => (
              <li key={ws.id}>
                <form action={switchActiveWorkspace.bind(null, ws.id)}>
                  <button
                    type="submit"
                    disabled={ws.id === activeWorkspaceId}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left font-mono text-xs uppercase tracking-wider hover:bg-paper ${
                      ws.id === activeWorkspaceId ? "bg-ink text-paper" : "text-ink"
                    }`}
                  >
                    <span className="truncate">{ws.name}</span>
                    {ws.isHome && <span className="ml-2 shrink-0 text-[0.6rem] opacity-70">Home</span>}
                  </button>
                </form>
              </li>
            ))}
          </ul>

          {canAddClient && (
            <div className="border-t border-ink p-2">
              {addingClient ? (
                <form
                  action={createClientWorkspace}
                  className="flex flex-col gap-2"
                >
                  <input
                    name="name"
                    required
                    autoFocus
                    placeholder="Client workspace name"
                    className="w-full border border-ink bg-paper px-2 py-1 font-mono text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full border border-ink px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink hover:text-paper"
                  >
                    Create
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingClient(true)}
                  className="w-full px-1 py-1 text-left font-mono text-xs font-semibold uppercase tracking-wider text-rust hover:underline"
                >
                  + Add Client Workspace
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
