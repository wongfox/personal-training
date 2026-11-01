"use client";

import { useActionState } from "react";
import { cn } from "@/lib/cn";

export interface AdminFormState {
  error?: string;
  ok?: string;
}

type Action = (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;

/** Wraps a server action form with pending, error and success states. */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className,
  hidden,
}: {
  action: Action;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
  hidden?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className={cn("space-y-5", className)}>
      {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {children}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button type="submit" disabled={pending} className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-bg disabled:opacity-50">
          {pending ? "Saving…" : submitLabel}
        </button>
        {state.error && (
          <p role="alert" className="text-[14px] text-danger">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p role="status" className="text-[14px] text-success">
            {state.ok}
          </p>
        )}
      </div>
    </form>
  );
}

/** A one-click action button (e.g. suspend, grant role) backed by a server action. */
export function ActionButton({
  action,
  label,
  hidden,
  tone = "default",
  confirm,
}: {
  action: Action;
  label: string;
  hidden: Record<string, string>;
  tone?: "default" | "danger";
  confirm?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className="inline-flex flex-col"
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-full border px-3.5 py-1.5 text-[13px] font-medium disabled:opacity-50",
          tone === "danger" ? "border-danger/30 text-danger hover:bg-danger-soft" : "border-line hover:bg-surface-2",
        )}
      >
        {pending ? "…" : label}
      </button>
      {state.error && <span className="mt-1 text-[12px] text-danger">{state.error}</span>}
    </form>
  );
}
