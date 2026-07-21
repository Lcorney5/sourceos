import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { StampBadge } from "@/components/ui/stamp-badge";

export default async function SettingsPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name, whatsapp_connected, whatsapp_number")
    .eq("workspace_id", workspace.id)
    .order("name");

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Settings" />
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Connections</CardTitle>
        </CardHeader>
        <CardBody>
          {!suppliers?.length ? (
            <p className="font-mono text-xs text-muted">No suppliers yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/20">
              {suppliers.map((supplier) => (
                <li key={supplier.id} className="flex items-center justify-between py-2">
                  <Link
                    href={`/dashboard/suppliers/${supplier.id}`}
                    className="text-sm text-ink hover:text-rust"
                  >
                    {supplier.name}
                  </Link>
                  {supplier.whatsapp_connected ? (
                    <StampBadge tone="steel">{supplier.whatsapp_number}</StampBadge>
                  ) : (
                    <span className="font-mono text-xs text-muted">Not connected</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
