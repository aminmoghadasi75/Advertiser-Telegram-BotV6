/**
 * Gemini Adaptive Multi-Model Router & Failover Engine
 *
 * Enforces strict priority hierarchy:
 * 1. Gemini 3.8 Flash (Primary, top conversational intelligence)
 * 2. Gemini 3.7 Flash (High-capability hybrid fallback)
 * 3. Gemini 3.6 Flash (High-throughput multimodal fallback)
 * 4. Gemini 3.5 Flash (Fluent lightweight fallback)
 * 5. Gemini 3.1 Flash lite (Sub-second latency, maximum quota headroom & anti-block)
 *
 * Automatic and intelligent fast-failover:
 * - When a model is busy (503 / overloaded / demand / timeout): immediate failover to next model
 * - When a model hits daily quota or rate limit: placed in cooldown, and immediately routed to next model
 * - Once the restriction period elapses ("تا رفع محدودیت"), the higher-priority model is automatically
 *   tested and seamlessly restored as #1.
 */

export const GEMINI_DEFAULT_MODEL_PRIORITY: readonly string[] = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
] as const;

export interface GeminiModelMetadata {
  modelName: string;
  displayName: string;
  priority: number;
  description: string;
  role: string;
  timeoutMs: number;
}

export const GEMINI_MODEL_METADATA: Record<string, GeminiModelMetadata> = {
  'gemini-3.8-flash': {
    modelName: 'gemini-3.8-flash',
    displayName: 'Gemini 3.8 Flash',
    priority: 1,
    description: 'مدل اولویت اول (هوش برتر کلامی، طبیعی‌ترین لحن تلگرامی)',
    role: 'اصلی و پیش‌فرض',
    timeoutMs: 5500,
  },
  'gemini-3.7-flash': {
    modelName: 'gemini-3.7-flash',
    displayName: 'Gemini 3.7 Flash',
    priority: 2,
    description: 'مدل اولویت دوم (پشتیبان پیشرفته، عملکرد هیبریدی قدرتمند)',
    role: 'پشتیبان اولویت ۲',
    timeoutMs: 5500,
  },
  'gemini-3.6-flash': {
    modelName: 'gemini-3.6-flash',
    displayName: 'Gemini 3.6 Flash',
    priority: 3,
    description: 'مدل اولویت سوم (پشتیبان سریع چندمنظوره)',
    role: 'پشتیبان اولویت ۳',
    timeoutMs: 5000,
  },
  'gemini-3.5-flash': {
    modelName: 'gemini-3.5-flash',
    displayName: 'Gemini 3.5 Flash',
    priority: 4,
    description: 'مدل اولویت چهارم (سبک، روان و پاسخگوی سریع)',
    role: 'پشتیبان اولویت ۴',
    timeoutMs: 4500,
  },
  'gemini-3.1-flash-lite': {
    modelName: 'gemini-3.1-flash-lite',
    displayName: 'Gemini 3.1 Flash lite',
    priority: 5,
    description: 'مدل اولویت پنجم (فوق‌سریع Lite با سقف کوئری بسیار بالا و ضد محدودیت)',
    role: 'پشتیبان نهایی ضد قطعی',
    timeoutMs: 4000,
  },
};

export interface GeminiModelHealth {
  modelName: string;
  consecutiveFailures: number;
  lastFailureTime: number;
  cooldownUntil: number;
  totalSuccesses: number;
  totalFailures: number;
  lastSuccessTime: number;
  lastError?: string;
  isDailyLimitExceeded?: boolean;
  isServerBusy?: boolean;
}

const geminiModelHealthMap = new Map<string, GeminiModelHealth>();

export function getModelHealth(modelName: string): GeminiModelHealth {
  let health = geminiModelHealthMap.get(modelName);
  if (!health) {
    health = {
      modelName,
      consecutiveFailures: 0,
      lastFailureTime: 0,
      cooldownUntil: 0,
      totalSuccesses: 0,
      totalFailures: 0,
      lastSuccessTime: 0,
      isDailyLimitExceeded: false,
      isServerBusy: false,
    };
    geminiModelHealthMap.set(modelName, health);
  }
  return health;
}

/**
 * Checks if the error message indicates a daily usage quota exhaustion.
 */
export function isDailyLimitError(errMsg: string): boolean {
  const normalized = errMsg.toLowerCase();
  return (
    normalized.includes('perday') ||
    normalized.includes('per day') ||
    normalized.includes('per_day') ||
    normalized.includes('daily') ||
    normalized.includes('day quota') ||
    normalized.includes('free tier limit') ||
    (normalized.includes('quota') && normalized.includes('day'))
  );
}

/**
 * Checks if the error indicates server congestion, high demand, or timeout.
 */
export function isModelBusyError(errMsg: string): boolean {
  const normalized = errMsg.toLowerCase();
  return (
    normalized.includes('503') ||
    normalized.includes('unavailable') ||
    normalized.includes('overloaded') ||
    normalized.includes('demand') ||
    normalized.includes('busy') ||
    normalized.includes('capacity') ||
    normalized.includes('timeout') ||
    normalized.includes('timed out') ||
    normalized.includes('econnreset') ||
    normalized.includes('socket hang up')
  );
}

/**
 * Checks if the error is a per-minute rate limit (RPM/TPM).
 */
export function isRateLimitError(errMsg: string): boolean {
  const normalized = errMsg.toLowerCase();
  return (
    normalized.includes('429') ||
    normalized.includes('resource_exhausted') ||
    normalized.includes('rate limit') ||
    normalized.includes('too many requests')
  );
}

