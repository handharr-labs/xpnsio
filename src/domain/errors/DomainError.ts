export type DomainErrorCode =
  | 'notFound'
  | 'validationFailed'
  | 'unauthorized'
  | 'networkUnavailable'
  | 'serverError'
  | 'unknown';

export class DomainError extends Error {
  readonly code: DomainErrorCode;
  readonly context?: Record<string, unknown>;

  constructor(code: DomainErrorCode, context?: Record<string, unknown>) {
    super(code);
    this.name = 'DomainError';
    this.code = code;
    this.context = context;
  }

  static notFound(resource: string, id: string): DomainError {
    return new DomainError('notFound', { resource, id });
  }

  static validationFailed(field: string, reason: string): DomainError {
    return new DomainError('validationFailed', { field, reason });
  }

  static unauthorized(): DomainError {
    return new DomainError('unauthorized');
  }

  static networkUnavailable(): DomainError {
    return new DomainError('networkUnavailable');
  }

  static serverError(message: string): DomainError {
    return new DomainError('serverError', { message });
  }
}
