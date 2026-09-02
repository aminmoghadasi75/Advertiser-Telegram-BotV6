import { Intent, IntentDetectionResult, ConversationContext } from '../types';
import { normalizePersianText, hasExactToken, matchBoundedPattern } from './normalizer';
import { extractEntities, ExtractedEntities, ENTITY_PATTERNS } from './intentEntities';
import { buildContextSummary, evaluateContextualEvidence, ContextSummary } from './contextSummary';
import {
  IntentCandidateDetail,
  resolveMultiIntentSet,
} from './intentCompatibility';

export type { CandidateEvidence, IntentCandidateDetail } from './intentCompatibility';
export type { IntentDetectionResult } from '../types';

// ---------------------------------------------------------
// INTENT PRIORITY TIERS & ACTIONABILITY
// ---------------------------------------------------------

export const INTENT_PRIORITY_TIER: Record<Intent, number> = {
  [Intent.INAPPROPRIATE]: 100,
  [Intent.SPAM]: 95,
  [Intent.REJECTION]: 90,
  [Intent.OBJECTION]: 88,
  [Intent.SUPPORT_REQUEST]: 85,
  [Intent.PURCHASE_INTENT]: 84,
  [Intent.PRICE_REQUEST]: 80,
  [Intent.PLAN_REQUEST]: 78,
  [Intent.TRIAL_REQUEST]: 76,
  [Intent.VPN_REQUEST]: 75,
  [Intent.RELEVANT_NEED]: 70,
  [Intent.PRODUCT_CURIOUS]: 68,
  [Intent.SUSPICION_BOT]: 65,
  [Intent.GOODBYE]: 60,
  [Intent.GREETING]: 50,
  [Intent.SMALL_TALK]: 45,
  [Intent.QUESTION]: 40,
  [Intent.OFF_TOPIC]: 20,
  [Intent.UNKNOWN]: 10,
  [Intent.SILENCE]: 0,
};

export const INTENT_ACTIONABILITY: Record<Intent, number> = {
  [Intent.INAPPROPRIATE]: 0.0,
  [Intent.SPAM]: 0.0,
  [Intent.REJECTION]: 0.95,
  [Intent.OBJECTION]: 0.85,
  [Intent.SUPPORT_REQUEST]: 0.95,
  [Intent.PURCHASE_INTENT]: 0.95,
  [Intent.PRICE_REQUEST]: 0.90,
  [Intent.PLAN_REQUEST]: 0.85,
  [Intent.TRIAL_REQUEST]: 0.85,
  [Intent.VPN_REQUEST]: 0.80,
  [Intent.RELEVANT_NEED]: 0.70,
  [Intent.PRODUCT_CURIOUS]: 0.65,
  [Intent.SUSPICION_BOT]: 0.50,
  [Intent.GOODBYE]: 0.80,
  [Intent.GREETING]: 0.40,
  [Intent.SMALL_TALK]: 0.30,
  [Intent.QUESTION]: 0.35,
  [Intent.OFF_TOPIC]: 0.10,
  [Intent.UNKNOWN]: 0.10,
  [Intent.SILENCE]: 0.0,
};

/**
 * Generates all candidate intents with rich multidimensional evidence.
 */
