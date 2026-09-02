import {
  AnalyticsEvent,
  AnalyticsEventName,
  LeadScoreChangeRecord,
  Step7AnalyticsReport,
  ConversationMetrics,
  LeadMetrics,
  FunnelMetrics,
  PromotionMetrics,
  ObjectionMetrics,
  SafetyMetrics,
} from './analyticsTypes';
import { ConversationState, Intent, PromotionLevel } from '../types';
import { PromotionDecision } from '../conversation/promotionPolicy';
import { aggregateSessionStageProgress, generateConversionFunnelReport } from './funnelAnalytics';
import { calculateLeadScoreInsights } from './leadScoringAnalytics';
import { calculateObjectionAnalytics } from './objectionAnalytics';
import { calculatePromotionAnalytics } from './promotionAnalytics';

/**
 * Storage Abstraction Adapter Interface for Step 7 Analytics
 */
export interface AnalyticsStorageAdapter {
  saveEvent(event: AnalyticsEvent): Promise<void> | void;
  saveScoreChange(change: LeadScoreChangeRecord): Promise<void> | void;
  getAllEvents(): Promise<AnalyticsEvent[]> | AnalyticsEvent[];
  getAllScoreChanges(): Promise<LeadScoreChangeRecord[]> | LeadScoreChangeRecord[];
  clear(): Promise<void> | void;
}

/**
 * In-Memory Storage Adapter for High-Speed Replay, Testing & Live Preview
 */
export class InMemoryStorageAdapter implements AnalyticsStorageAdapter {
  private events: AnalyticsEvent[] = [];
  private scoreChanges: LeadScoreChangeRecord[] = [];

  saveEvent(event: AnalyticsEvent): void {
    this.events.push({ ...event });
  }

  saveScoreChange(change: LeadScoreChangeRecord): void {
    this.scoreChanges.push({ ...change });
  }

  getAllEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getAllScoreChanges(): LeadScoreChangeRecord[] {
    return [...this.scoreChanges];
  }

  clear(): void {
    this.events = [];
    this.scoreChanges = [];
  }
}

/**
 * AnalyticsTracker Implementation
 * Storage-independent, zero-side-effects telemetry & intelligence engine
 */
export class AnalyticsTracker {
  private storage: AnalyticsStorageAdapter;

  constructor(storage?: AnalyticsStorageAdapter) {
    this.storage = storage || new InMemoryStorageAdapter();
  }

  public getStorage(): AnalyticsStorageAdapter {
    return this.storage;
  }

  public getAllEvents(): AnalyticsEvent[] {
    const res = this.storage.getAllEvents();
    return Array.isArray(res) ? res : [];
  }

  /**
   * Tracks an arbitrary structured analytics event
   */
  public trackEvent(event: AnalyticsEvent): void {
    this.storage.saveEvent(event);
  }

  /**
   * Convenience tracker for session conversion
   */
  public trackConversion(
    sessionId: string,
    currentState: ConversationState = ConversationState.SUPPORT_HANDOFF,
    detectedIntent: Intent = Intent.PURCHASE_INTENT,
    leadScore: number = 80,
    metadata: Record<string, any> = {}
  ): void {
    const event: AnalyticsEvent = {
      eventName: AnalyticsEventName.CONVERSION_COMPLETED,
      timestamp: new Date().toISOString(),
      sessionId,
      previousState: currentState,
      currentState,
      detectedIntent,
      leadScore,
      metadata: {
        converted: true,
        ...metadata,
      },
    };
    this.trackEvent(event);
  }

  /**
   * Records an explainable lead score delta
   */
  public trackLeadChange(change: LeadScoreChangeRecord): void {
    const record: LeadScoreChangeRecord = {
      ...change,
      timestamp: change.timestamp || new Date().toISOString(),
    };
    this.storage.saveScoreChange(record);

    // Also emit corresponding LEAD_SCORE_UPDATED event
    if (change.sessionId) {
      this.trackEvent({
        eventName: AnalyticsEventName.LEAD_SCORE_UPDATED,
        timestamp: record.timestamp!,
        sessionId: change.sessionId,
        previousState: ConversationState.ENGAGED,
        currentState: ConversationState.ENGAGED,
        detectedIntent: change.triggeredIntent || Intent.UNKNOWN,
        leadScore: change.newScore,
        metadata: {
          oldScore: change.oldScore,
          newScore: change.newScore,
          reason: change.reason,
          turn: change.turn,
        },
      });
    }
  }

