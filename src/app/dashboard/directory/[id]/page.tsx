import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contacts/contact-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { updateContact, deleteContact } from "@/lib/actions/contacts";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: contact } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!contact) notFound();

  const updateWithId = updateContact.bind(null, contact.id);
  const deleteWithId = deleteContact.bind(null, contact.id);

  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title={contact.name}
        actions={<DeleteButton action={deleteWithId} confirmMessage={`Delete ${contact.name}?`} />}
      />
      <ContactForm action={updateWithId} contact={contact} submitLabel="Save Changes" />
    </div>
  );
}
