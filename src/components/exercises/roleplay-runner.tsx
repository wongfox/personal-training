"use client";

import { ArrowUp, Flag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { postJSON } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import type { ClientExerciseConfig } from "@/server/engine/client-config";
import type { RunnerProps } from "./runners";

type Config = Extract<ClientExerciseConfig, { type: "roleplay" }>;
type Turn = { role: "user" | "counterpart"; text: string };

export function RoleplayRunner({ exerciseId, config, submitting, locked, onSubmit }: RunnerProps<Config> & { exerciseId: string }) {
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
      setError(e instanceof Error ? e.message : "Couldn't reach the simulator.");
    } finally {
      setThinking(false);
    }
  }

  const userTurns = turns.filter((t) => t.role === "user").length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface-2 p-4 text-[14px] leading-relaxed">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Scenario</p>
        <p className="mt-1">{config.setting}</p>
        <p className="mt-2">
          <span className="font-semibold">{config.counterpart.name}</span> · {config.counterpart.role}
        </p>
        <p className="mt-2 text-ink-2">
          <span className="font-semibold text-ink">Your goal: </span>
          {config.objective}
        </p>
      </div>

      <div className="space-y-3" aria-live="polite">
        {turns.map((t, i) => (
          <div key={i} className={cn("flex", t.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed",
                t.role === "user" ? "rounded-br-lg bg-ink text-bg" : "rounded-bl-lg bg-surface shadow-card",
              )}
            >
              {t.role === "counterpart" && <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{config.counterpart.name}</p>}
              {t.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-lg bg-surface px-4 py-3 shadow-card">
              <span className="inline-flex gap-1" aria-label={`${config.counterpart.name} is typing`}>
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
            Your reply
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
            placeholder="Your reply…"
            className="min-h-14 flex-1 resize-none rounded-3xl border border-line bg-surface px-4 py-3 text-[16px] outline-none focus:border-ink/40"
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={!draft.trim() || thinking}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-bg disabled:opacity-40"
            aria-label="Send reply"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      )}

      {!locked && userTurns > 0 && (
        <Button variant={done ? "primary" : "secondary"} onClick={() => onSubmit({ turns })} disabled={submitting || thinking}>
          <Flag size={16} />
          {submitting ? "Evaluating…" : done ? "Get my feedback" : "End and get feedback"}
        </Button>
      )}
      {mode === "scripted" && <p className="text-center text-[12px] text-muted">Scripted practice partner · connect an AI provider for open-ended conversations</p>}
    </div>
  );
}
