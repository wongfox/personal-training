"use client";

import { ArrowUp, MessageCircle, Plus, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MarkdownLite } from "@/components/markdown-lite";
import { LeafSprig } from "@/components/scene";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["confident", "meeting", "introduce", "price"] as const;

export function CoachChat({
  firstName,
  initial,
  history,
  aiConnected,
}: {
  firstName: string;
  initial: { id: string; messages: Msg[] } | null;
  history: { id: string; title: string }[];
  aiConnected: boolean;
}) {
  const t = useT();
  const [conversationId, setConversationId] = useState<string | null>(initial?.id ?? null);
  const [messages, setMessages] = useState<Msg[]>(initial?.messages ?? []);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || streaming) return;
    setDraft("");
    setError(null);
    setStreaming(true);
    setMessages((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/coach/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: conversationId ?? undefined, message }),
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? t("coach.unavailable"));
      }
      const id = res.headers.get("X-Conversation-Id");
      if (id && !conversationId) {
        setConversationId(id);
        window.history.replaceState(null, "", `/coach?c=${id}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + chunk };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => m.slice(0, -1));
      setError(e instanceof Error ? e.message : t("common.somethingWrong"));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[640px] flex-col bg-bg">
      <header className="flex items-center gap-3 px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <Link href="/home" aria-label={t("common.close")} className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-surface-2">
          <X size={22} aria-hidden />
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-hero text-hero-ink" aria-hidden>
            <Sparkles size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight">{t("coach.header")}</p>
            <p className="truncate text-[11px] text-muted">{aiConnected ? t("coach.subtitleAi") : t("coach.subtitlePlaybook")}</p>
          </div>
        </div>
        <Link
          href="/coach"
          className="-mr-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-surface-2"
          aria-label={t("coach.newConversation")}
        >
          <Plus size={20} aria-hidden />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="animate-rise">
            <section className="relative isolate overflow-hidden rounded-[28px] bg-hero p-6 text-hero-ink shadow-card">
              <LeafSprig className="absolute -right-4 -bottom-5 -z-10 h-32 w-32 text-hero-ink/20" />
              <h1 className="max-w-[90%] font-display text-[32px] leading-[1.05]">{t("coach.greeting", { name: firstName })}</h1>
              <p className="mt-2 max-w-[90%] text-[14px] text-hero-ink/80">{t("coach.intro")}</p>
            </section>
            <h2 className="mt-6 px-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{t("coach.suggestionsLabel")}</h2>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {SUGGESTIONS.map((key) => {
                const s = t(`coach.suggestions.${key}`);
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full bg-surface px-4 py-2.5 text-left text-[14px] font-medium text-ink shadow-card transition hover:bg-accent-soft active:scale-[0.98]"
                    >
                      {s}
                    </button>
                  </li>
                );
              })}
            </ul>
            {history.length > 0 && (
              <div className="mt-8">
                <h2 className="px-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">{t("coach.earlier")}</h2>
                <ul className="mt-2.5 divide-y divide-line rounded-[28px] bg-surface px-4 shadow-card">
                  {history.map((h) => (
                    <li key={h.id}>
                      <Link href={`/coach?c=${h.id}`} className="flex items-center gap-3 py-3.5 text-[14px] text-ink-2 hover:text-ink">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent" aria-hidden>
                          <MessageCircle size={15} />
                        </span>
                        <span className="truncate">{h.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <ol className="space-y-4" aria-live="polite">
            {messages.map((m, i) => (
              <li key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-[24px] rounded-br-md bg-hero px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-hero-ink shadow-card">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[92%] rounded-[24px] rounded-bl-md bg-surface px-4 py-3 shadow-card">
                    {m.content ? (
                      <MarkdownLite source={m.content} />
                    ) : (
                      <span className="inline-flex gap-1 py-2" role="status" aria-label={t("coach.thinking")}>
                        {[0, 1, 2].map((d) => (
                          <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
                        ))}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
        {error && <p className="mt-4 rounded-[20px] bg-danger-soft px-4 py-3 text-[14px] text-danger">{error}</p>}
        <div ref={endRef} />
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
        className="bg-bg px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2 rounded-[28px] bg-surface p-1.5 pl-5 shadow-card ring-1 ring-line focus-within:ring-accent/40">
          <label htmlFor="coach-input" className="sr-only">
            {t("coach.inputLabel")}
          </label>
          <textarea
            id="coach-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(draft);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={t("coach.placeholder")}
            className="max-h-36 min-h-11 flex-1 resize-none bg-transparent py-2.5 text-[16px] outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!draft.trim() || streaming}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-hero text-hero-ink transition hover:brightness-110 active:scale-95 disabled:opacity-40"
            aria-label={t("coach.send")}
          >
            <ArrowUp size={20} aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
