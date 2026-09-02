import { ConversationState } from '../types';
import { ConversationTurnTrace, StateEvaluationMetrics } from './evaluationTypes';

/**
 * Evaluates State Transitions across all Turn Traces
 */
export function evaluateStates(traces: ConversationTurnTrace[]): StateEvaluationMetrics {
  let totalTransitions = 0;
  let correctTransitions = 0;
  const invalidTransitions: StateEvaluationMetrics['invalidTransitions'] = [];
  const errorCategoryCounts: Record<string, number> = {
    STATE_SKIPPED: 0,
    STATE_STUCK: 0,
    STATE_PREMATURE_PROMOTION: 0,
    STATE_LATE_PROMOTION: 0,
    STATE_WRONG_TRANSITION: 0,
    STATE_REVERSION_ERROR: 0,
    STATE_REJECTION_BYPASS: 0,
    STATE_EXIT_FAILURE: 0,
  };

  traces.forEach((trace) => {
    if (!trace.expected) return;
    totalTransitions++;
    const expectedState = trace.expected.state;
    const actualState = trace.nextState;

    if (expectedState === actualState) {
      correctTransitions++;
    } else {
      // Categorize State Error
      let categorized = false;

      // 1. Stuck in same state
      if (trace.previousState === trace.nextState && expectedState !== trace.previousState) {
        errorCategoryCounts['STATE_STUCK']++;
        trace.errorCategories.push('STATE_STUCK');
        categorized = true;
      }

      // 2. Rejection Bypass (Expected REJECTED or LOW_INTEREST but went to promotion/interest)
      if (
        (expectedState === ConversationState.REJECTED || expectedState === ConversationState.LOW_INTEREST) &&
        (actualState === ConversationState.PRODUCT_INTRODUCTION ||
          actualState === ConversationState.PRICE_DISCUSSION ||
          actualState === ConversationState.SUPPORT_HANDOFF)
      ) {
        errorCategoryCounts['STATE_REJECTION_BYPASS']++;
        trace.errorCategories.push('STATE_REJECTION_BYPASS');
        trace.criticalErrors.push('CRITICAL: State machine bypassed REJECTED state into promotional state');
        categorized = true;
      }

      // 3. Premature Promotion (Jumped straight to price or support before engagement)
      if (
        (actualState === ConversationState.PRICE_DISCUSSION || actualState === ConversationState.SUPPORT_HANDOFF) &&
        (expectedState === ConversationState.EARLY_CONVERSATION || expectedState === ConversationState.ENGAGED)
      ) {
        errorCategoryCounts['STATE_PREMATURE_PROMOTION']++;
        trace.errorCategories.push('STATE_PREMATURE_PROMOTION');
        categorized = true;
      }

      // 4. Late Promotion (Expected intro or price but stayed in engaged/early)
      if (
        (expectedState === ConversationState.PRODUCT_INTRODUCTION ||
          expectedState === ConversationState.PRICE_DISCUSSION ||
          expectedState === ConversationState.SUPPORT_HANDOFF) &&
        (actualState === ConversationState.EARLY_CONVERSATION || actualState === ConversationState.ENGAGED)
      ) {
        errorCategoryCounts['STATE_LATE_PROMOTION']++;
        trace.errorCategories.push('STATE_LATE_PROMOTION');
        categorized = true;
      }

      // 5. Exit Failure (Expected GOODBYE or EXITING but stayed active)
      if (
        (expectedState === ConversationState.GOODBYE || expectedState === ConversationState.EXITING) &&
        actualState !== ConversationState.GOODBYE &&
        actualState !== ConversationState.EXITING
      ) {
        errorCategoryCounts['STATE_EXIT_FAILURE']++;
        trace.errorCategories.push('STATE_EXIT_FAILURE');
        categorized = true;
      }

      if (!categorized) {
        errorCategoryCounts['STATE_WRONG_TRANSITION']++;
        trace.errorCategories.push('STATE_WRONG_TRANSITION');
      }

      invalidTransitions.push({
        conversationId: trace.conversationId,
        turnId: trace.turnId,
        fromState: trace.previousState,
        toState: trace.nextState,
        expectedState,
        reason: `Expected state ${expectedState}, but state machine transitioned to ${actualState}`,
      });
    }
  });

  const stateAccuracy = totalTransitions > 0 ? correctTransitions / totalTransitions : 0;

  return {
    totalTransitions,
    correctTransitions,
    stateAccuracy,
    invalidTransitionCount: invalidTransitions.length,
    invalidTransitions,
    errorCategoryCounts,
  };
}
