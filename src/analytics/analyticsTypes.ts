import { ConversationState, Intent, PromotionLevel, ObjectionCategory } from '../types';

/**
 * Step 7 Event Taxonomy
 * Strict categorisation across User, Intent, State, Sales, and Safety domains.
 */
export enum AnalyticsEventName {
  // USER EVENTS
  SESSION_STARTED = 'SESSION_STARTED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  USER_RETURNED = 'USER_RETURNED',
  USER_ABANDONED = 'USER_ABANDONED',

  // INTENT EVENTS
  INTENT_DETECTED = 'INTENT_DETECTED',
  MULTI_INTENT_DETECTED = 'MULTI_INTENT_DETECTED',
  HIGH_VALUE_INTENT_DETECTED = 'HIGH_VALUE_INTENT_DETECTED',
  OBJECTION_DETECTED = 'OBJECTION_DETECTED',
  REJECTION_DETECTED = 'REJECTION_DETECTED',

  // STATE EVENTS
  STATE_ENTERED = 'STATE_ENTERED',
  STATE_CHANGED = 'STATE_CHANGED',
  STATE_EXITED = 'STATE_EXITED',

  // SALES EVENTS
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_SCORE_UPDATED = 'LEAD_SCORE_UPDATED',
  CTA_SHOWN = 'CTA_SHOWN',
  CTA_ACCEPTED = 'CTA_ACCEPTED',
  CTA_REJECTED = 'CTA_REJECTED',
  PURCHASE_INTENT_DETECTED = 'PURCHASE_INTENT_DETECTED',
  TRIAL_REQUESTED = 'TRIAL_REQUESTED',
  PRICE_REQUESTED = 'PRICE_REQUESTED',
  CONVERSION_COMPLETED = 'CONVERSION_COMPLETED',

  // SAFETY EVENTS
  PROMOTION_BLOCKED = 'PROMOTION_BLOCKED',
  GUARDRAIL_TRIGGERED = 'GUARDRAIL_TRIGGERED',
  BOT_SUSPECTED = 'BOT_SUSPECTED',
}

/**
 * Event Category grouping
 */
export type EventCategory = 'USER' | 'INTENT' | 'STATE' | 'SALES' | 'SAFETY';

/**
 * Strict Event Envelope Structure required by Step 7
 */
export interface AnalyticsEvent {
  eventName: AnalyticsEventName | string;
  timestamp: string; // ISO 8601 string
  sessionId: string;
  userId?: string;
  previousState: ConversationState;
  currentState: ConversationState;
  detectedIntent: Intent;
  leadScore: number;
  metadata: Record<string, any>;
}

/**
 * 8-Stage Conversion Funnel Taxonomy
 */
export enum FunnelStage {
  STAGE_1_CONVERSATION_STARTED = 'Stage 1: Conversation Started',
  STAGE_2_INTENT_IDENTIFIED = 'Stage 2: Intent Identified',
  STAGE_3_NEED_DETECTED = 'Stage 3: Need Detected',
  STAGE_4_PRODUCT_INTEREST = 'Stage 4: Product Interest',
  STAGE_5_COMMERCIAL_INTENT = 'Stage 5: Commercial Intent',
  STAGE_6_CTA_PRESENTED = 'Stage 6: CTA Presented',
  STAGE_7_TRIAL_PURCHASE_ACTION = 'Stage 7: Trial/Purchase Action',
  STAGE_8_CONVERSION = 'Stage 8: Conversion',
}

/**
 * Granular Objection Categories for Sales Intelligence
 */
export enum AnalyticsObjectionCategory {
  PRICE = 'PRICE',
  TRUST = 'TRUST',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  COMPETITOR = 'COMPETITOR',
  FEATURE_GAP = 'FEATURE_GAP',
  OTHER = 'OTHER',
}

/**
 * Explainable Lead Score Change Structure
 */
export interface LeadScoreChangeRecord {
  oldScore: number;
  newScore: number;
  reason: string;
  triggeredIntent: Intent;
  triggeredEvent?: string;
  turn?: number;
  timestamp?: string;
  sessionId?: string;
}

/**
 * Funnel Stage Calculation Result
 */
export interface FunnelStageMetric {
  stageNumber: number;
  stageName: FunnelStage;
  count: number;
  conversionRateFromPrevious: number; // percentage (0 - 100)
  dropOffRate: number; // percentage (0 - 100)
  avgTurnsToReach: number;
  avgTimeSecondsToReach: number;
}

/**
 * Stage 3 Funnel Report Structure
 */
