"use client";

import { ArrowUp, Flag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { postJSON } from "@/lib/api-client";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";
import type { ClientExerciseConfig } from "@/server/engine/client-config";
import type { RunnerProps } from "./runners";

type Config = Extract<ClientExerciseConfig, { type: "roleplay" }>;
type Turn = { role: "user" | "counterpart"; text: string };

export function RoleplayRunner({ exerciseId, config, submitting, locked, onSubmit }: RunnerProps<Config> & { exerciseId: string }) {
  const t = useT();
  const [turns, setTurns] = useState<Turn[]>([{ role: "counterpart", text: config.openingLine }]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<"ai" | "scripted" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [turns, thinking]);

  async function send() {
    const text = draft.trim();
    if (!text || thinking) return;
    const next: Turn[] = [...turns, { role: "user", text }];
    setTurns(next);
    setDraft("");
    setThinking(true);
    setError(null);
    try {
      const res = await postJSON<{ reply: string | null; done: boolean; mode: "ai" | "scripted" }>(
        `/api/practice/${exerciseId}/turn`,
        { turns: next },
      );
      setMode(res.mode);
      if (res.reply) setTurns([...next, { role: "counterpart", text: res.reply }]);
      if (res.done) setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("exercises.roleplay.reachError"));
    } finally {
      setThinking(false);
    }
  }

  const userTurns = turns.filter((turn) => turn.role === "user").length;

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] bg-accent-soft p-5 text-[14px] leading-relaxed text-ink">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("exercises.roleplay.scenario")}</p>
        <p className="mt-1.5">{config.setting}</p>
        <div className="mt-3 flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-hero font-display text-[17px] text-hero-ink" aria-hidden>
            {config.counterpart.name.slice(0, 1).toUpperCase()}
          </span>
          <p className="min-w-0">
            <span className="block font-semibold">{config.counterpart.name}</span>
            <span className="block text-[13px] text-ink-2">{config.counterpart.role}</span>
          </p>
        </div>
        <p className="mt-3 border-t border-accent/15 pt-3 text-ink-2">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">{t("exercises.roleplay.goal")}</span>
          <span className="mt-0.5 block text-ink">{config.objective}</span>
        </p>
      </div>

      <div className="space-y-3" aria-live="polite">
        {turns.map((turn, i) => (
          <div key={i} className={cn("flex", turn.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-[24px] px-4 py-3 text-[15px] leading-relaxed",
                turn.role === "user" ? "rounded-br-lg bg-hero text-hero-ink" : "rounded-bl-lg bg-surface shadow-card",
              )}
            >
              {turn.role === "counterpart" && <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">{config.counterpart.name}</p>}
              {turn.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-[24px] rounded-bl-lg bg-surface px-4 py-3 shadow-card">
              <span role="status" className="inline-flex gap-1" aria-label={t("exercises.roleplay.typing", { name: config.counterpart.name })}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="text-[14px] text-danger">{error}</p>}

      {!locked && !done && (
        <div className="flex items-end gap-2">
          <label htmlFor="reply" className="sr-only">
            {t("exercises.roleplay.replyLabel")}
          </label>
          <textarea
            id="reply"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            rows={2}
            maxLength={1500}
            placeholder={t("exercises.roleplay.placeholder")}
            className="min-h-14 flex-1 resize-none rounded-[24px] border border-line bg-surface px-4 py-3 text-[16px] outline-none placeholder:text-muted focus:border-accent/50"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={!draft.trim() || thinking}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hero text-hero-ink shadow-card transition active:scale-95 disabled:opacity-40"
            aria-label={t("exercises.roleplay.send")}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      )}

      {!locked && userTurns > 0 && (
        <Button variant={done ? "primary" : "secondary"} onClick={() => onSubmit({ turns })} disabled={submitting || thinking}>
          <Flag size={16} aria-hidden />
          {submitting ? t("exercises.roleplay.evaluating") : done ? t("exercises.roleplay.getFeedback") : t("exercises.roleplay.endAndFeedback")}
        </Button>
      )}
      {mode === "scripted" && <p className="text-center text-[12px] text-muted">{t("exercises.roleplay.scripted")}</p>}
    </div>
  );
}
