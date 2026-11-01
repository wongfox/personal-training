import type { Metadata } from "next";
import { LogoMark } from "@/components/brand";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col items-center justify-center px-6 text-center">
      <LogoMark size={44} />
      <h1 className="mt-8 font-display text-[34px] leading-tight">You&apos;re offline.</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
        Lessons you&apos;ve opened recently are still available. Anything you complete while offline is saved on this device and syncs when
        you reconnect.
      </p>
      <a href="/home" className="mt-8 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-bg">
        Try again
      </a>
    </div>
  );
}
