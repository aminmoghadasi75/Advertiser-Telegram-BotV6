import {
  ConversationState,
  Intent,
  PromotionLevel,
  ObjectionCategory,
  ConversationContext,
  AnonymousProductPromotion,
  AnonymousChatMessage,
  ConversationStrategy,
  BotPersonaConfig,
} from '../types';
import { detectIntent, IntentDetectionResult } from './intentEngine';
import { calculateLeadScoreUpdate, ScoreUpdateResult } from './leadScoring';
import { evaluatePromotionPolicy, PromotionDecision } from './promotionPolicy';
import { analyzeObjection, ObjectionAnalysis } from './objectionEngine';
import { transitionConversationState, StateTransitionResult } from './stateMachine';
import { validateAndSanitizeResponse, ValidationResult, MAX_BOT_MESSAGES_LIMIT } from './responseValidator';
import { DEFAULT_PRODUCT_CONFIG, ProductConfig, formatProductPromptContext } from '../config/productConfig';

export interface ConversationStepOutput {
  updatedContext: ConversationContext;
  intentResult: IntentDetectionResult;
  scoreUpdate: ScoreUpdateResult;
  promotionDecision: PromotionDecision;
  stateTransition: StateTransitionResult;
  objectionAnalysis?: ObjectionAnalysis;
  promptDirective: string;
  shouldSendPhotoBanner: boolean;
  isTerminal: boolean;
  messageLimitReached: boolean;
}

/**
 * Initializes a clean ConversationContext for a new anonymous chat session
 */
export function createInitialConversationContext(
  partnerTag?: string,
  partnerProfileSnippet?: string,
  startedAt?: string
): ConversationContext {
  const nowIso = startedAt || new Date().toISOString();
  return {
    state: ConversationState.INITIAL_GREETING,
    previousState: ConversationState.CONNECTING,
    intent: Intent.UNKNOWN,
    detectedIntentsHistory: [],
    leadScore: 0,
    scoreFactors: [],
    scoredIntentCategories: [],
    promotionLock: false,
    promotionLevel: PromotionLevel.NO_PROMOTION,
    productMentioned: false,
    lastPromotionTurn: 0,
    lastCTATurn: 0,
    turnCount: 0,
    botMessageCount: 0,
    userMessageCount: 0,
    maxBotMessages: MAX_BOT_MESSAGES_LIMIT,
    conversationStartedAt: nowIso,
    elapsedSeconds: 0,
    supportIdAvailable: false,
    offerCount: 0,
    recentBotMessages: [],
    recentStrangerMessages: [],
    rejectionsCount: 0,
    objectionsCount: 0,
    partnerTag,
    partnerProfileSnippet,
  };
}

/**
 * Core Orchestration Pipeline for Conversation Turn
 * Deterministically processes the user message through all decision engines.
 */
