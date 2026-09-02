import {
  FunnelStage,
  FunnelStageMetric,
  ConversionFunnelReport,
  AnalyticsEvent,
  AnalyticsEventName,
} from './analyticsTypes';
import { ConversationState, Intent, PromotionLevel } from '../types';

export interface SessionStageProgress {
  sessionId: string;
  stagesReached: Set<FunnelStage>;
  stageTurns: Map<FunnelStage, number>;
  stageTimestamps: Map<FunnelStage, number>; // epoch ms
  isConverted: boolean;
  totalTurns: number;
  totalDurationSeconds: number;
}

const FUNNEL_STAGE_ORDER: FunnelStage[] = [
  FunnelStage.STAGE_1_CONVERSATION_STARTED,
  FunnelStage.STAGE_2_INTENT_IDENTIFIED,
  FunnelStage.STAGE_3_NEED_DETECTED,
  FunnelStage.STAGE_4_PRODUCT_INTEREST,
  FunnelStage.STAGE_5_COMMERCIAL_INTENT,
  FunnelStage.STAGE_6_CTA_PRESENTED,
  FunnelStage.STAGE_7_TRIAL_PURCHASE_ACTION,
  FunnelStage.STAGE_8_CONVERSION,
];

/**
 * Maps an event or turn state to applicable funnel stages
 */
export function determineReachedStages(
  event: AnalyticsEvent,
  turnNumber: number
): FunnelStage[] {
  const reached: FunnelStage[] = [];

  // Stage 1: Conversation Started
  reached.push(FunnelStage.STAGE_1_CONVERSATION_STARTED);

  // Stage 2: Intent Identified
  if (
    event.detectedIntent &&
    event.detectedIntent !== Intent.UNKNOWN &&
    event.detectedIntent !== Intent.SILENCE
  ) {
    reached.push(FunnelStage.STAGE_2_INTENT_IDENTIFIED);
  }

  // Stage 3: Need Detected
  if (
    event.detectedIntent === Intent.RELEVANT_NEED ||
    event.detectedIntent === Intent.VPN_REQUEST ||
    event.currentState === ConversationState.NEED_DETECTED ||
    event.currentState === ConversationState.QUALIFYING
  ) {
    reached.push(FunnelStage.STAGE_3_NEED_DETECTED);
  }

  // Stage 4: Product Interest
  if (
    event.detectedIntent === Intent.PRODUCT_CURIOUS ||
    event.detectedIntent === Intent.VPN_REQUEST ||
    event.currentState === ConversationState.PRODUCT_INTRODUCTION ||
    event.currentState === ConversationState.PRODUCT_INTEREST
  ) {
    reached.push(FunnelStage.STAGE_4_PRODUCT_INTEREST);
  }

  // Stage 5: Commercial Intent
  if (
    event.detectedIntent === Intent.PRICE_REQUEST ||
    event.detectedIntent === Intent.PLAN_REQUEST ||
    event.detectedIntent === Intent.TRIAL_REQUEST ||
    event.detectedIntent === Intent.PURCHASE_INTENT ||
    event.detectedIntent === Intent.SUPPORT_REQUEST ||
    event.currentState === ConversationState.PRICE_DISCUSSION ||
    event.currentState === ConversationState.TRIAL_DISCUSSION ||
    event.currentState === ConversationState.SUPPORT_HANDOFF ||
    event.eventName === AnalyticsEventName.PRICE_REQUESTED ||
    event.eventName === AnalyticsEventName.TRIAL_REQUESTED ||
    event.eventName === AnalyticsEventName.PURCHASE_INTENT_DETECTED
  ) {
    reached.push(FunnelStage.STAGE_5_COMMERCIAL_INTENT);
  }

  // Stage 6: CTA Presented
  if (
    event.eventName === AnalyticsEventName.CTA_SHOWN ||
    event.metadata?.promotionLevel === PromotionLevel.DIRECT_OFFER ||
    event.metadata?.ctaShown === true
  ) {
    reached.push(FunnelStage.STAGE_6_CTA_PRESENTED);
  }

  // Stage 7: Trial/Purchase Action
  if (
    event.eventName === AnalyticsEventName.CTA_ACCEPTED ||
    event.eventName === AnalyticsEventName.TRIAL_REQUESTED ||
    event.eventName === AnalyticsEventName.PURCHASE_INTENT_DETECTED ||
    (event.metadata?.ctaAccepted === true &&
      (event.detectedIntent === Intent.TRIAL_REQUEST ||
        event.detectedIntent === Intent.PURCHASE_INTENT ||
        event.detectedIntent === Intent.SUPPORT_REQUEST))
  ) {
    reached.push(FunnelStage.STAGE_7_TRIAL_PURCHASE_ACTION);
  }

  // Stage 8: Conversion
  if (
    event.eventName === AnalyticsEventName.CONVERSION_COMPLETED ||
    event.metadata?.converted === true ||
    (event.currentState === ConversationState.SUPPORT_HANDOFF &&
      (event.detectedIntent === Intent.PURCHASE_INTENT ||
        event.detectedIntent === Intent.TRIAL_REQUEST ||
        event.detectedIntent === Intent.SUPPORT_REQUEST))
  ) {
    reached.push(FunnelStage.STAGE_8_CONVERSION);
  }

  return reached;
}

