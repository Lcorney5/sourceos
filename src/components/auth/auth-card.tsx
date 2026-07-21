import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 py-12">
      <Link href="/" className="mb-8 font-display text-2xl font-bold uppercase tracking-tight">
        Source<span className="text-rust">OS</span>
      </Link>
      <div className="w-full max-w-sm border border-ink bg-paper-card p-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted">
          {subtitle}
        </p>
        <h1 className="mb-6 font-display text-2xl font-bold uppercase tracking-tight">
          {title}
        </h1>
        {children}
      </div>
      <p className="mt-4 font-mono text-xs text-muted">{footer}</p>
    </div>
  );
}