export function processConversationTurn(
  userMessage: string,
  currentContext: ConversationContext,
  promotionConfig?: AnonymousProductPromotion,
  maxTurns: number = 4,
  messageHistory: AnonymousChatMessage[] = [],
  productConfig: ProductConfig = DEFAULT_PRODUCT_CONFIG,
  strategy: ConversationStrategy = 'direct_pitch',
  persona?: BotPersonaConfig
): ConversationStepOutput {
  const currentTurn = currentContext.turnCount + 1;
  const historyForIntent = messageHistory.map((m) => ({
    sender: m.sender,
    text: m.text,
  }));

  // Step 1: Detect User Intent
  const intentResult = detectIntent(userMessage, historyForIntent);
  const currentIntent = intentResult.intent;

  // Step 2: Handle Timing and Duration (A2)
  const startedAtEpoch = currentContext.conversationStartedAt
    ? new Date(currentContext.conversationStartedAt).getTime()
    : Date.now();
  const calculatedDurationSec = Math.max(
    currentContext.elapsedSeconds || 0,
    Math.floor((Date.now() - startedAtEpoch) / 1000)
  );
  const supportIdAvailable = calculatedDurationSec >= 120;

  // Step 3: Handle Rejections & Objections counts
  let newPromotionLock = currentContext.promotionLock;
  let rejectionsCount = currentContext.rejectionsCount;
  let objectionsCount = currentContext.objectionsCount;

  if (currentIntent === Intent.REJECTION) {
    newPromotionLock = true;
    rejectionsCount += 1;
  } else if (intentResult.isExplicitProductIntent && newPromotionLock) {
    // Release lock if user explicitly initiates product inquiry
    newPromotionLock = false;
  }

  if (currentIntent === Intent.OBJECTION) {
    objectionsCount += 1;
  }

  // Step 4: Calculate Lead Score with Deduplication
  const scoreUpdate = calculateLeadScoreUpdate(
    currentContext.leadScore,
    currentIntent,
    currentContext.scoreFactors,
    currentTurn
  );

  const updatedFactors = scoreUpdate.factor
    ? [...currentContext.scoreFactors, scoreUpdate.factor]
    : currentContext.scoreFactors;

  // Step 5: Evaluate Promotion Policy
  const tempContextForPolicy: ConversationContext = {
    ...currentContext,
    intent: currentIntent,
    leadScore: scoreUpdate.newScore,
    turnCount: currentTurn,
    elapsedSeconds: calculatedDurationSec,
    supportIdAvailable,
    promotionLock: newPromotionLock,
  };

  const promotionDecision = evaluatePromotionPolicy(
    tempContextForPolicy,
    currentIntent,
    promotionConfig,
    strategy
  );

  // Step 6: Analyze Objection if applicable
  let objectionAnalysis: ObjectionAnalysis | undefined;
  if (currentIntent === Intent.OBJECTION) {
    objectionAnalysis = analyzeObjection(userMessage);
  }

  // Step 7: State Transition Engine
  const stateTransition = transitionConversationState(
    currentContext.state,
    currentIntent,
    {
      ...tempContextForPolicy,
      promotionLevel: promotionDecision.allowedLevel,
    },
    maxTurns,
    strategy
  );

  // Step 8: Build Final Updated Context
  const isDirectCTA =
    promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER &&
    (currentIntent === Intent.SUPPORT_REQUEST ||
      currentIntent === Intent.PURCHASE_INTENT ||
      currentIntent === Intent.PRICE_REQUEST ||
      stateTransition.newState === ConversationState.SUPPORT_HANDOFF);

  const isCommercialActive = [
    ConversationState.PRODUCT_INTRODUCTION,
    ConversationState.PRODUCT_INTEREST,
    ConversationState.PRICE_DISCUSSION,
    ConversationState.TRIAL_DISCUSSION,
    ConversationState.SUPPORT_HANDOFF,
    ConversationState.OBJECTION_HANDLING,
    ConversationState.NEED_DETECTED,
  ].includes(stateTransition.newState);

  const maxLimit = (isCommercialActive || scoreUpdate.newScore >= 35)
    ? (currentContext.maxBotMessages ? Math.max(currentContext.maxBotMessages, 35) : 35)
    : (currentContext.maxBotMessages || MAX_BOT_MESSAGES_LIMIT);

  const messageLimitReached = (currentContext.botMessageCount || 0) >= maxLimit;

  let finalState = stateTransition.newState;
  if (messageLimitReached) {
    finalState = ConversationState.EXITING;
  }

  const updatedRecentStranger = [...(currentContext.recentStrangerMessages || []), userMessage].slice(-10);

  const updatedContext: ConversationContext = {
    state: finalState,
    previousState: currentContext.state,
    intent: currentIntent,
    detectedIntentsHistory: [...currentContext.detectedIntentsHistory, currentIntent],
    leadScore: scoreUpdate.newScore,
    scoreFactors: updatedFactors,
    scoredIntentCategories: updatedFactors.map((f) => f.intent),
    promotionLock: promotionDecision.isPromotionLocked || newPromotionLock,
    promotionLevel: promotionDecision.allowedLevel,
    productMentioned: currentContext.productMentioned || promotionDecision.allowedLevel !== PromotionLevel.NO_PROMOTION,
    lastPromotionTurn:
      promotionDecision.allowedLevel !== PromotionLevel.NO_PROMOTION
        ? currentTurn
        : currentContext.lastPromotionTurn,
    lastCTATurn: isDirectCTA ? currentTurn : currentContext.lastCTATurn,
    turnCount: currentTurn,
    botMessageCount: currentContext.botMessageCount || 0,
    userMessageCount: (currentContext.userMessageCount || 0) + 1,
    maxBotMessages: maxLimit,
    conversationStartedAt: currentContext.conversationStartedAt || new Date().toISOString(),
    elapsedSeconds: calculatedDurationSec,
    supportIdAvailable,
    offerCount: promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER
      ? (currentContext.offerCount || 0) + 1
      : (currentContext.offerCount || 0),
    recentBotMessages: currentContext.recentBotMessages || [],
    recentStrangerMessages: updatedRecentStranger,
    rejectionsCount,
    objectionsCount,
    lastObjectionCategory: objectionAnalysis?.category,
    partnerTag: currentContext.partnerTag,
    partnerProfileSnippet: currentContext.partnerProfileSnippet,
  };

  // Step 9: Build Prompt Context Directive
  const promptDirective = buildPromptDirective(
    updatedContext,
    intentResult,
    promotionDecision,
    stateTransition,
    objectionAnalysis,
    promotionConfig,
    productConfig,
    strategy,
    persona
  );

  return {
    updatedContext,
    intentResult,
    scoreUpdate,
    promotionDecision,
    stateTransition,
    objectionAnalysis,
    promptDirective,
    shouldSendPhotoBanner: promotionDecision.canSendBannerPhoto,
    isTerminal: stateTransition.isTerminalState || messageLimitReached,
    messageLimitReached,
  };
}

