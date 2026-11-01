"use client";

import { LogoMark } from "@/components/brand";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center px-6 text-center">
      <LogoMark size={40} />
      <h1 className="mt-8 font-display text-[34px] leading-tight">Something slipped.</h1>
      <p className="mt-3 text-[15px] text-ink-2">That wasn&apos;t you. Try again — your progress is safe.</p>
      <button type="button" onClick={reset} className="mt-8 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg">
        Try again
      </button>
    </div>
  );
}
