import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createQuote } from "@/lib/actions/quotes";
import { EmptyState } from "@/components/ui/table";
import { LinkButton } from "@/components/ui/button";

export default async function NewQuotePage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("workspace_id", workspace.id)
    .order("name");

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Log Quote" />
      {!suppliers?.length ? (
        <EmptyState
          message="Add a supplier before logging a quote."
          action={<LinkButton href="/dashboard/suppliers/new">Add Supplier</LinkButton>}
        />
      ) : (
        <form action={createQuote} className="flex max-w-xl flex-col gap-4">
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="Unit Price" htmlFor="unit_price">
              <Input id="unit_price" name="unit_price" type="number" min={0} step="0.01" required />
            </Field>
            <Field label="Currency" htmlFor="currency">
              <Select id="currency" name="currency" defaultValue="USD">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CNY">CNY</option>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="MOQ" htmlFor="moq">
              <Input id="moq" name="moq" type="number" min={0} />
            </Field>
            <Field label="Lead Time (days)" htmlFor="lead_time_days">
              <Input id="lead_time_days" name="lead_time_days" type="number" min={0} />
            </Field>
          </div>
          <Field label="Date Received" htmlFor="date_received">
            <Input
              id="date_received"
              name="date_received"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </Field>
          <Field label="Notes" htmlFor="notes">
            <Textarea id="notes" name="notes" rows={3} />
          </Field>
          <Button type="submit" className="self-start">
            Save Quote
          </Button>
        </form>
      )}
    </div>
  );
}
