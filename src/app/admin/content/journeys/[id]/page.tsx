import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getJourneyAdmin } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { saveJourneyAction, saveModuleAction } from "../../../actions";
import { AdminForm } from "../../../form";
import { Input, MetaFields, PageHeader, Panel, StatusBadge, Table } from "../../../ui";

export const metadata: Metadata = { title: "Journey" };

export default async function JourneyAdminPage({ params }: PageProps<"/admin/content/journeys/[id]">) {
  const user = await requirePermission("content:read");
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let data;
  try {
    data = await getJourneyAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const { journey, modules } = data;
  const canWrite = can(user.roles, "content:write");
  const canPublish = can(user.roles, "content:publish");

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader title={journey.title} crumbs={[{ href: "/admin/content", label: "Content" }]} action={<StatusBadge status={journey.status} />} />

      <section>
        <h2 className="mb-3 text-[15px] font-semibold">Modules</h2>
        <Table head={["#", "Module", "Status", "Lessons", "Minutes"]}>
          {modules.map((m) => (
            <tr key={m.id} className="hover:bg-surface-2">
              <td className="px-4 py-3 tabular-nums text-muted">{m.order}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/content/modules/${m.id}`} className="font-medium hover:underline">
                  {m.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={m.status} />
              </td>
              <td className="px-4 py-3 tabular-nums">{m.lessons}</td>
              <td className="px-4 py-3 tabular-nums">{m.estimatedMinutes}</td>
            </tr>
          ))}
        </Table>
      </section>

      {canWrite && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel>
            <h2 className="mb-4 text-[15px] font-semibold">Edit journey</h2>
            <AdminForm action={saveJourneyAction} hidden={{ id: journey.id }}>
              <MetaFields values={journey} canPublish={canPublish} minutes={{ min: 1, max: 1000 }} />
              <Input label="Subtitle" name="subtitle" defaultValue={journey.subtitle ?? ""} />
            </AdminForm>
          </Panel>
          <Panel>
            <h2 className="mb-4 text-[15px] font-semibold">Add a module</h2>
            <AdminForm action={saveModuleAction} hidden={{ journeyId: journey.id }} submitLabel="Add module">
              <MetaFields canPublish={canPublish} withSlug={false} values={{ order: modules.length + 1, category: journey.category, difficulty: journey.difficulty, estimatedMinutes: 30 }} minutes={{ min: 1, max: 600 }} />
            </AdminForm>
          </Panel>
        </div>
      )}
    </div>
  );
}
