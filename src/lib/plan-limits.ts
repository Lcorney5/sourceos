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

export const PLAN_RANK: Record<WorkspacePlan, number> = { starter: 0, growth: 1, agency: 2 };

export function hasFeature(plan: WorkspacePlan, minPlan: WorkspacePlan): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK[minPlan];
}

export const FEATURE_MIN_PLAN = {
  analytics: "growth",
  documents: "growth",
  production: "growth",
  activityLog: "agency",
} as const satisfies Record<string, WorkspacePlan>;
