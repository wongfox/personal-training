import type { Metadata } from "next";
import Link from "next/link";
import { categoryName } from "@/lib/taxonomy";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listJourneysAdmin, reviewQueue } from "@/server/services/admin";
import { PageHeader, Panel, StatusBadge, Table } from "../ui";

export const metadata: Metadata = { title: "Content" };

export default async function ContentPage() {
  await requirePermission("content:read");
  const db = getDb();
  const [journeys, queue] = await Promise.all([listJourneysAdmin(db), reviewQueue(db)]);
  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Content"
        subtitle="Journeys → modules → lessons (with exercise, knowledge check and mission), plus the Practice and Explore libraries."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/content/practice" className="rounded-full border border-line px-4 py-2 text-[14px] font-medium hover:bg-surface-2">
              Practice tools
            </Link>
            <Link href="/admin/content/resources" className="rounded-full border border-line px-4 py-2 text-[14px] font-medium hover:bg-surface-2">
              Explore library
            </Link>
            <Link href="/admin/content/journeys/new" className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg">
              New journey
            </Link>
          </div>
        }
      />
      {queue.length > 0 && (
        <Panel className="mb-6">
          <h2 className="text-[15px] font-semibold">In review ({queue.length})</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {queue.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-[13px] text-accent">
                  {q.kind}: {q.title}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <Table head={["Journey", "Category", "Status", "Modules", "Lessons", "Learners", "Order"]}>
        {journeys.map((j) => (
          <tr key={j.id} className="hover:bg-surface-2">
            <td className="px-4 py-3">
              <Link href={`/admin/content/journeys/${j.id}`} className="font-medium hover:underline">
                {j.title}
              </Link>
              <div className="font-mono text-[11px] text-muted">{j.slug}</div>
            </td>
            <td className="px-4 py-3 text-[13px]">{categoryName(j.category)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={j.status} />
            </td>
            <td className="px-4 py-3 tabular-nums">{j.modules}</td>
            <td className="px-4 py-3 tabular-nums">{j.lessons}</td>
            <td className="px-4 py-3 tabular-nums">{j.learners}</td>
            <td className="px-4 py-3 tabular-nums">{j.order}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
