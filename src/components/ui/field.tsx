import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-2xl border border-line bg-surface px-4 text-[16px] text-ink placeholder:text-muted outline-none transition focus:border-ink/40 focus:ring-4 focus:ring-ink/5 aria-[invalid=true]:border-danger";

export function Field({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: ComponentProps<"input"> & { label: string; error?: string; hint?: string; id: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink-2">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "h-13")}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  error,
  id,
  className,
  ...props
}: ComponentProps<"textarea"> & { label?: string; error?: string; id: string }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-ink-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(control, "min-h-28 resize-none py-3.5 leading-relaxed")}
        {...props}
      />
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}

export function FormAlert({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-3 text-[14px]",
        tone === "error" ? "bg-danger-soft text-danger" : "bg-success-soft text-success",
      )}
    >
      {children}
    </div>
  );
}
