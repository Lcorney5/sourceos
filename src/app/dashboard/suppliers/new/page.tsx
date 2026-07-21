import { PageHeader } from "@/components/ui/card";
import { SupplierForm } from "@/components/suppliers/supplier-form";
import { createSupplier } from "@/lib/actions/suppliers";

export default function NewSupplierPage() {
  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Add Supplier" />
      <SupplierForm action={createSupplier} submitLabel="Create Supplier" />
    </div>
  );
}
