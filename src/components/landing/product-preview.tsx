import { Table, Thead, Th, Tr, Td } from "@/components/ui/table";
import { QuoteStatusBadge } from "@/components/ui/stamp-badge";

const QUOTES = [
  {
    supplier: "Guangzhou Canvas Co.",
    price: "$2.40",
    moq: "500",
    leadTime: "25d",
    received: "Jul 14",
    status: "accepted",
  },
  {
    supplier: "Ningbo Textile Group",
    price: "$2.65",
    moq: "300",
    leadTime: "18d",
    received: "Jul 16",
    status: "pending",
  },
  {
    supplier: "Xiamen Bagworks",
    price: "$2.15",
    moq: "1,000",
    leadTime: "35d",
    received: "Jul 12",
    status: "pending",
  },
  {
    supplier: "Fujian Canvas Supply",
    price: "$2.80",
    moq: "200",
    leadTime: "14d",
    received: "Jul 9",
    status: "rejected",
  },
];

export function ProductPreview() {
  return (
    <div className="mx-auto max-w-4xl border border-ink bg-paper-card shadow-[6px_6px_0_0_var(--color-ink)]">
      <div className="flex items-center justify-between border-b border-ink px-4 py-2">
        <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
          Manifest / Quotes
        </span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted">
          12oz Canvas Tote Bag
        </span>
      </div>
      <div className="p-4">
        <Table>
          <Thead>
            <tr>
              <Th>Supplier</Th>
              <Th>Unit Price</Th>
              <Th>MOQ</Th>
              <Th>Lead Time</Th>
              <Th>Received</Th>
              <Th>Status</Th>
            </tr>
          </Thead>
          <tbody>
            {QUOTES.map((q) => (
              <Tr key={q.supplier}>
                <Td className="font-semibold">{q.supplier}</Td>
                <Td className="font-mono">{q.price}</Td>
                <Td className="font-mono">{q.moq}</Td>
                <Td className="font-mono">{q.leadTime}</Td>
                <Td className="font-mono">{q.received}</Td>
                <Td>
                  <QuoteStatusBadge status={q.status} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
