import {
  GEMINI_DEFAULT_MODEL_PRIORITY,
  getAdaptiveCandidateModels,
  getModelHealth,
  getModelStatusReport,
  recordGeminiFailure,
  recordGeminiSuccess,
  resetRouterHealth,
  isDailyLimitError,
  isModelBusyError,
  isRateLimitError,
} from './geminiAdaptiveRouter';

export interface TestResult {
  name: string;
  category: 'ROUTER';
  passed: boolean;
  expected: string;
  actual: string;
}

export function runAllGeminiAdaptiveRouterTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
} {
  const results: TestResult[] = [];

  function assert(name: string, passed: boolean, expected: string, actual: string) {
    results.push({
      name,
      category: 'ROUTER',
      passed,
      expected,
      actual,
    });
  }

  // Always start with clean state
  resetRouterHealth();

  // Test 1: Strict 5-tier Priority Order Verification
  const initialCandidates = getAdaptiveCandidateModels();
  assert(
    'Test 1: Strict 5-tier Priority Order Verification',
    initialCandidates.length === 5 &&
      initialCandidates[0] === 'gemini-3.8-flash' &&
      initialCandidates[1] === 'gemini-3.7-flash' &&
      initialCandidates[2] === 'gemini-3.6-flash' &&
      initialCandidates[3] === 'gemini-3.5-flash' &&
      initialCandidates[4] === 'gemini-3.1-flash-lite',
    'Order: 3.8 -> 3.7 -> 3.6 -> 3.5 -> 3.1-lite',
    `Order: ${initialCandidates.join(' -> ')}`
  );

  // Test 2: Error Classification (Busy vs Daily vs Rate Limit)
  const busyDetected = isModelBusyError('503 Service Unavailable: Model is overloaded due to high demand');
  const dailyDetected = isDailyLimitError('Resource has been exhausted: Quota exceeded for Generate Content API requests per day');
  const rateLimitDetected = isRateLimitError('429 Too Many Requests: Rate limit exceeded');
  assert(
    'Test 2: Error Classification (Busy, Daily Quota, RPM Rate Limit)',
    busyDetected && dailyDetected && rateLimitDetected,
    'busy=true, daily=true, rateLimit=true',
    `busy=${busyDetected}, daily=${dailyDetected}, rateLimit=${rateLimitDetected}`
  );

  // Test 3: Fast Switching when Gemini 3.8 Flash is Busy (503 / High Demand)
  resetRouterHealth();
  const t0 = 1000000;
  const cooldownSecBusy = recordGeminiFailure(
    'gemini-3.8-flash',
    new Error('503 Service Unavailable: Model overloaded'),
    t0
  );
  const candidatesAfter38Busy = getAdaptiveCandidateModels(t0 + 1000);
  const health38 = getModelHealth('gemini-3.8-flash');
  assert(
    'Test 3: Fast Switching when Gemini 3.8 is Busy (immediate switch to 3.7)',
    candidatesAfter38Busy[0] === 'gemini-3.7-flash' &&
      health38.isServerBusy === true &&
      cooldownSecBusy >= 15,
    'Top candidate: gemini-3.7-flash, isServerBusy: true, cooldown >= 15s',
    `Top candidate: ${candidatesAfter38Busy[0]}, isServerBusy: ${health38.isServerBusy}, cooldown: ${cooldownSecBusy}s`
  );

  // Test 4: Fast Switching on Daily Quota Limit (Extended cooldown & immediate failover)
  resetRouterHealth();
  const cooldownSecDaily = recordGeminiFailure(
    'gemini-3.8-flash',
    new Error('RESOURCE_EXHAUSTED: Quota exceeded per day for free tier limit'),
    t0
  );
  const healthDaily = getModelHealth('gemini-3.8-flash');
  const candidatesDaily = getAdaptiveCandidateModels(t0 + 5000);
  assert(
    'Test 4: Fast Switching on Daily Quota Limit (isDailyLimitExceeded=true & switch to 3.7)',
    candidatesDaily[0] === 'gemini-3.7-flash' &&
      healthDaily.isDailyLimitExceeded === true &&
      cooldownSecDaily >= 600,
    'Top candidate: gemini-3.7-flash, isDailyLimitExceeded: true, cooldown >= 600s',
    `Top candidate: ${candidatesDaily[0]}, isDaily: ${healthDaily.isDailyLimitExceeded}, cooldown: ${cooldownSecDaily}s`
  );

  // Test 5: Cascading Failover across all 5 models (3.8 -> 3.7 -> 3.6 -> 3.5 -> 3.1-lite)
  resetRouterHealth();
  recordGeminiFailure('gemini-3.8-flash', new Error('503 Busy'), t0);
  recordGeminiFailure('gemini-3.7-flash', new Error('429 Rate Limit'), t0);
  const candAfterTwoFails = getAdaptiveCandidateModels(t0 + 1000);
  assert(
    'Test 5a: Cascading Failover (3.8 & 3.7 busy -> 3.6 takes over)',
    candAfterTwoFails[0] === 'gemini-3.6-flash',
    'Top candidate: gemini-3.6-flash',
    `Top candidate: ${candAfterTwoFails[0]}`
  );

  recordGeminiFailure('gemini-3.6-flash', new Error('503 Busy'), t0);
  recordGeminiFailure('gemini-3.5-flash', new Error('Timeout'), t0);
  const candAfterFourFails = getAdaptiveCandidateModels(t0 + 1000);
  assert(
    'Test 5b: Cascading Failover (3.8, 3.7, 3.6, 3.5 busy -> 3.1-flash-lite takes over)',
    candAfterFourFails[0] === 'gemini-3.1-flash-lite',
    'Top candidate: gemini-3.1-flash-lite',
    `Top candidate: ${candAfterFourFails[0]}`
  );

  // Test 6: Automatic Probe & Recovery when limitation is lifted ("تا رفع محدودیت")
  resetRouterHealth();
  // Mark 3.8 as failed with 15s cooldown at t0
  recordGeminiFailure('gemini-3.8-flash', new Error('503 Busy'), t0);
  // Before cooldown elapses (e.g. at t0 + 5s): 3.7 is primary
  const candBeforeCooldown = getAdaptiveCandidateModels(t0 + 5000);
  assert(
    'Test 6a: During cooldown, lower priority model remains active',
    candBeforeCooldown[0] === 'gemini-3.7-flash',
    'Top candidate: gemini-3.7-flash',
    `Top candidate: ${candBeforeCooldown[0]}`
  );

  // After 16 seconds (cooldown elapsed): 3.8 automatically returns to top candidate!
  const candAfterCooldown = getAdaptiveCandidateModels(t0 + 16000);
  assert(
    'Test 6b: Cooldown expired -> Higher-priority model 3.8 is immediately probed again',
    candAfterCooldown[0] === 'gemini-3.8-flash',
    'Top candidate: gemini-3.8-flash',
    `Top candidate: ${candAfterCooldown[0]}`
  );

  // Probe succeeds: limitation is officially lifted!
  recordGeminiSuccess('gemini-3.8-flash');
  const healthRecovered = getModelHealth('gemini-3.8-flash');
  const candRecovered = getAdaptiveCandidateModels(t0 + 20000);
  assert(
    'Test 6c: Limitation lifted -> 3.8 successfully restored to full health with 0 failures',
    healthRecovered.consecutiveFailures === 0 &&
      healthRecovered.cooldownUntil === 0 &&
      candRecovered[0] === 'gemini-3.8-flash',
    'consecutiveFailures=0, cooldownUntil=0, Top candidate: gemini-3.8-flash',
    `consecutiveFailures=${healthRecovered.consecutiveFailures}, cooldownUntil=${healthRecovered.cooldownUntil}, Top: ${candRecovered[0]}`
  );

  // Test 7: Model Status Report Output
  const report = getModelStatusReport(t0 + 20000);
  assert(
    'Test 7: Comprehensive Model Status Report Output (all 5 models reported)',
    report.models.length === 5 &&
      report.models[0].modelName === 'gemini-3.8-flash' &&
      report.models[1].modelName === 'gemini-3.7-flash' &&
      report.models[2].modelName === 'gemini-3.6-flash' &&
      report.models[3].modelName === 'gemini-3.5-flash' &&
      report.models[4].modelName === 'gemini-3.1-flash-lite' &&
      report.activeModel === 'gemini-3.8-flash',
    '5 models with 3.8 active',
    `${report.models.length} models, active: ${report.activeModel}`
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  return {
    total: results.length,
    passed,
    failed,
    results,
  };
}
