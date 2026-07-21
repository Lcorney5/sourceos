import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { isPurchaseOrderOverdue } from "@/lib/purchase-orders";

function monthParam(date: Date) {
  return format(date, "yyyy-MM");
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const anchor = month ? parseISO(`${month}-01`) : new Date();
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select("*, suppliers(name)")
    .eq("workspace_id", workspace.id)
    .gte("target_delivery_date", format(gridStart, "yyyy-MM-dd"))
    .lte("target_delivery_date", format(gridEnd, "yyyy-MM-dd"));

  const posByDay = new Map<string, typeof purchaseOrders>();
  for (const po of purchaseOrders ?? []) {
    if (!po.target_delivery_date) continue;
    const list = posByDay.get(po.target_delivery_date) ?? [];
    list.push(po);
    posByDay.set(po.target_delivery_date, list);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Manifest"
        title="Delivery Calendar"
        actions={
          <div className="flex items-center gap-2">
            <LinkButton href={`/dashboard/calendar?month=${monthParam(subMonths(anchor, 1))}`} variant="secondary">
              ← Prev
            </LinkButton>
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">
              {format(anchor, "MMMM yyyy")}
            </span>
            <LinkButton href={`/dashboard/calendar?month=${monthParam(addMonths(anchor, 1))}`} variant="secondary">
              Next →
            </LinkButton>
          </div>
        }
      />
      <div className="grid grid-cols-7 border-l border-t border-ink">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="border-b border-r border-ink bg-paper-card px-2 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted"
          >
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayPOs = posByDay.get(key) ?? [];
          return (
            <div
              key={key}
              className={`min-h-28 border-b border-r border-ink p-1.5 ${
                isSameMonth(day, anchor) ? "bg-paper" : "bg-paper-card/50"
              }`}
            >
              <p
                className={`mb-1 font-mono text-xs ${
                  isToday(day)
                    ? "inline-block bg-rust px-1 text-paper"
                    : isSameMonth(day, anchor)
                      ? "text-ink"
                      : "text-muted"
                }`}
              >
                {format(day, "d")}
              </p>
              <div className="flex flex-col gap-1">
                {dayPOs.map((po) => (
                  <Link
                    key={po.id}
                    href={`/dashboard/purchase-orders/${po.id}`}
                    className={`block truncate border px-1 py-0.5 font-mono text-[0.625rem] leading-tight hover:bg-ink hover:text-paper ${
                      isPurchaseOrderOverdue(po) ? "border-rust text-rust" : "border-steel text-steel"
                    }`}
                    title={`${po.product_name} — ${po.suppliers?.name ?? ""}`}
                  >
                    {po.product_name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
