import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/database.types";

type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];

export function SupplierForm({
  action,
  supplier,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  supplier?: Supplier;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-xl">
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required defaultValue={supplier?.name} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location" htmlFor="location">
          <Input id="location" name="location" defaultValue={supplier?.location ?? ""} />
        </Field>
        <Field label="MOQ" htmlFor="moq">
          <Input id="moq" name="moq" type="number" min={0} defaultValue={supplier?.moq ?? ""} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Lead Time (days)" htmlFor="lead_time_days">
          <Input
            id="lead_time_days"
            name="lead_time_days"
            type="number"
            min={0}
            defaultValue={supplier?.lead_time_days ?? ""}
          />
        </Field>
        <Field label="Contact Email" htmlFor="contact_email">
          <Input
            id="contact_email"
            name="contact_email"
            type="email"
            defaultValue={supplier?.contact_email ?? ""}
          />
        </Field>
      </div>
      <Field label="Contact Phone" htmlFor="contact_phone">
        <Input id="contact_phone" name="contact_phone" defaultValue={supplier?.contact_phone ?? ""} />
      </Field>
      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={4} defaultValue={supplier?.notes ?? ""} />
      </Field>
      <Button type="submit" className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
