import {
  AnalyticsObjectionCategory,
  ObjectionAnalyticsSummary,
  AnalyticsEvent,
  AnalyticsEventName,
} from './analyticsTypes';
import { ConversationState, Intent } from '../types';
import { mapToAnalyticsObjectionCategory } from './leadScoringAnalytics';

interface SessionObjectionTrace {
  sessionId: string;
  hadObjection: boolean;
  objectionCategories: Set<AnalyticsObjectionCategory>;
  recovered: boolean;
  converted: boolean;
  abandoned: boolean;
  objectionEventIndices: number[];
}

/**
 * Calculates comprehensive Objection Intelligence metrics
 */
export function calculateObjectionAnalytics(
  events: AnalyticsEvent[]
): ObjectionAnalyticsSummary {
  const sessionMap = new Map<string, SessionObjectionTrace>();

  // Group events by session in chronological order
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const sessionEvents = new Map<string, AnalyticsEvent[]>();
  for (const ev of sortedEvents) {
    const list = sessionEvents.get(ev.sessionId) || [];
    list.push(ev);
    sessionEvents.set(ev.sessionId, list);
  }

  const categoryCounts: Record<AnalyticsObjectionCategory, number> = {
    [AnalyticsObjectionCategory.PRICE]: 0,
    [AnalyticsObjectionCategory.TRUST]: 0,
    [AnalyticsObjectionCategory.SECURITY]: 0,
    [AnalyticsObjectionCategory.PERFORMANCE]: 0,
    [AnalyticsObjectionCategory.COMPETITOR]: 0,
    [AnalyticsObjectionCategory.FEATURE_GAP]: 0,
    [AnalyticsObjectionCategory.OTHER]: 0,
  };

  const categoryRecoveryCounts: Record<AnalyticsObjectionCategory, { total: number; recovered: number; converted: number; abandoned: number }> = {
    [AnalyticsObjectionCategory.PRICE]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
    [AnalyticsObjectionCategory.TRUST]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
    [AnalyticsObjectionCategory.SECURITY]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
    [AnalyticsObjectionCategory.PERFORMANCE]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
    [AnalyticsObjectionCategory.COMPETITOR]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
    [AnalyticsObjectionCategory.FEATURE_GAP]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
    [AnalyticsObjectionCategory.OTHER]: { total: 0, recovered: 0, converted: 0, abandoned: 0 },
  };

  let totalObjectionEvents = 0;

  for (const [sessionId, evList] of sessionEvents.entries()) {
    const trace: SessionObjectionTrace = {
      sessionId,
      hadObjection: false,
      objectionCategories: new Set<AnalyticsObjectionCategory>(),
      recovered: false,
      converted: false,
      abandoned: false,
      objectionEventIndices: [],
    };

    // Find all objection events
    for (let i = 0; i < evList.length; i++) {
      const ev = evList[i];
      const isObjection =
        ev.eventName === AnalyticsEventName.OBJECTION_DETECTED ||
        ev.detectedIntent === Intent.OBJECTION ||
        ev.currentState === ConversationState.OBJECTION_HANDLING ||
        ev.metadata?.isObjection === true;

      if (isObjection) {
        trace.hadObjection = true;
        trace.objectionEventIndices.push(i);
        totalObjectionEvents++;

        const cat = mapToAnalyticsObjectionCategory(
          ev.metadata?.objectionCategory || ev.metadata?.category || ev.metadata?.reason || ev.metadata?.userMessage
        );
        trace.objectionCategories.add(cat);
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    }

    if (trace.hadObjection && trace.objectionEventIndices.length > 0) {
      const firstObjIdx = trace.objectionEventIndices[0];
      const subsequentEvents = evList.slice(firstObjIdx + 1);

      // Check recovery: Did the state move back to ENGAGED, PRODUCT_*, TRIAL_*, PRICE_*, SUPPORT_HANDOFF?
      const reachedPositiveState = subsequentEvents.some((e) =>
        [
          ConversationState.ENGAGED,
          ConversationState.PRODUCT_INTRODUCTION,
          ConversationState.PRODUCT_INTEREST,
          ConversationState.PRICE_DISCUSSION,
          ConversationState.TRIAL_DISCUSSION,
          ConversationState.SUPPORT_HANDOFF,
        ].includes(e.currentState)
      );

      // Check conversion: Did the session complete a conversion or purchase intent?
      const didConvert = subsequentEvents.some(
        (e) =>
          e.eventName === AnalyticsEventName.CONVERSION_COMPLETED ||
          e.eventName === AnalyticsEventName.PURCHASE_INTENT_DETECTED ||
          e.eventName === AnalyticsEventName.TRIAL_REQUESTED ||
          e.metadata?.converted === true ||
          e.currentState === ConversationState.SUPPORT_HANDOFF
      );

      // Check abandonment: Did user abandon, reject, or goodbye without conversion?
      const didAbandon =
        !didConvert &&
        subsequentEvents.some(
          (e) =>
            e.eventName === AnalyticsEventName.USER_ABANDONED ||
            e.eventName === AnalyticsEventName.REJECTION_DETECTED ||
            e.currentState === ConversationState.REJECTED ||
            e.currentState === ConversationState.LOW_INTEREST ||
            e.currentState === ConversationState.GOODBYE ||
            e.currentState === ConversationState.EXITING
        );

      trace.recovered = reachedPositiveState || didConvert;
      trace.converted = didConvert;
      trace.abandoned = didAbandon || (!trace.recovered && !trace.converted);

      for (const cat of trace.objectionCategories) {
        const stats = categoryRecoveryCounts[cat];
        stats.total += 1;
        if (trace.recovered) stats.recovered += 1;
        if (trace.converted) stats.converted += 1;
        if (trace.abandoned) stats.abandoned += 1;
      }
    }

    sessionMap.set(sessionId, trace);
  }

  const allSessions = Array.from(sessionMap.values());
  const totalSessions = allSessions.length;
  const sessionsWithObjections = allSessions.filter((s) => s.hadObjection);
  const totalObjectedSessions = sessionsWithObjections.length;

  const objectionFrequency =
    totalSessions > 0
      ? Number(((totalObjectedSessions / totalSessions) * 100).toFixed(2))
      : 0;

  const recoveredSessionsCount = sessionsWithObjections.filter((s) => s.recovered).length;
  const recoverySuccessRate =
    totalObjectedSessions > 0
      ? Number(((recoveredSessionsCount / totalObjectedSessions) * 100).toFixed(2))
      : 0;

  const convertedObjectedCount = sessionsWithObjections.filter((s) => s.converted).length;
  const objectionToPurchaseConversionRate =
    totalObjectedSessions > 0
      ? Number(((convertedObjectedCount / totalObjectedSessions) * 100).toFixed(2))
      : 0;

  const abandonedObjectedCount = sessionsWithObjections.filter((s) => s.abandoned).length;
  const objectionToAbandonmentRate =
    totalObjectedSessions > 0
      ? Number(((abandonedObjectedCount / totalObjectedSessions) * 100).toFixed(2))
      : 0;

  const categoryBreakdown = Object.values(AnalyticsObjectionCategory).map((cat) => {
    const stats = categoryRecoveryCounts[cat];
    const catTotal = stats.total;
    return {
      category: cat,
      count: categoryCounts[cat] || 0,
      recoveryRate: catTotal > 0 ? Number(((stats.recovered / catTotal) * 100).toFixed(2)) : 0,
      conversionRate: catTotal > 0 ? Number(((stats.converted / catTotal) * 100).toFixed(2)) : 0,
      abandonmentRate: catTotal > 0 ? Number(((stats.abandoned / catTotal) * 100).toFixed(2)) : 0,
    };
  });

  return {
    objectionFrequency,
    totalObjections: totalObjectionEvents,
    objectionCategories: categoryCounts,
    recoverySuccessRate,
    objectionToPurchaseConversionRate,
    objectionToAbandonmentRate,
    categoryBreakdown,
  };
}