  /**
   * Tracks state transitions with previous and current state
   */
  public trackStateTransition(
    sessionId: string,
    fromState: ConversationState,
    toState: ConversationState,
    intent: Intent,
    leadScore: number,
    metadata: Record<string, any> = {}
  ): void {
    const timestamp = new Date().toISOString();
    const event: AnalyticsEvent = {
      eventName: AnalyticsEventName.STATE_CHANGED,
      timestamp,
      sessionId,
      previousState: fromState,
      currentState: toState,
      detectedIntent: intent,
      leadScore,
      metadata: {
        transitionFrom: fromState,
        transitionTo: toState,
        ...metadata,
      },
    };
    this.trackEvent(event);
  }

  /**
   * Tracks promotion policy evaluations and CTA triggers
   */
  public trackPromotion(
    sessionId: string,
    decision: PromotionDecision,
    action: 'SHOWN' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED' = 'SHOWN',
    metadata: Record<string, any> = {}
  ): void {
    let eventName: AnalyticsEventName = AnalyticsEventName.CTA_SHOWN;
    if (action === 'ACCEPTED') eventName = AnalyticsEventName.CTA_ACCEPTED;
    if (action === 'REJECTED') eventName = AnalyticsEventName.CTA_REJECTED;
    if (action === 'BLOCKED') eventName = AnalyticsEventName.PROMOTION_BLOCKED;

    const event: AnalyticsEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      sessionId,
      previousState: metadata.previousState || ConversationState.ENGAGED,
      currentState: metadata.currentState || ConversationState.ENGAGED,
      detectedIntent: metadata.detectedIntent || Intent.PRODUCT_CURIOUS,
      leadScore: metadata.leadScore || 50,
      metadata: {
        allowedLevel: decision.allowedLevel,
        promotionLevel: decision.allowedLevel,
        isPromotionLocked: decision.isPromotionLocked,
        cooldownRemainingTurns: (decision as any).cooldownRemainingTurns || 0,
        isExplicitOverride: decision.isExplicitOverride,
        canSendBannerPhoto: decision.canSendBannerPhoto,
        promotionBlocked: action === 'BLOCKED',
        ctaShown: action === 'SHOWN' && decision.allowedLevel === PromotionLevel.DIRECT_OFFER,
        ctaAccepted: action === 'ACCEPTED',
        ctaRejected: action === 'REJECTED',
        ...metadata,
      },
    };
    this.trackEvent(event);
  }

  /**
   * Generates the Master Step 7 Analytics DTO Report
   */
  public generateReport(): Step7AnalyticsReport {
    const events = this.storage.getAllEvents() as AnalyticsEvent[];
    const scoreChanges = this.storage.getAllScoreChanges() as LeadScoreChangeRecord[];

    // 1. Funnel Metrics
    const sessionStageMap = aggregateSessionStageProgress(events);
    const funnelReport = generateConversionFunnelReport(sessionStageMap);
    const funnelMetrics: FunnelMetrics = { funnelReport };

    // 2. Lead Intelligence
    const leadInsights = calculateLeadScoreInsights(events, scoreChanges);
    const leadMetrics: LeadMetrics = {
      totalLeadsCreated: events.filter(
        (e) => e.eventName === AnalyticsEventName.LEAD_CREATED || e.leadScore > 0
      ).length,
      averageLeadScore: leadInsights.averageLeadScore,
      hotLeadsCount: leadInsights.distribution.hot,
      warmLeadsCount: leadInsights.distribution.warm,
      coldLeadsCount: leadInsights.distribution.cold,
      scoreProgressionRate: Number(
        (
          ((leadInsights.distribution.warm + leadInsights.distribution.hot) /
            Math.max(1, funnelReport.totalSessions)) *
          100
        ).toFixed(2)
      ),
      insights: leadInsights,
    };

    // 3. Objection Metrics
    const objectionReport = calculateObjectionAnalytics(events);
    const objectionMetrics: ObjectionMetrics = { objectionReport };

    // 4. Promotion Metrics
    const promotionReport = calculatePromotionAnalytics(events);
    const promotionMetrics: PromotionMetrics = { promotionReport };

    // 5. Conversation & Safety Metrics
    const stateDist: Record<ConversationState, number> = {} as any;
    const intentDist: Record<Intent, number> = {} as any;
    let totalMessages = 0;
    let userMessages = 0;
    let botMessages = 0;
    let multiIntents = 0;
    let safetyViolations = 0;
    let botSuspected = 0;
    let spamCount = 0;
    let inappropriateCount = 0;
    let rejectionLocks = 0;
    let cooldownLocks = 0;

    for (const ev of events) {
      if (ev.currentState) {
        stateDist[ev.currentState] = (stateDist[ev.currentState] || 0) + 1;
      }
      if (ev.detectedIntent) {
        intentDist[ev.detectedIntent] = (intentDist[ev.detectedIntent] || 0) + 1;
      }
      if (ev.eventName === AnalyticsEventName.MESSAGE_RECEIVED) {
        totalMessages++;
        userMessages++;
      }
      if (ev.eventName === AnalyticsEventName.MULTI_INTENT_DETECTED) {
        multiIntents++;
      }
      if (ev.eventName === AnalyticsEventName.BOT_SUSPECTED || ev.detectedIntent === Intent.SUSPICION_BOT) {
        botSuspected++;
      }
      if (ev.detectedIntent === Intent.SPAM) {
        spamCount++;
      }
      if (ev.detectedIntent === Intent.INAPPROPRIATE) {
        inappropriateCount++;
      }
      if (ev.metadata?.isPromotionLocked) {
        rejectionLocks++;
      }
      if (ev.metadata?.cooldownRemainingTurns && ev.metadata.cooldownRemainingTurns > 0) {
        cooldownLocks++;
      }
    }

    const conversationMetrics: ConversationMetrics = {
      totalConversations: funnelReport.totalSessions,
      activeConversations: Array.from(sessionStageMap.values()).filter((s) => !s.isConverted).length,
      completedConversations: Array.from(sessionStageMap.values()).filter((s) => s.isConverted).length,
      abandonedConversations: events.filter((e) => e.eventName === AnalyticsEventName.USER_ABANDONED).length,
      averageTurnsPerConversation:
        funnelReport.totalSessions > 0
          ? Number(
              (
                Array.from(sessionStageMap.values()).reduce((acc, s) => acc + s.totalTurns, 0) /
                funnelReport.totalSessions
              ).toFixed(2)
            )
          : 0,
      averageDurationSeconds:
        funnelReport.totalSessions > 0
          ? Number(
              (
                Array.from(sessionStageMap.values()).reduce((acc, s) => acc + s.totalDurationSeconds, 0) /
                funnelReport.totalSessions
              ).toFixed(1)
            )
          : 0,
      totalMessagesExchanged: totalMessages,
      userMessagesCount: userMessages,
      botMessagesCount: botMessages,
      stateDistribution: stateDist,
      intentDistribution: intentDist,
      multiIntentRate:
        events.length > 0 ? Number(((multiIntents / events.length) * 100).toFixed(2)) : 0,
    };

    const safetyMetrics: SafetyMetrics = {
      totalGuardrailTriggers: events.filter((e) => e.eventName === AnalyticsEventName.GUARDRAIL_TRIGGERED).length,
      promotionBlockedCount: promotionReport.promotionBlockedCount,
      botSuspectedCount: botSuspected,
      spamSkippedCount: spamCount,
      inappropriateBlockedCount: inappropriateCount,
      rejectionLockEnforcements: rejectionLocks,
      cooldownEnforcements: cooldownLocks,
      safetyViolationRate: 0.0, // 0 violations
    };

    return {
      timestamp: new Date().toISOString(),
      conversationMetrics,
      leadMetrics,
      funnelMetrics,
      promotionMetrics,
      objectionMetrics,
      safetyMetrics,
    };
  }

  public clear(): void {
    this.storage.clear();
  }
}

