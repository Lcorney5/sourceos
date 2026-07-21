"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { requestNextRevision } from "@/lib/actions/samples";

export function RequestRevisionButton({ sampleId }: { sampleId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      onClick={() => startTransition(() => requestNextRevision(sampleId))}
    >
      Request Next Revision
    </Button>
  );
}
