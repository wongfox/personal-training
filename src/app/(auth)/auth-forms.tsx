"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormAlert } from "@/components/ui/field";
import { useT } from "@/i18n/client";
import {
  type FormState,
  forgotPasswordAction,
  loginAction,
  registerAction,
  resetPasswordAction,
} from "./actions";

const initial: FormState = {};

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  const t = useT();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? t("common.loading") : children}
    </Button>
  );
}

export function LoginForm({ notice }: { notice?: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(loginAction, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      {notice && !state.error && <FormAlert>{notice}</FormAlert>}
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <Field
        id="email"
        name="email"
        type="email"
        label={t("auth.fields.email")}
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={state.values?.email}
        error={state.fields?.email}
      />
      <Field
        id="password"
        name="password"
        type="password"
        label={t("auth.fields.password")}
        autoComplete="current-password"
        required
        error={state.fields?.password}
      />
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-[14px] text-ink-2 underline-offset-4 hover:underline">
          {t("auth.login.forgot")}
        </Link>
      </div>
      <Submit pending={pending}>{t("auth.login.submit")}</Submit>
    </form>
  );
}

export function RegisterForm() {
  const t = useT();
  const [state, action, pending] = useActionState(registerAction, initial);
  const tzRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (tzRef.current) tzRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }, []);
  return (
    <form action={action} className="space-y-4" noValidate>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <input ref={tzRef} type="hidden" name="timezone" defaultValue="UTC" />
      <Field
        id="name"
        name="name"
        label={t("auth.fields.name")}
        autoComplete="given-name"
        required
        defaultValue={state.values?.name}
        error={state.fields?.name}
      />
      <Field
        id="email"
        name="email"
        type="email"
        label={t("auth.fields.email")}
        autoComplete="email"
        inputMode="email"
        required
        defaultValue={state.values?.email}
        error={state.fields?.email}
      />
      <Field
        id="password"
        name="password"
        type="password"
        label={t("auth.fields.password")}
        autoComplete="new-password"
        required
        minLength={10}
        hint={t("auth.fields.passwordHint")}
        error={state.fields?.password}
      />
      <Submit pending={pending}>{t("auth.register.submit")}</Submit>
    </form>
  );
}

export function ForgotPasswordForm() {
  const t = useT();
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  if (state.success) {
    return (
      <div className="space-y-5">
        <FormAlert tone="success">{state.success}</FormAlert>
        <Link href="/login" className="block text-center text-[15px] font-medium underline-offset-4 hover:underline">
          {t("auth.forgot.backToSignIn")}
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4" noValidate>
      <Field
        id="email"
        name="email"
        type="email"
        label={t("auth.fields.email")}
        autoComplete="email"
        inputMode="email"
        required
        error={state.fields?.email}
      />
      <Submit pending={pending}>{t("auth.forgot.submit")}</Submit>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useT();
  const [state, action, pending] = useActionState(resetPasswordAction, initial);
  return (
    <form action={action} className="space-y-4" noValidate>
      {state.error && <FormAlert>{state.error}</FormAlert>}
      <input type="hidden" name="token" value={token} />
      <Field
        id="password"
        name="password"
        type="password"
        label={t("auth.fields.newPassword")}
        autoComplete="new-password"
        required
        minLength={10}
        hint={t("auth.fields.newPasswordHint")}
        error={state.fields?.password}
      />
      <Submit pending={pending}>{t("auth.reset.submit")}</Submit>
    </form>
  );
}
