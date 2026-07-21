import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { POStageBadge, OverdueBadge } from "@/components/ui/stamp-badge";
import { StageProgressBar } from "@/components/purchase-orders/stage-progress-bar";
import { PO_STAGES, isPurchaseOrderOverdue } from "@/lib/purchase-orders";
import { updatePurchaseOrder, deletePurchaseOrder } from "@/lib/actions/purchase-orders";
import { DocumentsSection } from "@/components/documents/documents-section";
import { withSignedUrls } from "@/lib/documents";
import { ProductionLog } from "@/components/purchase-orders/production-log";

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: po } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!po) notFound();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("purchase_order_id", po.id)
    .order("created_at", { ascending: false });
  const documentsWithUrls = await withSignedUrls(supabase, documents ?? []);

  const { data: productionLogEntries } = await supabase
    .from("production_logs")
    .select("*")
    .eq("purchase_order_id", po.id)
    .order("created_at", { ascending: false });

  const updateWithId = updatePurchaseOrder.bind(null, po.id);
  const deleteWithId = deletePurchaseOrder.bind(null, po.id);
  const overdue = isPurchaseOrderOverdue(po);

  return (
    <div>
      <PageHeader
        eyebrow={po.suppliers?.name ?? "Supplier"}
        title={po.product_name}
        actions={
          <div className="flex items-center gap-2">
            <POStageBadge stage={po.stage} />
            {overdue && <OverdueBadge />}
            <DeleteButton
              action={deleteWithId}
              confirmMessage={`Delete purchase order for ${po.product_name}?`}
            />
          </div>
        }
      />

      <div className="mb-6">
        <StageProgressBar stage={po.stage} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardBody>
          <form action={updateWithId} className="flex flex-col gap-4">
            <Field label="Product Name" htmlFor="product_name">
              <Input id="product_name" name="product_name" required defaultValue={po.product_name} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Total Amount" htmlFor="total_amount">
                <Input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  min={0}
                  step="0.01"
                  defaultValue={po.total_amount}
                />
              </Field>
              <Field label="Currency" htmlFor="currency">
                <Select id="currency" name="currency" defaultValue={po.currency}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CNY">CNY</option>
                </Select>
              </Field>
              <Field label="Stage" htmlFor="stage">
                <Select id="stage" name="stage" defaultValue={po.stage}>
                  {PO_STAGES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="border border-ink/30 p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Deposit</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Deposit Amount" htmlFor="deposit_amount">
                  <Input
                    id="deposit_amount"
                    name="deposit_amount"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={po.deposit_amount}
                  />
                </Field>
                <Field label="Deposit Due Date" htmlFor="deposit_due_date">
                  <Input
                    id="deposit_due_date"
                    name="deposit_due_date"
                    type="date"
                    defaultValue={po.deposit_due_date ?? ""}
                  />
                </Field>
              </div>
              <label className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
                <input type="checkbox" name="deposit_paid" defaultChecked={po.deposit_paid} />
                Deposit Paid
              </label>
            </div>

            <div className="border border-ink/30 p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Balance</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Balance Amount" htmlFor="balance_amount">
                  <Input
                    id="balance_amount"
                    name="balance_amount"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={po.balance_amount}
                  />
                </Field>
                <Field label="Balance Due Date" htmlFor="balance_due_date">
                  <Input
                    id="balance_due_date"
                    name="balance_due_date"
                    type="date"
                    defaultValue={po.balance_due_date ?? ""}
                  />
                </Field>
              </div>
              <label className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider">
                <input type="checkbox" name="balance_paid" defaultChecked={po.balance_paid} />
                Balance Paid
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Order Date" htmlFor="order_date">
                <Input id="order_date" name="order_date" type="date" defaultValue={po.order_date} />
              </Field>
              <Field label="Target Delivery" htmlFor="target_delivery_date">
                <Input
                  id="target_delivery_date"
                  name="target_delivery_date"
                  type="date"
                  defaultValue={po.target_delivery_date ?? ""}
                />
              </Field>
            </div>

            <Button type="submit" className="self-start">
              Save Changes
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production Log</CardTitle>
          </CardHeader>
          <CardBody>
            <ProductionLog purchaseOrderId={po.id} entries={productionLogEntries ?? []} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardBody>
            <DocumentsSection documents={documentsWithUrls} purchaseOrderId={po.id} />
          </CardBody>
        </Card>
      </div>
      </div>
    </div>
  );
}
