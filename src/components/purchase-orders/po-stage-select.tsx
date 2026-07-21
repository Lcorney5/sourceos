"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/form";
import { setPurchaseOrderStage } from "@/lib/actions/purchase-orders";
import { PO_STAGES } from "@/lib/purchase-orders";
import type { POStage } from "@/lib/supabase/database.types";

export function POStageSelect({ poId, stage }: { poId: string; stage: POStage }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={stage}
      disabled={pending}
      className="py-1"
      onChange={(e) =>
        startTransition(() => {
          setPurchaseOrderStage(poId, e.target.value as POStage);
        })
      }
    >
      {PO_STAGES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </Select>
  );
}
