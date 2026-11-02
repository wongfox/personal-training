import { errors as enErrors } from "@/i18n/messages/en/errors";

/** A top-level key of the `errors` message namespace (a stable error code). */
export type ErrorKey = Exclude<keyof typeof enErrors, "validation">;
export type ErrorVars = Record<string, string | number>;

function isErrorKey(value: string): value is ErrorKey {
  return Object.prototype.hasOwnProperty.call(enErrors, value) && typeof (enErrors as Record<string, unknown>)[value] === "string";
}

function interpolate(template: string, vars?: ErrorVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}

/**
 * Errors with an HTTP status and a stable code. Pass either an English
 * sentence or a key of the `errors` namespace (e.g. "lessonNotFound"): a key
 * is kept on `key` so the boundary can translate it, and `message` is always
 * the English text.
 */
export class AppError extends Error {
  readonly key?: ErrorKey;
  readonly vars?: ErrorVars;

  constructor(
    messageOrKey: string,
    readonly status: number,
    readonly code: string,
    vars?: ErrorVars,
  ) {
    const key = isErrorKey(messageOrKey) ? messageOrKey : undefined;
    super(key ? interpolate(enErrors[key] as string, vars) : messageOrKey);
    this.key = key;
    this.vars = vars;
  }
}

export class NotFoundError extends AppError {
  constructor(messageOrKey: string = "notFound", vars?: ErrorVars) {
    super(messageOrKey, 404, "not_found", vars);
  }
}

export class ForbiddenError extends AppError {
  constructor(messageOrKey: string = "forbidden", vars?: ErrorVars) {
    super(messageOrKey, 403, "forbidden", vars);
  }
}

export class ValidationError extends AppError {
  constructor(messageOrKey: string, vars?: ErrorVars) {
    super(messageOrKey, 400, "invalid", vars);
  }
}

export class RateLimitError extends AppError {
  constructor(messageOrKey: string = "rateLimited", vars?: ErrorVars) {
    super(messageOrKey, 429, "rate_limited", vars);
  }
}
