"use client";

import { LogOut } from "lucide-react";
import { useEffect, useTransition } from "react";
import { logoutAction } from "@/app/(auth)/actions";
import { useT } from "@/i18n/client";
import { clearLocalData } from "@/lib/api-client";

/** Signs out and wipes this device's cached pages and unsynced queue first (shared devices). */
export function SignOutButton() {
  const [pending, start] = useTransition();
  const t = useT();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await clearLocalData();
          await logoutAction();
        })
      }
      className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[15px] font-medium text-danger hover:bg-danger-soft disabled:opacity-60"
    >
      <LogOut size={18} aria-hidden /> {pending ? t("profile.signingOut") : t("profile.signOut")}
    </button>
  );
}

/** Mounted on sign-in screens: whatever a previous user left on this device is discarded. */
export function ClearLocalDataOnMount() {
  useEffect(() => {
    void clearLocalData();
  }, []);
  return null;
}
