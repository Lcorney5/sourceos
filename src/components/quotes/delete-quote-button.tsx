"use client";

import { useTransition } from "react";
import { deleteQuote } from "@/lib/actions/quotes";

export function DeleteQuoteButton({ quoteId }: { quoteId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this quote?")) startTransition(() => deleteQuote(quoteId));
      }}
      className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline disabled:opacity-40"
    >
      Delete
    </button>
  );
}
