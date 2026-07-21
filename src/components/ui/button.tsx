import { clsx } from "clsx";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-rust text-paper border-rust hover:bg-ink hover:border-ink",
  secondary: "bg-transparent text-ink border-ink hover:bg-ink hover:text-paper",
  ghost: "bg-transparent text-ink border-transparent hover:border-ink",
  danger: "bg-transparent text-rust border-rust hover:bg-rust hover:text-paper",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 border px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(baseClasses, VARIANT_CLASSES[variant], className)}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={clsx(baseClasses, VARIANT_CLASSES[variant], className)}
    >
      {children}
    </Link>
  );
}
