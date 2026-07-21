import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { StampBadge } from "@/components/ui/stamp-badge";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import Link from "next/link";

export default async function SuppliersPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("name");

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Suppliers"
        actions={<LinkButton href="/dashboard/suppliers/new">+ Add Supplier</LinkButton>}
      />
      {!suppliers?.length ? (
        <EmptyState
          message="No suppliers yet."
          action={<LinkButton href="/dashboard/suppliers/new">Add your first supplier</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Location</Th>
              <Th>MOQ</Th>
              <Th>Lead Time</Th>
              <Th>Contact</Th>
              <Th>WhatsApp</Th>
            </tr>
          </Thead>
          <tbody>
            {suppliers.map((supplier) => (
              <Tr key={supplier.id}>
                <Td className="font-semibold">
                  <Link href={`/dashboard/suppliers/${supplier.id}`} className="hover:text-rust">
                    {supplier.name}
                  </Link>
                </Td>
                <Td>{supplier.location ?? "—"}</Td>
                <Td className="font-mono">{supplier.moq ?? "—"}</Td>
                <Td className="font-mono">
                  {supplier.lead_time_days ? `${supplier.lead_time_days}d` : "—"}
                </Td>
                <Td>{supplier.contact_email ?? supplier.contact_phone ?? "—"}</Td>
                <Td>
                  {supplier.whatsapp_connected ? (
                    <StampBadge tone="steel">Connected</StampBadge>
                  ) : (
                    <span className="font-mono text-xs text-muted">—</span>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
