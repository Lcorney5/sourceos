"use client";

import { useTransition } from "react";
import { deleteSupplier } from "@/lib/actions/suppliers";

export function DeleteSupplierButton({ supplierId, name }: { supplierId: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete ${name}? This also removes its quotes, samples, and purchase orders.`)) {
          startTransition(() => deleteSupplier(supplierId));
        }
      }}
      className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline disabled:opacity-40"
    >
      Delete
    </button>
  );
}
