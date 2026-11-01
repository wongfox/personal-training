import { OfflineSync } from "@/components/pwa/offline-sync";
import { requireUser } from "@/server/auth/current-user";

/** Full-screen flows (lesson, mission, reviews) — no tab bar, one task at a time. */
export default async function FocusLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();
  return (
    <>
      {children}
      <OfflineSync userId={user.id} />
    </>
  );
}
