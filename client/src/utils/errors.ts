import { formatError } from '@/services/core';
import { addToast } from '@heroui/react';

export function filterErrors(error: ReturnType<typeof formatError>) {
  switch (error.status) {
    case 400:
    case 401:
    case 403:
    case 404:
    case 409:
    case 424:
    case 429:
    case 500:
      if (!error.message?.startsWith('Request failed with status code')) {
        return error.message;
      }
      return undefined;
    case 0:
      return "We can't seem to connect right now. Please check your connection and try again.";
    default:
      return undefined;
  }
}

export const errTryAgainLater = 'Something went wrong! Please, try again later';

export function filterAndNotifyError(e: ReturnType<typeof formatError>): void {
  addToast({ title: filterErrors(e) ?? 'Something went wrong!', color:"danger"});
}

export function filterAndNotifyRetryError(e: ReturnType<typeof formatError>) {
  addToast({ title:filterErrors(e) ?? errTryAgainLater, color:"danger"});
}
