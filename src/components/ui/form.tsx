import { clsx } from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClasses =
  "w-full border border-ink bg-paper-card px-3 py-2 font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-rust";

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted"
    >
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(fieldClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(fieldClasses, className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx(fieldClasses, className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="mt-1 font-mono text-xs text-rust">{error}</p>}
    </div>
  );
}
