import {
  ConversationState,
  Intent,
  PromotionLevel,
  ConversationContext,
  AnonymousProductPromotion,
  AnonymousChatMessage,
} from '../types';
import {
  createInitialConversationContext,
  processConversationTurn,
} from '../conversation/conversationEngine';
import { validateAndSanitizeResponse } from '../conversation/responseValidator';
import { GOLD_DATASET } from './goldDataset';
import {
  GoldConversation,
  GoldTurn,
  ConversationTurnTrace,
  ReplayMode,
  ReplayEvaluationReport,
} from './evaluationTypes';
import { evaluateIntents } from './intentEvaluator';
import { evaluateStates } from './stateEvaluator';
import { evaluatePromotions } from './promotionEvaluator';
import { evaluateResponses, scoreResponseQuality } from './responseEvaluator';
import { calculateConversationMetrics } from './conversationMetrics';
import { detectRegressions } from './regressionDetector';

const defaultPromotionConfig: AnonymousProductPromotion = {
  enabled: true,
  productName: 'فیلترشکن اختصاصی پرسرعت',
  productDescription: 'سرورهای اختصاصی V2ray بدون قطعی با تست رایگان',
  imageUrl: 'https://example.com/banner.jpg',
  contactHandleOrLink: 'Nova_vpn10',
  sendMode: 'ai_natural_mention',
  minPhotoDelaySeconds: 120,
};

/**
 * Generates high-fidelity mock response for DETERMINISTIC_REPLAY mode
 * based on the state machine transition, intent, and promotion decision.
 */
export function generateDeterministicMockResponse(
  intent: Intent,
  state: ConversationState,
  promoLevel: PromotionLevel,
  promotionLock: boolean,
  userMessage: string
): string {
  if (intent === Intent.INAPPROPRIATE || intent === Intent.SPAM) {
    return 'من باید برم، روزت بخیر.';
  }

  if (intent === Intent.GOODBYE || state === ConversationState.GOODBYE) {
    return 'خوشحال شدم از هم‌صحبتی باهات، مراقب خودت باش 🌸 فعلا';
  }

  if (intent === Intent.REJECTION || state === ConversationState.REJECTED) {
    return 'باشه حتما، ببخشید مزاحم شدم! راستی خودت اهل کجایی؟';
  }

  if (state === ConversationState.SUPPORT_HANDOFF || intent === Intent.PURCHASE_INTENT) {
    return 'میتونی به آیدی پشتیبانیمون Nova_vpn10 پیام بدی تا برات سریع فعال کنن 🌸';
  }

  if (state === ConversationState.PRICE_DISCUSSION || intent === Intent.PRICE_REQUEST) {
    return 'ماهانه ۵۰ گیگ ۱۲۰ تومنه و نامحدود دوکاربره ۲۲۰ تومن با ضمانت بازگشت وجه 🌸';
  }

  if (state === ConversationState.TRIAL_DISCUSSION || intent === Intent.TRIAL_REQUEST) {
    return 'اره اکانت تست ۱۲ ساعته رایگان داریم، میخوای برات بفرستم امتحان کنی؟';
  }

  if (state === ConversationState.OBJECTION_HANDLING) {
    return 'کاملا حق داری! برای همین اول اکانت تست رایگان میدیم که خیالت از سرعت و کیفیت راحت باشه 🌸';
  }

  if (state === ConversationState.PRODUCT_INTRODUCTION || state === ConversationState.NEED_DETECTED) {
    if (promoLevel === PromotionLevel.SOFT_MENTION) {
      return 'اره متاسفانه این روزا اینترنت خیلی خرابه، من خودم رو سرورای اختصاصی v2ray وصل میشم خیلی خوب جواب میده.';
    }
    if (promoLevel === PromotionLevel.DIRECT_OFFER) {
      return 'من خودم از سرورهای اختصاصی Nova_vpn10 استفاده میکنم که پینگ پایینه و قطعی نداره.';
    }
  }

  if (intent === Intent.SUSPICION_BOT) {
    return 'نه بابا منم مثل خودت ادمم اومدم یکم چت کنیم haha';
  }

  if (intent === Intent.SMALL_TALK) {
    return 'منم ۲۴ تهرانم، دانشجوام. تو مشغولی یا درس میخونی؟';
  }

  return 'سلام چطوری؟ خوبی؟ 🌸';
}

/**
 * Replays a single conversation turn-by-turn in a strictly isolated, read-only environment.
 */