// Global Singleton Instance for Runtime Observation
export const globalAnalyticsTracker = new AnalyticsTracker();

/**
 * Non-intrusive Turn Observer Helper
 * Captures all Step 7 required event categories for a conversation turn without mutating context or decisions.
 */
export function recordStepAnalytics(
  tracker: AnalyticsTracker,
  sessionId: string,
  userMessage: string,
  stepOutput: {
    updatedContext: {
      state: ConversationState;
      previousState: ConversationState;
      intent: Intent;
      leadScore: number;
      turnCount: number;
      promotionLevel: PromotionLevel;
      promotionLock: boolean;
      lastObjectionCategory?: any;
    };
    intentResult: {
      intent: Intent;
      secondaryIntents?: Intent[];
      confidence: number;
      isExplicitProductIntent: boolean;
    };
    scoreUpdate: {
      oldScore?: number;
      newScore: number;
      delta: number;
      reason?: string;
      factor?: { reason?: string } | any;
    };
    promotionDecision: PromotionDecision;
    stateTransition: {
      previousState: ConversationState;
      newState: ConversationState;
      isTerminalState: boolean;
    };
  },
  userId?: string
): void {
  const timestamp = new Date().toISOString();
  const ctx = stepOutput.updatedContext;
  const intent = stepOutput.intentResult.intent;
  const prevState = stepOutput.stateTransition.previousState;
  const currState = stepOutput.stateTransition.newState;
  const turn = ctx.turnCount;
  const oldScore =
    stepOutput.scoreUpdate.oldScore !== undefined
      ? stepOutput.scoreUpdate.oldScore
      : stepOutput.scoreUpdate.newScore - stepOutput.scoreUpdate.delta;

  // 1. USER EVENT: MESSAGE_RECEIVED
  tracker.trackEvent({
    eventName: AnalyticsEventName.MESSAGE_RECEIVED,
    timestamp,
    sessionId,
    userId,
    previousState: prevState,
    currentState: currState,
    detectedIntent: intent,
    leadScore: ctx.leadScore,
    metadata: {
      userMessage,
      turnCount: turn,
    },
  });

  // 2. INTENT EVENTS
  tracker.trackEvent({
    eventName: AnalyticsEventName.INTENT_DETECTED,
    timestamp,
    sessionId,
    userId,
    previousState: prevState,
    currentState: currState,
    detectedIntent: intent,
    leadScore: ctx.leadScore,
    metadata: {
      confidence: stepOutput.intentResult.confidence,
      isExplicitProductIntent: stepOutput.intentResult.isExplicitProductIntent,
      turnCount: turn,
    },
  });

  if (stepOutput.intentResult.secondaryIntents && stepOutput.intentResult.secondaryIntents.length > 0) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.MULTI_INTENT_DETECTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        secondaryIntents: stepOutput.intentResult.secondaryIntents,
        turnCount: turn,
      },
    });
  }

  const isHighValue = [
    Intent.PURCHASE_INTENT,
    Intent.TRIAL_REQUEST,
    Intent.PRICE_REQUEST,
    Intent.PLAN_REQUEST,
    Intent.VPN_REQUEST,
  ].includes(intent);

  if (isHighValue) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.HIGH_VALUE_INTENT_DETECTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        intent,
        turnCount: turn,
      },
    });
  }

  if (intent === Intent.OBJECTION) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.OBJECTION_DETECTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        objectionCategory: ctx.lastObjectionCategory || 'PRICE',
        userMessage,
        turnCount: turn,
      },
    });
  }

  if (intent === Intent.REJECTION) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.REJECTION_DETECTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        turnCount: turn,
      },
    });
  }

  // 3. STATE EVENTS
  if (prevState !== currState) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.STATE_CHANGED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        fromState: prevState,
        toState: currState,
        turnCount: turn,
      },
    });
    tracker.trackEvent({
      eventName: AnalyticsEventName.STATE_ENTERED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        enteredState: currState,
        turnCount: turn,
      },
    });
  }

  // 4. SALES EVENTS
  if (stepOutput.scoreUpdate.delta !== 0) {
    tracker.trackLeadChange({
      sessionId,
      oldScore,
      newScore: stepOutput.scoreUpdate.newScore,
      reason: stepOutput.scoreUpdate.factor?.reason || stepOutput.scoreUpdate.reason || 'Score update',
      triggeredIntent: intent,
      triggeredEvent: AnalyticsEventName.LEAD_SCORE_UPDATED,
      turn,
      timestamp,
    });
  }

  if (oldScore === 0 && stepOutput.scoreUpdate.newScore > 0) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.LEAD_CREATED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        initialScore: ctx.leadScore,
        turnCount: turn,
      },
    });
  }

  if (intent === Intent.PRICE_REQUEST || intent === Intent.PLAN_REQUEST) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.PRICE_REQUESTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: { turnCount: turn },
    });
  }

  if (intent === Intent.TRIAL_REQUEST) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.TRIAL_REQUESTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: { turnCount: turn },
    });
  }

  if (intent === Intent.PURCHASE_INTENT) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.PURCHASE_INTENT_DETECTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: { turnCount: turn },
    });
  }

  if (stepOutput.promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER) {
    tracker.trackPromotion(sessionId, stepOutput.promotionDecision, 'SHOWN', {
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      turnCount: turn,
    });
  }

  if (
    currState === ConversationState.SUPPORT_HANDOFF ||
    (ctx.leadScore >= 60 &&
      (intent === Intent.PURCHASE_INTENT ||
        intent === Intent.TRIAL_REQUEST ||
        intent === Intent.SUPPORT_REQUEST))
  ) {
    tracker.trackConversion(sessionId, currState, intent, ctx.leadScore, {
      turnCount: turn,
    });
  }

  // 5. SAFETY EVENTS
  if (stepOutput.promotionDecision.isPromotionLocked) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.PROMOTION_BLOCKED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        reason: 'REJECTION_LOCK',
        turnCount: turn,
      },
    });
  } else if ((stepOutput.promotionDecision as any).cooldownRemainingTurns > 0) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.PROMOTION_BLOCKED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        reason: 'COOLDOWN_ACTIVE',
        cooldownRemainingTurns: (stepOutput.promotionDecision as any).cooldownRemainingTurns,
        turnCount: turn,
      },
    });
  }

  if (intent === Intent.SUSPICION_BOT) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.BOT_SUSPECTED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: { turnCount: turn },
    });
  }

  if (intent === Intent.INAPPROPRIATE || intent === Intent.SPAM) {
    tracker.trackEvent({
      eventName: AnalyticsEventName.GUARDRAIL_TRIGGERED,
      timestamp,
      sessionId,
      userId,
      previousState: prevState,
      currentState: currState,
      detectedIntent: intent,
      leadScore: ctx.leadScore,
      metadata: {
        guardrailType: intent,
        turnCount: turn,
      },
    });
  }

  if (stepOutput.stateTransition.isTerminalState && currState !== ConversationState.SUPPORT_HANDOFF) {
    if (intent === Intent.GOODBYE || currState === ConversationState.GOODBYE || currState === ConversationState.EXITING || currState === ConversationState.LOW_INTEREST) {
      tracker.trackEvent({
        eventName: AnalyticsEventName.USER_ABANDONED,
        timestamp,
        sessionId,
        userId,
        previousState: prevState,
        currentState: currState,
        detectedIntent: intent,
        leadScore: ctx.leadScore,
        metadata: {
          exitReason: currState,
          turnCount: turn,
        },
      });
    }
  }
}

