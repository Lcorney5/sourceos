import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { signOut } from "@/lib/auth/actions";
import { StampBadge } from "@/components/ui/stamp-badge";

const NAV_ITEMS = [
  { href: "/dashboard/home", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/suppliers", label: "Suppliers" },
  { href: "/dashboard/directory", label: "Directory" },
  { href: "/dashboard/analytics", label: "Performance" },
  { href: "/dashboard/quotes", label: "Quotes" },
  { href: "/dashboard/samples", label: "Samples" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/purchase-orders", label: "Orders" },
  { href: "/dashboard/finance", label: "Finance" },
  { href: "/dashboard/activity-log", label: "Activity Log" },
  { href: "/dashboard/timeline", label: "Timeline" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/dashboard/production", label: "Production" },
  { href: "/dashboard/documents", label: "Documents" },
  { href: "/dashboard/messages", label: "Messages" },
  { href: "/dashboard/team", label: "Team" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, workspace } = await requireWorkspace();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-ink bg-paper-card md:h-screen md:w-56 md:border-b-0 md:border-r">
        <div className="border-b border-ink px-4 py-4">
          <Link href="/dashboard/home" className="font-display text-xl font-bold uppercase tracking-tight">
            Source<span className="text-rust">OS</span>
          </Link>
          <p className="mt-1 truncate font-mono text-xs uppercase tracking-wide text-muted">
            {workspace.name}
          </p>
          <StampBadge tone="steel" className="mt-2">
            {workspace.plan}
          </StampBadge>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-transparent px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ink p-2">
          <Link
            href="/dashboard/settings"
            className="block border border-transparent px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink"
          >
            Settings
          </Link>
          <Link
            href="/dashboard/billing"
            className="block border border-transparent px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink"
          >
            Billing
          </Link>
          <div className="mt-2 flex items-center justify-between px-3 py-1">
            <span className="truncate font-mono text-[0.6875rem] text-muted">
              {profile.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="font-mono text-[0.6875rem] font-semibold uppercase text-rust hover:underline"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
