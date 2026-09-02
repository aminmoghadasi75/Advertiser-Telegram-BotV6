import {
  LeadScoreChangeRecord,
  LeadScoreInsights,
  AnalyticsObjectionCategory,
  AnalyticsEvent,
  AnalyticsEventName,
} from './analyticsTypes';
import { Intent, ConversationState } from '../types';

export interface SessionLeadData {
  sessionId: string;
  finalScore: number;
  scoreChanges: LeadScoreChangeRecord[];
  detectedIntents: Set<Intent>;
  objectionsEncountered: Set<AnalyticsObjectionCategory>;
  isConverted: boolean;
}

/**
 * Maps raw string or enum objections to AnalyticsObjectionCategory
 */
export function mapToAnalyticsObjectionCategory(
  categoryOrText?: string
): AnalyticsObjectionCategory {
  if (!categoryOrText) return AnalyticsObjectionCategory.OTHER;

  const upper = categoryOrText.toUpperCase();
  if (upper.includes('PRICE') || upper.includes('COST') || upper.includes('گران') || upper.includes('قیمت')) {
    return AnalyticsObjectionCategory.PRICE;
  }
  if (upper.includes('TRUST') || upper.includes('SCAM') || upper.includes('اعتماد') || upper.includes('کلاهبرداری')) {
    return AnalyticsObjectionCategory.TRUST;
  }
  if (upper.includes('SECURITY') || upper.includes('PRIVACY') || upper.includes('امنیت') || upper.includes('ردیابی')) {
    return AnalyticsObjectionCategory.SECURITY;
  }
  if (upper.includes('PERFORMANCE') || upper.includes('SPEED') || upper.includes('SLOW') || upper.includes('قطعی') || upper.includes('سرعت')) {
    return AnalyticsObjectionCategory.PERFORMANCE;
  }
  if (upper.includes('COMPETITOR') || upper.includes('EXISTING') || upper.includes('رقیب') || upper.includes('جای دیگه')) {
    return AnalyticsObjectionCategory.COMPETITOR;
  }
  if (upper.includes('FEATURE') || upper.includes('COMPLEXITY') || upper.includes('سخت') || upper.includes('نصب')) {
    return AnalyticsObjectionCategory.FEATURE_GAP;
  }
  return AnalyticsObjectionCategory.OTHER;
}

/**
 * Aggregates explainable lead scoring events and computes intelligence insights
 */
