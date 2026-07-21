"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendWhatsappMessage } from "@/lib/actions/whatsapp";
import { Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/database.types";

type WhatsappMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

export function WhatsappThread({
  supplierId,
  connected,
  messages,
}: {
  supplierId: string;
  connected: boolean;
  messages: WhatsappMessage[];
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.set("body", body);

    try {
      await sendWhatsappMessage(supplierId, formData);
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      {messages.length === 0 ? (
        <p className="mb-4 font-mono text-xs text-muted">No WhatsApp messages yet.</p>
      ) : (
        <div className="mb-4 flex max-h-80 flex-col gap-2 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[80%] border px-3 py-2 text-sm ${
                msg.direction === "outbound"
                  ? "self-end border-rust bg-rust/5 text-ink"
                  : "self-start border-steel bg-steel/5 text-ink"
              }`}
            >
              <p>{msg.body}</p>
              <p className="mt-1 font-mono text-[0.625rem] text-muted">
                {new Date(msg.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {connected ? (
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          <Textarea
            rows={2}
            placeholder="Reply via WhatsApp..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          {error && <p className="font-mono text-xs text-rust">{error}</p>}
          <Button type="submit" variant="secondary" disabled={pending} className="self-start">
            {pending ? "Sending..." : "Send"}
          </Button>
        </form>
      ) : (
        <p className="font-mono text-xs text-muted">
          Connect WhatsApp above to send and receive messages here.
        </p>
      )}
    </div>
  );
}
