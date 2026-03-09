import type { DomainErrorCode } from './DomainError';

export function humanizeError(code: DomainErrorCode): string {
  const messages: Record<DomainErrorCode, string> = {
    notFound: 'The requested resource was not found.',
    validationFailed: 'Please check your input and try again.',
    unauthorized: 'You are not authorized to perform this action.',
    networkUnavailable: 'No internet connection. Please check your network.',
    serverError: 'Something went wrong on our end. Please try again.',
    unknown: 'An unexpected error occurred.',
  };
  return messages[code];
}