export function calculateLeadScoreInsights(
  events: AnalyticsEvent[],
  scoreChangeHistory: LeadScoreChangeRecord[]
): LeadScoreInsights {
  const sessionLeadMap = new Map<string, SessionLeadData>();

  // Process all events
  for (const event of events) {
    const sessionId = event.sessionId;
    let data = sessionLeadMap.get(sessionId);
    if (!data) {
      data = {
        sessionId,
        finalScore: event.leadScore || 0,
        scoreChanges: [],
        detectedIntents: new Set<Intent>(),
        objectionsEncountered: new Set<AnalyticsObjectionCategory>(),
        isConverted: false,
      };
      sessionLeadMap.set(sessionId, data);
    }

    data.finalScore = Math.max(data.finalScore, event.leadScore || 0);

    if (event.detectedIntent && event.detectedIntent !== Intent.UNKNOWN) {
      data.detectedIntents.add(event.detectedIntent);
    }

    if (
      event.eventName === AnalyticsEventName.OBJECTION_DETECTED ||
      event.detectedIntent === Intent.OBJECTION ||
      event.currentState === ConversationState.OBJECTION_HANDLING
    ) {
      const cat = mapToAnalyticsObjectionCategory(
        event.metadata?.objectionCategory || event.metadata?.category || event.metadata?.reason
      );
      data.objectionsEncountered.add(cat);
    }

    if (
      event.eventName === AnalyticsEventName.CONVERSION_COMPLETED ||
      event.metadata?.converted === true ||
      (event.currentState === ConversationState.SUPPORT_HANDOFF &&
        (event.detectedIntent === Intent.PURCHASE_INTENT ||
          event.detectedIntent === Intent.TRIAL_REQUEST ||
          event.detectedIntent === Intent.SUPPORT_REQUEST))
    ) {
      data.isConverted = true;
    }
  }

  // Attach score change history
  for (const change of scoreChangeHistory) {
    if (change.sessionId) {
      const sData = sessionLeadMap.get(change.sessionId);
      if (sData) {
        sData.scoreChanges.push(change);
        sData.finalScore = Math.max(sData.finalScore, change.newScore);
        if (change.triggeredIntent) {
          sData.detectedIntents.add(change.triggeredIntent);
        }
      }
    }
  }

  const sessions = Array.from(sessionLeadMap.values());
  const totalSessions = sessions.length;

  if (totalSessions === 0) {
    return {
      averageLeadScore: 0,
      medianLeadScore: 0,
      distribution: { cold: 0, warm: 0, hot: 0 },
      highestConvertingIntents: [],
      highScoreLowConversionIntents: [],
      objectionsBlockingConversion: [],
      recentScoreChanges: scoreChangeHistory.slice(-20),
    };
  }

  // Calculate scores
  const allScores = sessions.map((s) => s.finalScore).sort((a, b) => a - b);
  const avgScore = Number((allScores.reduce((acc, s) => acc + s, 0) / totalSessions).toFixed(2));
  const medianScore =
    totalSessions % 2 === 1
      ? allScores[Math.floor(totalSessions / 2)]
      : Number(
          (
            (allScores[totalSessions / 2 - 1] + allScores[totalSessions / 2]) /
            2
          ).toFixed(2)
        );

  const coldCount = sessions.filter((s) => s.finalScore < 26).length;
  const warmCount = sessions.filter((s) => s.finalScore >= 26 && s.finalScore < 56).length;
  const hotCount = sessions.filter((s) => s.finalScore >= 56).length;

  // Intent conversion tracking
  const intentStats = new Map<
    Intent,
    { total: number; converted: number; scoreSum: number }
  >();

  for (const session of sessions) {
    for (const intent of session.detectedIntents) {
      const curr = intentStats.get(intent) || { total: 0, converted: 0, scoreSum: 0 };
      curr.total += 1;
      curr.scoreSum += session.finalScore;
      if (session.isConverted) {
        curr.converted += 1;
      }
      intentStats.set(intent, curr);
    }
  }

  const highestConvertingIntents = Array.from(intentStats.entries())
    .map(([intent, stat]) => ({
      intent,
      conversionRate: Number(((stat.converted / stat.total) * 100).toFixed(2)),
      conversions: stat.converted,
      total: stat.total,
    }))
    .filter((item) => item.total >= 1)
    .sort((a, b) => b.conversionRate - a.conversionRate || b.conversions - a.conversions);

  // High score but low conversion intents (avgScore >= 35, conversionRate <= 40%)
  const highScoreLowConversionIntents = Array.from(intentStats.entries())
    .map(([intent, stat]) => {
      const averageScore = Number((stat.scoreSum / stat.total).toFixed(2));
      const conversionRate = Number(((stat.converted / stat.total) * 100).toFixed(2));
      const dropOffCount = stat.total - stat.converted;
      return {
        intent,
        averageScore,
        conversionRate,
        dropOffCount,
      };
    })
    .filter((item) => item.averageScore >= 35 && item.conversionRate < 50 && item.dropOffCount > 0)
    .sort((a, b) => b.dropOffCount - a.dropOffCount);

  // Objections blocking conversion
  const objectionStats = new Map<AnalyticsObjectionCategory, { total: number; unconverted: number }>();
  for (const session of sessions) {
    for (const obj of session.objectionsEncountered) {
      const curr = objectionStats.get(obj) || { total: 0, unconverted: 0 };
      curr.total += 1;
      if (!session.isConverted) {
        curr.unconverted += 1;
      }
      objectionStats.set(obj, curr);
    }
  }

  const objectionsBlockingConversion = Array.from(objectionStats.entries())
    .map(([category, stat]) => ({
      category,
      count: stat.total,
      dropOffRate: Number(((stat.unconverted / stat.total) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    averageLeadScore: avgScore,
    medianLeadScore: medianScore,
    distribution: {
      cold: coldCount,
      warm: warmCount,
      hot: hotCount,
    },
    highestConvertingIntents,
    highScoreLowConversionIntents,
    objectionsBlockingConversion,
    recentScoreChanges: scoreChangeHistory.slice(-50),
  };
}
