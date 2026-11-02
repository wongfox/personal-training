import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getResourceAdmin, hasSpanish } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { EsMissingBadge, isLiveLocked, LiveNotice, PageHeader, Panel, StatusBadge } from "../../../ui";
import { ResourceForm } from "../../library-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.resource.metaTitle") };
}

export default async function ResourceAdminPage({ params }: PageProps<"/admin/content/resources/[id]">) {
  const user = await requirePermission("content:read");
  const { t } = await getTranslator();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let resource;
  try {
    resource = await getResourceAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const canWrite = can(user.roles, "content:write");
  const canPublish = can(user.roles, "content:publish");
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={resource.title}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: "/admin/content/resources", label: t("admin.resource.listTitle") },
        ]}
        action={
          <div className="flex items-center gap-2">
            {!hasSpanish(resource.translations) && <EsMissingBadge />}
            <StatusBadge status={resource.status} />
          </div>
        }
      />
      {canWrite && isLiveLocked(canPublish, resource.status) ? (
        <LiveNotice />
      ) : (
        <Panel>{canWrite ? <ResourceForm resource={resource} canPublish={canPublish} /> : <p>{t("admin.content.readOnly")}</p>}</Panel>
      )}
    </div>
  );
}
