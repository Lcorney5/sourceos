"use client";

import { useTransition } from "react";
import { deleteDocument } from "@/lib/actions/documents";

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this document?")) startTransition(() => deleteDocument(documentId));
      }}
      className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline disabled:opacity-40"
    >
      Delete
    </button>
  );
}
