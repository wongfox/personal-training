export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found.") {
    super(message, 404, "not_found");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You don't have access to this.") {
    super(message, 403, "forbidden");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "invalid");
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Slow down a little.") {
    super(message, 429, "rate_limited");
  }
}
