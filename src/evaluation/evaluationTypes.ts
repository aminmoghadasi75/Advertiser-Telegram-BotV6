import {
  ConversationState,
  Intent,
  PromotionLevel,
  ObjectionCategory,
  AnonymousChatMessage,
} from '../types';

export enum ReplayMode {
  DETERMINISTIC_REPLAY = 'DETERMINISTIC_REPLAY',
  LLM_REPLAY = 'LLM_REPLAY',
}

export type StratifiedCategory =
  | 'successful_conversion'
  | 'near_conversion'
  | 'product_rejection'
  | 'early_exit'
  | 'long_conversation'
  | 'short_conversation'
  | 'product_related'
  | 'no_product'
  | 'objection'
  | 'suspicion_bot';

export type AnnotatorConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface GoldTurn {
  turnId: number;
  userMessage: string;
  expectedIntent: Intent | 'AMBIGUOUS';
  expectedState: ConversationState;
  expectedPromotionLevel: PromotionLevel;
  expectedAction?: string;
  confidence: AnnotatorConfidence;
  notes?: string;
  secondaryExpectedIntents?: Intent[];
  mockAssistantResponse?: string;
}

export interface GoldConversation {
  conversationId: string;
  title: string;
  category: StratifiedCategory;
  categoryTitleFa?: string;
  description: string;
  isSynthetic?: boolean;
  partnerTag?: string;
  partnerProfileSnippet?: string;
  turns: GoldTurn[];
  expectedFinalState?: ConversationState;
  expectedOutcome?: 'CONVERSION' | 'NEAR_CONVERSION' | 'REJECTED' | 'NO_PRODUCT_EXIT' | 'EARLY_EXIT' | 'BOT_EXIT';
}

// Trace Object for Turn-by-Turn Replay
export interface ConversationTurnTrace {
  conversationId: string;
  turnId: number;
  timestamp: string;
  userMessage: string;
  normalizedMessage: string;

  previousState: ConversationState;
  currentState: ConversationState;
  nextState: ConversationState;

  primaryIntent: Intent;
  secondaryIntents: Intent[];
  intentConfidence: number;

  leadScoreBefore: number;
  leadScoreAfter: number;

  promotionLevel: PromotionLevel;
  promotionLock: boolean;

  productMentioned: boolean;
  trialRequested: boolean;
  priceRequested: boolean;
  supportRequested: boolean;

  allowedActions: string[];

  generatedResponse: string;

  validatorStatus: {
    isValid: boolean;
    wasFallbackUsed: boolean;
    violations: string[];
    sanitizedText: string;
  };

  evaluationStatus: 'PASSED' | 'FAILED' | 'WARNING' | 'NEEDS_REVIEW';

  errorCategories: string[];
  criticalErrors: string[];

  // Comparison with Gold Labels
  expected?: {
    intent: Intent | 'AMBIGUOUS';
    state: ConversationState;
    promotionLevel: PromotionLevel;
    action?: string;
    confidence: AnnotatorConfidence;
  };

  responseScores?: {
    relevance: number; // 0-2
    contextContinuity: number; // 0-2
    naturalness: number; // 0-2
    conciseness: number; // 0-2
    salesAppropriateness: number; // 0-2
    questionAnswered: number; // 0-2
    repetition: number; // 0-2
    tone: number; // 0-2
    unsupportedClaims: number; // 0-2
    totalScorePercent: number;
    reasoning?: string;
  };
}

export interface IntentEvaluationMetrics {
  totalTurns: number;
  evaluatedTurns: number;
  ambiguousTurns: number;
  overallAccuracy: number;
  byIntent: Record<
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
  >;
  confusionMatrix: {
    labels: string[];
    matrix: number[][]; // [expectedIndex][actualIndex]
  };
  criticalErrors: Array<{
    conversationId: string;
    turnId: number;
    userMessage: string;
    expected: string;
    actual: string;
    rule: string;
  }>;
  errorCategoryCounts: Record<string, number>;
}

