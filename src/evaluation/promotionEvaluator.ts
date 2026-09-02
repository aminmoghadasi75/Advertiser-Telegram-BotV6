import { PromotionLevel, Intent } from '../types';
import { ConversationTurnTrace, PromotionEvaluationMetrics } from './evaluationTypes';

/**
 * Evaluates Promotion Decisions against Gold Labels and Promotion Safety Invariants
 */
export function evaluatePromotions(traces: ConversationTurnTrace[]): PromotionEvaluationMetrics {
  let totalTurns = 0;
  let correctTurns = 0;
  let oversellingCount = 0;
  let missedOpportunityCount = 0;
  let prematureOfferCount = 0;
  let repeatedOfferCount = 0;
  let postRejectionSellingCount = 0;
  let ctaSpamCount = 0;

  const criticalBugs: PromotionEvaluationMetrics['criticalBugs'] = [];
  const errorCategoryCounts: Record<string, number> = {
    OVERSELLING: 0,
    MISSED_OPPORTUNITY: 0,
    PREMATURE_OFFER: 0,
    REPEATED_OFFER: 0,
    POST_REJECTION_SELLING: 0,
    CTA_SPAM: 0,
  };

  traces.forEach((trace) => {
    if (!trace.expected) return;
    totalTurns++;

    const expected = trace.expected.promotionLevel;
    const actual = trace.promotionLevel;
    const userMsg = trace.userMessage;

    if (expected === actual) {
      correctTurns++;
    } else {
      // 1. Overselling
      if (
        expected === PromotionLevel.NO_PROMOTION &&
        (actual === PromotionLevel.SOFT_MENTION || actual === PromotionLevel.DIRECT_OFFER)
      ) {
        oversellingCount++;
        errorCategoryCounts['OVERSELLING']++;
        trace.errorCategories.push('OVERSELLING');

        // Check if premature offer
        if (trace.turnId <= 2 && trace.primaryIntent !== Intent.VPN_REQUEST && trace.primaryIntent !== Intent.PRICE_REQUEST) {
          prematureOfferCount++;
          errorCategoryCounts['PREMATURE_OFFER']++;
          trace.errorCategories.push('PREMATURE_OFFER');
        }
      }

      // 2. Missed Opportunity
      if (
        (expected === PromotionLevel.SOFT_MENTION || expected === PromotionLevel.DIRECT_OFFER) &&
        actual === PromotionLevel.NO_PROMOTION
      ) {
        missedOpportunityCount++;
        errorCategoryCounts['MISSED_OPPORTUNITY']++;
        trace.errorCategories.push('MISSED_OPPORTUNITY');
      }
    }

    // =========================================================================
    // CRITICAL PROMOTION BUGS EVALUATION
    // =========================================================================

    // CRITICAL_1: Explicit Rejection -> Promotion
    if (
      (trace.primaryIntent === Intent.REJECTION || trace.expected.intent === Intent.REJECTION) &&
      (actual === PromotionLevel.SOFT_MENTION || actual === PromotionLevel.DIRECT_OFFER)
    ) {
      const bug = {
        conversationId: trace.conversationId,
        turnId: trace.turnId,
        bugId: 'CRITICAL_1' as const,
        description: 'CRITICAL_1: Explicit User Rejection led to Promotion attempt',
        userMessage: userMsg,
        actualLevel: actual,
        promotionLock: trace.promotionLock,
      };
      criticalBugs.push(bug);
      trace.criticalErrors.push(bug.description);
      postRejectionSellingCount++;
      errorCategoryCounts['POST_REJECTION_SELLING']++;
    }

    // CRITICAL_2: promotionLock = true -> CTA during subsequent non-commercial turns
    if (
      trace.promotionLock &&
      actual === PromotionLevel.DIRECT_OFFER &&
      trace.primaryIntent !== Intent.REJECTION &&
      trace.expected.intent !== Intent.REJECTION &&
      trace.primaryIntent !== Intent.VPN_REQUEST &&
      trace.primaryIntent !== Intent.PRICE_REQUEST &&
      trace.primaryIntent !== Intent.PURCHASE_INTENT &&
      trace.primaryIntent !== Intent.TRIAL_REQUEST &&
      trace.primaryIntent !== Intent.SUPPORT_REQUEST
    ) {
      const bug = {
        conversationId: trace.conversationId,
        turnId: trace.turnId,
        bugId: 'CRITICAL_2' as const,
        description: 'CRITICAL_2: Promotion Lock is active but Direct Offer / CTA was issued',
        userMessage: userMsg,
        actualLevel: actual,
        promotionLock: trace.promotionLock,
      };
      criticalBugs.push(bug);
      trace.criticalErrors.push(bug.description);
      postRejectionSellingCount++;
      errorCategoryCounts['POST_REJECTION_SELLING']++;
    }

    // CRITICAL_3: No Product Intent -> Direct Offer
    if (
      (trace.primaryIntent === Intent.GREETING ||
        trace.primaryIntent === Intent.SMALL_TALK ||
        trace.primaryIntent === Intent.OFF_TOPIC) &&
      actual === PromotionLevel.DIRECT_OFFER
    ) {
      const bug = {
        conversationId: trace.conversationId,
        turnId: trace.turnId,
        bugId: 'CRITICAL_3' as const,
        description: 'CRITICAL_3: Casual chit-chat with No Product Intent received aggressive Direct Offer',
        userMessage: userMsg,
        actualLevel: actual,
        promotionLock: trace.promotionLock,
      };
      criticalBugs.push(bug);
      trace.criticalErrors.push(bug.description);
      prematureOfferCount++;
      errorCategoryCounts['PREMATURE_OFFER']++;
    }

    // CRITICAL_5: User asks unrelated question -> Product Advertisement
    if (
      (trace.primaryIntent === Intent.QUESTION || trace.primaryIntent === Intent.OFF_TOPIC) &&
      (trace.expected.intent === Intent.QUESTION || trace.expected.intent === Intent.OFF_TOPIC) &&
      actual === PromotionLevel.DIRECT_OFFER
    ) {
      const bug = {
        conversationId: trace.conversationId,
        turnId: trace.turnId,
        bugId: 'CRITICAL_5' as const,
        description: 'CRITICAL_5: User asked unrelated question but system sent direct product pitch',
        userMessage: userMsg,
        actualLevel: actual,
        promotionLock: trace.promotionLock,
      };
      criticalBugs.push(bug);
      trace.criticalErrors.push(bug.description);
    }
  });

  const promotionAccuracy = totalTurns > 0 ? correctTurns / totalTurns : 0;
  const errorRate = totalTurns > 0 ? (totalTurns - correctTurns) / totalTurns : 0;

  return {
    totalTurns,
    promotionAccuracy,
    errorRate,
    oversellingCount,
    missedOpportunityCount,
    prematureOfferCount,
    repeatedOfferCount,
    postRejectionSellingCount,
    ctaSpamCount,
    criticalBugs,
    errorCategoryCounts,
  };
}
