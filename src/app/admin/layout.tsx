import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can, type Permission } from "@/server/auth/rbac";
import { AdminNav } from "./admin-nav";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  const title = t("admin.meta.title");
  return { title: { default: title, template: `%s · ${title}` }, robots: { index: false } };
}

const NAV: { href: string; key: string; permission: Permission }[] = [
  { href: "/admin", key: "dashboard", permission: "admin:access" },
  { href: "/admin/users", key: "users", permission: "users:read" },
  { href: "/admin/content", key: "content", permission: "content:read" },
  { href: "/admin/audit", key: "audit", permission: "audit:read" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requirePermission("admin:access");
  const { t } = await getTranslator();
  const items = NAV.filter((n) => can(user.roles, n.permission)).map((n) => ({ href: n.href, label: t(`admin.nav.${n.key}`) }));
  const staffRoles = user.roles.filter((r) => r !== "USER").map((r) => t(`admin.roles.${r}.name`));
  return (
    <div className="min-h-dvh bg-bg lg:flex">
      <aside className="border-b border-line px-4 py-4 sm:px-5 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0 lg:py-7">
        <div className="flex items-center justify-between gap-3 lg:block">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <Wordmark />
          </Link>
          <span className="rounded-full bg-hero px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-hero-ink lg:mt-3 lg:inline-block">{t("admin.nav.badge")}</span>
        </div>
        <AdminNav label={t("admin.nav.label")} items={items} back={{ href: "/home", label: t("admin.nav.backToApp") }} />
        <div className="mt-3 flex items-center justify-between gap-3 lg:mt-auto lg:block">
          <LanguageSwitcher />
          <p className="hidden text-[12px] text-muted lg:mt-4 lg:block">
            <span className="block truncate">{user.email}</span>
            {staffRoles.join(", ")}
          </p>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-5 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
