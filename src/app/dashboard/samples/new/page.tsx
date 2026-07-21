import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button, LinkButton } from "@/components/ui/button";
import { createSample } from "@/lib/actions/samples";
import { EmptyState } from "@/components/ui/table";

export default async function NewSamplePage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("workspace_id", workspace.id)
    .order("name");

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Request Sample" />
      {!suppliers?.length ? (
        <EmptyState
          message="Add a supplier before requesting a sample."
          action={<LinkButton href="/dashboard/suppliers/new">Add Supplier</LinkButton>}
        />
      ) : (
        <form action={createSample} className="flex max-w-xl flex-col gap-4">
          <Field label="Supplier" htmlFor="supplier_id">
            <Select id="supplier_id" name="supplier_id" required defaultValue="">
              <option value="" disabled>
                Select a supplier
              </option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Product Name" htmlFor="product_name">
            <Input id="product_name" name="product_name" required />
          </Field>
          <Field label="Revision" htmlFor="revision">
            <Input id="revision" name="revision" type="number" min={1} defaultValue={1} />
          </Field>
          <Field label="Photo URLs (one per line)" htmlFor="photo_urls">
            <Textarea id="photo_urls" name="photo_urls" rows={3} />
          </Field>
          <Field label="Notes" htmlFor="notes">
            <Textarea id="notes" name="notes" rows={3} />
          </Field>
          <Button type="submit" className="self-start">
            Save Sample
          </Button>
        </form>
      )}
    </div>
  );
}
