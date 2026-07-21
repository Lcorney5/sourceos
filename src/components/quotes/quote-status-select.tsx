"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/form";
import { setQuoteStatus } from "@/lib/actions/quotes";
import type { QuoteStatus } from "@/lib/supabase/database.types";

export function QuoteStatusSelect({ quoteId, status }: { quoteId: string; status: QuoteStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={pending}
      className="py-1"
      onChange={(e) =>
        startTransition(() => {
          setQuoteStatus(quoteId, e.target.value as QuoteStatus);
        })
      }
    >
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </Select>
  );
}
