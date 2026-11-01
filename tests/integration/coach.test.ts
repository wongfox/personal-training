import { beforeAll, describe, expect, it } from "vitest";
import type { DB } from "@/server/db";
import { playbookReply } from "@/server/services/coach";
import { setupDatabase } from "./helpers";

const ctx = { firstName: "Juan", text: "", primarySkill: "Communication", journeyTitle: "Communication Mastery" };

describe("playbook coach (no AI provider)", () => {
  let db: DB;
  beforeAll(async () => {
    db = await setupDatabase();
  });

  it.each([
    ["I freeze when my boss asks me a question in meetings", /question|pressure|pause|answer|nerv/i],
    ["How do I stop rambling in meetings?", /point|bottom line|first sentence|concise|lead with/i],
    ["How do I introduce myself at a networking event?", /intro|one line|who you help/i],
    ["I always forget people's names", /name/i],
  ])("answers %s on topic", async (question, expected) => {
    const reply = await playbookReply(db, question, ctx);
    const firstBlock = reply.split("\n\n").slice(0, 2).join(" ");
    expect(firstBlock).toMatch(expected);
    expect(reply).not.toMatch(/builds exactly this/);
  });
});
