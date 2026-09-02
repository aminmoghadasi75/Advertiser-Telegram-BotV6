import { GOLD_DATASET } from './goldDataset';
import { runFullEvaluation, replaySingleConversation } from './replayEngine';
import { evaluateIntents } from './intentEvaluator';
import { evaluateStates } from './stateEvaluator';
import { evaluatePromotions } from './promotionEvaluator';
import { evaluateResponses, scoreResponseQuality } from './responseEvaluator';
import { calculateConversationMetrics } from './conversationMetrics';
import { detectRegressions } from './regressionDetector';
import { ConversationState, Intent, PromotionLevel } from '../types';
import { ConversationTurnTrace, ReplayMode } from './evaluationTypes';

export interface EvalTestItem {
  name: string;
  category: 'UNIT' | 'INTEGRATION';
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export interface EvalTestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  results: EvalTestItem[];
  durationMs: number;
  fullReport?: any;
}

/**
 * Runs all Step 5 Unit & Integration Evaluation Tests
 */
export async function runAllEvaluationTests(): Promise<EvalTestSuiteSummary> {
  const startTime = Date.now();
  const results: EvalTestItem[] = [];

  // =========================================================================
  // 1. UNIT TEST: Intent Evaluator & Confusion Matrix
  // =========================================================================
  (() => {
    const mockTraces: ConversationTurnTrace[] = [
      {
        conversationId: 'mock_1',
        turnId: 1,
        timestamp: new Date().toISOString(),
        userMessage: 'سلام خوبی؟',
        normalizedMessage: 'سلام خوبی؟',
        previousState: ConversationState.CONNECTING,
        currentState: ConversationState.INITIAL_GREETING,
        nextState: ConversationState.EARLY_CONVERSATION,
        primaryIntent: Intent.GREETING,
        secondaryIntents: [],
        intentConfidence: 0.95,
        leadScoreBefore: 0,
        leadScoreAfter: 5,
        promotionLevel: PromotionLevel.NO_PROMOTION,
        promotionLock: false,
        productMentioned: false,
        trialRequested: false,
        priceRequested: false,
        supportRequested: false,
        allowedActions: [],
        generatedResponse: 'سلام چطوری؟',
        validatorStatus: { isValid: true, wasFallbackUsed: false, violations: [], sanitizedText: 'سلام چطوری؟' },
        evaluationStatus: 'PASSED',
        errorCategories: [],
        criticalErrors: [],
        expected: {
          intent: Intent.GREETING,
          state: ConversationState.EARLY_CONVERSATION,
          promotionLevel: PromotionLevel.NO_PROMOTION,
          confidence: 'HIGH',
        },
      },
      {
        conversationId: 'mock_2',
        turnId: 2,
        timestamp: new Date().toISOString(),
        userMessage: 'قیمت چنده؟',
        normalizedMessage: 'قیمت چنده؟',
        previousState: ConversationState.EARLY_CONVERSATION,
        currentState: ConversationState.EARLY_CONVERSATION,
        nextState: ConversationState.PRICE_DISCUSSION,
        primaryIntent: Intent.PRICE_REQUEST,
        secondaryIntents: [],
        intentConfidence: 0.95,
        leadScoreBefore: 5,
        leadScoreAfter: 35,
        promotionLevel: PromotionLevel.DIRECT_OFFER,
        promotionLock: false,
        productMentioned: true,
        trialRequested: false,
        priceRequested: true,
        supportRequested: false,
        allowedActions: [],
        generatedResponse: 'قیمت ماهانه ۱۲۰ تومنه',
        validatorStatus: { isValid: true, wasFallbackUsed: false, violations: [], sanitizedText: 'قیمت ماهانه ۱۲۰ تومنه' },
        evaluationStatus: 'PASSED',
        errorCategories: [],
        criticalErrors: [],
        expected: {
          intent: Intent.PRICE_REQUEST,
          state: ConversationState.PRICE_DISCUSSION,
          promotionLevel: PromotionLevel.DIRECT_OFFER,
          confidence: 'HIGH',
        },
      },
    ];

    const metrics = evaluateIntents(mockTraces);
    const passed =
      metrics.overallAccuracy === 1.0 &&
      metrics.byIntent[Intent.GREETING]?.precision === 1.0 &&
      metrics.byIntent[Intent.PRICE_REQUEST]?.precision === 1.0 &&
      metrics.confusionMatrix.matrix.length > 0;

    results.push({
      name: 'Unit 1: Intent Evaluator & Confusion Matrix Calculation',
      category: 'UNIT',
      passed,
      expected: 'Accuracy=1.0, Precision=1.0, Non-empty Confusion Matrix',
      actual: `Accuracy=${metrics.overallAccuracy}, Precision=${metrics.byIntent[Intent.GREETING]?.precision}`,
    });
  })();

  // =========================================================================
  // 2. UNIT TEST: State Evaluator & Invalid Transitions Detection
  // =========================================================================
  (() => {
    const mockTraces: ConversationTurnTrace[] = [
      {
        conversationId: 'mock_state_1',
        turnId: 1,
        timestamp: new Date().toISOString(),
        userMessage: 'تبلیغ نکن',
        normalizedMessage: 'تبلیغ نکن',
        previousState: ConversationState.EARLY_CONVERSATION,
        currentState: ConversationState.EARLY_CONVERSATION,
        nextState: ConversationState.REJECTED,
        primaryIntent: Intent.REJECTION,
        secondaryIntents: [],
        intentConfidence: 0.95,
        leadScoreBefore: 10,
        leadScoreAfter: -20,
        promotionLevel: PromotionLevel.NO_PROMOTION,
        promotionLock: true,
        productMentioned: false,
        trialRequested: false,
        priceRequested: false,
        supportRequested: false,
        allowedActions: [],
        generatedResponse: 'باشه عزیزم ببخشید',
        validatorStatus: { isValid: true, wasFallbackUsed: false, violations: [], sanitizedText: 'باشه عزیزم ببخشید' },
        evaluationStatus: 'PASSED',
        errorCategories: [],
        criticalErrors: [],
        expected: {
          intent: Intent.REJECTION,
          state: ConversationState.REJECTED,
          promotionLevel: PromotionLevel.NO_PROMOTION,
          confidence: 'HIGH',
        },
      },
    ];

    const stateMetrics = evaluateStates(mockTraces);
    const passed = stateMetrics.stateAccuracy === 1.0 && stateMetrics.invalidTransitionCount === 0;

    results.push({
      name: 'Unit 2: State Evaluator Accuracy & Invariant Check',
      category: 'UNIT',
      passed,
      expected: 'State Accuracy=1.0, Invalid Transitions=0',
      actual: `State Accuracy=${stateMetrics.stateAccuracy}, Invalid Transitions=${stateMetrics.invalidTransitionCount}`,
    });
  })();

  // =========================================================================
  // 3. UNIT TEST: Promotion Evaluator & Critical Bugs Detection
  // =========================================================================
  (() => {
    // Trace with violation (Critical 1: Rejection -> Direct Offer)
    const mockViolatingTrace: ConversationTurnTrace[] = [
      {
        conversationId: 'mock_violation_1',
        turnId: 1,
        timestamp: new Date().toISOString(),
        userMessage: 'اصلا نمیخوام وی پی ان',
        normalizedMessage: 'اصلا نمیخوام وی پی ان',
        previousState: ConversationState.EARLY_CONVERSATION,
        currentState: ConversationState.EARLY_CONVERSATION,
        nextState: ConversationState.REJECTED,
        primaryIntent: Intent.REJECTION,
        secondaryIntents: [],
        intentConfidence: 0.95,
        leadScoreBefore: 0,
        leadScoreAfter: -20,
        promotionLevel: PromotionLevel.DIRECT_OFFER, // Violation!
        promotionLock: true,
        productMentioned: true,
        trialRequested: false,
        priceRequested: false,
        supportRequested: false,
        allowedActions: [],
        generatedResponse: 'فیلترشکن خوب با قیمت ۵۰ تومن',
        validatorStatus: { isValid: false, wasFallbackUsed: true, violations: ['Lock violation'], sanitizedText: 'باشه' },
        evaluationStatus: 'FAILED',
        errorCategories: [],
        criticalErrors: [],
        expected: {
          intent: Intent.REJECTION,
          state: ConversationState.REJECTED,
          promotionLevel: PromotionLevel.NO_PROMOTION,
          confidence: 'HIGH',
        },
      },
    ];

    const promoMetrics = evaluatePromotions(mockViolatingTrace);
    const passed =
      promoMetrics.criticalBugs.length === 1 &&
      promoMetrics.criticalBugs[0].bugId === 'CRITICAL_1';

    results.push({
      name: 'Unit 3: Promotion Evaluator Detects CRITICAL_1 (Post-Rejection Pitch)',
      category: 'UNIT',
      passed,
      expected: 'Critical Bug Count=1 (CRITICAL_1 detected)',
      actual: `Critical Bug Count=${promoMetrics.criticalBugs.length} (${promoMetrics.criticalBugs[0]?.bugId})`,
    });
  })();

  // =========================================================================
  // 4. UNIT TEST: Response Quality Evaluator 9-Dimension Scoring
  // =========================================================================
  (() => {
    const scoreGood = scoreResponseQuality(
      'سلام عزیزم چطوری؟ روزت چطور گذشت؟ 🌸',
      'سلام خوبی؟',
      Intent.GREETING,
      ConversationState.EARLY_CONVERSATION,
      PromotionLevel.NO_PROMOTION,
      false
    );

    const scoreRobotic = scoreResponseQuality(
      'به عنوان یک هوش مصنوعی پاسخ شما دریافت شد و من یک بات هستم.',
      'سلام',
      Intent.GREETING,
      ConversationState.EARLY_CONVERSATION,
      PromotionLevel.NO_PROMOTION,
      false
    );

    const passed =
      scoreGood.totalScorePercent >= 90 &&
      scoreRobotic.detectedErrors.includes('ROBOTIC_TONE') &&
      scoreRobotic.tone === 0;

    results.push({
      name: 'Unit 4: Response Quality Evaluator & Anti-Robot Tone Detection',
      category: 'UNIT',
      passed,
      expected: 'Good Score >= 90%, Robotic Tone Detected on Artificial Text',
      actual: `Good Score=${scoreGood.totalScorePercent}%, Robotic Errors=${scoreRobotic.detectedErrors.join(', ')}`,
    });
  })();

  // =========================================================================
  // 5. UNIT TEST: Regression Detector against Legacy Baseline
  // =========================================================================
  (() => {
    const dummyIntent = {
      totalTurns: 10,
      evaluatedTurns: 10,
      ambiguousTurns: 0,
      overallAccuracy: 0.95,
      byIntent: {},
      confusionMatrix: { labels: [], matrix: [] },
      criticalErrors: [],
      errorCategoryCounts: {},
    };
    const dummyState = {
      totalTransitions: 10,
      correctTransitions: 10,
      stateAccuracy: 1.0,
      invalidTransitionCount: 0,
      invalidTransitions: [],
      errorCategoryCounts: {},
    };
    const dummyPromo = {
      totalTurns: 10,
      promotionAccuracy: 1.0,
      errorRate: 0.0,
      oversellingCount: 0,
      missedOpportunityCount: 0,
      prematureOfferCount: 0,
      repeatedOfferCount: 0,
      postRejectionSellingCount: 0,
      ctaSpamCount: 0,
      criticalBugs: [],
      errorCategoryCounts: {},
    };
    const dummyResp = {
      totalResponsesEvaluated: 10,
      averageScores: {
        relevance: 2,
        contextContinuity: 2,
        naturalness: 2,
        conciseness: 2,
        salesAppropriateness: 2,
        questionAnswered: 2,
        repetition: 2,
        tone: 2,
        unsupportedClaims: 2,
        overallAverageQuality: 2,
        overallPercentage: 100,
      },
      roboticToneCount: 0,
      contextBreakCount: 0,
      unsupportedClaimCount: 0,
      oversellingCount: 0,
      missedOpportunityCount: 0,
      errorCategoryCounts: {},
    };
    const dummyConv = {
      totalConversations: 1,
      averageLengthTurns: 4,
      averageTurnsToNeedDetection: 2,
      averageTurnsToProductIntro: 3,
      averageTurnsToFirstCTA: 4,
      totalPromotions: 1,
      totalCTAs: 1,
      totalObjections: 0,
      totalRejections: 0,
      finalStateDistribution: {},
      outcomesDistribution: {},
      exitReasonsDistribution: {},
      funnel: [],
      conversationQualityScoreAverage: 92,
      conversionTrackingGapNotes: '',
    };

    const regressions = detectRegressions(dummyIntent, dummyState, dummyPromo, dummyResp, dummyConv);
    const passed =
      regressions.length === 5 &&
      regressions.every((r) => r.status === 'IMPROVED' || r.status === 'STABLE');

    results.push({
      name: 'Unit 5: Regression Detector Engine Benchmark Verification',
      category: 'UNIT',
      passed,
      expected: '5 Metrics Evaluated, All IMPROVED or STABLE',
      actual: `Evaluated ${regressions.length} metrics, Results: ${regressions.map((r) => r.status).join(', ')}`,
    });
  })();

  // =========================================================================
  // 6. INTEGRATION TEST: Full Replay on 58 Gold Dataset Conversations
  // =========================================================================
  let fullReport: any = null;
  try {
    fullReport = await runFullEvaluation(GOLD_DATASET, ReplayMode.DETERMINISTIC_REPLAY);

    const isDatasetSufficient = fullReport.datasetSummary.totalConversations >= 50;
    const isTurnsSufficient = fullReport.datasetSummary.totalTurns >= 100;
    const hasConfusionMatrix = fullReport.intentMetrics.confusionMatrix.matrix.length > 0;
    const hasFunnel = fullReport.conversationMetrics.funnel.length >= 8;
    const zeroPromotionBugs = fullReport.promotionMetrics.criticalBugs.length === 0;
    const highStateAccuracy = fullReport.stateMetrics.stateAccuracy >= 0.9;
    const baselineIntentAccuracy = fullReport.intentMetrics.overallAccuracy >= 0.8;

    const passed =
      isDatasetSufficient &&
      isTurnsSufficient &&
      hasConfusionMatrix &&
      hasFunnel &&
      zeroPromotionBugs &&
      highStateAccuracy &&
      baselineIntentAccuracy;

    results.push({
      name: `Integration: Full Deterministic Replay on ${fullReport.datasetSummary.totalConversations} Gold Conversations (${fullReport.datasetSummary.totalTurns} turns)`,
      category: 'INTEGRATION',
      passed,
      expected: '50+ Conversations, Intent Acc >= 80%, State Acc >= 90%, 0 Critical Promotion Bugs, Full Funnel & Confusion Matrix',
      actual: `Conversations=${fullReport.datasetSummary.totalConversations}, Turns=${fullReport.datasetSummary.totalTurns}, Intent Acc=${(fullReport.intentMetrics.overallAccuracy * 100).toFixed(1)}%, State Acc=${(fullReport.stateMetrics.stateAccuracy * 100).toFixed(1)}%, Critical Promotion Bugs=${fullReport.promotionMetrics.criticalBugs.length}`,
      details: JSON.stringify(fullReport.summaryStatus, null, 2),
    });
  } catch (err: any) {
    results.push({
      name: 'Integration: Full Deterministic Replay',
      category: 'INTEGRATION',
      passed: false,
      expected: 'Successful batch replay',
      actual: `Error: ${err?.message || String(err)}`,
    });
  }

  const durationMs = Date.now() - startTime;
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    total: results.length,
    passed: passedCount,
    failed: failedCount,
    results,
    durationMs,
    fullReport,
  };
}