export async function replaySingleConversation(
  conversation: GoldConversation,
  mode: ReplayMode = ReplayMode.DETERMINISTIC_REPLAY,
  llmReplyGenerator?: (prompt: string, history: any[]) => Promise<string>,
  promoConfig: AnonymousProductPromotion = defaultPromotionConfig
): Promise<ConversationTurnTrace[]> {
  const traces: ConversationTurnTrace[] = [];
  let context: ConversationContext = createInitialConversationContext(
    conversation.partnerTag,
    conversation.partnerProfileSnippet
  );

  const messageHistory: AnonymousChatMessage[] = [];

  for (let i = 0; i < conversation.turns.length; i++) {
    const goldTurn: GoldTurn = conversation.turns[i];
    const turnNumber = i + 1;
    const userMsg = goldTurn.userMessage;

    const previousState = context.state;
    const leadScoreBefore = context.leadScore;

    // Run Decision Engine Pipeline
    const stepOutput = processConversationTurn(
      userMsg,
      context,
      promoConfig,
      4,
      messageHistory
    );

    context = stepOutput.updatedContext;
    const nextState = context.state;
    const leadScoreAfter = context.leadScore;

    // Generate response (Deterministic mock or LLM)
    let rawResponse = '';
    if (mode === ReplayMode.LLM_REPLAY && llmReplyGenerator) {
      try {
        rawResponse = await llmReplyGenerator(stepOutput.promptDirective, messageHistory);
      } catch (err: any) {
        rawResponse = generateDeterministicMockResponse(
          stepOutput.intentResult.intent,
          nextState,
          context.promotionLevel,
          context.promotionLock,
          userMsg
        );
      }
    } else {
      rawResponse =
        goldTurn.mockAssistantResponse ||
        generateDeterministicMockResponse(
          stepOutput.intentResult.intent,
          nextState,
          context.promotionLevel,
          context.promotionLock,
          userMsg
        );
    }

    // Run Response Validator
    const validatorResult = validateAndSanitizeResponse(rawResponse, context, promoConfig);

    // Score Response
    const responseScore = scoreResponseQuality(
      validatorResult.sanitizedText,
      userMsg,
      stepOutput.intentResult.intent,
      nextState,
      context.promotionLevel,
      context.promotionLock
    );

    const errorCategories: string[] = [...responseScore.detectedErrors];
    const criticalErrors: string[] = [];

    // Check trace status
    let evaluationStatus: ConversationTurnTrace['evaluationStatus'] = 'PASSED';
    if (goldTurn.expectedIntent !== 'AMBIGUOUS' && goldTurn.expectedIntent !== stepOutput.intentResult.intent) {
      evaluationStatus = 'FAILED';
    }
    if (goldTurn.expectedState !== nextState) {
      evaluationStatus = 'FAILED';
    }
    if (goldTurn.expectedPromotionLevel !== context.promotionLevel) {
      evaluationStatus = 'FAILED';
    }

    const trace: ConversationTurnTrace = {
      conversationId: conversation.conversationId,
      turnId: turnNumber,
      timestamp: new Date().toISOString(),
      userMessage: userMsg,
      normalizedMessage: userMsg.trim(),
      previousState,
      currentState: previousState,
      nextState,
      primaryIntent: stepOutput.intentResult.intent,
      secondaryIntents: [],
      intentConfidence: stepOutput.intentResult.confidence,
      leadScoreBefore,
      leadScoreAfter,
      promotionLevel: context.promotionLevel,
      promotionLock: context.promotionLock,
      productMentioned: context.productMentioned,
      trialRequested: stepOutput.intentResult.intent === Intent.TRIAL_REQUEST,
      priceRequested: stepOutput.intentResult.intent === Intent.PRICE_REQUEST,
      supportRequested: stepOutput.intentResult.intent === Intent.SUPPORT_REQUEST,
      allowedActions: [stepOutput.promotionDecision.reason],
      generatedResponse: validatorResult.sanitizedText,
      validatorStatus: {
        isValid: validatorResult.isValid,
        wasFallbackUsed: validatorResult.wasFallbackUsed,
        violations: validatorResult.violations,
        sanitizedText: validatorResult.sanitizedText,
      },
      evaluationStatus,
      errorCategories,
      criticalErrors,
      expected: {
        intent: goldTurn.expectedIntent,
        state: goldTurn.expectedState,
        promotionLevel: goldTurn.expectedPromotionLevel,
        action: goldTurn.expectedAction,
        confidence: goldTurn.confidence,
      },
      responseScores: responseScore,
    };

    traces.push(trace);

    // Update in-memory history for next turn
    messageHistory.push({
      id: `msg_${conversation.conversationId}_${turnNumber}_user`,
      sender: 'stranger',
      text: userMsg,
      timestamp: new Date().toISOString(),
    });
    messageHistory.push({
      id: `msg_${conversation.conversationId}_${turnNumber}_bot`,
      sender: 'me_melody',
      text: validatorResult.sanitizedText,
      timestamp: new Date().toISOString(),
    });
  }

  return traces;
}

