import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/supabase/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required defaultValue={product?.name} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="SKU" htmlFor="sku">
          <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
        </Field>
        <Field label="Category" htmlFor="category">
          <Input id="category" name="category" defaultValue={product?.category ?? ""} />
        </Field>
      </div>
      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={4} defaultValue={product?.notes ?? ""} />
      </Field>
      <Button type="submit" className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
