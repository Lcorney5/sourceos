import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";

export default async function ProductsPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("name");

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Products"
        actions={<LinkButton href="/dashboard/products/new">+ Add Product</LinkButton>}
      />
      {!products?.length ? (
        <EmptyState
          message="No products in your catalog yet."
          action={<LinkButton href="/dashboard/products/new">Add your first product</LinkButton>}
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
            </tr>
          </Thead>
          <tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td className="font-semibold">
                  <Link href={`/dashboard/products/${product.id}`} className="hover:text-rust">
                    {product.name}
                  </Link>
                </Td>
                <Td className="font-mono">{product.sku ?? "—"}</Td>
                <Td>{product.category ?? "—"}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
