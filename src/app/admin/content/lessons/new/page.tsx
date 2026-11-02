import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getModuleAdmin } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { PageHeader } from "../../../ui";
import { LessonForm } from "../lesson-form";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.lesson.newTitle") };
}

export default async function NewLessonPage({ searchParams }: PageProps<"/admin/content/lessons/new">) {
  const user = await requirePermission("content:write");
  const { t } = await getTranslator();
  const moduleId = (await searchParams).module;
  if (typeof moduleId !== "string" || !uuidSchema.safeParse(moduleId).success) notFound();
  let data;
  try {
    data = await getModuleAdmin(getDb(), moduleId);
  } catch (e) {
    if (e instanceof NotFoundError) notFound();
    throw e;
  }
  return (
    <div className="max-w-4xl">
      <PageHeader
        title={t("admin.lesson.newTitle")}
        crumbs={[
          { href: "/admin/content", label: t("admin.content.title") },
          { href: `/admin/content/journeys/${data.journey.id}`, label: data.journey.title },
          { href: `/admin/content/modules/${moduleId}`, label: data.module.title },
        ]}
      />
      <LessonForm moduleId={moduleId} canPublish={can(user.roles, "content:publish")} nextOrder={data.lessons.length + 1} />
    </div>
  );
}
