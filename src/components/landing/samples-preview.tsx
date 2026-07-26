import { Table, Thead, Th, Tr, Td } from "@/components/ui/table";
import { SampleStatusBadge } from "@/components/ui/stamp-badge";

const SAMPLES = [
  {
    product: "12oz Canvas Tote Bag",
    supplier: "Guangzhou Canvas Co.",
    revision: 3,
    status: "approved",
    updated: "Jul 18",
  },
  {
    product: "Recycled Poly Mailer",
    supplier: "Ningbo Textile Group",
    revision: 2,
    status: "in_transit",
    updated: "Jul 17",
  },
  {
    product: "Cotton Drawstring Pouch",
    supplier: "Xiamen Bagworks",
    revision: 1,
    status: "requested",
    updated: "Jul 15",
  },
];

export function SamplesPreview() {
  return (
    <div className="mx-auto max-w-4xl border border-ink bg-paper-card shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex items-center justify-between border-b border-ink px-4 py-2">
        <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
          Manifest / Samples
        </span>
      </div>
      <div className="p-4">
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
            {SAMPLES.map((s) => (
              <Tr key={s.product}>
                <Td className="font-semibold">{s.product}</Td>
                <Td>{s.supplier}</Td>
                <Td className="font-mono">R{s.revision}</Td>
                <Td>
                  <SampleStatusBadge status={s.status} />
                </Td>
                <Td className="font-mono">{s.updated}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
