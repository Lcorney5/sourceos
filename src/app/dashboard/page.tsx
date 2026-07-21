import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardBody } from "@/components/ui/card";
import { StampBadge } from "@/components/ui/stamp-badge";
import { PO_STAGES } from "@/lib/purchase-orders";
import { SuppliersIcon, QuotesIcon, OrderVolumeIcon } from "@/components/dashboard/stat-icons";
import type { POStage } from "@/lib/supabase/database.types";

export default async function DashboardOverviewPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const [suppliers, quotes, purchaseOrders] = await Promise.all([
    supabase.from("suppliers").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id, status"),
    supabase.from("purchase_orders").select("id, stage, total_amount, currency"),
  ]);

  const allQuotes = quotes.data ?? [];
  const acceptedQuotes = allQuotes.filter((q) => q.status === "accepted").length;
  const pendingQuotes = allQuotes.filter((q) => q.status === "pending").length;

  const allPOs = purchaseOrders.data ?? [];
  const activePOs = allPOs.filter((po) => po.stage !== "delivered");
  const orderVolume = activePOs.reduce((sum, po) => sum + po.total_amount, 0);
  const volumeCurrency = activePOs[0]?.currency ?? allPOs[0]?.currency ?? "USD";

  const stats = [
    {
      label: "Active Suppliers",
      value: String(suppliers.count ?? 0),
      subtext: null,
      href: "/dashboard/suppliers",
      viewLabel: "View Suppliers",
      icon: <SuppliersIcon />,
    },
    {
      label: "Pending Quotes",
      value: String(pendingQuotes),
      subtext: `${acceptedQuotes} accepted · ${allQuotes.length} total`,
      href: "/dashboard/quotes",
      viewLabel: "View Quotes",
      icon: <QuotesIcon />,
    },
    {
      label: "Current Order Volume",
      value: `$${orderVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      subtext: `${activePOs.length} active · ${allPOs.length} total`,
      href: "/dashboard/purchase-orders",
      viewLabel: "View Orders",
      icon: <OrderVolumeIcon />,
    },
  ];

  const stageCounts = PO_STAGES.map((stage) => ({
    ...stage,
    count: allPOs.filter((po) => po.stage === stage.value).length,
  }));
  const maxStageCount = Math.max(...stageCounts.map((s) => s.count), 1);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Sourcing Pipeline Metrics At A Glance" />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardBody>
              <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
                {stat.icon}
                {stat.label}
              </p>
              <p className="truncate font-display text-4xl font-bold text-ink">{stat.value}</p>
              {stat.subtext && (
                <p className="mt-1 font-mono text-xs text-muted">{stat.subtext}</p>
              )}
              <Link
                href={stat.href}
                className="mt-3 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-steel hover:text-rust"
              >
                {stat.viewLabel} →
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="mb-3 font-display text-xl font-bold uppercase tracking-tight">
        Orders by Stage
      </p>
      <div className="flex flex-col gap-3 border border-ink p-4">
        {stageCounts.map((stage) => (
          <StageRow
            key={stage.value}
            stage={stage.value}
            label={stage.label}
            count={stage.count}
            max={maxStageCount}
          />
        ))}
      </div>
    </div>
  );
}

function StageRow({
  stage,
  label,
  count,
  max,
}: {
  stage: POStage;
  label: string;
  count: number;
  max: number;
}) {
  return (
    <div className="grid grid-cols-[8rem_1fr_2rem] items-center gap-3">
      <StampBadge tone={stage === "delivered" ? "steel" : "ink"} rotate={false}>
        {label}
      </StampBadge>
      <div className="h-3 bg-paper">
        <div
          className="h-3 bg-ink"
          style={{ width: `${Math.max((count / max) * 100, count > 0 ? 2 : 0)}%` }}
        />
      </div>
      <span className="text-right font-mono text-sm font-semibold text-ink">{count}</span>
    </div>
  );
}
