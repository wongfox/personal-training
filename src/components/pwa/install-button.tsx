"use client";

import { Download, Share } from "lucide-react";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/client";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** "Install app" row: native prompt on Chromium, a short hint on iOS Safari, hidden once installed. */
export function InstallButton() {
  const t = useT();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(true);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    // Defer state updates to a microtask so this effect only subscribes.
    queueMicrotask(() => {
      setInstalled(standalone);
      setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    });
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (installed || (!deferred && !ios)) return null;

  if (deferred) {
    return (
      <button
        type="button"
        onClick={async () => {
          await deferred.prompt();
          const choice = await deferred.userChoice;
          if (choice.outcome === "accepted") setInstalled(true);
          setDeferred(null);
        }}
        className="flex w-full items-center gap-3 rounded-[22px] bg-surface px-4 py-3 text-left text-[15px] font-medium shadow-card hover:bg-surface-2"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <Download size={18} aria-hidden />
        </span>
        {t("profile.install.button")}
      </button>
    );
  }
  return (
    <p className="flex items-start gap-3 rounded-[22px] bg-surface px-4 py-3.5 text-[14px] text-ink-2 shadow-card">
      <Share size={18} className="mt-0.5 shrink-0" aria-hidden />
      {t("profile.install.ios")}
    </p>
  );
}