export interface StateEvaluationMetrics {
  totalTransitions: number;
  correctTransitions: number;
  stateAccuracy: number;
  invalidTransitionCount: number;
  invalidTransitions: Array<{
    conversationId: string;
    turnId: number;
    fromState: ConversationState;
    toState: ConversationState;
    expectedState: ConversationState;
    reason: string;
  }>;
  errorCategoryCounts: Record<string, number>;
}

export interface PromotionEvaluationMetrics {
  totalTurns: number;
  promotionAccuracy: number;
  errorRate: number;
  oversellingCount: number;
  missedOpportunityCount: number;
  prematureOfferCount: number;
  repeatedOfferCount: number;
  postRejectionSellingCount: number;
  ctaSpamCount: number;
  criticalBugs: Array<{
    conversationId: string;
    turnId: number;
    bugId: 'CRITICAL_1' | 'CRITICAL_2' | 'CRITICAL_3' | 'CRITICAL_4' | 'CRITICAL_5';
    description: string;
    userMessage: string;
    actualLevel: PromotionLevel;
    promotionLock: boolean;
  }>;
  errorCategoryCounts: Record<string, number>;
}

export interface ResponseEvaluationMetrics {
  totalResponsesEvaluated: number;
  averageScores: {
    relevance: number;
    contextContinuity: number;
    naturalness: number;
    conciseness: number;
    salesAppropriateness: number;
    questionAnswered: number;
    repetition: number;
    tone: number;
    unsupportedClaims: number;
    overallAverageQuality: number; // 0 to 2 scale
    overallPercentage: number; // 0 to 100%
  };
  roboticToneCount: number;
  contextBreakCount: number;
  unsupportedClaimCount: number;
  oversellingCount: number;
  missedOpportunityCount: number;
  errorCategoryCounts: Record<string, number>;
}

export interface FunnelStageMetric {
  stage: string;
  stageNameFa: string;
  count: number;
  percentage: number;
  dropOffCount: number;
  dropOffRate: number;
}

export interface ConversationLevelMetrics {
  totalConversations: number;
  averageLengthTurns: number;
  averageTurnsToNeedDetection: number;
  averageTurnsToProductIntro: number;
  averageTurnsToFirstCTA: number;
  totalPromotions: number;
  totalCTAs: number;
  totalObjections: number;
  totalRejections: number;
  finalStateDistribution: Record<string, number>;
  outcomesDistribution: Record<string, number>;
  exitReasonsDistribution: Record<string, number>;
  funnel: FunnelStageMetric[];
  conversationQualityScoreAverage: number; // 0 to 100
  conversionTrackingGapNotes: string;
}

export interface RegressionComparisonItem {
  metricName: string;
  baselineOldValue: number | string;
  newSystemValue: number | string;
  delta: number | string;
  status: 'IMPROVED' | 'STABLE' | 'REGRESSION' | 'NO_BASELINE';
  notes?: string;
}

export interface ReplayEvaluationReport {
  timestamp: string;
  mode: ReplayMode;
  datasetSummary: {
    totalConversations: number;
    totalTurns: number;
    categoriesBreakdown: Record<string, number>;
  };
  intentMetrics: IntentEvaluationMetrics;
  stateMetrics: StateEvaluationMetrics;
  promotionMetrics: PromotionEvaluationMetrics;
  responseMetrics: ResponseEvaluationMetrics;
  conversationMetrics: ConversationLevelMetrics;
  regressionAnalysis: RegressionComparisonItem[];
  tracesByConversation: Record<string, ConversationTurnTrace[]>;
  allTraces: ConversationTurnTrace[];
  summaryStatus: {
    criticalErrorsCount: number;
    intentF1Macro: number;
    stateAccuracy: number;
    promotionErrorRate: number;
    overallQualityScore: number;
    readinessStatus: 'READY_FOR_STEP_6' | 'BLOCKED';
    readinessNotes: string[];
  };
}
