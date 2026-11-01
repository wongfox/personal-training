import type { exercises, resources } from "@/server/db/schema";
import { savePracticeAction, saveResourceAction } from "../actions";
import { AdminForm } from "../form";
import { Area, Input, MetaFields, Select } from "../ui";

const RESOURCE_TYPES = [
  { value: "framework", label: "Framework" },
  { value: "cheat_sheet", label: "Cheat sheet" },
  { value: "template", label: "Template" },
  { value: "case_study", label: "Case study" },
  { value: "insight", label: "Expert insight" },
  { value: "video", label: "Video" },
];

export function ResourceForm({ resource, canPublish }: { resource?: typeof resources.$inferSelect; canPublish: boolean }) {
  return (
    <AdminForm action={saveResourceAction} hidden={resource ? { id: resource.id } : undefined} submitLabel={resource ? "Save" : "Create"}>
      <MetaFields values={resource ?? { estimatedMinutes: 5 }} canPublish={canPublish} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Type" name="type" defaultValue={resource?.type ?? "framework"} options={RESOURCE_TYPES} />
        <Input label="Link (https only, optional)" name="url" defaultValue={resource?.url ?? ""} type="url" />
      </div>
      <Area
        label="Body"
        name="body"
        defaultValue={resource?.body}
        rows={16}
        hint="Paragraphs separated by blank lines; ## headings, - bullets, 1. steps, **bold**."
      />
    </AdminForm>
  );
}

export function PracticeForm({ tool, canPublish }: { tool?: typeof exercises.$inferSelect; canPublish: boolean }) {
  return (
    <AdminForm action={savePracticeAction} hidden={tool ? { id: tool.id } : undefined} submitLabel={tool ? "Save" : "Create"}>
      <MetaFields values={tool ?? { estimatedMinutes: 5 }} canPublish={canPublish} />
      <Area
        label="Config (JSON)"
        name="config"
        defaultValue={tool ? JSON.stringify(tool.config, null, 2) : ""}
        rows={20}
        className="font-mono"
        spellCheck={false}
        hint="Same shape as lesson exercises. Use type roleplay for simulators and pitch for the presentation trainer."
      />
    </AdminForm>
  );
}
