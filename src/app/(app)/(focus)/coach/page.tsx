import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslator } from "@/i18n/server";
import { aiEnabled } from "@/server/ai/client";
import { requireUser } from "@/server/auth/current-user";
import { getDb } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import { getConversation, listConversations } from "@/server/services/coach";
import { uuidSchema } from "@/server/validation";
import { CoachChat } from "./chat";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("coach.title") };
}

export default async function CoachPage({ searchParams }: PageProps<"/coach">) {
  const user = await requireUser();
  const { c } = await searchParams;
  const db = getDb();
  let initial: { id: string; messages: { role: "user" | "assistant"; content: string }[] } | null = null;
  if (typeof c === "string") {
    if (!uuidSchema.safeParse(c).success) notFound();
    try {
      const { conversation, messages } = await getConversation(db, user.id, c);
      initial = { id: conversation.id, messages: messages.map((m) => ({ role: m.role, content: m.content })) };
    } catch (e) {
      if (e instanceof NotFoundError) notFound();
      throw e;
    }
  }
  const history = await listConversations(db, user.id);
  return (
    <CoachChat
      key={initial?.id ?? "new"}
      firstName={user.name.split(" ")[0]}
      initial={initial}
      history={history.map((h) => ({ id: h.id, title: h.title }))}
      aiConnected={aiEnabled()}
    />
  );
}
