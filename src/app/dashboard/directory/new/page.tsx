import { PageHeader } from "@/components/ui/card";
import { ContactForm } from "@/components/contacts/contact-form";
import { createContact } from "@/lib/actions/contacts";

export default function NewContactPage() {
  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Add Contact" />
      <ContactForm action={createContact} submitLabel="Create Contact" />
    </div>
  );
}
