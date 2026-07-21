import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { WhatsappConnect } from "@/components/suppliers/whatsapp-connect";
import { DeleteButton } from "@/components/ui/delete-button";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  updateSupplier,
  deleteSupplier,
  addCommunicationLogEntry,
} from "@/lib/actions/suppliers";
import { DocumentsSection } from "@/components/documents/documents-section";
import { withSignedUrls } from "@/lib/documents";
import { WhatsappThread } from "@/components/suppliers/whatsapp-thread";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!supplier) notFound();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("supplier_id", supplier.id)
    .order("created_at", { ascending: false });
  const documentsWithUrls = await withSignedUrls(supabase, documents ?? []);

  const { data: whatsappMessages } = await supabase
    .from("whatsapp_messages")
    .select("*")
    .eq("supplier_id", supplier.id)
    .order("timestamp", { ascending: true });

  const updateSupplierWithId = updateSupplier.bind(null, supplier.id);
  const deleteSupplierWithId = deleteSupplier.bind(null, supplier.id);
  const addLogEntry = addCommunicationLogEntry.bind(null, supplier.id);

  return (
    <div>
      <PageHeader
        eyebrow="Supplier"
        title={supplier.name}
        actions={
          <DeleteButton
            action={deleteSupplierWithId}
            confirmMessage={`Delete ${supplier.name}? This also removes its quotes, samples, and purchase orders.`}
          />
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardBody>
            <SupplierForm action={updateSupplierWithId} supplier={supplier} submitLabel="Save Changes" />
          </CardBody>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp</CardTitle>
            </CardHeader>
            <CardBody>
              <WhatsappConnect
                supplierId={supplier.id}
                whatsappNumber={supplier.whatsapp_number}
                connected={supplier.whatsapp_connected}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Messages</CardTitle>
            </CardHeader>
            <CardBody>
              <WhatsappThread
                supplierId={supplier.id}
                connected={supplier.whatsapp_connected}
                messages={whatsappMessages ?? []}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communication Log</CardTitle>
            </CardHeader>
            <CardBody>
              <form action={addLogEntry} className="mb-4 flex flex-col gap-3 border-b border-ink/30 pb-4">
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <Field label="Summary" htmlFor="summary">
                    <Input id="summary" name="summary" placeholder="Confirmed MOQ of 500 units" required />
                  </Field>
                  <Field label="Source" htmlFor="source">
                    <Select id="source" name="source" defaultValue="email">
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="call">Call</option>
                      <option value="other">Other</option>
                    </Select>
                  </Field>
                </div>
                <Button type="submit" variant="secondary" className="self-start">
                  Log Entry
                </Button>
              </form>
              {supplier.communication_log.length === 0 ? (
                <p className="font-mono text-xs text-muted">No entries yet.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {[...supplier.communication_log].reverse().map((entry, i) => (
                    <li key={i} className="border-l-2 border-ink/30 pl-3">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-muted">
                        {new Date(entry.date).toLocaleString()} · {entry.source}
                      </p>
                      <p className="text-sm text-ink">{entry.summary}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardBody>
              <DocumentsSection documents={documentsWithUrls} supplierId={supplier.id} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