export function generateCandidates(
  normText: string,
  rawText: string,
  entities: ExtractedEntities,
  context: ContextSummary
): IntentCandidateDetail[] {
  const candidates: IntentCandidateDetail[] = [];

  // 1. INAPPROPRIATE
  if (entities.hasInappropriateEntity) {
    candidates.push({
      intent: Intent.INAPPROPRIATE,
      lexicalEvidence: 0.98,
      semanticEvidence: 0.98,
      contextualEvidence: 0.1,
      negativeEvidence: 0.0,
      actionability: 0.0,
      confidence: 0.98,
      reasonCodes: ['SAFETY_INAPPROPRIATE_LANGUAGE'],
      matchedPatterns: ['explicit_profanity_token'],
    });
  }

  // 2. SPAM
  if (entities.hasSpamEntity) {
    candidates.push({
      intent: Intent.SPAM,
      lexicalEvidence: 0.95,
      semanticEvidence: 0.95,
      contextualEvidence: 0.1,
      negativeEvidence: 0.0,
      actionability: 0.0,
      confidence: 0.96,
      reasonCodes: ['SPAM_PATTERN_DETECTED'],
      matchedPatterns: ['external_promotional_link_or_spam'],
    });
  }

  // 3. REJECTION
  const isExplicitRejection =
    !/نمیخوام بگم/i.test(normText) &&
    (entities.hasRejectionEntity ||
    /(نمیخوام|لازم ندارم|نیاز ندارم|علاقه ندارم|تبلیغ نکن|اسپم نکن|خریدار نیستم|پول ندارم بدم|بس کن|حوصله ندارم|ولش کن نمیخوام|فیلترشکن نمیخوام|اصلا نمیخوام|قصد خرید ندارم|لازمم نمیشه|به دردم نمیخوره|از جای دیگه خریدم|از جای دیگه گرفتم|خریدم از جای دیگه|از جای دیگه|جای دیگه خریدم|از جا دیگه)/i.test(
      normText
    ));

  if (isExplicitRejection) {
    candidates.push({
      intent: Intent.REJECTION,
      lexicalEvidence: 0.95,
      semanticEvidence: 0.95,
      contextualEvidence: evaluateContextualEvidence(Intent.REJECTION, context, true),
      negativeEvidence: 0.0,
      actionability: 0.95,
      confidence: 0.96,
      reasonCodes: ['EXPLICIT_USER_REJECTION'],
      matchedPatterns: ['rejection_refusal_phrase'],
    });
  }

  // 4. OBJECTION (Generalized multidimensional objection detector)
  if (entities.hasObjectionEntity) {
    const reasons: string[] = ['OBJECTION_DETECTED'];
    if (entities.objectionConcepts.hasPriceResistance) reasons.push('OBJECTION_PRICE_RESISTANCE');
    if (entities.objectionConcepts.hasTrustConcern) reasons.push('OBJECTION_TRUST_CONCERN');
    if (entities.objectionConcepts.hasRiskOrFailureConcern) reasons.push('OBJECTION_RISK_CONCERN');
    if (entities.objectionConcepts.hasValueDoubt) reasons.push('OBJECTION_VALUE_DOUBT');
    if (entities.objectionConcepts.hasCompetitorComparison) reasons.push('OBJECTION_COMPETITOR_COMPARISON');
    if (entities.objectionConcepts.hasRefundOrGuaranteeConcern) reasons.push('OBJECTION_REFUND_GUARANTEE');
    if (entities.objectionConcepts.hasUsabilityDoubt) reasons.push('OBJECTION_USABILITY_DOUBT');
    if (entities.objectionConcepts.hasBadPriorExperience) reasons.push('OBJECTION_BAD_PRIOR_EXPERIENCE');

    candidates.push({
      intent: Intent.OBJECTION,
      lexicalEvidence: 0.92,
      semanticEvidence: 0.90,
      contextualEvidence: evaluateContextualEvidence(Intent.OBJECTION, context, true),
      negativeEvidence: 0.0,
      actionability: 0.85,
      confidence: 0.92,
      reasonCodes: reasons,
      matchedPatterns: ['objection_resistance_marker'],
    });
  }

  // 5. SUPPORT_REQUEST
  const isDirectSupport =
    entities.hasSupportEntity ||
    /(آیدی ادمین|ایدی ادمین|آیدی پشتیبانی|ایدی پشتیبانی|آیدی شو داری|آیدیشو داری|آیدیشو|آیدی شو|آیدی بده|ایدی بده|آیدی تلگرام|از کجا بخرم|از کجا بگیرم|از کجا باید تهیه کنم|از کجا تهیه کنم|چطوری تهیه کنم|چجوری تهیه کنم|کجا پیام بدم|به کی پیام بدم|لینک خرید|لینک پشتیبانی|کانال کجاست|کانال یا آیدی|آیدی فروش|برای خرید به کجا پیام|آیدی رو بده|آیدی کانال|ادمین صحبت|وارد برنامه کنم|ست کنه بلد نیستم|پیوی ادمین|پشتیبانیتون|ادمین چنل|پینگم بالا رفته|بازی نمیتونم بکنم|سرورم وصل نمیشه|سرعتم پایینه|افت سرعت دارم|پشتیبانی کمک|کمک کنید|متصل نمیشه|چجوری درستش کنم|خطای \d+|خطای ۵۰۰|خطای 500|به پشتیبانی|کمک کن)/i.test(
      normText
    );

  if (isDirectSupport) {
    candidates.push({
      intent: Intent.SUPPORT_REQUEST,
      lexicalEvidence: 0.94,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.SUPPORT_REQUEST, context, true),
      negativeEvidence: 0.0,
      actionability: 0.95,
      confidence: 0.95,
      reasonCodes: ['DIRECT_SUPPORT_OR_ADMIN_REQUEST'],
      matchedPatterns: ['support_admin_contact_query'],
    });
  }

  // 6. PURCHASE_INTENT
  const isPriceAmountQuery = /(چقدر|چند|چقدر باید|چقد).*(واریز|پرداخت)/i.test(normText);
  const isDirectPurchase =
    !isPriceAmountQuery &&
    (entities.hasPurchaseEntity ||
    /(میخوام بخرم|میخوام سفارش بدم|شماره کارت|شماره کارت بده|شماره کارت بفرست|کارت بده|لینک پرداخت|لینک پرداخت بفرست|شماره حساب|شماره شبا|اطلاعات پرداخت|الان واریز کنم|الان پرداخت میکنم|واریز کنم|پرداخت کنم|برام فعال کن|خرید قطعی|من یه دونه میخوام|اکانت میخوام بخرم|چجوری پرداخت کنم|میخوامش|اوکی میخوامش|برام اوکی کن الان واریز|مبلغ رو زدم|وجه رو انتقال|میخام بخرم|سفارشمو ثبت کن|تا الان بخرم)/i.test(
      normText
    ));

  if (isDirectPurchase) {
    candidates.push({
      intent: Intent.PURCHASE_INTENT,
      lexicalEvidence: 0.93,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.PURCHASE_INTENT, context, true),
      negativeEvidence: 0.0,
      actionability: 0.95,
      confidence: 0.94,
      reasonCodes: ['DIRECT_PURCHASE_COMMITMENT'],
      matchedPatterns: ['purchase_intent_phrase'],
    });
  }

  // 7. PRICE_REQUEST (Disambiguated from pure plan duration or commodity trap)
  const isPerformanceOrLimitQuery = /(پینگ|سرعت|تاخیر|پینگش|سرعتش|سقف مصرف|تنوع پلن|حجم|ترافیک).*(چنده|چقدره|چطوره)/i.test(normText) && !/(قیمت|هزینه|تعرفه|تومن|ماهی چقدر|چقدر باید بدم)/i.test(normText);
  const isDirectPrice =
    !isPerformanceOrLimitQuery &&
    (entities.hasPriceEntity ||
    isPriceAmountQuery ||
    (/(قیمت|قیمتش|هزینه|هزینش|چند تومن|چندتومنه|تعرفه|نرخ|ماهی چنده|یک ماهه چنده|ماهانه چنده|ماهانه چقدر|چند میدی|چند درمیاد|لیست قیمت|تعرفه‌ها|تعرفه ها|چقدر میشه|چقدر باید بدم|چند هزار تومن|چقدر درمیاد آخرش|باید پرداخت کنیم|ماهی چقدر باید بابتش بدم|ارزونتر|تخفیف|چرا اینقدر گرونه)/i.test(
      normText
    ) &&
      !entities.hasCommercialTrapEntity));

  if (isDirectPrice) {
    candidates.push({
      intent: Intent.PRICE_REQUEST,
      lexicalEvidence: 0.94,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.PRICE_REQUEST, context, true),
      negativeEvidence: 0.0,
      actionability: 0.90,
      confidence: 0.94,
      reasonCodes: ['DIRECT_PRICE_QUERY'],
      matchedPatterns: ['price_cost_tariff_inquiry'],
    });
  }

  // 8. PLAN_REQUEST (Tiers, packages, durations, data limits, user count, comparisons)
  const isAccountClosing = /بسته میشه|بسته بشه|بلاک میشه|مسدود میشه/i.test(normText);
  const isDirectPlan =
    !isAccountClosing &&
    (entities.hasPlanEntity ||
    entities.planConcepts.hasComparisonToken ||
    (entities.planConcepts.hasDurationToken && (entities.hasProductEntity || /اشتراک|اکانت|پلن/i.test(normText))) ||
    /(چه پلن‌هایی|کدوم پلن|پلن سه ماهه|پلن یک ماهه|پلن نامحدود|پلن خانواده|چند کاربره|تک کاربره|دو کاربره|تنوع پلن|چه بسته‌هایی|پلن‌ها چیه|سقف مصرف|دو نفر|دوکاربره|سالیانه‌اش|سالیانه|۳ کاربره|۴ کاربره)/i.test(
      normText
    ));

  if (isDirectPlan) {
    candidates.push({
      intent: Intent.PLAN_REQUEST,
      lexicalEvidence: 0.93,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.PLAN_REQUEST, context, true),
      negativeEvidence: 0.0,
      actionability: 0.85,
      confidence: 0.93,
      reasonCodes: ['PLAN_AND_TIER_QUERY'],
      matchedPatterns: ['plan_tier_duration_inquiry'],
    });
  }

  // 9. TRIAL_REQUEST
  const isDirectTrial =
    entities.hasTrialEntity ||
    /(اکانت تست|کانفیگ تست|تست رایگان|تست میدی|تست بدی|تست بده|اول تست|تست کنم|امتحان کنم|دمو داری|تست نیم ساعته|تست یک روزه|تست [۲2][۴4] ساعته|تست [۱1][۲2] ساعته|تست خوب بدی|تست اولش میدی|تست داری|تست سرعت|تست یک ساعته|یه ساعت تست|اولش تست|یه تست بده|اول امتحان کنم|تست [۱1] گیگ|تست \d+ گیگ|تست \d+ ساعته|اگه تست)/i.test(
      normText
    );

  if (isDirectTrial) {
    candidates.push({
      intent: Intent.TRIAL_REQUEST,
      lexicalEvidence: 0.94,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.TRIAL_REQUEST, context, true),
      negativeEvidence: 0.0,
      actionability: 0.88,
      confidence: 0.94,
      reasonCodes: ['DIRECT_TRIAL_REQUEST'],
      matchedPatterns: ['trial_demo_request_phrase'],
    });
  }

  // 10. VPN_REQUEST (Explicit inquiries for VPN/config product availability)
  const isDirectVpn =
    /(خودت با چه برنامه‌ای وصل میشی|با چی وصل میشی|فیلترشکن خوب داری|فیلترشکن داری|vpn داری|کانفیگ داری|v2ray داری|سرور داری|فیلترشکن میخوام|کانفیگ vless|کانفیگ vmess|کانفیگ shadowsocks|وی پی ان اختصاصی|سرور اختصاصی|پروکسی تلگرام.*(داری|بدی)|فیلترشکن.*برام بفرستی|فیلترشکن.*معرفی کنی|کانفیگ میخوام|چه وی پی انی|از چه وی پی انی|فیلترشکن پولی|سرویسی داری که|یه چیز قوی میخوام|چیز قوی میخوام)/i.test(
      normText
    ) ||
    (entities.hasProductEntity && /(داری|موجود داری|ارائه میدی|میدی|بفرستی|معرفی کنی|میخوام|پهنای باند)/i.test(normText) && !/(سرور اختصاصی خودتونه|پنل.*عمومی|نکنه.*(فیلتر|قطع)|پولمون بسوزه)/i.test(normText));

  if (isDirectVpn) {
    candidates.push({
      intent: Intent.VPN_REQUEST,
      lexicalEvidence: 0.94,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.VPN_REQUEST, context, true),
      negativeEvidence: 0.0,
      actionability: 0.88,
      confidence: 0.94,
      reasonCodes: ['EXPLICIT_VPN_INQUIRY'],
      matchedPatterns: ['vpn_service_inquiry'],
    });
  }

  // 11. RELEVANT_NEED (Generalized network, platform frustration, performance degradation, trading risk)
  if (entities.hasNeedEntity) {
    candidates.push({
      intent: Intent.RELEVANT_NEED,
      lexicalEvidence: 0.88,
      semanticEvidence: 0.90,
      contextualEvidence: evaluateContextualEvidence(Intent.RELEVANT_NEED, context, true),
      negativeEvidence: 0.0,
      actionability: 0.70,
      confidence: 0.88,
      reasonCodes: ['PAIN_POINT_NEED_DETECTED'],
      matchedPatterns: ['network_platform_frustration_or_need'],
    });
  }

  // 12. PRODUCT_CURIOUS (Technical specs, device compatibility, protocols, locations, ping inquiries)
  const isProductCurious =
    entities.productCuriousConcepts.hasDeviceOrOs ||
      entities.productCuriousConcepts.hasIspOrNetwork ||
      entities.productCuriousConcepts.hasProtocolOrTech ||
      entities.productCuriousConcepts.hasLocationOrServer ||
      entities.productCuriousConcepts.hasFixedIpOrKillSwitch ||
      /(روی.*(ویندوز|مک|آیفون|ios|اندروید|لپتاپ|گوشی|مودم)|با.*(همراه اول|ایرانسل|رایتل|مخابرات|وای فای)|(سرور|لوکیشن).*(آلمان|هلند|فرانسه|فنلاند|ترکیه|آمریکا|ایران|المان)|اینستاگرام|یوتیوب|آیپی ثابت|ایپی ثابت|پروتکل|vless|vmess|v2box|reality|سرعتش چطوره|سرعتش خوبه|پینگش چطوره|افت سرعت داره|پینگ میده|پینگ زیر|روی چند دستگاه|همزمان وصل|کیفیت سرور|پینگ.*چنده|سرعت.*چقدره|سرور اختصاصی خودتونه|پنل.*عمومی|تضمین بدون قطعی)/i.test(
        normText
      );

  if (isProductCurious) {
    candidates.push({
      intent: Intent.PRODUCT_CURIOUS,
      lexicalEvidence: 0.90,
      semanticEvidence: 0.90,
      contextualEvidence: evaluateContextualEvidence(Intent.PRODUCT_CURIOUS, context, true),
      negativeEvidence: 0.0,
      actionability: 0.65,
      confidence: 0.90,
      reasonCodes: ['PRODUCT_FEATURE_AND_COMPATIBILITY_INQUIRY'],
      matchedPatterns: ['product_feature_device_os_isp_inquiry'],
    });
  }

  // 13. SUSPICION_BOT
  if (entities.hasBotSuspicionEntity) {
    candidates.push({
      intent: Intent.SUSPICION_BOT,
      lexicalEvidence: 0.94,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.SUSPICION_BOT, context, true),
      negativeEvidence: 0.0,
      actionability: 0.50,
      confidence: 0.92,
      reasonCodes: ['BOT_SUSPICION_DETECTED'],
      matchedPatterns: ['bot_suspicion_marker'],
    });
  }

  // 14. GOODBYE
  if (entities.hasGoodbyeEntity) {
    candidates.push({
      intent: Intent.GOODBYE,
      lexicalEvidence: 0.92,
      semanticEvidence: 0.92,
      contextualEvidence: evaluateContextualEvidence(Intent.GOODBYE, context, true),
      negativeEvidence: /^(سلام|درود|هلو)/i.test(normText) ? 0.3 : 0.0,
      actionability: 0.80,
      confidence: 0.94,
      reasonCodes: ['CONVERSATIONAL_GOODBYE'],
      matchedPatterns: ['farewell_closing_phrase'],
    });
  }

  // 15. GREETING
  if (entities.hasGreetingEntity && !/(نپرسیدم|فقط سلام|نگفتم|کی پرسید)/i.test(normText)) {
    candidates.push({
      intent: Intent.GREETING,
      lexicalEvidence: 0.90,
      semanticEvidence: 0.90,
      contextualEvidence: evaluateContextualEvidence(Intent.GREETING, context, true),
      negativeEvidence: 0.0,
      actionability: 0.40,
      confidence: 0.90,
      reasonCodes: ['GREETING_FORMULA'],
      matchedPatterns: ['greeting_salutation_phrase'],
    });
  }

  // 16. SMALL_TALK (Generalized social bonding, ASL, occupation, routine, hobby)
  if (entities.hasSmallTalkEntity) {
    candidates.push({
      intent: Intent.SMALL_TALK,
      lexicalEvidence: 0.88,
      semanticEvidence: 0.90,
      contextualEvidence: evaluateContextualEvidence(Intent.SMALL_TALK, context, true),
      negativeEvidence: 0.0,
      actionability: 0.30,
      confidence: 0.90,
      reasonCodes: ['SMALL_TALK_PERSONAL_SHARING'],
      matchedPatterns: ['small_talk_disclosure_or_social_marker'],
    });
  }

  // 17. QUESTION (General non-commercial conversation questions)
  if (entities.hasGeneralQuestionEntity || /(شهریه دانشگاه|تست رانندگی)/i.test(normText)) {
    candidates.push({
      intent: Intent.QUESTION,
      lexicalEvidence: 0.85,
      semanticEvidence: 0.80,
      contextualEvidence: evaluateContextualEvidence(Intent.QUESTION, context, true),
      negativeEvidence: 0.0,
      actionability: 0.35,
      confidence: 0.85,
      reasonCodes: ['GENERAL_CONVERSATION_QUESTION'],
      matchedPatterns: ['general_question_inquiry'],
    });
  }

  // 18. OFF_TOPIC (POSITIVE EVIDENCE ONLY - Never fallback without positive off-topic indicators)
  if (entities.hasOffTopicPositiveEntity || entities.hasCommercialTrapEntity) {
    candidates.push({
      intent: Intent.OFF_TOPIC,
      lexicalEvidence: 0.92,
      semanticEvidence: 0.90,
      contextualEvidence: 0.1,
      negativeEvidence: 0.0,
      actionability: 0.10,
      confidence: 0.92,
      reasonCodes: ['OFF_TOPIC_BY_POSITIVE_EVIDENCE'],
      matchedPatterns: ['unrelated_domain_positive_evidence'],
    });
  }

  // 19. SHORT UNKNOWN / CLARIFICATION EXPRESSION
  if (/^(خب|خب چی شد|یعنی چی|یعنی چی واقعا|چی|منظورت چیه|اوکی|باشه|باش|مرسی|؟|\?|\.\.\.)[\s\?؟\.]*$/i.test(normText.trim())) {
    candidates.push({
      intent: Intent.UNKNOWN,
      lexicalEvidence: 0.98,
      semanticEvidence: 0.95,
      contextualEvidence: 0.1,
      negativeEvidence: 0.0,
      actionability: 0.0,
      confidence: 0.98,
      reasonCodes: ['SHORT_UNKNOWN_OVERRIDE'],
      matchedPatterns: ['short_clarification_token'],
    });
  }

  return candidates;
}

