import { getTranslator } from "@/i18n/server";
import type { exercises, resources } from "@/server/db/schema";
import { hasSpanish } from "@/server/services/admin";
import { savePracticeAction, saveResourceAction } from "../actions";
import { AdminForm } from "../form";
import { LangTabs, PrefillButton } from "../lang-tabs";
import { Area, englishHint, Input, MetaFields, Select, SpanishIntro, SpanishMetaFields, spanishOf } from "../ui";

const RESOURCE_TYPES = ["framework", "cheat_sheet", "template", "case_study", "insight", "video"] as const;

export async function ResourceForm({ resource, canPublish }: { resource?: typeof resources.$inferSelect; canPublish: boolean }) {
  const { t } = await getTranslator();
  const es = spanishOf<{ title: string; description: string; body: string }>(resource);
  return (
    <AdminForm action={saveResourceAction} hidden={resource ? { id: resource.id } : undefined} submitLabel={resource ? t("common.save") : t("admin.form.create")}>
      <LangTabs
        esMissing={!hasSpanish(resource?.translations)}
        en={
          <>
            <MetaFields values={resource ?? { estimatedMinutes: 5 }} canPublish={canPublish} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label={t("admin.resource.type")}
                name="type"
                defaultValue={resource?.type ?? "framework"}
                options={RESOURCE_TYPES.map((value) => ({ value, label: t(`taxonomy.resourceTypes.${value}`) }))}
              />
              <Input label={t("admin.resource.link")} name="url" defaultValue={resource?.url ?? ""} type="url" />
            </div>
            <Area label={t("admin.resource.body")} name="body" defaultValue={resource?.body} rows={16} hint={t("admin.resource.bodyHint")} />
          </>
        }
        es={
          <>
            <SpanishIntro />
            <SpanishMetaFields english={{ title: resource?.title, description: resource?.description }} spanish={es} />
            <Area
              label={t("admin.resource.body")}
              name="es_body"
              defaultValue={typeof es.body === "string" ? es.body : ""}
              placeholder={englishHint(t, resource?.body)}
              rows={16}
              hint={t("admin.resource.bodyHint")}
            />
          </>
        }
      />
    </AdminForm>
  );
}

export async function PracticeForm({ tool, canPublish }: { tool?: typeof exercises.$inferSelect; canPublish: boolean }) {
  const { t } = await getTranslator();
  const es = spanishOf<{ title: string; description: string; config: unknown }>(tool);
  return (
    <AdminForm action={savePracticeAction} hidden={tool ? { id: tool.id } : undefined} submitLabel={tool ? t("common.save") : t("admin.form.create")}>
      <LangTabs
        esMissing={!hasSpanish(tool?.translations)}
        en={
          <>
            <MetaFields values={tool ?? { estimatedMinutes: 5 }} canPublish={canPublish} />
            <Area
              label={t("admin.practice.config")}
              name="config"
              defaultValue={tool ? JSON.stringify(tool.config, null, 2) : ""}
              rows={20}
              className="font-mono"
              spellCheck={false}
              hint={t("admin.practice.configHint")}
            />
          </>
        }
        es={
          <>
            <SpanishIntro />
            <SpanishMetaFields english={{ title: tool?.title, description: tool?.description }} spanish={es} />
            <Area
              label={t("admin.practice.esConfig")}
              name="es_config"
              defaultValue={es.config ? JSON.stringify(es.config, null, 2) : ""}
              rows={20}
              className="font-mono"
              spellCheck={false}
              hint={t("admin.practice.esConfigHint")}
            />
            {tool && (
              <div>
                <PrefillButton target="es_config" value={JSON.stringify(tool.config, null, 2)} />
              </div>
            )}
          </>
        }
      />
    </AdminForm>
  );
}
