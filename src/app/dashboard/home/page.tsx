import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { ActivityItem } from "@/components/activity/activity-item";

const QUICK_LINKS = [
  { href: "/dashboard/suppliers", label: "Suppliers" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/samples", label: "Samples" },
  { href: "/dashboard/purchase-orders", label: "Purchase Orders" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/finance", label: "Finance" },
];

export default async function HomePage() {
  const { profile, workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: recentActivity } = await supabase
    .from("activity_log")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(8);

  const firstName = (profile.name ?? profile.email).split(" ")[0].split("@")[0];

  return (
    <div>
      <PageHeader eyebrow={workspace.name} title={`Welcome back, ${firstName}`} />

      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Quick Links</p>
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="text-center hover:border-rust">
              <CardBody className="py-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                  {link.label}
                </p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Link
            href="/dashboard/activity-log"
            className="font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-rust hover:underline"
          >
            View All
          </Link>
        </CardHeader>
        <CardBody>
          {!recentActivity?.length ? (
            <EmptyState message="No activity yet." />
          ) : (
            <ul className="flex flex-col gap-3">
              {recentActivity.map((entry) => (
                <ActivityItem key={entry.id} entry={entry} />
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
