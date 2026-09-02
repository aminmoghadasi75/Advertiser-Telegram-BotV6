import { Intent } from '../types';
import { ConversationTurnTrace, IntentEvaluationMetrics } from './evaluationTypes';

const KEY_EVAL_INTENTS: Intent[] = [
  Intent.GREETING,
  Intent.SMALL_TALK,
  Intent.QUESTION,
  Intent.RELEVANT_NEED,
  Intent.VPN_REQUEST,
  Intent.PRODUCT_CURIOUS,
  Intent.TRIAL_REQUEST,
  Intent.PRICE_REQUEST,
  Intent.SUPPORT_REQUEST,
  Intent.PURCHASE_INTENT,
  Intent.OBJECTION,
  Intent.REJECTION,
  Intent.GOODBYE,
  Intent.SUSPICION_BOT,
  Intent.INAPPROPRIATE,
  Intent.SPAM,
  Intent.OFF_TOPIC,
];

/**
 * Evaluates all Turn Traces against Gold Intent Labels
 * Calculates Accuracy, Precision, Recall, F1, Confusion Matrix, Critical Errors & Error Categories.
 */
export function evaluateIntents(traces: ConversationTurnTrace[]): IntentEvaluationMetrics {
  const byIntent: Record<
    string,
    {
      truePositives: number;
      falsePositives: number;
      falseNegatives: number;
      precision: number;
      recall: number;
      f1: number;
      support: number;
    }
  > = {};

  // Initialize all intents
  KEY_EVAL_INTENTS.forEach((intent) => {
    byIntent[intent] = {
      truePositives: 0,
      falsePositives: 0,
      falseNegatives: 0,
      precision: 0,
      recall: 0,
      f1: 0,
      support: 0,
    };
  });

  const labels = KEY_EVAL_INTENTS.map((i) => i.toString());
  const labelIndexMap = new Map<string, number>();
  labels.forEach((label, idx) => labelIndexMap.set(label, idx));

  // Initialize confusion matrix: [expected][actual]
  const matrix: number[][] = Array.from({ length: labels.length }, () =>
    Array(labels.length).fill(0)
  );

  let evaluatedTurns = 0;
  let correctTurns = 0;
  let ambiguousTurns = 0;
  const criticalErrors: IntentEvaluationMetrics['criticalErrors'] = [];
  const errorCategoryCounts: Record<string, number> = {
    INTENT_FALSE_POSITIVE: 0,
    INTENT_FALSE_NEGATIVE: 0,
    INTENT_WRONG_CLASS: 0,
    INTENT_AMBIGUOUS: 0,
    NORMALIZATION_FAILURE: 0,
    KEYWORD_COLLISION: 0,
    MULTI_INTENT_FAILURE: 0,
    CONTEXT_FAILURE: 0,
  };

  traces.forEach((trace) => {
    if (!trace.expected) return;
    const expected = trace.expected.intent;
    const actual = trace.primaryIntent;
    const userMsg = trace.userMessage;

    if (expected === 'AMBIGUOUS') {
      ambiguousTurns++;
      errorCategoryCounts['INTENT_AMBIGUOUS']++;
      return;
    }

    evaluatedTurns++;

    // Ensure intent stats exist
    if (!byIntent[expected]) {
      byIntent[expected] = {
        truePositives: 0,
        falsePositives: 0,
        falseNegatives: 0,
        precision: 0,
        recall: 0,
        f1: 0,
        support: 0,
      };
    }
    if (!byIntent[actual]) {
      byIntent[actual] = {
        truePositives: 0,
        falsePositives: 0,
        falseNegatives: 0,
        precision: 0,
        recall: 0,
        f1: 0,
        support: 0,
      };
    }

    byIntent[expected].support++;

    // Update Confusion Matrix
    const expIdx = labelIndexMap.get(expected);
    const actIdx = labelIndexMap.get(actual);
    if (expIdx !== undefined && actIdx !== undefined) {
      matrix[expIdx][actIdx]++;
    }

    if (expected === actual) {
      correctTurns++;
      byIntent[expected].truePositives++;
    } else {
      byIntent[actual].falsePositives++;
      byIntent[expected].falseNegatives++;

      // Classify Intent Error
      let categorized = false;

      // Multi-intent check
      if (
        userMsg.includes('قیمت') &&
        (userMsg.includes('نمیخوام') || userMsg.includes('ندارم') || userMsg.includes('نه'))
      ) {
        errorCategoryCounts['MULTI_INTENT_FAILURE']++;
        trace.errorCategories.push('MULTI_INTENT_FAILURE');
        categorized = true;
      }

      // Keyword collision
      if (
        (actual === Intent.SMALL_TALK && expected === Intent.VPN_REQUEST) ||
        (actual === Intent.QUESTION && expected === Intent.PRICE_REQUEST)
      ) {
        errorCategoryCounts['KEYWORD_COLLISION']++;
        trace.errorCategories.push('KEYWORD_COLLISION');
        categorized = true;
      }

      if (!categorized) {
        errorCategoryCounts['INTENT_WRONG_CLASS']++;
        trace.errorCategories.push('INTENT_WRONG_CLASS');
      }

      // Check Critical Intent Errors
      // 1. User explicitly asks for VPN but Intent = SMALL_TALK
      if (expected === Intent.VPN_REQUEST && actual === Intent.SMALL_TALK) {
        const err = {
          conversationId: trace.conversationId,
          turnId: trace.turnId,
          userMessage: userMsg,
          expected,
          actual,
          rule: 'CRITICAL: User asks for VPN but Intent = SMALL_TALK',
        };
        criticalErrors.push(err);
        trace.criticalErrors.push(err.rule);
      }

      // 2. User explicitly rejects but Intent != REJECTION
      if (expected === Intent.REJECTION && actual !== Intent.REJECTION) {
        const err = {
          conversationId: trace.conversationId,
          turnId: trace.turnId,
          userMessage: userMsg,
          expected,
          actual,
          rule: 'CRITICAL: User explicitly rejects but Intent != REJECTION',
        };
        criticalErrors.push(err);
        trace.criticalErrors.push(err.rule);
      }

      // 3. User asks price but Intent != PRICE_REQUEST
      if (expected === Intent.PRICE_REQUEST && actual !== Intent.PRICE_REQUEST) {
        const err = {
          conversationId: trace.conversationId,
          turnId: trace.turnId,
          userMessage: userMsg,
          expected,
          actual,
          rule: 'CRITICAL: User asks price but Intent != PRICE_REQUEST',
        };
        criticalErrors.push(err);
        trace.criticalErrors.push(err.rule);
      }

      // 4. User asks support but Intent != SUPPORT_REQUEST
      if (expected === Intent.SUPPORT_REQUEST && actual !== Intent.SUPPORT_REQUEST) {
        const err = {
          conversationId: trace.conversationId,
          turnId: trace.turnId,
          userMessage: userMsg,
          expected,
          actual,
          rule: 'CRITICAL: User asks support but Intent != SUPPORT_REQUEST',
        };
        criticalErrors.push(err);
        trace.criticalErrors.push(err.rule);
      }

      // 5. User asks trial but Intent != TRIAL_REQUEST
      if (expected === Intent.TRIAL_REQUEST && actual !== Intent.TRIAL_REQUEST) {
        const err = {
          conversationId: trace.conversationId,
          turnId: trace.turnId,
          userMessage: userMsg,
          expected,
          actual,
          rule: 'CRITICAL: User asks trial but Intent != TRIAL_REQUEST',
        };
        criticalErrors.push(err);
        trace.criticalErrors.push(err.rule);
      }

      // 6. User is not interested but system detects PURCHASE_INTENT
      if (
        (expected === Intent.REJECTION || expected === Intent.GOODBYE || expected === Intent.SMALL_TALK) &&
        actual === Intent.PURCHASE_INTENT
      ) {
        const err = {
          conversationId: trace.conversationId,
          turnId: trace.turnId,
          userMessage: userMsg,
          expected,
          actual,
          rule: 'CRITICAL: User not interested but detected PURCHASE_INTENT',
        };
        criticalErrors.push(err);
        trace.criticalErrors.push(err.rule);
      }
    }
  });

  // Calculate Precision, Recall, F1 for each intent
  Object.keys(byIntent).forEach((key) => {
    const item = byIntent[key];
    const precDenom = item.truePositives + item.falsePositives;
    item.precision = precDenom > 0 ? item.truePositives / precDenom : 0;

    const recDenom = item.truePositives + item.falseNegatives;
    item.recall = recDenom > 0 ? item.truePositives / recDenom : 0;

    const f1Denom = item.precision + item.recall;
    item.f1 = f1Denom > 0 ? (2 * (item.precision * item.recall)) / f1Denom : 0;
  });

  const overallAccuracy = evaluatedTurns > 0 ? correctTurns / evaluatedTurns : 0;

  return {
    totalTurns: traces.length,
    evaluatedTurns,
    ambiguousTurns,
    overallAccuracy,
    byIntent,
    confusionMatrix: {
      labels,
      matrix,
    },
    criticalErrors,
    errorCategoryCounts,
  };
}
