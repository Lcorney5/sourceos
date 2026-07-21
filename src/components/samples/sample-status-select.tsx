"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/form";
import { setSampleStatus } from "@/lib/actions/samples";
import type { SampleStatus } from "@/lib/supabase/database.types";

export function SampleStatusSelect({ sampleId, status }: { sampleId: string; status: SampleStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      className="py-1"
      onChange={(e) =>
        startTransition(() => {
          setSampleStatus(sampleId, e.target.value as SampleStatus);
        })
      }
    >
      <option value="requested">Requested</option>
      <option value="in_transit">In Transit</option>
      <option value="received">Received</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
    </Select>
  );
}
