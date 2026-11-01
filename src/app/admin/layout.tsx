import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { requirePermission } from "@/server/auth/current-user";
import { can, type Permission } from "@/server/auth/rbac";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

const NAV: { href: string; label: string; permission: Permission }[] = [
  { href: "/admin", label: "Dashboard", permission: "admin:access" },
  { href: "/admin/users", label: "Users", permission: "users:read" },
  { href: "/admin/content", label: "Content", permission: "content:read" },
  { href: "/admin/audit", label: "Audit log", permission: "audit:read" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requirePermission("admin:access");
  const items = NAV.filter((n) => can(user.roles, n.permission));
  return (
    <div className="min-h-dvh lg:flex">
      <aside className="border-b border-line px-5 py-4 lg:sticky lg:top-0 lg:h-dvh lg:w-56 lg:shrink-0 lg:border-r lg:border-b-0 lg:py-7">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <Wordmark />
          </Link>
          <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-bg lg:mt-3 lg:inline-block">Admin</span>
        </div>
        <nav aria-label="Admin" className="no-scrollbar -mx-1 mt-4 flex gap-1 overflow-x-auto lg:mx-0 lg:mt-10 lg:flex-col">
          {items.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 rounded-xl px-3 py-2 text-[14px] font-medium text-ink-2 hover:bg-surface-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
          <Link href="/home" className="shrink-0 rounded-xl px-3 py-2 text-[14px] text-muted hover:bg-surface-2 hover:text-ink lg:mt-6">
            ← Back to app
          </Link>
        </nav>
        <p className="mt-4 hidden text-[12px] text-muted lg:block">
          {user.email}
          <br />
          {user.roles.filter((r) => r !== "USER").join(", ")}
        </p>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
