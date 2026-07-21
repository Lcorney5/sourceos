import type { WorkspacePlan } from "@/lib/supabase/database.types";

// null = unlimited
export const PLAN_LIMITS: Record<WorkspacePlan, { suppliers: number | null; members: number | null }> = {
  starter: { suppliers: 25, members: 5 },
  growth: { suppliers: 100, members: 15 },
  agency: { suppliers: null, members: null },
};

export function formatLimit(value: number | null): string {
  return value === null ? "Unlimited" : String(value);
}
