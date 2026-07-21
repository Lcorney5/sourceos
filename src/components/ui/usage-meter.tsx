import { formatLimit } from "@/lib/plan-limits";

export function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  const atLimit = limit !== null && used >= limit;

  return (
    <p className={`font-mono text-xs uppercase tracking-wider ${atLimit ? "text-rust" : "text-muted"}`}>
      {used} / {formatLimit(limit)} {label}
    </p>
  );
}
