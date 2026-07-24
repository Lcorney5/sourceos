export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-2 h-3 w-24 bg-ink/10" />
          <div className="h-8 w-48 bg-ink/15" />
        </div>
        <div className="h-9 w-32 bg-ink/10" />
      </div>
      <div className="border border-ink">
        <div className="h-9 border-b border-ink bg-paper" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-6 border-b border-ink/30 px-3 py-3 last:border-b-0">
            <div className="h-4 w-32 bg-ink/10" />
            <div className="h-4 w-24 bg-ink/10" />
            <div className="h-4 w-40 bg-ink/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
