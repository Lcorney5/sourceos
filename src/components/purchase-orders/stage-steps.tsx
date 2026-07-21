import { PO_STAGES } from "@/lib/purchase-orders";
import type { POStage } from "@/lib/supabase/database.types";

export function StageSteps({
  stage,
  showLabels = true,
}: {
  stage: POStage;
  showLabels?: boolean;
}) {
  const currentIndex = PO_STAGES.findIndex((s) => s.value === stage);

  return (
    <div className="flex">
      {PO_STAGES.map((s, i) => {
        const filled = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <div key={s.value} className="relative flex-1 text-center">
            {i > 0 && (
              <div className="absolute right-1/2 top-[5px] h-px w-full border-t border-dashed border-ink/25" />
            )}
            <div
              title={s.label}
              className={`relative z-10 mx-auto h-2.5 w-2.5 ${
                filled ? "bg-ink" : "border border-ink/25 bg-paper-card"
              } ${isCurrent ? "border-2 border-rust" : ""}`}
            />
            {showLabels && (
              <p className="mt-1.5 font-mono text-[0.55rem] font-semibold uppercase tracking-wide text-muted">
                {s.label}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
