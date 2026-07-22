import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardBody } from "@/components/ui/card";
import { BarChart } from "@/components/analytics/bar-chart";
import { LineChart, type LineSeries } from "@/components/analytics/line-chart";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";
import { hasFeature, FEATURE_MIN_PLAN } from "@/lib/plan-limits";
import { isPurchaseOrderOverdue } from "@/lib/purchase-orders";

export default async function AnalyticsPage() {
  const { workspace } = await requireWorkspace();

  if (!hasFeature(workspace.plan, FEATURE_MIN_PLAN.analytics)) {
    return (
      <div>
        <PageHeader eyebrow="Manifest" title="Performance Analytics" />
        <UpgradeGate feature="Performance Analytics" minPlan={FEATURE_MIN_PLAN.analytics} />
      </div>
    );
  }

  const supabase = await createClient();

  const [{ data: quotes }, { data: purchaseOrders }, { data: suppliers }] = await Promise.all([
    supabase
      .from("quotes")
      .select("product_name, unit_price, lead_time_days, date_received, supplier_id, suppliers(name)")
      .eq("workspace_id", workspace.id),
    supabase.from("purchase_orders").select("*").eq("workspace_id", workspace.id),
    supabase.from("suppliers").select("id, name").eq("workspace_id", workspace.id),
  ]);

  // Stat tiles
  const supplierCount = suppliers?.length ?? 0;
  const leadTimes = (quotes ?? []).map((q) => q.lead_time_days).filter((v): v is number => v != null);
  const avgLeadTime = leadTimes.length ? leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length : null;
  const committedSpend = (purchaseOrders ?? [])
    .filter((po) => po.stage !== "delivered")
    .reduce((sum, po) => sum + po.total_amount, 0);
  const pastDueCount = (purchaseOrders ?? []).filter(isPurchaseOrderOverdue).length;

  // Avg lead time by supplier (top 8)
  const bySupplier = new Map<string, { total: number; count: number }>();
  for (const q of quotes ?? []) {
    if (q.lead_time_days == null) continue;
    const name = q.suppliers?.name ?? "Unknown";
    const entry = bySupplier.get(name) ?? { total: 0, count: 0 };
    entry.total += q.lead_time_days;
    entry.count += 1;
    bySupplier.set(name, entry);
  }
  const leadTimeBySupplier = Array.from(bySupplier.entries())
    .map(([label, { total, count }]) => ({ label, value: total / count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Avg unit price by month, for the top 3 products by quote count
  const quoteCountByProduct = new Map<string, number>();
  for (const q of quotes ?? []) {
    quoteCountByProduct.set(q.product_name, (quoteCountByProduct.get(q.product_name) ?? 0) + 1);
  }
  const topProducts = Array.from(quoteCountByProduct.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const months = Array.from(
    new Set((quotes ?? []).map((q) => q.date_received.slice(0, 7)))
  ).sort();

  const priceSeries: LineSeries[] = topProducts.map((product) => ({
    name: product,
    points: months.map((month) => {
      const matches = (quotes ?? []).filter(
        (q) => q.product_name === product && q.date_received.slice(0, 7) === month
      );
      const avg = matches.length
        ? matches.reduce((sum, q) => sum + q.unit_price, 0) / matches.length
        : 0;
      return { x: month, y: avg };
    }),
  }));

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Performance Analytics" />
      <p className="mb-6 max-w-2xl font-mono text-xs text-muted">
        Trends are computed from your own supplier, quote, and PO history — there is no external
        market-pricing data source to benchmark against.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Suppliers", value: String(supplierCount) },
          { label: "Avg Lead Time", value: avgLeadTime ? `${avgLeadTime.toFixed(0)}d` : "—" },
          { label: "Committed Spend", value: `$${committedSpend.toLocaleString()}` },
          { label: "Past Due POs", value: String(pastDueCount), alert: pastDueCount > 0 },
        ].map((stat) => (
          <Card key={stat.label} className={stat.alert ? "border-rust" : undefined}>
            <CardBody>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{stat.label}</p>
              <p className={`mt-2 font-display text-3xl font-bold ${stat.alert ? "text-rust" : "text-ink"}`}>
                {stat.value}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <BarChart title="Avg Lead Time by Supplier (days)" data={leadTimeBySupplier} valueSuffix="d" />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <LineChart title="Avg Quote Price by Month" series={priceSeries} valuePrefix="$" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
