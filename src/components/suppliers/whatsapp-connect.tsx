"use client";

import { useState, useTransition } from "react";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StampBadge } from "@/components/ui/stamp-badge";
import { setWhatsappConnection } from "@/lib/actions/suppliers";

export function WhatsappConnect({
  supplierId,
  whatsappNumber,
  connected,
}: {
  supplierId: string;
  whatsappNumber: string | null;
  connected: boolean;
}) {
  const [number, setNumber] = useState(whatsappNumber ?? "");
  const [showConsent, setShowConsent] = useState(false);
  const [pending, startTransition] = useTransition();

  if (connected) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <StampBadge tone="steel">Connected</StampBadge>
          <p className="mt-2 font-mono text-xs text-muted">{whatsappNumber}</p>
        </div>
        <Button
          type="button"
          variant="danger"
          disabled={pending}
          onClick={() =>
            startTransition(() => {
              setWhatsappConnection(supplierId, "", false);
            })
          }
        >
          Disconnect
        </Button>
      </div>
    );
  }

  if (showConsent) {
    return (
      <div className="border border-amber p-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-amber">
          Consent Required
        </p>
        <p className="mb-4 text-sm text-ink">
          Connecting <strong>{number}</strong> will sync all future WhatsApp messages with this
          number into SourceOS, including messages sent by the supplier. No existing chat history
          is imported automatically. Only proceed if you have a lawful basis to store this
          supplier&apos;s messages.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(() => {
                setWhatsappConnection(supplierId, number, true);
                setShowConsent(false);
              })
            }
          >
            Confirm & Connect
          </Button>
          <Button type="button" variant="secondary" onClick={() => setShowConsent(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Field label="WhatsApp Number" htmlFor="whatsapp_number">
        <Input
          id="whatsapp_number"
          placeholder="+1 555 123 4567"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </Field>
      <Button type="button" disabled={!number.trim()} onClick={() => setShowConsent(true)} className="self-start">
        Connect WhatsApp
      </Button>
      <p className="font-mono text-xs text-muted">
        Requires WhatsApp Business API approval. Until then, log conversations manually below.
      </p>
    </div>
  );
}
