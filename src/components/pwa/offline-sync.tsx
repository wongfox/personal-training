"use client";

import { CloudOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/i18n/client";
import { flushOutbox, pendingCount, setOutboxUser } from "@/lib/api-client";

/** Flushes queued progress when the app comes back online, and shows an offline banner. */
export function OfflineSync({ userId }: { userId: string }) {
  const router = useRouter();
  const t = useT();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOutboxUser(userId);
    const sync = async () => {
      setOffline(!navigator.onLine);
      if (navigator.onLine && pendingCount() > 0) {
        const sent = await flushOutbox();
        if (sent > 0) router.refresh();
      }
    };
    void sync();
    const goOffline = () => setOffline(true);
    window.addEventListener("online", sync);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", goOffline);
    };
  }, [router, userId]);

  if (!offline) return null;
  return (
    <div role="status" className="fixed inset-x-0 top-0 z-50 flex justify-center pt-[max(0.5rem,env(safe-area-inset-top))]">
      <span className="inline-flex items-center gap-2 rounded-full bg-hero px-4 py-2 text-[13px] text-hero-ink shadow-card">
        <CloudOff size={14} aria-hidden /> {t("common.offlineBanner")}
      </span>
    </div>
  );
}
