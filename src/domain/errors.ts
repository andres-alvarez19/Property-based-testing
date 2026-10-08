export abstract class DomainError extends Error {
  abstract readonly code: "validation_error" | "not_found" | "conflict";

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  readonly code = "validation_error" as const;
}

export class NotFoundError extends DomainError {
  readonly code = "not_found" as const;
}

export class ConflictError extends DomainError {
  readonly code = "conflict" as const;
}
