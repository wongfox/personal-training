import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getLessonAdmin, hasSpanish } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { EsMissingBadge, isLiveLocked, LiveNotice, PageHeader, StatusBadge } from "../../../ui";
import { LessonForm } from "../lesson-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.lesson.metaTitle") };
}

export default async function LessonAdminPage({ params }: PageProps<"/admin/content/lessons/[id]">) {
  const user = await requirePermission("content:read");
  const { t } = await getTranslator();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  let data;
  try {
    data = await getLessonAdmin(getDb(), id);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  const canWrite = can(user.roles, "content:write");
  const canPublish = can(user.roles, "content:publish");
  return (
    <div className="max-w-4xl">
      <PageHeader
        title={data.lesson.title}
        subtitle={t("admin.lesson.stats", { started: data.stats.started, completed: data.stats.completed })}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: `/admin/content/journeys/${data.module.journeyId}`, label: t("admin.lesson.journeyCrumb") },
          { href: `/admin/content/modules/${data.module.id}`, label: data.module.title },
        ]}
        action={
          <div className="flex items-center gap-2">
            {!hasSpanish(data.lesson.translations) && <EsMissingBadge />}
            <StatusBadge status={data.lesson.status} />
          </div>
        }
      />
      {canWrite && isLiveLocked(canPublish, data.lesson.status) ? (
        <LiveNotice />
      ) : canWrite ? (
        <LessonForm moduleId={data.module.id} lesson={data.lesson} exercise={data.exercise} questions={data.questions} action={data.action} canPublish={canPublish} />
      ) : (
        <p className="text-ink-2">{t("admin.lesson.readOnly")}</p>
      )}
    </div>
  );
}
