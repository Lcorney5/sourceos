export function BarChart({
  title,
  data,
  valueSuffix = "",
}: {
  title: string;
  data: { label: string; value: number }[];
  valueSuffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">{title}</p>
      {data.length === 0 ? (
        <p className="font-mono text-xs text-muted">Not enough data yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((d) => (
            <div key={d.label} className="grid grid-cols-[8rem_1fr_auto] items-center gap-2">
              <span className="truncate font-mono text-xs text-ink" title={d.label}>
                {d.label}
              </span>
              <div className="h-4 bg-paper">
                <div
                  className="h-4 bg-steel"
                  style={{ width: `${Math.max((d.value / max) * 100, 2)}%` }}
                />
              </div>
              <span className="font-mono text-xs text-ink">
                {d.value.toFixed(1)}
                {valueSuffix}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
