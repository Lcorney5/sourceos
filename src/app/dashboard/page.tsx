import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardBody } from "@/components/ui/card";

export default async function DashboardOverviewPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const [suppliers, pendingQuotes, activePOs, overduePOs] = await Promise.all([
    supabase.from("suppliers").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("purchase_orders")
      .select("id", { count: "exact", head: true })
      .neq("stage", "delivered"),
    supabase
      .from("purchase_orders_with_status")
      .select("id", { count: "exact", head: true })
      .eq("is_overdue", true),
  ]);

  const stats = [
    { label: "Suppliers", value: suppliers.count ?? 0, href: "/dashboard/suppliers" },
    { label: "Pending Quotes", value: pendingQuotes.count ?? 0, href: "/dashboard/quotes" },
    { label: "Active POs", value: activePOs.count ?? 0, href: "/dashboard/purchase-orders" },
    {
      label: "Past Due POs",
      value: overduePOs.count ?? 0,
      href: "/dashboard/purchase-orders",
      alert: (overduePOs.count ?? 0) > 0,
    },
  ];

  return (
    <div>
      <PageHeader eyebrow="Manifest Overview" title={workspace.name} />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className={stat.alert ? "border-rust" : undefined}>
              <CardBody>
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
                <p
                  className={`mt-2 font-display text-4xl font-bold ${
                    stat.alert ? "text-rust" : "text-ink"
                  }`}
                >
                  {stat.value}
                </p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
