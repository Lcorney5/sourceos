import { PageHeader } from "@/components/ui/card";
import { ProductForm } from "@/components/products/product-form";
import { createProduct } from "@/lib/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Add Product" />
      <ProductForm action={createProduct} submitLabel="Create Product" />
    </div>
  );
}
