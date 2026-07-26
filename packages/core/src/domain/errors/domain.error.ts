export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: string | number) {
    super(`${entity} with identifier ${id} was not found.`);
    this.name = 'NotFoundError';
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized access.') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
