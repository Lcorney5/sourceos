import type { Database } from "@/lib/supabase/database.types";

type ActivityEntry = Database["public"]["Tables"]["activity_log"]["Row"];

export function ActivityItem({ entry }: { entry: ActivityEntry }) {
  return (
    <li className="border-l-2 border-ink/30 pl-3">
      <p className="text-sm text-ink">
        <span className="font-semibold">{entry.actor_label}</span> {entry.action}
        {entry.entity_label && <> — {entry.entity_label}</>}
      </p>
      <p className="font-mono text-[0.6875rem] text-muted">
        {new Date(entry.created_at).toLocaleString()}
      </p>
    </li>
  );
}
