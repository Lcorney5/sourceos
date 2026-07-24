import Link from "next/link";
import { requireWorkspace } from "@/lib/auth/dal";
import { signOut } from "@/lib/auth/actions";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, workspace, isOwner, isHomeWorkspace, workspaceOptions } =
    await requireWorkspace();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col border-b border-ink bg-paper-card md:h-screen md:w-56 md:border-b-0 md:border-r">
        <div className="border-b border-ink px-4 py-4">
          <Link href="/dashboard/home" className="font-display text-xl font-bold uppercase tracking-tight">
            Source<span className="text-rust">OS</span>
          </Link>
          <WorkspaceSwitcher
            activeWorkspaceId={workspace.id}
            activeName={workspace.name}
            activePlan={workspace.plan}
            workspaces={workspaceOptions}
            canAddClient={isOwner && isHomeWorkspace && workspace.plan === "agency"}
          />
        </div>
        <SidebarNav />
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
          <Link
            href="/dashboard/feedback"
            className="block border border-transparent px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-ink hover:border-ink"
          >
            Feedback
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
