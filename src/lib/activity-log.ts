import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function logActivity(
  supabase: SupabaseClient<Database>,
  params: {
    workspaceId: string;
    actorLabel: string;
    action: string;
    entityType: string;
    entityLabel?: string | null;
    entityId?: string | null;
  }
) {
  // Best-effort — a logging failure should never break the actual mutation.
  await supabase.from("activity_log").insert({
    workspace_id: params.workspaceId,
    actor_label: params.actorLabel,
    action: params.action,
    entity_type: params.entityType,
    entity_label: params.entityLabel ?? null,
    entity_id: params.entityId ?? null,
  });
}