/**
 * Builds the exact deterministic instructions for Gemini
 */
export function buildPromptDirective(
  context: ConversationContext,
  intentResult: IntentDetectionResult,
  promotionDecision: PromotionDecision,
  stateTransition: StateTransitionResult,
  objectionAnalysis?: ObjectionAnalysis,
  promotionConfig?: AnonymousProductPromotion,
  productConfig: ProductConfig = DEFAULT_PRODUCT_CONFIG,
  strategy: ConversationStrategy = 'direct_pitch',
  persona?: BotPersonaConfig
): string {
  const lines: string[] = [];

  const personaLabel = persona?.name || 'Online Representative';
  const personaRole = persona?.role || (strategy === 'direct_pitch' ? 'Sales Visitor & Free Trial Specialist' : 'Friendly Conversationalist');
  const targetProductName = productConfig.productName || promotionConfig?.productName || 'سرویس اشتراک اختصاصی';

  lines.push(`=== CONVERSATION ENGINE DIRECTIVE (Turn ${context.turnCount}) ===`);
  lines.push(`• Strategy Mode: ${strategy.toUpperCase()}`);
  lines.push(`• Persona Identity: ${personaLabel} | Role: ${personaRole}`);
  lines.push(`• Current State: ${context.state} (from ${context.previousState})`);
  lines.push(`• Detected Intent: ${context.intent} (Confidence: ${Math.round(intentResult.confidence * 100)}%)`);
  lines.push(`• Lead Score: ${context.leadScore}/100 (${context.leadScore >= 56 ? 'HOT' : context.leadScore >= 26 ? 'WARM' : 'COLD'})`);
  lines.push(`• Promotion Policy: ${promotionDecision.allowedLevel} (Locked: ${context.promotionLock ? 'YES' : 'NO'})`);
  lines.push(`• Bot Message Count: ${context.botMessageCount}/${context.maxBotMessages || 25}`);
  lines.push(`• Conversation Duration: ${context.elapsedSeconds}s (Support ID Access: ${context.supportIdAvailable ? 'ALLOWED' : 'GATED (<120s)'})`);

  if (promotionDecision.isExplicitOverride || promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER || promotionDecision.allowedLevel === PromotionLevel.SOFT_MENTION) {
    if (!context.supportIdAvailable) {
      lines.push(`⚡ PRODUCT PRESENTATION & < 120s PLATFORM RESTRICTION: The conversation is under 2 minutes (120s). Telegram anonymous bot automatically filters out photos and @ handles.`);
      lines.push(`• DIRECTIVE: Highlight the core value proposition for ${targetProductName} clearly and warmly based on Product Specs & FAQ (plans, prices, speed, protocols, free test account).`);
      lines.push(`• ENGAGEMENT & RETENTION: Keep the conversation active naturally until 120s passes (e.g. ask what device they use: Android/iOS/Windows, or their mobile network/carrier: Irancell/MCI/Wifi, or offer to prepare a free test config).`);
      lines.push(`• SUPPORT ID & PHOTO: STRICTLY DO NOT output any handle or photo yet because Telegram will drop it!`);
    } else {
      const handle = (productConfig.support.handle || promotionConfig?.contactHandleOrLink || 'nova_vpn10').replace(/^@/, '');
      lines.push(`✅ 2-MINUTE THRESHOLD REACHED (>= 120s): Platform restrictions lifted.`);
      lines.push(`• Support Handle: ${handle} (strictly without @ and with underscore)`);
      lines.push(`• Offer the support handle and invite them to connect for the free test account or setup.`);
    }
  }

  if (context.intent === Intent.REJECTION || (context.state === ConversationState.GOODBYE && context.promotionLock)) {
    lines.push(`⛔ USER DECLINED / NO NEED DETECTED: User indicated they do not need services. Immediately output a single, ultra-short polite goodbye (3 to 6 words max, e.g. «باشه حله مراقب خودت باش فعلا» or «اوکی موفق باشی فعلا»). Do NOT ask any new questions or drag the conversation, so the system can exit cleanly.`);
  } else if (context.promotionLock) {
    lines.push(`⛔ PROMOTION LOCKED: User has no interest. DO NOT pitch or push offers. Speak politely and briefly without commercial pressure.`);
  } else if (promotionDecision.allowedLevel === PromotionLevel.NO_PROMOTION) {
    const toneDesc = persona?.tone ? `Tone: ${persona.tone}` : 'Tone: warm, natural and friendly';
    lines.push(`💬 MODE: CASUAL RAPPORT ONLY. Speak authentically as ${personaLabel} (${personaRole}). ${toneDesc}. ${persona?.bio || ''}. DO NOT push unsolicited marketing.`);
  } else if (promotionDecision.allowedLevel === PromotionLevel.SOFT_MENTION) {
    lines.push(`🌱 MODE: ORGANIC & RELEVANT CONVERSATION. Touch upon ${targetProductName} warmly, answering contextually and building value without aggressive pressure.`);
  } else if (promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER) {
    lines.push(`🎯 MODE: DIRECT VALUE & PRODUCT GUIDE. Act as ${personaRole}. Answer clearly and warmly using the Knowledge Base. Invite them to test or try.`);
    if (context.supportIdAvailable) {
      const handle = (productConfig.support.handle || promotionConfig?.contactHandleOrLink || 'nova_vpn10').replace(/^@/, '');
      lines.push(`• Support Handle: ${handle} (strictly without @ and with underscore)`);
    } else {
      lines.push(`• Support Handle: [LOCKED: conversation duration < 120s - DO NOT provide handle yet]`);
    }
  }

  if (objectionAnalysis) {
    lines.push(`🛡️ OBJECTION HANDLING (${objectionAnalysis.category}):`);
    lines.push(`• Strategy: ${objectionAnalysis.suggestedStrategy}`);
    objectionAnalysis.recommendedTalkingPoints.forEach((point) => {
      lines.push(`  - ${point}`);
    });
  }

  if (context.recentBotMessages && context.recentBotMessages.length > 0) {
    lines.push(`• Anti-Repetition Rule: Previous bot messages in this chat: [${context.recentBotMessages.slice(-4).map(m => `"${m}"`).join(' | ')}]. Never repeat identical questions or phrase structures!`);
  }

  // 18+ Messages Winding Down Directive
  if ((context.botMessageCount || 0) >= 18) {
    lines.push(`⏳ WINDING DOWN (18+ Messages): You have reached 18+ messages. Naturally let the user know you will have to leave soon (e.g. «راستی منم کم‌کم باید برم») and smoothly guide the conversation towards a natural goodbye.`);
  }

  // Exit behavior based on user context
  if (context.state === ConversationState.GOODBYE || context.intent === Intent.GOODBYE) {
    lines.push(`👋 FAREWELL: The user is leaving. Give a short, natural, warm goodbye.`);
  }

  lines.push(`========================================================`);

  return lines.join('\n');
}

export { validateAndSanitizeResponse };
