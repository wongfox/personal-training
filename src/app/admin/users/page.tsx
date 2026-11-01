import type { Metadata } from "next";
import Link from "next/link";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listUsers } from "@/server/services/admin";
import { PageHeader, StatusBadge, Table } from "../ui";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  await requirePermission("users:read");
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : undefined;
  const page = Number(sp.page) || 1;
  const { rows, total } = await listUsers(getDb(), { q, page });
  const pages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="max-w-6xl">
      <PageHeader title="Users" subtitle={`${total} account${total === 1 ? "" : "s"}`} />
      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or email" aria-label="Search users" className="h-10 w-full max-w-sm rounded-xl border border-line bg-surface px-3 text-[14px]" />
        <button className="rounded-full bg-ink px-4 text-[14px] font-medium text-bg">Search</button>
      </form>
      <Table head={["Learner", "Roles", "Status", "Plan", "XP", "Streak", "Last trained", "Joined"]}>
        {rows.map((u) => (
          <tr key={u.id} className="hover:bg-surface-2">
            <td className="px-4 py-3">
              <Link href={`/admin/users/${u.id}`} className="font-medium hover:underline">
                {u.name}
              </Link>
              <div className="text-[12px] text-muted">{u.email}</div>
            </td>
            <td className="px-4 py-3 text-[12px]">{u.roles.filter((r) => r !== "USER").join(", ") || "Learner"}</td>
            <td className="px-4 py-3">
              <StatusBadge status={u.status} />
            </td>
            <td className="px-4 py-3 text-[13px]">{u.onboarded ? "Yes" : "Not yet"}</td>
            <td className="px-4 py-3 tabular-nums">{u.totalXp ?? 0}</td>
            <td className="px-4 py-3 tabular-nums">{u.streak}</td>
            <td className="px-4 py-3 text-[13px] text-ink-2">{u.lastActive ?? "—"}</td>
            <td className="px-4 py-3 text-[13px] text-ink-2">{u.createdAt.toISOString().slice(0, 10)}</td>
          </tr>
        ))}
      </Table>
      {pages > 1 && (
        <nav className="mt-4 flex gap-2 text-[14px]" aria-label="Pages">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`/admin/users?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={p === page ? "font-semibold underline" : "text-ink-2"}>
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
