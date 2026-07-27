"use client";

import { useTransition } from "react";
import { deleteSample } from "@/lib/actions/samples";

export function DeleteSampleButton({ sampleId }: { sampleId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this sample?")) startTransition(() => deleteSample(sampleId));
      }}
      className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline disabled:opacity-40"
    >
      Delete
    </button>
  );
}
