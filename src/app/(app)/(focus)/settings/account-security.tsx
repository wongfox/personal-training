"use client";

import { useActionState, useState, useTransition } from "react";
import { resendVerificationAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field, FormAlert } from "@/components/ui/field";
import { type AccountState, changePasswordAction, deleteAccountAction } from "./account-actions";

export function EmailStatus({ verified, email, notice }: { verified: boolean; email: string; notice?: string }) {
  const [state, setState] = useState<{ ok?: string; error?: string }>({});
  const [pending, start] = useTransition();
  return (
    <section className="space-y-2">
      {notice && <FormAlert tone={notice === "1" ? "success" : "error"}>{notice === "1" ? "Email confirmed. Thank you." : "That confirmation link is invalid or has expired."}</FormAlert>}
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-card">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{email}</p>
          <p className={verified ? "text-[13px] text-success" : "text-[13px] text-accent"}>{verified ? "Confirmed" : "Not confirmed yet"}</p>
        </div>
        {!verified && (
          <Button variant="secondary" size="sm" className="shrink-0 whitespace-nowrap" disabled={pending} onClick={() => start(async () => setState(await resendVerificationAction()))}>
            {pending ? "Sending…" : "Resend link"}
          </Button>
        )}
      </div>
      {state.ok && <p className="text-[13px] text-success">{state.ok}</p>}
      {state.error && <p className="text-[13px] text-danger">{state.error}</p>}
    </section>
  );
}

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="space-y-3">
      {hasPassword && <Field id="current" name="current" type="password" label="Current password" autoComplete="current-password" required />}
      <Field id="next" name="next" type="password" label={hasPassword ? "New password" : "Set a password"} autoComplete="new-password" minLength={10} required hint="At least 10 characters." />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      {state.ok && <FormAlert tone="success">{state.ok}</FormAlert>}
      <Button type="submit" variant="secondary" size="md" disabled={pending}>
        {pending ? "Saving…" : hasPassword ? "Change password" : "Set password"}
      </Button>
    </form>
  );
}

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AccountState, FormData>(deleteAccountAction, {});
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-[14px] font-medium text-danger underline underline-offset-4">
        Delete my account
      </button>
    );
  }
  return (
    <form action={action} className="space-y-3 rounded-2xl border border-danger/30 p-4">
      <p className="text-[14px] leading-relaxed">
        This permanently deletes your plan, progress, reflections and coach conversations. It can&apos;t be undone. Type <strong>DELETE</strong> to confirm.
      </p>
      <Field id="confirm" name="confirm" label="Confirmation" autoComplete="off" />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="md" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="danger" size="md" disabled={pending}>
          {pending ? "Deleting…" : "Delete forever"}
        </Button>
      </div>
    </form>
  );
}
