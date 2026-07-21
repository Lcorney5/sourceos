import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/database.types";

type Contact = Database["public"]["Tables"]["contacts"]["Row"];

export function ContactForm({
  action,
  contact,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  contact?: Contact;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required defaultValue={contact?.name} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Company" htmlFor="company">
          <Input id="company" name="company" defaultValue={contact?.company ?? ""} />
        </Field>
        <Field label="Role" htmlFor="role">
          <Input
            id="role"
            name="role"
            placeholder="Freight Forwarder, Agent, Inspector..."
            defaultValue={contact?.role ?? ""}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" defaultValue={contact?.email ?? ""} />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" defaultValue={contact?.phone ?? ""} />
        </Field>
      </div>
      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={4} defaultValue={contact?.notes ?? ""} />
      </Field>
      <Button type="submit" className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
