import { BottomNav, SideNav } from "@/components/app-nav";
import { OfflineSync } from "@/components/pwa/offline-sync";
import { requireUser } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";

export default async function TabsLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  return (
    <div className="flex min-h-dvh">
      <SideNav isStaff={can(user.roles, "admin:access")} />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-[480px] px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-nav lg:max-w-3xl lg:px-10 lg:pt-10 lg:pb-16">
          {children}
        </main>
      </div>
      <BottomNav />
      <OfflineSync />
    </div>
  );
}