/**
 * Returns candidate models ordered adaptively based on real-time health and priority:
 * 1. Eligible models (not currently in cooldown), maintaining exact 1 -> 2 -> 3 -> 4 -> 5 order.
 *    As soon as a higher-priority model's cooldown elapses, it automatically re-enters the eligible list
 *    at its natural top position, allowing seamless recovery test!
 * 2. Models currently under cooldown are placed at the end as emergency fallbacks.
 */
export function getAdaptiveCandidateModels(now: number = Date.now()): string[] {
  const eligible: string[] = [];
  const inCooldown: string[] = [];

  for (const modelName of GEMINI_DEFAULT_MODEL_PRIORITY) {
    const health = getModelHealth(modelName);
    if (health.cooldownUntil <= now) {
      eligible.push(modelName);
    } else {
      inCooldown.push(modelName);
    }
  }

  const sorted = [...eligible, ...inCooldown];
  return sorted.length > 0 ? sorted : [...GEMINI_DEFAULT_MODEL_PRIORITY];
}

/**
 * Records a successful response from a Gemini model.
 * If the model was previously degraded, marks it fully recovered and resets failures.
 */
export function recordGeminiSuccess(modelName: string): void {
  const health = getModelHealth(modelName);
  const hadFailures = health.consecutiveFailures > 0 || health.cooldownUntil > 0;
  health.consecutiveFailures = 0;
  health.cooldownUntil = 0;
  health.totalSuccesses++;
  health.lastSuccessTime = Date.now();
  health.lastError = undefined;
  health.isDailyLimitExceeded = false;
  health.isServerBusy = false;

  if (hadFailures) {
    console.info(
      `[Gemini Adaptive Router] ✅ رفع محدودیت مدل اولویت‌دار ${modelName}: مدل با موفقیت ریکاوری شد و در اولویت اول فعال قرار گرفت.`
    );
  }
}

/**
 * Records a failure or busy status on a Gemini model.
 * Calculates adaptive cooldown based on error nature (daily limit vs busy/overload vs rate limit).
 * Returns the cooldown duration in seconds.
 */
export function recordGeminiFailure(
  modelName: string,
  error: any,
  now: number = Date.now()
): number {
  const health = getModelHealth(modelName);
  const errMsg = String(error?.message || error || 'Unknown error');
  health.consecutiveFailures++;
  health.totalFailures++;
  health.lastFailureTime = now;
  health.lastError = errMsg;

  const isDaily = isDailyLimitError(errMsg);
  const isBusy = isModelBusyError(errMsg);
  const isQuota = isRateLimitError(errMsg);

  health.isDailyLimitExceeded = isDaily;
  health.isServerBusy = isBusy;

  let cooldownSec: number;
  if (isDaily) {
    // Daily quota exhaustion: back off for 15-30 minutes so we don't spam Google,
    // then periodically probe to seamlessly recover as soon as daily limits reset.
    const multiplier = Math.min(health.consecutiveFailures, 3);
    cooldownSec = 600 * multiplier; // 10m -> 20m -> 30m max
  } else if (isBusy) {
    // Busy / overloaded server: fast recovery cooldown (15s -> 30s -> 60s max)
    const multiplier = Math.pow(2, Math.min(health.consecutiveFailures - 1, 2));
    cooldownSec = Math.min(60, 15 * multiplier);
  } else if (isQuota) {
    // Rate limit per minute: 20s -> 40s -> 80s max
    const multiplier = Math.pow(2, Math.min(health.consecutiveFailures - 1, 2));
    cooldownSec = Math.min(80, 20 * multiplier);
  } else {
    // Other transient errors / timeouts: 15s -> 30s max
    cooldownSec = Math.min(60, 15 * health.consecutiveFailures);
  }

  health.cooldownUntil = now + cooldownSec * 1000;
  return cooldownSec;
}

/**
 * Resets all model health statistics (useful for tests or manual admin reset).
 */
export function resetRouterHealth(): void {
  geminiModelHealthMap.clear();
}

/**
 * Returns a comprehensive report of all models, their health, priority and cooldowns.
 */
export function getModelStatusReport(now: number = Date.now()) {
  const activeCandidates = getAdaptiveCandidateModels(now);
  const models = GEMINI_DEFAULT_MODEL_PRIORITY.map((m, idx) => {
    const health = getModelHealth(m);
    const meta = GEMINI_MODEL_METADATA[m];
    const isCooldown = health.cooldownUntil > now;
    const isRecovering = !isCooldown && health.consecutiveFailures > 0;

    return {
      modelName: m,
      displayName: meta?.displayName || m,
      priority: idx + 1,
      description: meta?.description || '',
      role: meta?.role || '',
      status: isCooldown ? ('cooldown' as const) : isRecovering ? ('recovering' as const) : ('healthy' as const),
      consecutiveFailures: health.consecutiveFailures,
      totalSuccesses: health.totalSuccesses,
      totalFailures: health.totalFailures,
      cooldownSecondsRemaining: Math.max(0, Math.round((health.cooldownUntil - now) / 1000)),
      isDailyLimitExceeded: Boolean(health.isDailyLimitExceeded),
      isServerBusy: Boolean(health.isServerBusy),
      lastSuccessTime: health.lastSuccessTime ? new Date(health.lastSuccessTime).toISOString() : null,
      lastFailureTime: health.lastFailureTime ? new Date(health.lastFailureTime).toISOString() : null,
      lastError: health.lastError || null,
    };
  });

  return {
    activeModel: activeCandidates[0] || GEMINI_DEFAULT_MODEL_PRIORITY[0],
    activePriorityOrder: activeCandidates,
    models,
  };
}
