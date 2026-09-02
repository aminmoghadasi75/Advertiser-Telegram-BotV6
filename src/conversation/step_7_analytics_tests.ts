import {
  AnalyticsTracker,
  InMemoryStorageAdapter,
  AnalyticsEventName,
  AnalyticsEvent,
  FunnelStage,
  AnalyticsObjectionCategory,
  recordStepAnalytics,
} from '../analytics';
import { ConversationState, Intent, PromotionLevel } from '../types';
import {
  processConversationTurn,
  createInitialConversationContext,
} from './conversationEngine';

export interface TestResult {
  name: string;
  passed: boolean;
  expected?: any;
  actual?: any;
  error?: string;
}

export interface Step7TestSuiteResult {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}

export function runAllStep7AnalyticsTests(): Step7TestSuiteResult {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, expected?: any, actual?: any) {
    results.push({
      name,
      passed: Boolean(condition),
      expected: expected ?? true,
      actual: actual ?? condition,
    });
  }

  // =========================================================================
  // TEST GROUP 1: EVENT CREATION & SCHEMA INTEGRITY
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const event: AnalyticsEvent = {
      eventName: AnalyticsEventName.SESSION_STARTED,
      timestamp: new Date().toISOString(),
      sessionId: 'sess_test_1',
      userId: 'user_123',
      previousState: ConversationState.CONNECTING,
      currentState: ConversationState.INITIAL_GREETING,
      detectedIntent: Intent.GREETING,
      leadScore: 0,
      metadata: { source: 'telegram_bot' },
    };

    tracker.trackEvent(event);
    const report = tracker.generateReport();

    assert('Event Creation: Event stored and report generated', report.conversationMetrics.totalConversations >= 1);
    assert('Event Schema: Envelope fields populated', event.sessionId === 'sess_test_1' && event.eventName === AnalyticsEventName.SESSION_STARTED);
  }

  // =========================================================================
  // TEST GROUP 2: 8-STAGE FUNNEL PROGRESSION
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const sessionId = 'sess_funnel_full';

    // Stage 1: Started
    tracker.trackEvent({
      eventName: AnalyticsEventName.SESSION_STARTED,
      timestamp: '2026-08-21T10:00:00Z',
      sessionId,
      previousState: ConversationState.CONNECTING,
      currentState: ConversationState.INITIAL_GREETING,
      detectedIntent: Intent.GREETING,
      leadScore: 0,
      metadata: { turnCount: 1 },
    });

    // Stage 2: Intent Identified
    tracker.trackEvent({
      eventName: AnalyticsEventName.INTENT_DETECTED,
      timestamp: '2026-08-21T10:00:10Z',
      sessionId,
      previousState: ConversationState.INITIAL_GREETING,
      currentState: ConversationState.EARLY_CONVERSATION,
      detectedIntent: Intent.SMALL_TALK,
      leadScore: 5,
      metadata: { turnCount: 1 },
    });

    // Stage 3: Need Detected
    tracker.trackEvent({
      eventName: AnalyticsEventName.INTENT_DETECTED,
      timestamp: '2026-08-21T10:00:30Z',
      sessionId,
      previousState: ConversationState.EARLY_CONVERSATION,
      currentState: ConversationState.NEED_DETECTED,
      detectedIntent: Intent.RELEVANT_NEED,
      leadScore: 20,
      metadata: { turnCount: 2 },
    });

    // Stage 4: Product Interest
    tracker.trackEvent({
      eventName: AnalyticsEventName.INTENT_DETECTED,
      timestamp: '2026-08-21T10:00:50Z',
      sessionId,
      previousState: ConversationState.NEED_DETECTED,
      currentState: ConversationState.PRODUCT_INTEREST,
      detectedIntent: Intent.PRODUCT_CURIOUS,
      leadScore: 40,
      metadata: { turnCount: 3 },
    });

    // Stage 5: Commercial Intent
    tracker.trackEvent({
      eventName: AnalyticsEventName.PRICE_REQUESTED,
      timestamp: '2026-08-21T10:01:10Z',
      sessionId,
      previousState: ConversationState.PRODUCT_INTEREST,
      currentState: ConversationState.PRICE_DISCUSSION,
      detectedIntent: Intent.PRICE_REQUEST,
      leadScore: 65,
      metadata: { turnCount: 4 },
    });

    // Stage 6: CTA Presented
    tracker.trackEvent({
      eventName: AnalyticsEventName.CTA_SHOWN,
      timestamp: '2026-08-21T10:01:20Z',
      sessionId,
      previousState: ConversationState.PRICE_DISCUSSION,
      currentState: ConversationState.PRICE_DISCUSSION,
      detectedIntent: Intent.PRICE_REQUEST,
      leadScore: 65,
      metadata: { promotionLevel: PromotionLevel.DIRECT_OFFER, turnCount: 4, ctaShown: true },
    });

    // Stage 7: Trial/Purchase Action
    tracker.trackEvent({
      eventName: AnalyticsEventName.CTA_ACCEPTED,
      timestamp: '2026-08-21T10:01:40Z',
      sessionId,
      previousState: ConversationState.PRICE_DISCUSSION,
      currentState: ConversationState.SUPPORT_HANDOFF,
      detectedIntent: Intent.PURCHASE_INTENT,
      leadScore: 85,
      metadata: { ctaAccepted: true, turnCount: 5 },
    });

    // Stage 8: Conversion
    tracker.trackConversion(sessionId, ConversationState.SUPPORT_HANDOFF, Intent.PURCHASE_INTENT, 85, { turnCount: 5 });

    const report = tracker.generateReport();
    const funnel = report.funnelMetrics.funnelReport;

    assert('Funnel: Full 8 stages reached', funnel.stages.length === 8, 8, funnel.stages.length);
    assert('Funnel: 100% conversion on single successful session', funnel.overallConversionRate === 100, 100, funnel.overallConversionRate);
    assert('Funnel: Stage 1 count is 1', funnel.stages[0].count === 1, 1, funnel.stages[0].count);
    assert('Funnel: Stage 8 count is 1', funnel.stages[7].count === 1, 1, funnel.stages[7].count);
  }

  // =========================================================================
  // TEST GROUP 3: EXPLAINABLE LEAD SCORE TRACKING
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const sessionId = 'sess_lead_explain';

    tracker.trackLeadChange({
      sessionId,
      oldScore: 0,
      newScore: 15,
      reason: 'RELEVANT_NEED detected',
      triggeredIntent: Intent.RELEVANT_NEED,
      triggeredEvent: AnalyticsEventName.LEAD_SCORE_UPDATED,
      turn: 1,
    });

    tracker.trackLeadChange({
      sessionId,
      oldScore: 15,
      newScore: 40,
      reason: 'PRICE_REQUEST detected (+25)',
      triggeredIntent: Intent.PRICE_REQUEST,
      triggeredEvent: AnalyticsEventName.LEAD_SCORE_UPDATED,
      turn: 2,
    });

    const report = tracker.generateReport();
    const leadMetrics = report.leadMetrics;

    assert('Lead Scoring: Average score computed', leadMetrics.averageLeadScore === 40, 40, leadMetrics.averageLeadScore);
    assert('Lead Scoring: Warm category counted', leadMetrics.warmLeadsCount === 1, 1, leadMetrics.warmLeadsCount);
    assert('Lead Scoring: Explainability records preserved', leadMetrics.insights.recentScoreChanges.length >= 2);
    assert('Lead Scoring: Reason verified', leadMetrics.insights.recentScoreChanges[0].reason === 'RELEVANT_NEED detected');
  }

  // =========================================================================
  // TEST GROUP 4: OBJECTION TRACKING & RECOVERY
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const sessionIdRecovered = 'sess_obj_rec';
    const sessionIdFailed = 'sess_obj_fail';

    // Session 1: Objection -> Recovered -> Converted
    tracker.trackEvent({
      eventName: AnalyticsEventName.MESSAGE_RECEIVED,
      timestamp: '2026-08-21T11:00:00Z',
      sessionId: sessionIdRecovered,
      previousState: ConversationState.PRODUCT_INTEREST,
      currentState: ConversationState.OBJECTION_HANDLING,
      detectedIntent: Intent.OBJECTION,
      leadScore: 35,
      metadata: { objectionCategory: AnalyticsObjectionCategory.PRICE, userMessage: 'خیلی گرونه' },
    });

    tracker.trackEvent({
      eventName: AnalyticsEventName.INTENT_DETECTED,
      timestamp: '2026-08-21T11:00:30Z',
      sessionId: sessionIdRecovered,
      previousState: ConversationState.OBJECTION_HANDLING,
      currentState: ConversationState.PRICE_DISCUSSION,
      detectedIntent: Intent.PRICE_REQUEST,
      leadScore: 60,
      metadata: { turnCount: 3 },
    });

    tracker.trackConversion(sessionIdRecovered, ConversationState.SUPPORT_HANDOFF, Intent.PURCHASE_INTENT, 80);

    // Session 2: Objection -> Abandoned
    tracker.trackEvent({
      eventName: AnalyticsEventName.MESSAGE_RECEIVED,
      timestamp: '2026-08-21T11:10:00Z',
      sessionId: sessionIdFailed,
      previousState: ConversationState.PRODUCT_INTEREST,
      currentState: ConversationState.OBJECTION_HANDLING,
      detectedIntent: Intent.OBJECTION,
      leadScore: 35,
      metadata: { objectionCategory: AnalyticsObjectionCategory.TRUST, userMessage: 'اعتمادی به این کانال‌ها نیست' },
    });

    tracker.trackEvent({
      eventName: AnalyticsEventName.USER_ABANDONED,
      timestamp: '2026-08-21T11:10:40Z',
      sessionId: sessionIdFailed,
      previousState: ConversationState.OBJECTION_HANDLING,
      currentState: ConversationState.REJECTED,
      detectedIntent: Intent.REJECTION,
      leadScore: 5,
      metadata: { exitReason: 'REJECTED' },
    });

    const report = tracker.generateReport();
    const objReport = report.objectionMetrics.objectionReport;

    assert('Objection Analytics: Total objections registered', objReport.totalObjections === 2, 2, objReport.totalObjections);
    assert('Objection Analytics: Recovery rate is 50%', objReport.recoverySuccessRate === 50, 50, objReport.recoverySuccessRate);
    assert('Objection Analytics: Purchase rate is 50%', objReport.objectionToPurchaseConversionRate === 50, 50, objReport.objectionToPurchaseConversionRate);
    assert('Objection Analytics: Price objection categorized', objReport.objectionCategories[AnalyticsObjectionCategory.PRICE] === 1);
    assert('Objection Analytics: Trust objection categorized', objReport.objectionCategories[AnalyticsObjectionCategory.TRUST] === 1);
  }

  // =========================================================================
  // TEST GROUP 5: CTA PERFORMANCE & TIMING
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const sessA = 'sess_cta_good';
    const sessB = 'sess_cta_premature';

    // Good CTA at turn 3 with high lead score
    tracker.trackEvent({
      eventName: AnalyticsEventName.CTA_SHOWN,
      timestamp: '2026-08-21T12:00:00Z',
      sessionId: sessA,
      previousState: ConversationState.PRODUCT_INTEREST,
      currentState: ConversationState.PRICE_DISCUSSION,
      detectedIntent: Intent.PRICE_REQUEST,
      leadScore: 70,
      metadata: { promotionLevel: PromotionLevel.DIRECT_OFFER, turnCount: 3, ctaShown: true, ctaType: 'PRICING_PLANS' },
    });

    tracker.trackEvent({
      eventName: AnalyticsEventName.CTA_ACCEPTED,
      timestamp: '2026-08-21T12:00:20Z',
      sessionId: sessA,
      previousState: ConversationState.PRICE_DISCUSSION,
      currentState: ConversationState.SUPPORT_HANDOFF,
      detectedIntent: Intent.PURCHASE_INTENT,
      leadScore: 85,
      metadata: { ctaAccepted: true, turnCount: 4 },
    });

    // Premature CTA at turn 1 with score 10
    tracker.trackEvent({
      eventName: AnalyticsEventName.CTA_SHOWN,
      timestamp: '2026-08-21T12:10:00Z',
      sessionId: sessB,
      previousState: ConversationState.INITIAL_GREETING,
      currentState: ConversationState.INITIAL_GREETING,
      detectedIntent: Intent.GREETING,
      leadScore: 10,
      metadata: { promotionLevel: PromotionLevel.DIRECT_OFFER, turnCount: 1, ctaShown: true, isExplicitProductIntent: false },
    });

    tracker.trackEvent({
      eventName: AnalyticsEventName.CTA_REJECTED,
      timestamp: '2026-08-21T12:10:15Z',
      sessionId: sessB,
      previousState: ConversationState.INITIAL_GREETING,
      currentState: ConversationState.REJECTED,
      detectedIntent: Intent.REJECTION,
      leadScore: 0,
      metadata: { ctaRejected: true, turnCount: 2 },
    });

    const report = tracker.generateReport();
    const promoReport = report.promotionMetrics.promotionReport;

    assert('Promotion Analytics: 2 CTAs shown', promoReport.ctaEffectiveness.shownCount === 2, 2, promoReport.ctaEffectiveness.shownCount);
    assert('Promotion Analytics: 1 CTA accepted', promoReport.ctaEffectiveness.acceptedCount === 1, 1, promoReport.ctaEffectiveness.acceptedCount);
    assert('Promotion Analytics: 1 CTA rejected', promoReport.ctaEffectiveness.rejectedCount === 1, 1, promoReport.ctaEffectiveness.rejectedCount);
    assert('Promotion Analytics: Premature CTA detected', promoReport.prematureCTARate > 0);
  }

  // =========================================================================
  // TEST GROUP 6: SAFETY & GUARDRAIL EVENT TELEMETRY
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const sessSafety = 'sess_safety';

    tracker.trackEvent({
      eventName: AnalyticsEventName.PROMOTION_BLOCKED,
      timestamp: new Date().toISOString(),
      sessionId: sessSafety,
      previousState: ConversationState.REJECTED,
      currentState: ConversationState.REJECTED,
      detectedIntent: Intent.REJECTION,
      leadScore: 0,
      metadata: { isPromotionLocked: true, reason: 'REJECTION_LOCK' },
    });

    tracker.trackEvent({
      eventName: AnalyticsEventName.BOT_SUSPECTED,
      timestamp: new Date().toISOString(),
      sessionId: sessSafety,
      previousState: ConversationState.REJECTED,
      currentState: ConversationState.GOODBYE,
      detectedIntent: Intent.SUSPICION_BOT,
      leadScore: 0,
      metadata: { turnCount: 2 },
    });

    const report = tracker.generateReport();
    const safety = report.safetyMetrics;

    assert('Safety Analytics: Promotion blocked counted', safety.promotionBlockedCount >= 1);
    assert('Safety Analytics: Bot suspected counted', safety.botSuspectedCount >= 1);
    assert('Safety Analytics: Zero safety violations', safety.safetyViolationRate === 0.0);
  }

  // =========================================================================
  // TEST GROUP 7: NON-INTRUSIVE TURN OBSERVER (recordStepAnalytics)
  // =========================================================================
  {
    const tracker = new AnalyticsTracker();
    const context = createInitialConversationContext();
    const promoConfig = {
      enabled: true,
      productName: 'فیلترشکن اختصاصی',
      productDescription: 'پرسرعت بدون قطعی',
      sendMode: 'ai_natural_mention' as const,
      contactHandleOrLink: 'Nova_vpn10',
    };

    // Process Turn 1: User expresses need
    const outTurn1 = processConversationTurn('نت خیلی ضعیفه فیلترشکن خوب داری؟', context, promoConfig, 4);
    recordStepAnalytics(tracker, 'sess_e2e_obs', 'نت خیلی ضعیفه فیلترشکن خوب داری؟', outTurn1);

    // Process Turn 2: User asks for pricing
    const outTurn2 = processConversationTurn('قیمتش چنده؟', outTurn1.updatedContext, promoConfig, 4);
    recordStepAnalytics(tracker, 'sess_e2e_obs', 'قیمتش چنده؟', outTurn2);

    const report = tracker.generateReport();

    assert('Observer: Captured 2 turns', report.conversationMetrics.totalMessagesExchanged >= 2);
    assert('Observer: Identified high-value intent', outTurn2.intentResult.intent === Intent.PRICE_REQUEST);
    assert('Observer: Funnel reached commercial intent', report.funnelMetrics.funnelReport.stages[4].count >= 1);
  }

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  return {
    suiteName: 'Step 7 Analytics, Conversion Tracking & Intelligence Tests',
    total,
    passed,
    failed,
    results,
  };
}
