import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { QuoteStatusSelect } from "@/components/quotes/quote-status-select";
import { DeleteQuoteButton } from "@/components/quotes/delete-quote-button";
import Link from "next/link";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const baseQuery = supabase
    .from("quotes")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id);

  const { data: quotes } = product
    ? await baseQuery.eq("product_name", product).order("unit_price", { ascending: true })
    : await baseQuery.order("product_name").order("unit_price", { ascending: true });

  const { data: productRows } = await supabase
    .from("quotes")
    .select("product_name")
    .eq("workspace_id", workspace.id);
  const productNames = Array.from(new Set(productRows?.map((r) => r.product_name) ?? [])).sort();

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Quotes"
        actions={<LinkButton href="/dashboard/quotes/new">+ Log Quote</LinkButton>}
      />

      {productNames.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">
            Compare product:
          </span>
          <Link
            href="/dashboard/quotes"
            className={`stamp ${!product ? "bg-ink text-paper" : "text-ink border-ink"}`}
          >
            All
          </Link>
          {productNames.map((name) => (
            <Link
              key={name}
              href={`/dashboard/quotes?product=${encodeURIComponent(name)}`}
              className={`stamp ${product === name ? "bg-ink text-paper" : "text-ink border-ink"}`}
            >
              {name}
            </Link>
          ))}
        </div>
      )}

      {!quotes?.length ? (
        <EmptyState
          message="No quotes yet."
          action={<LinkButton href="/dashboard/quotes/new">Log your first quote</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Product</Th>
              <Th>Supplier</Th>
              <Th>Unit Price</Th>
              <Th>MOQ</Th>
              <Th>Lead Time</Th>
              <Th>Received</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {quotes.map((quote) => (
              <Tr key={quote.id}>
                <Td className="font-semibold">{quote.product_name}</Td>
                <Td>{quote.suppliers?.name ?? "—"}</Td>
                <Td className="font-mono">
                  {quote.currency} {quote.unit_price.toFixed(2)}
                </Td>
                <Td className="font-mono">{quote.moq ?? "—"}</Td>
                <Td className="font-mono">{quote.lead_time_days ? `${quote.lead_time_days}d` : "—"}</Td>
                <Td className="font-mono">{quote.date_received}</Td>
                <Td>
                  <QuoteStatusSelect quoteId={quote.id} status={quote.status} />
                </Td>
                <Td>
                  <DeleteQuoteButton quoteId={quote.id} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
