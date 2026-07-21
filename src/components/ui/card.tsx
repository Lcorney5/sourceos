import { clsx } from "clsx";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("border border-ink bg-paper-card", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("border-b border-ink px-4 py-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={clsx("font-display text-lg font-semibold uppercase tracking-wide", className)}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("p-4", className)}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string;
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between border-b-2 border-ink pb-4">
      <div>
        {eyebrow && (
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
