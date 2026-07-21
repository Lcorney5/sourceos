import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button, LinkButton } from "@/components/ui/button";
import { createPurchaseOrder } from "@/lib/actions/purchase-orders";
import { EmptyState } from "@/components/ui/table";
import { ProductNameDatalist } from "@/components/products/product-name-datalist";

export default async function NewPurchaseOrderPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const [{ data: suppliers }, { data: products }] = await Promise.all([
    supabase.from("suppliers").select("id, name").eq("workspace_id", workspace.id).order("name"),
    supabase.from("products").select("name").eq("workspace_id", workspace.id).order("name"),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="New Purchase Order" />
      {!suppliers?.length ? (
        <EmptyState
          message="Add a supplier before creating a purchase order."
          action={<LinkButton href="/dashboard/suppliers/new">Add Supplier</LinkButton>}
        />
      ) : (
        <form action={createPurchaseOrder} className="flex max-w-xl flex-col gap-4">
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
            <Input id="product_name" name="product_name" list="product-names" required />
            <ProductNameDatalist products={products ?? []} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Total Amount" htmlFor="total_amount">
              <Input id="total_amount" name="total_amount" type="number" min={0} step="0.01" required />
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
          <div className="border border-ink/30 p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              Deposit
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Deposit Amount" htmlFor="deposit_amount">
                <Input id="deposit_amount" name="deposit_amount" type="number" min={0} step="0.01" defaultValue={0} />
              </Field>
              <Field label="Deposit Due Date" htmlFor="deposit_due_date">
                <Input id="deposit_due_date" name="deposit_due_date" type="date" />
              </Field>
            </div>
          </div>
          <div className="border border-ink/30 p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">
              Balance
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Balance Amount" htmlFor="balance_amount">
                <Input id="balance_amount" name="balance_amount" type="number" min={0} step="0.01" defaultValue={0} />
              </Field>
              <Field label="Balance Due Date" htmlFor="balance_due_date">
                <Input id="balance_due_date" name="balance_due_date" type="date" />
              </Field>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Order Date" htmlFor="order_date">
              <Input id="order_date" name="order_date" type="date" defaultValue={today} />
            </Field>
            <Field label="Target Delivery" htmlFor="target_delivery_date">
              <Input id="target_delivery_date" name="target_delivery_date" type="date" />
            </Field>
          </div>
          <Button type="submit" className="self-start">
            Create Purchase Order
          </Button>
        </form>
      )}
    </div>
  );
}
