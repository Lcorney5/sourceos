import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/table";
import { UsageMeter } from "@/components/ui/usage-meter";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { SupplierDirectory } from "@/components/suppliers/supplier-directory";

export default async function SuppliersPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("name");

  const list = suppliers ?? [];

  return (
    <div>
      <PageHeader
        title="Supplier Directory"
        subtitle={`${list.length} suppliers · quick contact reference`}
        actions={<LinkButton href="/dashboard/suppliers/new">+ Add Supplier</LinkButton>}
      />
      <div className="mb-4">
        <UsageMeter
          label="suppliers used"
          used={list.length}
          limit={PLAN_LIMITS[workspace.plan].suppliers}
        />
      </div>
      {!list.length ? (
        <EmptyState
          message="No suppliers yet."
          action={<LinkButton href="/dashboard/suppliers/new">Add your first supplier</LinkButton>}
        />
      ) : (
        <SupplierDirectory suppliers={list} />
      )}
    </div>
  );
}
