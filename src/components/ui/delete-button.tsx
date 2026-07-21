"use client";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  confirmMessage,
  label = "Delete",
}: {
  action: () => void;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="danger">
        {label}
      </Button>
    </form>
  );
}
