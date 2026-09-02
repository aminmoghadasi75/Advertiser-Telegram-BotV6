import { Intent, ConversationContext } from '../types';
import { ENTITY_PATTERNS } from './intentEntities';

export interface ContextSummary {
  productContextActive: boolean;
  recentPrimaryIntents: Intent[];
  recentSecondaryIntents: Intent[];
  lastCommercialIntent: Intent | null;
  lastResolvedTopic: string | null;
  hasUnresolvedQuestion: boolean;
  promotionLocked: boolean;
  turnCount: number;
}

const COMMERCIAL_INTENTS = new Set<Intent>([
  Intent.SUPPORT_REQUEST,
  Intent.PURCHASE_INTENT,
  Intent.PRICE_REQUEST,
  Intent.PLAN_REQUEST,
  Intent.TRIAL_REQUEST,
  Intent.VPN_REQUEST,
  Intent.PRODUCT_CURIOUS,
  Intent.OBJECTION,
  Intent.RELEVANT_NEED,
]);

/**
 * Builds a bounded ContextSummary from conversation history and optional ConversationContext.
 * Bounded to the last 4 messages to prevent stale contextual drift.
 */
export function buildContextSummary(
  history: Array<{ sender: string; text: string }> = [],
  convContext?: ConversationContext
): ContextSummary {
  const boundedHistory = history.slice(-6);
  const turnCount = convContext?.turnCount ?? Math.floor(history.length / 2) + 1;
  const promotionLocked = convContext?.promotionLock ?? false;

  const recentPrimaryIntents: Intent[] = convContext?.detectedIntentsHistory?.slice(-4) ?? [];
  const recentSecondaryIntents: Intent[] = [];

  let lastCommercialIntent: Intent | null = null;
  let lastResolvedTopic: string | null = null;
  let hasUnresolvedQuestion = false;

  // Scan recent history texts
  const recentTexts = boundedHistory.map((h) => h.text).join(' ');
  const lastUserTurn = [...boundedHistory].reverse().find((h) => h.sender === 'stranger' || h.sender === 'user');
  const lastBotTurn = [...boundedHistory].reverse().find((h) => h.sender === 'me_melody' || h.sender === 'assistant' || h.sender === 'ai_bot');

  if (lastBotTurn && /(\?|؟)/.test(lastBotTurn.text)) {
    hasUnresolvedQuestion = true;
  }

  // Determine if product context is currently active
  const isProductMentionedInHistory =
    convContext?.productMentioned ||
    ENTITY_PATTERNS.PRODUCT.test(recentTexts) ||
    /فیلتر|v2ray|vpn|سرور|کانفیگ|اشتراک|اکانت|پلن|تعرفه/i.test(recentTexts);

  const productContextActive = Boolean(isProductMentionedInHistory && !promotionLocked);

  // Identify last commercial intent from history if recorded
  for (let i = recentPrimaryIntents.length - 1; i >= 0; i--) {
    if (COMMERCIAL_INTENTS.has(recentPrimaryIntents[i])) {
      lastCommercialIntent = recentPrimaryIntents[i];
      break;
    }
  }

  if (productContextActive) {
    if (/قیمت|چنده|تعرفه/i.test(recentTexts)) lastResolvedTopic = 'PRICE';
    else if (/پلن|سه ماهه|یک ماهه|کاربره|حجمی/i.test(recentTexts)) lastResolvedTopic = 'PLAN';
    else if (/تست|دمو/i.test(recentTexts)) lastResolvedTopic = 'TRIAL';
    else if (/سرور|لوکیشن|پروتکل|ویندوز|آیفون|اندروید|همراه اول/i.test(recentTexts)) lastResolvedTopic = 'TECHNICAL_SPECS';
  }

  return {
    productContextActive,
    recentPrimaryIntents,
    recentSecondaryIntents,
    lastCommercialIntent,
    lastResolvedTopic,
    hasUnresolvedQuestion,
    promotionLocked,
    turnCount,
  };
}

/**
 * Evaluates contextual evidence for an intent.
 * CRITICAL RULE: Context may ONLY modify/boost confidence when current message has compatible lexical evidence.
 * Context must NEVER invent an intent with zero current-message evidence.
 */
export function evaluateContextualEvidence(
  intent: Intent,
  context: ContextSummary,
  hasCurrentLexicalEvidence: boolean
): number {
  if (!hasCurrentLexicalEvidence) {
    return 0.0;
  }

  if (context.promotionLocked) {
    if (COMMERCIAL_INTENTS.has(intent)) {
      return 0.1;
    }
  }

  switch (intent) {
    case Intent.PRODUCT_CURIOUS:
    case Intent.VPN_REQUEST:
    case Intent.PRICE_REQUEST:
    case Intent.PLAN_REQUEST:
    case Intent.TRIAL_REQUEST:
    case Intent.SUPPORT_REQUEST:
    case Intent.PURCHASE_INTENT:
      return context.productContextActive ? 0.85 : 0.3;

    case Intent.OBJECTION:
      return context.productContextActive ? 0.8 : 0.4;

    case Intent.RELEVANT_NEED:
      return 0.5;

    case Intent.SMALL_TALK:
    case Intent.GREETING:
      return context.turnCount <= 2 ? 0.7 : 0.4;

    case Intent.GOODBYE:
      return context.turnCount > 2 ? 0.8 : 0.4;

    default:
      return 0.3;
  }
}
