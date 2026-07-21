import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { SampleStatusSelect } from "@/components/samples/sample-status-select";
import Link from "next/link";

export default async function SamplesPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: samples } = await supabase
    .from("samples")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .order("date_updated", { ascending: false });

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Samples"
        actions={<LinkButton href="/dashboard/samples/new">+ Request Sample</LinkButton>}
      />
      {!samples?.length ? (
        <EmptyState
          message="No samples yet."
          action={<LinkButton href="/dashboard/samples/new">Request your first sample</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Product</Th>
              <Th>Supplier</Th>
              <Th>Rev.</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
            </tr>
          </Thead>
          <tbody>
            {samples.map((sample) => (
              <Tr key={sample.id}>
                <Td className="font-semibold">
                  <Link href={`/dashboard/samples/${sample.id}`} className="hover:text-rust">
                    {sample.product_name}
                  </Link>
                </Td>
                <Td>{sample.suppliers?.name ?? "—"}</Td>
                <Td className="font-mono">R{sample.revision}</Td>
                <Td>
                  <SampleStatusSelect sampleId={sample.id} status={sample.status} />
                </Td>
                <Td className="font-mono">{new Date(sample.date_updated).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
