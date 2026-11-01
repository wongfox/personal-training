import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getModuleAdmin } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { saveModuleAction } from "../../../actions";
import { AdminForm } from "../../../form";
import { MetaFields, PageHeader, Panel, StatusBadge, Table } from "../../../ui";

export const metadata: Metadata = { title: "Module" };

export default async function ModuleAdminPage({ params }: PageProps<"/admin/content/modules/[id]">) {
  const user = await requirePermission("content:read");
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let data;
  try {
    data = await getModuleAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const { module: mod, journey, lessons } = data;
  const canWrite = can(user.roles, "content:write");

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title={mod.title}
        crumbs={[
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/journeys/${journey.id}`, label: journey.title },
        ]}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={mod.status} />
            {canWrite && (
              <Link href={`/admin/content/lessons/new?module=${mod.id}`} className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg">
                New lesson
              </Link>
            )}
          </div>
        }
      />
      <Table head={["#", "Lesson", "Status", "Minutes", "Updated"]}>
        {lessons.map((l) => (
          <tr key={l.id} className="hover:bg-surface-2">
            <td className="px-4 py-3 tabular-nums text-muted">{l.order}</td>
            <td className="px-4 py-3">
              <Link href={`/admin/content/lessons/${l.id}`} className="font-medium hover:underline">
                {l.title}
              </Link>
              <div className="font-mono text-[11px] text-muted">{l.slug}</div>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={l.status} />
            </td>
            <td className="px-4 py-3 tabular-nums">{l.estimatedMinutes}</td>
            <td className="px-4 py-3 text-[13px] text-ink-2">{l.updatedAt.toISOString().slice(0, 10)}</td>
          </tr>
        ))}
      </Table>
      {canWrite && (
        <Panel className="max-w-3xl">
          <h2 className="mb-4 text-[15px] font-semibold">Edit module</h2>
          <AdminForm action={saveModuleAction} hidden={{ id: mod.id, journeyId: journey.id }}>
            <MetaFields values={mod} canPublish={can(user.roles, "content:publish")} withSlug={false} minutes={{ min: 1, max: 600 }} />
          </AdminForm>
        </Panel>
      )}
    </div>
  );
}