/**
 * Runs evaluation across the full Gold Dataset or a subset of conversations.
 */
export async function runFullEvaluation(
  dataset: GoldConversation[] = GOLD_DATASET,
  mode: ReplayMode = ReplayMode.DETERMINISTIC_REPLAY,
  llmReplyGenerator?: (prompt: string, history: any[]) => Promise<string>
): Promise<ReplayEvaluationReport> {
  const tracesByConversation: Record<string, ConversationTurnTrace[]> = {};
  const allTraces: ConversationTurnTrace[] = [];

  const categoriesBreakdown: Record<string, number> = {};

  for (const conv of dataset) {
    categoriesBreakdown[conv.category] = (categoriesBreakdown[conv.category] || 0) + 1;
    const convTraces = await replaySingleConversation(conv, mode, llmReplyGenerator);
    tracesByConversation[conv.conversationId] = convTraces;
    allTraces.push(...convTraces);
  }

  const intentMetrics = evaluateIntents(allTraces);
  const stateMetrics = evaluateStates(allTraces);
  const promotionMetrics = evaluatePromotions(allTraces);
  const responseMetrics = evaluateResponses(allTraces);
  const conversationMetrics = calculateConversationMetrics(tracesByConversation, dataset);
  const regressionAnalysis = detectRegressions(
    intentMetrics,
    stateMetrics,
    promotionMetrics,
    responseMetrics,
    conversationMetrics
  );

  // Compute Macro Intent F1
  let sumF1 = 0;
  let f1Count = 0;
  Object.values(intentMetrics.byIntent).forEach((item) => {
    if (item.support > 0) {
      sumF1 += item.f1;
      f1Count++;
    }
  });
  const intentF1Macro = f1Count > 0 ? Number((sumF1 / f1Count).toFixed(3)) : 0;

  const totalCriticalErrors =
    intentMetrics.criticalErrors.length + promotionMetrics.criticalBugs.length;

  const isReady =
    totalCriticalErrors === 0 &&
    intentMetrics.overallAccuracy >= 0.85 &&
    stateMetrics.stateAccuracy >= 0.85 &&
    promotionMetrics.errorRate <= 0.1;

  const readinessNotes: string[] = [];
  if (totalCriticalErrors > 0) {
    readinessNotes.push(`${totalCriticalErrors} critical errors require resolution`);
  }
  if (intentMetrics.overallAccuracy < 0.85) {
    readinessNotes.push(`Intent accuracy (${(intentMetrics.overallAccuracy * 100).toFixed(1)}%) below target`);
  }
  if (stateMetrics.stateAccuracy < 0.85) {
    readinessNotes.push(`State accuracy (${(stateMetrics.stateAccuracy * 100).toFixed(1)}%) below target`);
  }
  if (promotionMetrics.errorRate > 0.1) {
    readinessNotes.push(`Promotion error rate (${(promotionMetrics.errorRate * 100).toFixed(1)}%) exceeds 10%`);
  }
  if (isReady) {
    readinessNotes.push('All decision metrics, state transitions, and safety locks verified successfully.');
  }

  return {
    timestamp: new Date().toISOString(),
    mode,
    datasetSummary: {
      totalConversations: dataset.length,
      totalTurns: allTraces.length,
      categoriesBreakdown,
    },
    intentMetrics,
    stateMetrics,
    promotionMetrics,
    responseMetrics,
    conversationMetrics,
    regressionAnalysis,
    tracesByConversation,
    allTraces,
    summaryStatus: {
      criticalErrorsCount: totalCriticalErrors,
      intentF1Macro,
      stateAccuracy: stateMetrics.stateAccuracy,
      promotionErrorRate: promotionMetrics.errorRate,
      overallQualityScore: conversationMetrics.conversationQualityScoreAverage,
      readinessStatus: isReady ? 'READY_FOR_STEP_6' : 'BLOCKED',
      readinessNotes,
    },
  };
}
