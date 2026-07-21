"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SuppliersIcon, QuotesIcon } from "@/components/dashboard/stat-icons";
import {
  HomeIcon,
  DashboardIcon,
  DirectoryIcon,
  PerformanceIcon,
  SamplesIcon,
  ProductsIcon,
  OrdersIcon,
  FinanceIcon,
  ActivityLogIcon,
  TimelineIcon,
  CalendarIcon,
  ProductionIcon,
  DocumentsIcon,
  MessagesIcon,
  TeamIcon,
} from "@/components/dashboard/nav-icons";

const NAV_ITEMS = [
  { href: "/dashboard/home", label: "Home", icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/dashboard/suppliers", label: "Suppliers", icon: SuppliersIcon },
  { href: "/dashboard/directory", label: "Directory", icon: DirectoryIcon },
  { href: "/dashboard/analytics", label: "Performance", icon: PerformanceIcon },
  { href: "/dashboard/quotes", label: "Quotes", icon: QuotesIcon },
  { href: "/dashboard/samples", label: "Samples", icon: SamplesIcon },
  { href: "/dashboard/products", label: "Products", icon: ProductsIcon },
  { href: "/dashboard/purchase-orders", label: "Orders", icon: OrdersIcon },
  { href: "/dashboard/finance", label: "Finance", icon: FinanceIcon },
  { href: "/dashboard/activity-log", label: "Activity Log", icon: ActivityLogIcon },
  { href: "/dashboard/timeline", label: "Timeline", icon: TimelineIcon },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarIcon },
  { href: "/dashboard/production", label: "Production", icon: ProductionIcon },
  { href: "/dashboard/documents", label: "Documents", icon: DocumentsIcon },
  { href: "/dashboard/messages", label: "Messages", icon: MessagesIcon },
  { href: "/dashboard/team", label: "Team", icon: TeamIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col overflow-y-auto py-2">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex items-center gap-3 bg-ink px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-paper"
                : "flex items-center gap-3 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted hover:bg-paper hover:text-ink"
            }
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
