"use client";

import { ArrowUp, MessageCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MarkdownLite } from "@/components/markdown-lite";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How can I sound more confident?",
  "What should I say in tomorrow's meeting?",
  "How do I introduce myself at an event?",
  "How can I respond to a price objection?",
];

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
        throw new Error(data.error ?? "Your coach couldn't answer right now.");
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
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[640px] flex-col">
      <header className="flex items-center gap-3 border-b border-line px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <Link href="/home" className="-ml-2 rounded-full px-2 py-1.5 text-[14px] text-ink-2 hover:bg-surface-2">
          Close
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[15px] font-semibold">Your coach</p>
          <p className="text-[11px] text-muted">{aiConnected ? "Knows your plan, progress and missions" : "Playbook mode · answers from your library"}</p>
        </div>
        <Link href="/coach" className="-mr-2 grid h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2" aria-label="New conversation">
          <Plus size={20} />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div className="animate-rise">
            <h1 className="font-display text-[34px] leading-[1.05]">What are you working on, {firstName}?</h1>
            <p className="mt-2 text-[15px] text-ink-2">Ask about a meeting, a conversation, a pitch — anything you want to handle better.</p>
            <ul className="mt-6 space-y-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => void send(s)} className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-left text-[15px] hover:border-ink/30">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            {history.length > 0 && (
              <div className="mt-10">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Earlier conversations</p>
                <ul className="mt-2 divide-y divide-line">
                  {history.map((h) => (
                    <li key={h.id}>
                      <Link href={`/coach?c=${h.id}`} className="flex items-center gap-3 py-3 text-[14px] text-ink-2 hover:text-ink">
                        <MessageCircle size={15} className="shrink-0" />
                        <span className="truncate">{h.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <ol className="space-y-5" aria-live="polite">
            {messages.map((m, i) => (
              <li key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-ink px-4 py-3 text-[15px] leading-relaxed text-bg">{m.content}</div>
                ) : (
                  <div className="max-w-[95%]">
                    {m.content ? (
                      <MarkdownLite source={m.content} />
                    ) : (
                      <span className="inline-flex gap-1 py-2" aria-label="Coach is thinking">
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
        {error && <p className="mt-4 rounded-2xl bg-danger-soft px-4 py-3 text-[14px] text-danger">{error}</p>}
        <div ref={endRef} />
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
        className="border-t border-line bg-bg px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="coach-input" className="sr-only">
            Message your coach
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
            placeholder="Ask your coach…"
            className="max-h-36 min-h-12 flex-1 resize-none rounded-3xl border border-line bg-surface px-4 py-3 text-[16px] outline-none focus:border-ink/40"
          />
          <button type="submit" disabled={!draft.trim() || streaming} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-bg disabled:opacity-40" aria-label="Send">
            <ArrowUp size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