/**
 * Builds SessionStageProgress records from chronological analytics events
 */
export function aggregateSessionStageProgress(
  events: AnalyticsEvent[]
): Map<string, SessionStageProgress> {
  const sessionMap = new Map<string, SessionStageProgress>();

  // Ensure deterministic chronological processing
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (const event of sortedEvents) {
    const sessionId = event.sessionId;
    let progress = sessionMap.get(sessionId);

    if (!progress) {
      progress = {
        sessionId,
        stagesReached: new Set<FunnelStage>([FunnelStage.STAGE_1_CONVERSATION_STARTED]),
        stageTurns: new Map<FunnelStage, number>([[FunnelStage.STAGE_1_CONVERSATION_STARTED, 1]]),
        stageTimestamps: new Map<FunnelStage, number>([
          [FunnelStage.STAGE_1_CONVERSATION_STARTED, new Date(event.timestamp).getTime()],
        ]),
        isConverted: false,
        totalTurns: 1,
        totalDurationSeconds: 0,
      };
      sessionMap.set(sessionId, progress);
    }

    const currentTurn = Number(event.metadata?.turnCount || event.metadata?.turn || 1);
    progress.totalTurns = Math.max(progress.totalTurns, currentTurn);

    const eventTime = new Date(event.timestamp).getTime();
    const firstTime = progress.stageTimestamps.get(FunnelStage.STAGE_1_CONVERSATION_STARTED) || eventTime;
    progress.totalDurationSeconds = Math.max(
      progress.totalDurationSeconds,
      Math.max(0, Math.round((eventTime - firstTime) / 1000))
    );

    const reachedStages = determineReachedStages(event, currentTurn);

    for (const stage of reachedStages) {
      if (!progress.stagesReached.has(stage)) {
        progress.stagesReached.add(stage);
        progress.stageTurns.set(stage, currentTurn);
        progress.stageTimestamps.set(stage, eventTime);
      }
    }

    if (reachedStages.includes(FunnelStage.STAGE_8_CONVERSION)) {
      progress.isConverted = true;
    }
  }

  return sessionMap;
}

/**
 * Generates the full Conversion Funnel Report with drop-off & stage conversion rates
 */
