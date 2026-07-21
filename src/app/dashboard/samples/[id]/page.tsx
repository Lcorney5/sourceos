import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { RequestRevisionButton } from "@/components/samples/request-revision-button";
import { SampleStatusBadge } from "@/components/ui/stamp-badge";
import { updateSample, deleteSample } from "@/lib/actions/samples";

export default async function SampleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: sample } = await supabase
    .from("samples")
    .select("*, suppliers(name)")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!sample) notFound();

  const updateSampleWithId = updateSample.bind(null, sample.id);
  const deleteSampleWithId = deleteSample.bind(null, sample.id);

  return (
    <div>
      <PageHeader
        eyebrow={sample.suppliers?.name ?? "Supplier"}
        title={`${sample.product_name} — R${sample.revision}`}
        actions={
          <div className="flex items-center gap-2">
            <SampleStatusBadge status={sample.status} />
            <DeleteButton
              action={deleteSampleWithId}
              confirmMessage={`Delete sample ${sample.product_name} R${sample.revision}?`}
            />
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardBody>
            <form action={updateSampleWithId} className="flex flex-col gap-4">
              <Field label="Product Name" htmlFor="product_name">
                <Input id="product_name" name="product_name" required defaultValue={sample.product_name} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Revision" htmlFor="revision">
                  <Input id="revision" name="revision" type="number" min={1} defaultValue={sample.revision} />
                </Field>
                <Field label="Status" htmlFor="status">
                  <Select id="status" name="status" defaultValue={sample.status}>
                    <option value="requested">Requested</option>
                    <option value="in_transit">In Transit</option>
                    <option value="received">Received</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </Field>
              </div>
              <Field label="Photo URLs (one per line)" htmlFor="photo_urls">
                <Textarea
                  id="photo_urls"
                  name="photo_urls"
                  rows={3}
                  defaultValue={sample.photo_urls.join("\n")}
                />
              </Field>
              <Field label="Notes / Feedback" htmlFor="notes">
                <Textarea id="notes" name="notes" rows={4} defaultValue={sample.notes ?? ""} />
              </Field>
              <Button type="submit" className="self-start">
                Save Changes
              </Button>
            </form>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-6">
          {sample.photo_urls.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardBody className="grid grid-cols-2 gap-2">
                {sample.photo_urls.map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={url}
                    src={url}
                    alt={sample.product_name}
                    className="aspect-square w-full border border-ink object-cover"
                  />
                ))}
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Revision History</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="mb-3 font-mono text-xs text-muted">
                Currently on revision {sample.revision}. Rejecting a sample? Request the next
                revision to reset status and increment the revision counter.
              </p>
              <RequestRevisionButton sampleId={sample.id} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
