import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getPracticeAdmin, hasSpanish } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { EsMissingBadge, isLiveLocked, LiveNotice, PageHeader, Panel, StatusBadge } from "../../../ui";
import { PracticeForm } from "../../library-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.practice.metaTitle") };
}

export default async function PracticeToolAdminPage({ params }: PageProps<"/admin/content/practice/[id]">) {
  const user = await requirePermission("content:read");
  const { t } = await getTranslator();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let tool;
  try {
    tool = await getPracticeAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const canWrite = can(user.roles, "content:write");
  const canPublish = can(user.roles, "content:publish");
  return (
    <div className="max-w-3xl">
      <PageHeader
        title={tool.title}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: "/admin/content/practice", label: t("admin.practice.listTitle") },
        ]}
        action={
          <div className="flex items-center gap-2">
            {!hasSpanish(tool.translations) && <EsMissingBadge />}
            <StatusBadge status={tool.status} />
          </div>
        }
      />
      {canWrite && isLiveLocked(canPublish, tool.status) ? (
        <LiveNotice />
      ) : (
        <Panel>{canWrite ? <PracticeForm tool={tool} canPublish={canPublish} /> : <p>{t("admin.content.readOnly")}</p>}</Panel>
      )}
    </div>
  );
}
