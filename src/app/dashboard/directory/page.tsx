import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";

export default async function DirectoryPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("name");

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Directory"
        actions={<LinkButton href="/dashboard/directory/new">+ Add Contact</LinkButton>}
      />
      {!contacts?.length ? (
        <EmptyState
          message="No contacts yet — freight forwarders, agents, inspectors, etc."
          action={<LinkButton href="/dashboard/directory/new">Add your first contact</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Company</Th>
              <Th>Role</Th>
              <Th>Contact</Th>
            </tr>
          </Thead>
          <tbody>
            {contacts.map((contact) => (
              <Tr key={contact.id}>
                <Td className="font-semibold">
                  <Link href={`/dashboard/directory/${contact.id}`} className="hover:text-rust">
                    {contact.name}
                  </Link>
                </Td>
                <Td>{contact.company ?? "—"}</Td>
                <Td>{contact.role ?? "—"}</Td>
                <Td>
                  {contact.email || contact.phone ? (
                    <div className="flex flex-col">
                      {contact.email && <span>{contact.email}</span>}
                      {contact.phone && <span className="text-muted">{contact.phone}</span>}
                    </div>
                  ) : (
                    "—"
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
