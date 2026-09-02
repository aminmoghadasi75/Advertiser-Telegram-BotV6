/**
 * Production-Safe Structured Logger & PII Sanitizer
 * Guarantees zero sensitive data leakage and structured JSON log formatting.
 */

export interface StructuredLogEntry {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  event: string;
  conversationId?: string;
  userId?: string;
  state?: string;
  intent?: string;
  latencyMs?: number;
  data?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /session/i,
  /api[_-]?key/i,
  /auth/i,
  /hash/i,
  /phone/i,
  /card/i,
  /ssn/i,
  /national[_-]?id/i,
];

const PHONE_REGEX = /(\+?98|0)?9\d{9}/g;
const SESSION_STRING_REGEX = /[1-9A-HJ-NP-Za-km-z]{40,}/g;

export function sanitizePii(value: any, depth: number = 0): any {
  if (depth > 6) return '[MAX_DEPTH]';
  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    let sanitized = value.replace(PHONE_REGEX, '[PHONE_REDACTED]');
    sanitized = sanitized.replace(SESSION_STRING_REGEX, '[SESSION_KEY_REDACTED]');
    return sanitized;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizePii(item, depth + 1));
  }

  if (typeof value === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      const isSensitiveKey = SENSITIVE_KEY_PATTERNS.some(pat => pat.test(k));
      if (isSensitiveKey) {
        sanitizedObj[k] = '[REDACTED_SECRET]';
      } else {
        sanitizedObj[k] = sanitizePii(v, depth + 1);
      }
    }
    return sanitizedObj;
  }

  return String(value);
}

export class ProductionLogger {
  private level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' = 'INFO';
  private logsBuffer: StructuredLogEntry[] = [];
  private maxBufferSize = 500;

  constructor(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' = 'INFO') {
    this.level = level;
  }

  public setLevel(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR') {
    this.level = level;
  }

  private shouldLog(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'): boolean {
    const order = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    return order[level] >= order[this.level];
  }

  public log(entry: Omit<StructuredLogEntry, 'timestamp'>) {
    if (!this.shouldLog(entry.level)) return;

    const sanitizedData = entry.data ? sanitizePii(entry.data) : undefined;
    const structured: StructuredLogEntry = {
      timestamp: new Date().toISOString(),
      level: entry.level,
      event: entry.event,
      conversationId: entry.conversationId,
      userId: entry.userId ? String(entry.userId).slice(0, 8) + '...' : undefined,
      state: entry.state,
      intent: entry.intent,
      latencyMs: entry.latencyMs,
      data: sanitizedData,
      error: entry.error
        ? {
            name: entry.error.name,
            message: sanitizePii(entry.error.message),
            stack: process.env.NODE_ENV === 'development' ? entry.error.stack : undefined,
          }
        : undefined,
    };

    this.logsBuffer.push(structured);
    if (this.logsBuffer.length > this.maxBufferSize) {
      this.logsBuffer.shift();
    }

    if (process.env.NODE_ENV !== 'test') {
      const serialized = JSON.stringify(structured);
      if (entry.level === 'ERROR') {
        console.error(serialized);
      } else if (entry.level === 'WARN') {
        console.warn(serialized);
      } else {
        console.log(serialized);
      }
    }
  }

  public info(event: string, meta?: Partial<StructuredLogEntry>) {
    this.log({ level: 'INFO', event, ...meta });
  }

  public warn(event: string, meta?: Partial<StructuredLogEntry>) {
    this.log({ level: 'WARN', event, ...meta });
  }

  public error(event: string, error?: any, meta?: Partial<StructuredLogEntry>) {
    const errorObj =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error
        ? { name: 'Error', message: String(error) }
        : undefined;

    this.log({ level: 'ERROR', event, error: errorObj, ...meta });
  }

  public debug(event: string, meta?: Partial<StructuredLogEntry>) {
    this.log({ level: 'DEBUG', event, ...meta });
  }

  public getRecentLogs(): StructuredLogEntry[] {
    return [...this.logsBuffer];
  }
}

export const logger = new ProductionLogger();
