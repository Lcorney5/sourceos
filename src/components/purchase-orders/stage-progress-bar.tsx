import { PO_STAGES } from "@/lib/purchase-orders";
import type { POStage } from "@/lib/supabase/database.types";

export function StageProgressBar({ stage, compact = false }: { stage: POStage; compact?: boolean }) {
  const currentIndex = PO_STAGES.findIndex((s) => s.value === stage);

  return (
    <div className="flex border border-ink">
      {PO_STAGES.map((s, i) => {
        const reached = i <= currentIndex;
        return (
          <div
            key={s.value}
            title={s.label}
            className={`flex-1 border-r border-ink text-center font-mono uppercase tracking-wider last:border-r-0 ${
              compact ? "py-1 text-[0.5rem]" : "px-2 py-2 text-[0.6875rem] font-semibold"
            } ${reached ? "bg-ink text-paper" : "text-muted"}`}
          >
            {compact ? "" : s.label}
          </div>
        );
      })}
    </div>
  );
}
