import type { Metadata } from "next";
import Link from "next/link";
import { categoryName } from "@/lib/taxonomy";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listPracticeAdmin } from "@/server/services/admin";
import { PageHeader, StatusBadge, Table } from "../../ui";

export const metadata: Metadata = { title: "Practice tools" };

export default async function PracticeAdminPage() {
  await requirePermission("content:read");
  const rows = await listPracticeAdmin(getDb());
  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Practice tools"
        subtitle="Simulators, trainers and drills shown in the Practice tab."
        crumbs={[{ href: "/admin/content", label: "Content" }]}
        action={
          <Link href="/admin/content/practice/new" className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg">
            New tool
          </Link>
        }
      />
      <Table head={["Tool", "Type", "Category", "Status", "Updated"]}>
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-surface-2">
            <td className="px-4 py-3">
              <Link href={`/admin/content/practice/${r.id}`} className="font-medium hover:underline">
                {r.title}
              </Link>
            </td>
            <td className="px-4 py-3 font-mono text-[12px]">{r.type}</td>
            <td className="px-4 py-3 text-[13px]">{categoryName(r.category)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={r.status} />
            </td>
            <td className="px-4 py-3 text-[13px] text-ink-2">{r.updatedAt.toISOString().slice(0, 10)}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
