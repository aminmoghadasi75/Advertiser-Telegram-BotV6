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
  strategy: ConversationStrategy = 'social_rapport',
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
  const supportIdAvailable = Boolean(currentContext.coinRewarded || currentContext.mediaUnlocked || calculatedDurationSec >= 120);

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

  // Passive Listening Detection:
  // Allows the bot to occasionally remain quiet, cede the initiative to the user,
  // and use natural single-word telegram reactions (اوهوم, آره, نه, نوچ, دقیقا, آره والا) instead of constantly interrogating.
  const isCasualState = [
    ConversationState.INITIAL_GREETING,
    ConversationState.EARLY_CONVERSATION,
    ConversationState.ENGAGED,
    ConversationState.QUALIFYING,
  ].includes(finalState);

  const isUserQuestionOrCommercialInquiry = [
    Intent.QUESTION,
    Intent.VPN_REQUEST,
    Intent.PRODUCT_CURIOUS,
    Intent.TRIAL_REQUEST,
    Intent.PRICE_REQUEST,
    Intent.PLAN_REQUEST,
    Intent.SUPPORT_REQUEST,
    Intent.PURCHASE_INTENT,
    Intent.OBJECTION,
    Intent.REJECTION,
    Intent.GOODBYE,
  ].includes(currentIntent);

  const userAskedNoExplicitQuestion =
    !userMessage.includes('؟') &&
    !userMessage.includes('?') &&
    !/(?:تو چی|شما چی|چطوری|چیکار|کجایی|چند|چرا|کی|کدوم)/i.test(userMessage);

  const shouldBePassiveListening =
    isCasualState &&
    !isUserQuestionOrCommercialInquiry &&
    promotionDecision.allowedLevel === PromotionLevel.NO_PROMOTION &&
    currentTurn >= 2 &&
    (currentTurn % 2 === 0 || userAskedNoExplicitQuestion);

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
    coinRewarded: currentContext.coinRewarded,
    mediaUnlocked: currentContext.mediaUnlocked,
    promoBannerSent: currentContext.promoBannerSent,
    isPassiveListeningTurn: shouldBePassiveListening,
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
  strategy: ConversationStrategy = 'social_rapport',
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
  lines.push(`• Conversation Duration: ${context.elapsedSeconds}s (Support ID & Banner Access: ${context.supportIdAvailable ? 'ALLOWED (Coin reward received or >=120s)' : 'GATED (<120s & before coin reward)'})`);

  if (promotionDecision.isExplicitOverride || promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER || promotionDecision.allowedLevel === PromotionLevel.SOFT_MENTION) {
    if (!context.supportIdAvailable) {
      lines.push(`⚡ PHASE 1 (< 120s & BEFORE COIN REWARD): The Telegram anonymous chat bot platform strictly forbids photos and English characters/IDs in the first 2 minutes or before the coin reward message («💰 تبریک تعداد 1 سکه...»).`);
      lines.push(`• STRICT RESTRICTION: DO NOT send photos, DO NOT output [SEND_PROMO_BANNER], and DO NOT write English letters or @ handles!`);
      lines.push(`• NATURAL TOPIC PULL: Converse warmly, exchange name/age/city, and smoothly pull the topic to slow internet / filtering in 100% natural Persian (e.g. «راستی نتم امروز خیلی رو مخ بود فیلترشکن خوب داری؟» or «چقدر تلگرام دیر وصل میشه توام قطعی داری؟»).`);
      lines.push(`• NO ENGLISH / NO LINKS: Keep it purely in Persian until coin reward arrives or 120s passes.`);
    } else {
      const handle = (productConfig.support.handle || promotionConfig?.contactHandleOrLink || 'nova_vpn10').replace(/^@/, '');
      lines.push(`✅ PHASE 2 (COIN REWARD RECEIVED OR >= 120s): Platform restrictions are LIFTED.`);
      lines.push(`• ULTRA-SHORT NATURAL CHAT (STRICT MAX 3-6 WORDS): Introduce or mention ${targetProductName} in an ultra-short, natural, human sentence (e.g. «من نوا وی‌پی‌ان وصل میشم خوبه» or «تستش رایگانه خواستی»).`);
      lines.push(`• DO NOT pack pitch, trial, id, and banner all into one huge run-on sentence! Never write more than 5-6 words in a bubble.`);
      lines.push(`• IF STRANGER ASKS FOR ID/PRICE/LINK: Give only the handle ${handle} in a 3-4 word bubble (e.g. «به ${handle} پیام بده تست میده»).`);
      lines.push(`• BRANCH A (INTEREST / QUESTIONS): Answer concisely in 3-5 words.`);
      lines.push(`• BRANCH B (NO INTEREST / REJECTION / "نه" / "دارم" / "وصلم"): Do NOT insist! Say a brief polite goodbye (3 words max: «باشه موفق باشی») so the system exits.`);
    }
  }

  // Telegram Micro-Bubble Formatting Rule
  const personaName = persona?.name || 'ملودی';
  lines.push(`📱 TELEGRAM HUMAN BURST CHAT FORMAT (ULTRA-SHORT / 3 TO 6 WORDS):`);
  lines.push(`• Output your response as 1 or 2 extremely short conversational bubbles separated by a newline (\\n).`);
  lines.push(`• STRICT RULE: Each bubble MUST be 3 to 6 words only! Short, snappy, and realistic like a real girl texting on Telegram.`);
  lines.push(`• Example:`);
  lines.push(`سلام خوبی\\n${personaName} ۲۶ تهران`);
  lines.push(`• NEVER write long sentences, marketing pitches, or compound clauses.`);

  // Absolute Ban on Robotic / Repetitive Cliché Questions
  lines.push(`🚫 BAN ON ROBOTIC & REPETITIVE QUESTIONS («شما چطور؟»، «شما چی؟»):`);
  lines.push(`• STRICTLY DO NOT end messages with textbook clichés like «شما چطور؟»، «شما چی؟» or «تو چطور؟». It sounds extremely robotic and unnatural in Telegram!`);
  lines.push(`• If the stranger has ALREADY introduced themselves (e.g. they stated their name, age, city like "نیما ۳۲ تهران"), NEVER ask them "شما چطور؟" or ask for their info again! Just acknowledge their info warmly and answer their questions (e.g. «خوشبختم منم مجردم»).`);
  lines.push(`• NEVER repeat the same question or ending phrase you asked in the previous turn! If you asked a question last turn, DO NOT ask another question this turn; let the stranger talk.`);

  // Absolute Ban on Over-Familiar / Affectionate Words
  lines.push(`🚫 ABSOLUTE BAN ON OVER-FAMILIAR / AFFECTIONATE WORDS (CRITICAL):`);
  lines.push(`• DO NOT use affectionate terms like «عزیزم»، «جانم»، «جان»، «گلم»، «گل من»، «عشقم»، «فدات»، «قربونت» with an unknown stranger in Telegram!`);
  lines.push(`• Using these words with a stranger on a first conversation feels weird, fake, robotic, and uncomfortable. Speak casually, respectfully, and authentically like an ordinary 26yo girl from Tehran (Sara).`);

  // Passive Listening & Initiative-Pass Mode
  if (context.isPassiveListeningTurn) {
    lines.push(`🤫 PASSIVE LISTENING & INITIATIVE-PASS MODE (CRITICAL TELEGRAM HABIT):`);
    lines.push(`• In this turn, DO NOT lead or drive the conversation forward! Let the stranger ask the questions.`);
    lines.push(`• STRICTLY FORBIDDEN to ask any questions in this turn (DO NOT include any question mark «؟» or interrogative phrase like «تو چی؟» or «چیکار می‌کنی؟»).`);
    lines.push(`• Use a natural, ultra-minimal 1-word or short Telegram response/reaction like real users do:`);
    lines.push(`  - Confirmation / Casual agreement: «اوهوم» or «آره» or «آره والا» or «دقیقا» or «آره واقعا»`);
    lines.push(`  - Casual negative / disinterest: «نوچ» or «نه» or «نه بابا»`);
    lines.push(`  - Simple reaction: «جالبه» or «خوبه» or «درکت می‌کنم»`);
    lines.push(`• Output ONLY 1 short bubble with 1 to 2 words (e.g. just «اوهوم» or «آره والا» or «نوچ»).`);
    lines.push(`• Silence and minimal response encourages the user to ask questions and take the lead!`);
  }

  if (objectionAnalysis?.category === ObjectionCategory.IT_PROFESSIONAL) {
    lines.push(`💻 USER IS IT SPECIALIST / SERVER HOST: The user is in IT or hosts their own VPN/server. DO NOT promote, pitch, or mention Nova or VPN support. Compliment their technical skill warmly and casually in 2-4 words per bubble (e.g. «ایول دمت گرم چه عالی» \\n «کارت شبکه است یا نرم‌افزار؟»). Keep it 100% human and conversational.`);
  } else if (context.intent === Intent.REJECTION || (context.state === ConversationState.GOODBYE && context.promotionLock)) {
    lines.push(`⛔ USER DECLINED / NO NEED DETECTED: User indicated they do not need services. Immediately output a single, ultra-short polite goodbye (3 words max, e.g. «باشه موفق باشی» or «اوکی فعلا»).`);
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
