import type { Metadata } from "next";
import { getTranslator } from "@/i18n/server";
import { requirePermission } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { listAudit } from "@/server/services/admin";
import { PageHeader, Table } from "../ui";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("admin.audit.title") };
}

export default async function AuditPage() {
  await requirePermission("audit:read");
  const { t } = await getTranslator();
  const rows = await listAudit(getDb(), 200);
  return (
    <div className="max-w-6xl">
      <PageHeader title={t("admin.audit.title")} subtitle={t("admin.audit.subtitle")} />
      <Table head={[t("admin.audit.head.when"), t("admin.audit.head.actor"), t("admin.audit.head.action"), t("admin.audit.head.entity"), t("admin.audit.head.details")]}>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="whitespace-nowrap px-4 py-2.5 text-[13px] tabular-nums text-ink-2">{r.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
            <td className="px-4 py-2.5 text-[13px]">{r.actor ?? "—"}</td>
            <td className="px-4 py-2.5 font-mono text-[12px]">{r.action}</td>
            <td className="px-4 py-2.5 text-[13px]">
              {r.entityType}
              {r.entityId && <span className="ml-1 font-mono text-[11px] text-muted">{r.entityId.slice(0, 8)}</span>}
            </td>
            <td className="max-w-xs truncate px-4 py-2.5 font-mono text-[11px] text-ink-2">{Object.keys(r.metadata).length ? JSON.stringify(r.metadata) : ""}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
