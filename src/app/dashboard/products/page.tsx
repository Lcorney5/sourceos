import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/table";
import { ProductCatalog, type ProductStat } from "@/components/products/product-catalog";

export default async function ProductsPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const [{ data: products }, { data: quotes }, { data: samples }, { data: purchaseOrders }] =
    await Promise.all([
      supabase.from("products").select("*").eq("workspace_id", workspace.id).order("name"),
      supabase
        .from("quotes")
        .select("product_name, supplier_id, unit_price, currency")
        .eq("workspace_id", workspace.id),
      supabase.from("samples").select("product_name").eq("workspace_id", workspace.id),
      supabase.from("purchase_orders").select("product_name").eq("workspace_id", workspace.id),
    ]);

  const list = products ?? [];
  const allQuotes = quotes ?? [];
  const allSamples = samples ?? [];
  const allOrders = purchaseOrders ?? [];

  const stats: ProductStat[] = list.map((product) => {
    const key = product.name.toLowerCase();
    const matchingQuotes = allQuotes.filter((q) => q.product_name.toLowerCase() === key);
    const bestQuote = matchingQuotes.reduce<(typeof matchingQuotes)[number] | null>(
      (best, q) => (best === null || q.unit_price < best.unit_price ? q : best),
      null
    );

    return {
      id: product.id,
      name: product.name,
      supplierCount: new Set(matchingQuotes.map((q) => q.supplier_id)).size,
      bestPrice: bestQuote?.unit_price ?? null,
      currency: bestQuote?.currency ?? null,
      quoteCount: matchingQuotes.length,
      sampleCount: allSamples.filter((s) => s.product_name.toLowerCase() === key).length,
      orderCount: allOrders.filter((o) => o.product_name.toLowerCase() === key).length,
    };
  });

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle={`${list.length} SKUs being managed`}
        actions={<LinkButton href="/dashboard/products/new">+ Add Product</LinkButton>}
      />
      {!list.length ? (
        <EmptyState
          message="No products in your catalog yet."
          action={<LinkButton href="/dashboard/products/new">Add your first product</LinkButton>}
        />
      ) : (
        <ProductCatalog products={stats} />
      )}
    </div>
  );
}
