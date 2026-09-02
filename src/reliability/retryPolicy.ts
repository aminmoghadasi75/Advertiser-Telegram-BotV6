/**
 * Production Retry Policy with Exponential Backoff & Jitter
 */

export interface RetryOptions {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffFactor: number;
  jitter: boolean;
  retryableErrors?: (err: any) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelayMs: 100,
  maxDelayMs: 2000,
  backoffFactor: 2,
  jitter: true,
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let attempt = 0;
  let delay = opts.initialDelayMs;

  while (true) {
    attempt++;
    try {
      return await operation();
    } catch (err) {
      if (attempt >= opts.maxAttempts) {
        throw err;
      }

      if (opts.retryableErrors && !opts.retryableErrors(err)) {
        throw err;
      }

      let currentDelay = delay;
      if (opts.jitter) {
        currentDelay = delay * (0.75 + Math.random() * 0.5);
      }

      await new Promise(resolve => setTimeout(resolve, currentDelay));
      delay = Math.min(delay * opts.backoffFactor, opts.maxDelayMs);
    }
  }
}
