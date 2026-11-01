import { OfflineSync } from "@/components/pwa/offline-sync";
import { eq } from "drizzle-orm";
import { ThemeSync } from "@/components/theme-sync";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { userSettings } from "@/server/db/schema";

/** Full-screen flows (lesson, mission, reviews) — no tab bar, one task at a time. */
export default async function FocusLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [settings] = await getDb().select({ theme: userSettings.theme }).from(userSettings).where(eq(userSettings.userId, user.id));
  return (
    <>
      {children}
      <OfflineSync userId={user.id} />
      <ThemeSync theme={settings?.theme ?? "system"} />
    </>
  );
}
