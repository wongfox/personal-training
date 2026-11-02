"use client";

import { useActionState, useState, useTransition } from "react";
import { resendVerificationAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Field, FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import { type AccountState, changePasswordAction, deleteAccountAction } from "./account-actions";

export function EmailStatus({ verified, email, notice }: { verified: boolean; email: string; notice?: string }) {
  const t = useT();
  const [state, setState] = useState<{ ok?: string; error?: string }>({});
  const [pending, start] = useTransition();
  return (
    <section className="space-y-2">
      {notice && <FormAlert tone={notice === "1" ? "success" : "error"}>{notice === "1" ? t("settings.email.confirmedNotice") : t("settings.email.invalidLink")}</FormAlert>}
      <div className="flex items-center justify-between gap-3 rounded-[22px] bg-surface px-4 py-3.5 shadow-card">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium">{email}</p>
          <p className={verified ? "text-[13px] text-success" : "text-[13px] text-accent"}>{verified ? t("settings.email.confirmed") : t("settings.email.notConfirmed")}</p>
        </div>
        {!verified && (
          <Button variant="secondary" size="sm" className="shrink-0 whitespace-nowrap" disabled={pending} onClick={() => start(async () => setState(await resendVerificationAction()))}>
            {pending ? t("settings.email.sending") : t("settings.email.resend")}
          </Button>
        )}
      </div>
      {state.ok && <p className="text-[13px] text-success">{state.ok}</p>}
      {state.error && <p className="text-[13px] text-danger">{state.error}</p>}
    </section>
  );
}

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const t = useT();
  const [state, action, pending] = useActionState<AccountState, FormData>(changePasswordAction, {});
  return (
    <form action={action} className="space-y-3 rounded-[28px] bg-surface p-5 shadow-card">
      {hasPassword && <Field id="current" name="current" type="password" label={t("settings.password.current")} autoComplete="current-password" required />}
      <Field
        id="next"
        name="next"
        type="password"
        label={hasPassword ? t("settings.password.new") : t("settings.password.set")}
        autoComplete="new-password"
        minLength={10}
        required
        hint={t("settings.password.hint")}
      />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      {state.ok && <FormAlert tone="success">{state.ok}</FormAlert>}
      <Button type="submit" variant="secondary" size="md" disabled={pending}>
        {pending ? t("common.saving") : hasPassword ? t("settings.password.change") : t("settings.password.setButton")}
      </Button>
    </form>
  );
}

export function DeleteAccount() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<AccountState, FormData>(deleteAccountAction, {});
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-[14px] font-medium text-danger underline underline-offset-4">
        {t("settings.deleteAccount.open")}
      </button>
    );
  }
  return (
    <form action={action} className="space-y-3 rounded-[22px] border border-danger/30 p-4">
      <p className="text-[14px] leading-relaxed">
        {t("settings.deleteAccount.body")} {t("settings.deleteAccount.typePrefix")} <strong>DELETE</strong> {t("settings.deleteAccount.typeSuffix")}
      </p>
      <Field id="confirm" name="confirm" label={t("settings.deleteAccount.confirmLabel")} autoComplete="off" />
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="md" onClick={() => setOpen(false)}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" variant="danger" size="md" disabled={pending}>
          {pending ? t("settings.deleteAccount.deleting") : t("settings.deleteAccount.submit")}
        </Button>
      </div>
    </form>
  );
}
