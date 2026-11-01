import { BottomNav, SideNav } from "@/components/app-nav";
import { OfflineSync } from "@/components/pwa/offline-sync";
import { eq } from "drizzle-orm";
import { ThemeSync } from "@/components/theme-sync";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { userSettings } from "@/server/db/schema";
import { can } from "@/server/auth/rbac";

export default async function TabsLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  const [settings] = await getDb().select({ theme: userSettings.theme }).from(userSettings).where(eq(userSettings.userId, user.id));
  return (
    <div className="flex min-h-dvh">
      <SideNav isStaff={can(user.roles, "admin:access")} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-[480px] px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-nav lg:max-w-3xl lg:px-10 lg:pt-10 lg:pb-16">
          {children}
        </main>
      </div>
      <BottomNav />
      <OfflineSync userId={user.id} />
      <ThemeSync theme={settings?.theme ?? "system"} />
    </div>
  );
}