export interface ConversionFunnelReport {
  totalSessions: number;
  stages: FunnelStageMetric[];
  overallConversionRate: number; // percentage (0 - 100)
  biggestDropOffStage: string;
  avgTurnsToConversion: number;
  avgTimeToConversionSeconds: number;
}

/**
 * Lead Score Insights Structure
 */
export interface LeadScoreInsights {
  averageLeadScore: number;
  medianLeadScore: number;
  distribution: {
    cold: number; // 0-25
    warm: number; // 26-55
    hot: number;  // 56-100
  };
  highestConvertingIntents: Array<{
    intent: Intent;
    conversionRate: number;
    conversions: number;
    total: number;
  }>;
  highScoreLowConversionIntents: Array<{
    intent: Intent;
    averageScore: number;
    conversionRate: number;
    dropOffCount: number;
  }>;
  objectionsBlockingConversion: Array<{
    category: AnalyticsObjectionCategory;
    count: number;
    dropOffRate: number;
  }>;
  recentScoreChanges: LeadScoreChangeRecord[];
}

/**
 * Objection Analytics Report Structure
 */
export interface ObjectionAnalyticsSummary {
  objectionFrequency: number; // Percentage of sessions encountering objections
  totalObjections: number;
  objectionCategories: Record<AnalyticsObjectionCategory, number>;
  recoverySuccessRate: number; // Percentage of objections recovered to engaged/commercial state
  objectionToPurchaseConversionRate: number; // Percentage of objected sessions converting
  objectionToAbandonmentRate: number; // Percentage of objected sessions abandoning
  categoryBreakdown: Array<{
    category: AnalyticsObjectionCategory;
    count: number;
    recoveryRate: number;
    conversionRate: number;
    abandonmentRate: number;
  }>;
}

/**
 * Promotion Performance Analytics Structure
 */
export interface PromotionPerformanceReport {
  ctaEffectiveness: {
    shownCount: number;
    acceptedCount: number;
    rejectedCount: number;
    conversionAfterCTA: number;
    acceptanceRate: number;
    ctaConversionRate: number;
  };
  bestPerformingCTATypes: Array<{
    ctaType: string;
    shownCount: number;
    acceptedCount: number;
    conversionRate: number;
  }>;
  worstPerformingCTATiming: Array<{
    turnNumber: number;
    stageName: string;
    shownCount: number;
    rejectionRate: number;
  }>;
  prematureCTARate: number; // CTAs shown when leadScore < 40 or turn < 2 without explicit intent
  missedOpportunityRate: number; // Sessions with hot lead score (>=56) and commercial intent where CTA wasn't shown
  guardrailSafetyComplianceRate: number; // 100% compliant with cooldown and rejection lock
  promotionBlockedCount: number;
}

// ============================================================================
// STEP 8: DASHBOARD DATA CONTRACT (DTOs)
// ============================================================================

export interface ConversationMetrics {
  totalConversations: number;
  activeConversations: number;
  completedConversations: number;
  abandonedConversations: number;
  averageTurnsPerConversation: number;
  averageDurationSeconds: number;
  totalMessagesExchanged: number;
  userMessagesCount: number;
  botMessagesCount: number;
  stateDistribution: Record<ConversationState, number>;
  intentDistribution: Record<Intent, number>;
  multiIntentRate: number;
}

export interface LeadMetrics {
  totalLeadsCreated: number;
  averageLeadScore: number;
  hotLeadsCount: number;
  warmLeadsCount: number;
  coldLeadsCount: number;
  scoreProgressionRate: number;
  insights: LeadScoreInsights;
}

export interface FunnelMetrics {
  funnelReport: ConversionFunnelReport;
}

export interface PromotionMetrics {
  promotionReport: PromotionPerformanceReport;
}

export interface ObjectionMetrics {
  objectionReport: ObjectionAnalyticsSummary;
}

export interface SafetyMetrics {
  totalGuardrailTriggers: number;
  promotionBlockedCount: number;
  botSuspectedCount: number;
  spamSkippedCount: number;
  inappropriateBlockedCount: number;
  rejectionLockEnforcements: number;
  cooldownEnforcements: number;
  safetyViolationRate: number; // Target: 0.00%
}

/**
 * Unified Step 7 Master Analytics DTO
 */
export interface Step7AnalyticsReport {
  timestamp: string;
  conversationMetrics: ConversationMetrics;
  leadMetrics: LeadMetrics;
  funnelMetrics: FunnelMetrics;
  promotionMetrics: PromotionMetrics;
  objectionMetrics: ObjectionMetrics;
  safetyMetrics: SafetyMetrics;
}
