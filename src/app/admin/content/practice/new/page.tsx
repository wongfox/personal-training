import type { Metadata } from "next";
import { requirePermission } from "@/server/auth/current-user";
import { can } from "@/server/auth/rbac";
import { PageHeader, Panel } from "../../../ui";
import { PracticeForm } from "../../library-forms";

export const metadata: Metadata = { title: "New practice tool" };

export default async function NewPracticePage() {
  const user = await requirePermission("content:write");
  return (
    <div className="max-w-3xl">
      <PageHeader title="New practice tool" crumbs={[{ href: "/admin/content", label: "Content" }, { href: "/admin/content/practice", label: "Practice tools" }]} />
      <Panel>
        <PracticeForm canPublish={can(user.roles, "content:publish")} />
      </Panel>
    </div>
  );
}
