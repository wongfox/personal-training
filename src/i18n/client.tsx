"use client";

import { createContext, type ReactNode, use, useMemo } from "react";
import type { Locale } from "./config";
import { createTranslator, type MessageTree, type TFunction } from "./translate";

const I18nContext = createContext<{ locale: Locale; t: TFunction } | null>(null);

/** Makes the current language's messages available to client components. */
export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: MessageTree; children: ReactNode }) {
  const value = useMemo(() => ({ locale, t: createTranslator(messages) }), [locale, messages]);
  return <I18nContext value={value}>{children}</I18nContext>;
}

function useI18n() {
  const ctx = use(I18nContext);
  if (!ctx) throw new Error("useT must be used inside <I18nProvider>");
  return ctx;
}

export function useT(): TFunction {
  return useI18n().t;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