/**
 * Deterministic, Context-Aware, Multi-Intent Detection Engine
 */
export function detectIntent(
  userMessage: string,
  history: Array<{ sender: string; text: string }> = [],
  convContext?: ConversationContext
): IntentDetectionResult {
  const rawText = userMessage || '';
  const cleanMsg = rawText.trim();

  if (!cleanMsg) {
    return {
      intent: Intent.SILENCE,
      primaryIntent: Intent.SILENCE,
      secondaryIntents: [],
      confidence: 1.0,
      priority: 0,
      matchedPatterns: [],
      isExplicitProductIntent: false,
      isObjectionOrRejection: false,
      evidence: [],
      reasonCodes: ['EMPTY_INPUT_SILENCE'],
      topCandidates: [{ intent: Intent.SILENCE, score: 1.0 }],
      actionabilityScore: 0.0,
    };
  }

  // Step 1: Persian Message Normalization
  const normText = normalizePersianText(cleanMsg);

  // Step 2: Entity & Lexical Feature Extraction
  const entities = extractEntities(normText);

  // Step 3: Context Summary Computation
  const contextSummary = buildContextSummary(history, convContext);

  // Step 4: Candidate Generation & Multi-Intent Scoring
  const candidates = generateCandidates(normText, cleanMsg, entities, contextSummary);

  // Step 5: Deterministic Conflict Resolution & Compatibility Matrix
  const resolution = resolveMultiIntentSet(candidates, normText, contextSummary);
  const primary = resolution.primary;

  const isExplicitProduct = [
    Intent.PURCHASE_INTENT,
    Intent.SUPPORT_REQUEST,
    Intent.TRIAL_REQUEST,
    Intent.PRICE_REQUEST,
    Intent.PLAN_REQUEST,
    Intent.VPN_REQUEST,
  ].includes(primary.intent);

  const isObjectionOrRejection = [
    Intent.REJECTION,
    Intent.OBJECTION,
    Intent.INAPPROPRIATE,
    Intent.SPAM,
  ].includes(primary.intent);

  const topCandidates = candidates
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4)
    .map((c) => ({
      intent: c.intent,
      score: Number(c.confidence.toFixed(2)),
    }));

  return {
    intent: primary.intent,
    primaryIntent: primary.intent,
    secondaryIntents: resolution.secondaries,
    confidence: primary.confidence,
    priority: INTENT_PRIORITY_TIER[primary.intent] ?? 50,
    matchedPatterns: primary.matchedPatterns,
    isExplicitProductIntent: isExplicitProduct,
    isObjectionOrRejection,
    evidence: entities.matchedEntities,
    reasonCodes: resolution.allReasonCodes,
    topCandidates,
    actionabilityScore: primary.actionability,
  };
}

/**
 * Detailed Intent Detector exposing rich candidate and explanation data
 */
export function detectIntentDetailed(
  userMessage: string,
  history: Array<{ sender: string; text: string }> = [],
  convContext?: ConversationContext
): IntentDetectionResult {
  return detectIntent(userMessage, history, convContext);
}
