import { clsx } from "clsx";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-ink">
      <table className="w-full min-w-max border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-ink bg-paper">{children}</thead>;
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={clsx(
        "whitespace-nowrap px-3 py-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={clsx("whitespace-nowrap px-3 py-2 align-middle", className)}>{children}</td>;
}

export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={clsx("border-b border-ink/30 last:border-b-0 hover:bg-ink/5", className)}>{children}</tr>;
}

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-ink/40 px-6 py-12 text-center">
      <p className="font-mono text-sm text-muted">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
