import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getLessonAdmin } from "@/server/services/admin";
import { uuidSchema } from "@/server/validation";
import { PageHeader, StatusBadge } from "../../../ui";
import { LessonForm } from "../lesson-form";

export const metadata: Metadata = { title: "Lesson" };

export default async function LessonAdminPage({ params }: PageProps<"/admin/content/lessons/[id]">) {
  const user = await requirePermission("content:read");
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
  return (
    <div className="max-w-4xl">
      <PageHeader
        title={data.lesson.title}
        subtitle={`${data.stats.started} learners started · ${data.stats.completed} completed`}
        crumbs={[
          { href: "/admin/content", label: "Content" },
          { href: `/admin/content/journeys/${data.module.journeyId}`, label: "Journey" },
          { href: `/admin/content/modules/${data.module.id}`, label: data.module.title },
        ]}
        action={<StatusBadge status={data.lesson.status} />}
      />
      {canWrite ? (
        <LessonForm moduleId={data.module.id} lesson={data.lesson} exercise={data.exercise} questions={data.questions} action={data.action} canPublish={can(user.roles, "content:publish")} />
      ) : (
        <p className="text-ink-2">You have read-only access to content.</p>
      )}
    </div>
  );
}
