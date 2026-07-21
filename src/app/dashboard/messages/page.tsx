import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { LinkButton } from "@/components/ui/button";
import { WhatsappThread } from "@/components/suppliers/whatsapp-thread";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ supplier?: string }>;
}) {
  const { supplier: selectedSupplierId } = await searchParams;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const [{ data: suppliers }, { data: allMessages }] = await Promise.all([
    supabase
      .from("suppliers")
      .select("id, name, whatsapp_connected")
      .eq("workspace_id", workspace.id)
      .eq("whatsapp_connected", true)
      .order("name"),
    supabase
      .from("whatsapp_messages")
      .select("supplier_id, body, timestamp")
      .eq("workspace_id", workspace.id)
      .order("timestamp", { ascending: false }),
  ]);

  const latestBySupplier = new Map<string, { body: string; timestamp: string }>();
  for (const msg of allMessages ?? []) {
    if (!latestBySupplier.has(msg.supplier_id)) {
      latestBySupplier.set(msg.supplier_id, msg);
    }
  }

  const conversations = (suppliers ?? [])
    .map((s) => ({ ...s, latest: latestBySupplier.get(s.id) }))
    .sort((a, b) => {
      if (!a.latest && !b.latest) return a.name.localeCompare(b.name);
      if (!a.latest) return 1;
      if (!b.latest) return -1;
      return b.latest.timestamp.localeCompare(a.latest.timestamp);
    });

  const selectedSupplier = selectedSupplierId
    ? conversations.find((c) => c.id === selectedSupplierId)
    : conversations[0];

  const { data: threadMessages } = selectedSupplier
    ? await supabase
        .from("whatsapp_messages")
        .select("*")
        .eq("supplier_id", selectedSupplier.id)
        .order("timestamp", { ascending: true })
    : { data: [] };

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Messages" />
      {!conversations.length ? (
        <EmptyState
          message="No suppliers have WhatsApp connected yet."
          action={<LinkButton href="/dashboard/suppliers">Go to Suppliers</LinkButton>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 border border-ink md:grid-cols-[16rem_1fr]">
          <div className="flex flex-col divide-y divide-ink/20 border-b border-ink md:border-b-0 md:border-r">
            {conversations.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/messages?supplier=${c.id}`}
                className={`p-3 hover:bg-ink/5 ${selectedSupplier?.id === c.id ? "bg-ink/5" : ""}`}
              >
                <p className="truncate text-sm font-semibold text-ink">{c.name}</p>
                <p className="truncate font-mono text-[0.6875rem] text-muted">
                  {c.latest?.body ?? "No messages yet"}
                </p>
              </Link>
            ))}
          </div>
          <div className="p-4">
            {selectedSupplier ? (
              <>
                <p className="mb-3 font-display text-lg font-bold uppercase tracking-tight">
                  {selectedSupplier.name}
                </p>
                <WhatsappThread
                  supplierId={selectedSupplier.id}
                  connected={selectedSupplier.whatsapp_connected}
                  messages={threadMessages ?? []}
                />
              </>
            ) : (
              <p className="font-mono text-xs text-muted">Select a conversation.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
