import {
  IntentEvaluationMetrics,
  StateEvaluationMetrics,
  PromotionEvaluationMetrics,
  ResponseEvaluationMetrics,
  ConversationLevelMetrics,
  RegressionComparisonItem,
} from './evaluationTypes';

/**
 * Historical Baseline Benchmarks from Legacy / Pre-Step-4 unconstrained system
 */
export const LEGACY_BASELINE_METRICS = {
  intentAccuracy: 0.62,
  stateAccuracy: 0.58,
  promotionErrorRate: 0.38,
  oversellingRate: 0.31,
  roboticToneCount: 14,
  criticalErrorsCount: 9,
  conversationQualityScore: 54,
};

/**
 * Compares current evaluation results against baseline and detects regressions.
 */
export function detectRegressions(
  intentMetrics: IntentEvaluationMetrics,
  stateMetrics: StateEvaluationMetrics,
  promotionMetrics: PromotionEvaluationMetrics,
  responseMetrics: ResponseEvaluationMetrics,
  convMetrics: ConversationLevelMetrics
): RegressionComparisonItem[] {
  const comparisons: RegressionComparisonItem[] = [];

  // 1. Intent Accuracy
  const intentAcc = intentMetrics.overallAccuracy;
  const intentAccDelta = Number((intentAcc - LEGACY_BASELINE_METRICS.intentAccuracy).toFixed(3));
  comparisons.push({
    metricName: 'Intent Detection Accuracy',
    baselineOldValue: (LEGACY_BASELINE_METRICS.intentAccuracy * 100).toFixed(1) + '%',
    newSystemValue: (intentAcc * 100).toFixed(1) + '%',
    delta: (intentAccDelta >= 0 ? '+' : '') + (intentAccDelta * 100).toFixed(1) + '%',
    status: intentAcc >= LEGACY_BASELINE_METRICS.intentAccuracy ? 'IMPROVED' : 'REGRESSION',
    notes: intentAcc >= 0.9 ? 'Exceeds target benchmark (>90%)' : 'Needs review',
  });

  // 2. State Machine Accuracy
  const stateAcc = stateMetrics.stateAccuracy;
  const stateAccDelta = Number((stateAcc - LEGACY_BASELINE_METRICS.stateAccuracy).toFixed(3));
  comparisons.push({
    metricName: 'State Machine Transition Accuracy',
    baselineOldValue: (LEGACY_BASELINE_METRICS.stateAccuracy * 100).toFixed(1) + '%',
    newSystemValue: (stateAcc * 100).toFixed(1) + '%',
    delta: (stateAccDelta >= 0 ? '+' : '') + (stateAccDelta * 100).toFixed(1) + '%',
    status: stateAcc >= LEGACY_BASELINE_METRICS.stateAccuracy ? 'IMPROVED' : 'REGRESSION',
    notes: stateAcc >= 0.9 ? 'Strict state transition integrity' : 'Needs review',
  });

  // 3. Promotion Error Rate (Lower is better!)
  const promoErrRate = promotionMetrics.errorRate;
  const promoDelta = Number((LEGACY_BASELINE_METRICS.promotionErrorRate - promoErrRate).toFixed(3));
  comparisons.push({
    metricName: 'Promotion Policy Error Rate',
    baselineOldValue: (LEGACY_BASELINE_METRICS.promotionErrorRate * 100).toFixed(1) + '%',
    newSystemValue: (promoErrRate * 100).toFixed(1) + '%',
    delta: (promoDelta >= 0 ? '-' : '+') + Math.abs(promoDelta * 100).toFixed(1) + '%',
    status: promoErrRate <= LEGACY_BASELINE_METRICS.promotionErrorRate ? 'IMPROVED' : 'REGRESSION',
    notes: promoErrRate <= 0.05 ? 'High policy compliance (<5% error)' : 'Policy violations detected',
  });

  // 4. Critical Errors (Zero tolerance target)
  const totalCritical =
    intentMetrics.criticalErrors.length + promotionMetrics.criticalBugs.length;
  comparisons.push({
    metricName: 'Critical Conversational Bugs (Rejection Bypass / CTA Spam)',
    baselineOldValue: LEGACY_BASELINE_METRICS.criticalErrorsCount,
    newSystemValue: totalCritical,
    delta: totalCritical - LEGACY_BASELINE_METRICS.criticalErrorsCount,
    status: totalCritical === 0 ? 'IMPROVED' : totalCritical <= 2 ? 'STABLE' : 'REGRESSION',
    notes: totalCritical === 0 ? 'Zero critical bugs detected' : `${totalCritical} critical errors require fix`,
  });

  // 5. Conversation Quality Score
  const qualityScore = convMetrics.conversationQualityScoreAverage;
  const qualityDelta = qualityScore - LEGACY_BASELINE_METRICS.conversationQualityScore;
  comparisons.push({
    metricName: 'Overall Conversation Quality Score',
    baselineOldValue: `${LEGACY_BASELINE_METRICS.conversationQualityScore}/100`,
    newSystemValue: `${qualityScore}/100`,
    delta: (qualityDelta >= 0 ? '+' : '') + `${qualityDelta}`,
    status: qualityScore >= LEGACY_BASELINE_METRICS.conversationQualityScore ? 'IMPROVED' : 'REGRESSION',
    notes: qualityScore >= 80 ? 'High human naturalness' : 'Acceptable quality',
  });

  return comparisons;
}
