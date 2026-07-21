"use client";

import { useState } from "react";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { JoinWorkspaceForm } from "./join-workspace-form";

export function OnboardingChoice() {
  const [mode, setMode] = useState<"create" | "join">("create");

  return (
    <div>
      {mode === "create" ? <CreateWorkspaceForm /> : <JoinWorkspaceForm />}
      <button
        type="button"
        onClick={() => setMode(mode === "create" ? "join" : "create")}
        className="mt-4 font-mono text-xs text-muted hover:text-rust hover:underline"
      >
        {mode === "create"
          ? "Have a workspace ID? Join a team instead"
          : "Starting fresh? Create a new workspace instead"}
      </button>
    </div>
  );
}
