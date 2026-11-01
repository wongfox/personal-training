"use client";

/**
 * JSON client for the app's REST endpoints. Writes that are safe to replay
 * (idempotent on the server) can be queued when the device is offline and are
 * flushed, in order, once connectivity returns.
 */

const OUTBOX_KEY = "pgos-outbox";

interface QueuedRequest {
  url: string;
  body: unknown;
  queuedAt: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function readOutbox(): QueuedRequest[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) ?? "[]") as QueuedRequest[];
  } catch {
    return [];
  }
}

function writeOutbox(items: QueuedRequest[]) {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable — nothing we can do */
  }
}

export function pendingCount(): number {
  return readOutbox().length;
}

export async function postJSON<T>(url: string, body: unknown, opts: { queueOffline?: boolean } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
    });
  } catch (e) {
    if (opts.queueOffline) {
      writeOutbox([...readOutbox(), { url, body, queuedAt: Date.now() }]);
      return { queued: true } as T;
    }
    throw new ApiError("You're offline. Check your connection and try again.", 0);
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new ApiError(data.error ?? "Something went wrong. Please try again.", res.status);
  return data as T;
}

let flushing = false;

/** Replays queued writes in order. Stops at the first network failure. */
export async function flushOutbox(): Promise<number> {
  if (flushing) return 0;
  flushing = true;
  let sent = 0;
  try {
    let queue = readOutbox();
    while (queue.length > 0) {
      const [head, ...rest] = queue;
      try {
        const res = await fetch(head.url, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Offline-Replay": "1" },
          body: JSON.stringify(head.body),
          credentials: "same-origin",
        });
        // 4xx means the server rejected it for good (e.g. already done) — drop it.
        if (res.status >= 500) break;
      } catch {
        break;
      }
      queue = rest;
      writeOutbox(queue);
      sent++;
    }
  } finally {
    flushing = false;
  }
  return sent;
}
