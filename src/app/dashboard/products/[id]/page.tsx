import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { ProductForm } from "@/components/products/product-form";
import { DeleteButton } from "@/components/ui/delete-button";
import { updateProduct, deleteProduct } from "@/lib/actions/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);
  const deleteWithId = deleteProduct.bind(null, product.id);

  return (
    <div>
      <PageHeader
        eyebrow="Product"
        title={product.name}
        actions={
          <DeleteButton action={deleteWithId} confirmMessage={`Delete ${product.name}?`} />
        }
      />
      <ProductForm action={updateWithId} product={product} submitLabel="Save Changes" />
    </div>
  );
}
