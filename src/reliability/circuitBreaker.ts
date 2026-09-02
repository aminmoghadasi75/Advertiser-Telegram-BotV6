/**
 * Production Circuit Breaker
 * Protects downstream services (Telegram API, external AI providers) from cascading failures.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold: number; // consecutive failures to open circuit
  resetTimeoutMs: number;   // time to wait before trying half-open state
  monitorIntervalMs?: number;
}

export class CircuitBreaker {
  private name: string;
  private failureThreshold: number;
  private resetTimeoutMs: number;
  private state: CircuitState = 'CLOSED';
  private consecutiveFailures = 0;
  private consecutiveSuccesses = 0;
  private lastFailureTime = 0;
  private totalCalls = 0;
  private totalFailures = 0;
  private totalTrips = 0;

  constructor(name: string, options: Partial<CircuitBreakerOptions> = {}) {
    this.name = name;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeoutMs = options.resetTimeoutMs || 30000;
  }

  public getState(): CircuitState {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN';
        this.consecutiveSuccesses = 0;
      }
    }
    return this.state;
  }

  public async execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T> | T): Promise<T> {
    this.totalCalls++;
    const currentState = this.getState();

    if (currentState === 'OPEN') {
      if (fallback) {
        return fallback();
      }
      throw new Error(`CircuitBreaker[${this.name}] is OPEN. Downstream service unavailable.`);
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (err) {
      this.recordFailure();
      if (fallback) {
        return fallback();
      }
      throw err;
    }
  }

  public recordSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.consecutiveSuccesses++;
      if (this.consecutiveSuccesses >= 2) {
        this.state = 'CLOSED';
        this.consecutiveFailures = 0;
        this.consecutiveSuccesses = 0;
      }
    } else if (this.state === 'CLOSED') {
      this.consecutiveFailures = 0;
    }
  }

  public recordFailure() {
    this.totalFailures++;
    this.consecutiveFailures++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN' || this.consecutiveFailures >= this.failureThreshold) {
      if (this.state !== 'OPEN') {
        this.totalTrips++;
      }
      this.state = 'OPEN';
    }
  }

  public reset() {
    this.state = 'CLOSED';
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
  }

  public getStats() {
    return {
      name: this.name,
      state: this.getState(),
      consecutiveFailures: this.consecutiveFailures,
      totalCalls: this.totalCalls,
      totalFailures: this.totalFailures,
      totalTrips: this.totalTrips,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
    };
  }
}
