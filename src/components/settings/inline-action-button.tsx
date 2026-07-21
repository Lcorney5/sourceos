"use client";

import { useTransition } from "react";

export function InlineActionButton({
  action,
  confirmMessage,
  label,
}: {
  action: () => void;
  confirmMessage?: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirmMessage && !confirm(confirmMessage)) return;
        startTransition(() => action());
      }}
      className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline disabled:opacity-40"
    >
      {label}
    </button>
  );
}
