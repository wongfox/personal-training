"use client";

import { useEffect } from "react";

/** Applies the account's saved theme on this device (the pre-paint script reads it next time). */
export function ThemeSync({ theme }: { theme: string }) {
  useEffect(() => {
    const root = document.documentElement;
    try {
      if (theme === "light" || theme === "dark") localStorage.setItem("pgos-theme", theme);
      else localStorage.removeItem("pgos-theme");
    } catch {
      /* storage unavailable */
    }
    if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
  }, [theme]);
  return null;
}
