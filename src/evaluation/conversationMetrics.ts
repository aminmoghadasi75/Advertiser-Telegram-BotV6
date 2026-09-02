import { ConversationState, Intent, PromotionLevel } from '../types';
import {
  ConversationLevelMetrics,
  ConversationTurnTrace,
  FunnelStageMetric,
  GoldConversation,
} from './evaluationTypes';

/**
 * Calculates Conversation-Level & Funnel Metrics across Replayed Conversations
 */
export function calculateConversationMetrics(
  tracesByConversation: Record<string, ConversationTurnTrace[]>,
  goldConversations: GoldConversation[]
): ConversationLevelMetrics {
  const conversationIds = Object.keys(tracesByConversation);
  const totalConversations = conversationIds.length;

  let totalTurnsSum = 0;
  let turnsToNeedSum = 0;
  let needDetectedConvCount = 0;

  let turnsToProductIntroSum = 0;
  let productIntroConvCount = 0;

  let turnsToFirstCTASum = 0;
  let ctaConvCount = 0;

  let totalPromotions = 0;
  let totalCTAs = 0;
  let totalObjections = 0;
  let totalRejections = 0;

  const finalStateDistribution: Record<string, number> = {};
  const outcomesDistribution: Record<string, number> = {};
  const exitReasonsDistribution: Record<string, number> = {};

  let qualityScoreSum = 0;

  // Funnel tracking sets
  const funnelStages = [
    { key: 'CONNECTED', labelFa: 'اتصال اولیه به مخاطب' },
    { key: 'ENGAGED', labelFa: 'تعامل و پیام اولیه' },
    { key: 'NEED_DETECTED', labelFa: 'طرح نیاز / اختلال اینترنت' },
    { key: 'PRODUCT_INTRODUCED', labelFa: 'معرفی اولیه وی‌پی‌ان' },
    { key: 'PRODUCT_INTEREST', labelFa: 'ابراز علاقه و کنجکاوی' },
    { key: 'TRIAL_REQUEST', labelFa: 'درخواست اکانت تست' },
    { key: 'PRICE_REQUEST', labelFa: 'استعلام قیمت و تعرفه' },
    { key: 'SUPPORT_HANDOFF', labelFa: 'ارسال آیدی پشتیبانی / بنر' },
    { key: 'PURCHASE_CONVERSION', labelFa: 'اعلام واریز / خرید قطعی' },
  ];

  const reachedStageCounts: Record<string, number> = {};
  funnelStages.forEach((s) => (reachedStageCounts[s.key] = 0));

  conversationIds.forEach((convId) => {
    const traces = tracesByConversation[convId] || [];
    const gold = goldConversations.find((g) => g.conversationId === convId);
    if (traces.length === 0) return;

    totalTurnsSum += traces.length;

    let convNeedTurn: number | null = null;
    let convIntroTurn: number | null = null;
    let convCTATurn: number | null = null;
    let convPromotions = 0;
    let convCTAs = 0;
    let convObjections = 0;
    let convRejections = 0;

    let reachedNeed = false;
    let reachedIntro = false;
    let reachedInterest = false;
    let reachedTrial = false;
    let reachedPrice = false;
    let reachedSupport = false;
    let reachedPurchase = false;

    let convQualitySum = 0;

    traces.forEach((t) => {
      if (t.responseScores) {
        convQualitySum += t.responseScores.totalScorePercent;
      }

      if (t.primaryIntent === Intent.RELEVANT_NEED || t.nextState === ConversationState.NEED_DETECTED) {
        reachedNeed = true;
        if (convNeedTurn === null) convNeedTurn = t.turnId;
      }

      if (
        t.nextState === ConversationState.PRODUCT_INTRODUCTION ||
        t.promotionLevel === PromotionLevel.SOFT_MENTION ||
        t.promotionLevel === PromotionLevel.DIRECT_OFFER
      ) {
        reachedIntro = true;
        if (convIntroTurn === null) convIntroTurn = t.turnId;
      }

      if (
        t.nextState === ConversationState.PRODUCT_INTEREST ||
        t.primaryIntent === Intent.PRODUCT_CURIOUS ||
        t.primaryIntent === Intent.VPN_REQUEST
      ) {
        reachedInterest = true;
      }

      if (t.primaryIntent === Intent.TRIAL_REQUEST || t.nextState === ConversationState.TRIAL_DISCUSSION) {
        reachedTrial = true;
      }

      if (t.primaryIntent === Intent.PRICE_REQUEST || t.nextState === ConversationState.PRICE_DISCUSSION) {
        reachedPrice = true;
      }

      if (t.primaryIntent === Intent.SUPPORT_REQUEST || t.nextState === ConversationState.SUPPORT_HANDOFF) {
        reachedSupport = true;
      }

      if (t.primaryIntent === Intent.PURCHASE_INTENT) {
        reachedPurchase = true;
      }

      if (t.promotionLevel !== PromotionLevel.NO_PROMOTION) {
        convPromotions++;
      }

      if (
        t.promotionLevel === PromotionLevel.DIRECT_OFFER &&
        (t.nextState === ConversationState.SUPPORT_HANDOFF ||
          t.primaryIntent === Intent.SUPPORT_REQUEST ||
          t.primaryIntent === Intent.PURCHASE_INTENT)
      ) {
        convCTAs++;
        if (convCTATurn === null) convCTATurn = t.turnId;
      }

      if (t.primaryIntent === Intent.OBJECTION) convObjections++;
      if (t.primaryIntent === Intent.REJECTION) convRejections++;
    });

    // Funnel Stage Increments
    reachedStageCounts['CONNECTED']++;
    reachedStageCounts['ENGAGED']++;
    if (reachedNeed) reachedStageCounts['NEED_DETECTED']++;
    if (reachedIntro) reachedStageCounts['PRODUCT_INTRODUCED']++;
    if (reachedInterest) reachedStageCounts['PRODUCT_INTEREST']++;
    if (reachedTrial) reachedStageCounts['TRIAL_REQUEST']++;
    if (reachedPrice) reachedStageCounts['PRICE_REQUEST']++;
    if (reachedSupport) reachedStageCounts['SUPPORT_HANDOFF']++;
    if (reachedPurchase) reachedStageCounts['PURCHASE_CONVERSION']++;

    if (convNeedTurn !== null) {
      turnsToNeedSum += convNeedTurn;
      needDetectedConvCount++;
    }
    if (convIntroTurn !== null) {
      turnsToProductIntroSum += convIntroTurn;
      productIntroConvCount++;
    }
    if (convCTATurn !== null) {
      turnsToFirstCTASum += convCTATurn;
      ctaConvCount++;
    }

    totalPromotions += convPromotions;
    totalCTAs += convCTAs;
    totalObjections += convObjections;
    totalRejections += convRejections;

    const finalTrace = traces[traces.length - 1];
    const finalState = finalTrace ? finalTrace.nextState : ConversationState.INITIAL_GREETING;
    finalStateDistribution[finalState] = (finalStateDistribution[finalState] || 0) + 1;

    const outcome = gold?.expectedOutcome || 'NO_PRODUCT_EXIT';
    outcomesDistribution[outcome] = (outcomesDistribution[outcome] || 0) + 1;

    const exitReason =
      finalState === ConversationState.GOODBYE
        ? 'partner_bye'
        : finalState === ConversationState.EXITING
        ? 'inappropriate_or_spam'
        : finalState === ConversationState.SUPPORT_HANDOFF
        ? 'converted_handoff'
        : 'max_turns_or_idle';
    exitReasonsDistribution[exitReason] = (exitReasonsDistribution[exitReason] || 0) + 1;

    const convAvgQuality = traces.length > 0 ? convQualitySum / traces.length : 0;
    qualityScoreSum += convAvgQuality;
  });

  // Calculate Funnel Metrics with Drop-off
  const funnel: FunnelStageMetric[] = [];
  let previousStageCount = totalConversations;

  funnelStages.forEach((stage, idx) => {
    const count = reachedStageCounts[stage.key] || 0;
    const percentage = totalConversations > 0 ? Math.round((count / totalConversations) * 100) : 0;
    const dropOffCount = idx === 0 ? 0 : Math.max(0, previousStageCount - count);
    const dropOffRate =
      idx === 0 || previousStageCount === 0
        ? 0
        : Math.round((dropOffCount / previousStageCount) * 100);

    funnel.push({
      stage: stage.key,
      stageNameFa: stage.labelFa,
      count,
      percentage,
      dropOffCount,
      dropOffRate,
    });

    previousStageCount = count;
  });

  const averageLengthTurns =
    totalConversations > 0 ? Number((totalTurnsSum / totalConversations).toFixed(1)) : 0;
  const averageTurnsToNeedDetection =
    needDetectedConvCount > 0 ? Number((turnsToNeedSum / needDetectedConvCount).toFixed(1)) : 0;
  const averageTurnsToProductIntro =
    productIntroConvCount > 0 ? Number((turnsToProductIntroSum / productIntroConvCount).toFixed(1)) : 0;
  const averageTurnsToFirstCTA =
    ctaConvCount > 0 ? Number((turnsToFirstCTASum / ctaConvCount).toFixed(1)) : 0;
  const conversationQualityScoreAverage =
    totalConversations > 0 ? Math.round(qualityScoreSum / totalConversations) : 0;

  const conversionTrackingGapNotes =
    'CONVERSION_TRACKING_GAP: Current telemetry tracks in-chat conversion indicators (SUPPORT_HANDOFF, PURCHASE_INTENT, PRICE_REQUEST). Full bottom-of-funnel payment receipts and card-to-card confirmations require an external payment bot webhook event (e.g. @Nova_vpn10 sales bot sync).';

  return {
    totalConversations,
    averageLengthTurns,
    averageTurnsToNeedDetection,
    averageTurnsToProductIntro,
    averageTurnsToFirstCTA,
    totalPromotions,
    totalCTAs,
    totalObjections,
    totalRejections,
    finalStateDistribution,
    outcomesDistribution,
    exitReasonsDistribution,
    funnel,
    conversationQualityScoreAverage,
    conversionTrackingGapNotes,
  };
}