export function generateConversionFunnelReport(
  sessionMap: Map<string, SessionStageProgress>
): ConversionFunnelReport {
  const totalSessions = sessionMap.size;

  if (totalSessions === 0) {
    return {
      totalSessions: 0,
      stages: FUNNEL_STAGE_ORDER.map((stage, idx) => ({
        stageNumber: idx + 1,
        stageName: stage,
        count: 0,
        conversionRateFromPrevious: idx === 0 ? 100 : 0,
        dropOffRate: 0,
        avgTurnsToReach: 0,
        avgTimeSecondsToReach: 0,
      })),
      overallConversionRate: 0,
      biggestDropOffStage: 'None',
      avgTurnsToConversion: 0,
      avgTimeToConversionSeconds: 0,
    };
  }

  const stageCounts = new Map<FunnelStage, number>();
  const stageTotalTurns = new Map<FunnelStage, number>();
  const stageTotalTime = new Map<FunnelStage, number>();

  for (const stage of FUNNEL_STAGE_ORDER) {
    stageCounts.set(stage, 0);
    stageTotalTurns.set(stage, 0);
    stageTotalTime.set(stage, 0);
  }

  for (const session of sessionMap.values()) {
    const sessionStart = session.stageTimestamps.get(FunnelStage.STAGE_1_CONVERSATION_STARTED) || 0;

    for (const stage of session.stagesReached) {
      stageCounts.set(stage, (stageCounts.get(stage) || 0) + 1);
      stageTotalTurns.set(stage, (stageTotalTurns.get(stage) || 0) + (session.stageTurns.get(stage) || 1));
      
      const stageTime = session.stageTimestamps.get(stage) || sessionStart;
      const elapsed = Math.max(0, Math.round((stageTime - sessionStart) / 1000));
      stageTotalTime.set(stage, (stageTotalTime.get(stage) || 0) + elapsed);
    }
  }

  const stageMetrics: FunnelStageMetric[] = [];
  let maxDropOff = -1;
  let biggestDropOffStage = 'None';
  let prevCount = totalSessions;

  for (let i = 0; i < FUNNEL_STAGE_ORDER.length; i++) {
    const stage = FUNNEL_STAGE_ORDER[i];
    const count = stageCounts.get(stage) || 0;
    const stageNumber = i + 1;

    const conversionRateFromPrevious =
      i === 0 ? 100 : prevCount > 0 ? Number(((count / prevCount) * 100).toFixed(2)) : 0;
    const dropOffRate =
      i === 0 ? 0 : prevCount > 0 ? Number((((prevCount - count) / prevCount) * 100).toFixed(2)) : 0;

    if (i > 0 && dropOffRate > maxDropOff && prevCount > 0) {
      maxDropOff = dropOffRate;
      biggestDropOffStage = stage;
    }

    const avgTurns = count > 0 ? Number(((stageTotalTurns.get(stage) || 0) / count).toFixed(2)) : 0;
    const avgTime = count > 0 ? Number(((stageTotalTime.get(stage) || 0) / count).toFixed(1)) : 0;

    stageMetrics.push({
      stageNumber,
      stageName: stage,
      count,
      conversionRateFromPrevious,
      dropOffRate,
      avgTurnsToReach: avgTurns,
      avgTimeSecondsToReach: avgTime,
    });

    prevCount = count;
  }

  const convertedCount = stageCounts.get(FunnelStage.STAGE_8_CONVERSION) || 0;
  const overallConversionRate =
    totalSessions > 0 ? Number(((convertedCount / totalSessions) * 100).toFixed(2)) : 0;

  const convertedSessions = Array.from(sessionMap.values()).filter((s) => s.isConverted);
  const avgTurnsToConversion =
    convertedSessions.length > 0
      ? Number(
          (
            convertedSessions.reduce(
              (acc, s) => acc + (s.stageTurns.get(FunnelStage.STAGE_8_CONVERSION) || s.totalTurns),
              0
            ) / convertedSessions.length
          ).toFixed(2)
        )
      : 0;

  const avgTimeToConversionSeconds =
    convertedSessions.length > 0
      ? Number(
          (
            convertedSessions.reduce((acc, s) => acc + s.totalDurationSeconds, 0) /
            convertedSessions.length
          ).toFixed(1)
        )
      : 0;

  return {
    totalSessions,
    stages: stageMetrics,
    overallConversionRate,
    biggestDropOffStage,
    avgTurnsToConversion,
    avgTimeToConversionSeconds,
  };
}
