/**
 * Runtime Configuration & Schema Validation for Production
 * Enforces strict environment schema validation, defaults, and secrets isolation.
 */

export interface RuntimeConfig {
  nodeEnv: 'production' | 'development' | 'test';
  port: number;
  host: string;
  apiTimeoutMs: number;
  maxPayloadLimit: string;
  enableStructuredLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enablePiiMasking: boolean;
  metricsEnabled: boolean;
  circuitBreakerThreshold: number;
  circuitBreakerResetTimeoutMs: number;
  maxConcurrentTurns: number;
  telegramApiId?: string;
  telegramApiHash?: string;
  geminiApiKeyConfigured: boolean;
}

export interface ConfigValidationResult {
  valid: boolean;
  config: RuntimeConfig;
  warnings: string[];
  errors: string[];
}

export function validateRuntimeConfig(env: Record<string, string | undefined> = process.env): ConfigValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const rawNodeEnv = (env.NODE_ENV || 'production').toLowerCase();
  let nodeEnv: 'production' | 'development' | 'test' = 'production';
  if (rawNodeEnv === 'development' || rawNodeEnv === 'test') {
    nodeEnv = rawNodeEnv;
  } else if (rawNodeEnv !== 'production') {
    warnings.push(`Unknown NODE_ENV "${rawNodeEnv}", defaulting to "production"`);
  }

  const rawPort = env.PORT || '3000';
  const port = parseInt(rawPort, 10);
  const isValidPort = !isNaN(port) && port > 0 && port <= 65535;
  if (!isValidPort) {
    errors.push(`Invalid PORT value: "${rawPort}". Must be a valid port number (1-65535). Defaulting to 3000.`);
  }

  const host = env.HOST || '0.0.0.0';

  const rawTimeout = env.API_TIMEOUT_MS || '30000';
  const apiTimeoutMs = parseInt(rawTimeout, 10);
  if (isNaN(apiTimeoutMs) || apiTimeoutMs < 1000) {
    warnings.push(`API_TIMEOUT_MS invalid or too low (${rawTimeout}), defaulting to 30000ms`);
  }

  const maxPayloadLimit = env.MAX_PAYLOAD_LIMIT || '15mb';

  const enableStructuredLogging = env.LOG_STRUCTURED !== 'false';
  const rawLogLevel = (env.LOG_LEVEL || 'info').toLowerCase();
  let logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';
  if (['debug', 'info', 'warn', 'error'].includes(rawLogLevel)) {
    logLevel = rawLogLevel as any;
  } else {
    warnings.push(`Invalid LOG_LEVEL "${rawLogLevel}", defaulting to "info"`);
  }

  const enablePiiMasking = env.DISABLE_PII_MASKING !== 'true';
  const metricsEnabled = env.METRICS_ENABLED !== 'false';

  const rawCbThreshold = env.CIRCUIT_BREAKER_THRESHOLD || '5';
  const circuitBreakerThreshold = parseInt(rawCbThreshold, 10) || 5;

  const rawCbReset = env.CIRCUIT_BREAKER_RESET_MS || '30000';
  const circuitBreakerResetTimeoutMs = parseInt(rawCbReset, 10) || 30000;

  const rawMaxConcurrent = env.MAX_CONCURRENT_TURNS || '500';
  const maxConcurrentTurns = parseInt(rawMaxConcurrent, 10) || 500;

  const telegramApiId = env.TELEGRAM_API_ID;
  const telegramApiHash = env.TELEGRAM_API_HASH;
  const geminiApiKeyConfigured = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);

  const config: RuntimeConfig = {
    nodeEnv,
    port: isValidPort ? port : 3000,
    host,
    apiTimeoutMs: isNaN(apiTimeoutMs) ? 30000 : apiTimeoutMs,
    maxPayloadLimit,
    enableStructuredLogging,
    logLevel,
    enablePiiMasking,
    metricsEnabled,
    circuitBreakerThreshold,
    circuitBreakerResetTimeoutMs,
    maxConcurrentTurns,
    telegramApiId,
    telegramApiHash,
    geminiApiKeyConfigured,
  };

  return {
    valid: errors.length === 0,
    config,
    warnings,
    errors,
  };
}

let activeRuntimeConfig: RuntimeConfig | null = null;

export function getRuntimeConfig(): RuntimeConfig {
  if (!activeRuntimeConfig) {
    const result = validateRuntimeConfig();
    activeRuntimeConfig = result.config;
  }
  return activeRuntimeConfig;
}
