import { Intent } from '../types';
import { ContextSummary } from './contextSummary';

export interface CandidateEvidence {
  lexical: number;
  entity: number;
  syntax: number;
  context: number;
  actionability: number;
  negativeEvidence: number;
  confidence: number;
  reasonCodes: string[];
}

export interface IntentCandidateDetail {
  intent: Intent;
  lexicalEvidence: number;
  semanticEvidence: number;
  contextualEvidence: number;
  negativeEvidence: number;
  actionability: number;
  confidence: number;
  reasonCodes: string[];
  matchedPatterns: string[];
}

export enum CompatibilityRelation {
  COEXIST = 'COEXIST',
  OVERRIDE_PRIMARY = 'OVERRIDE_PRIMARY',
  FORCE_SECONDARY = 'FORCE_SECONDARY',
  MUTUALLY_EXCLUSIVE = 'MUTUALLY_EXCLUSIVE',
  SUPPRESS_SECONDARY = 'SUPPRESS_SECONDARY',
}

/**
 * Deterministic Pairwise Compatibility Rules
 */
export function getCompatibilityRelation(primary: Intent, secondary: Intent): CompatibilityRelation {
  if (primary === secondary) {
    return CompatibilityRelation.MUTUALLY_EXCLUSIVE;
  }

  // SPAM overrides and suppresses everything
  if (primary === Intent.SPAM || secondary === Intent.SPAM) {
    return CompatibilityRelation.MUTUALLY_EXCLUSIVE;
  }

  // INAPPROPRIATE primary allows specific conversational secondaries
  if (primary === Intent.INAPPROPRIATE) {
    if ([Intent.QUESTION, Intent.REJECTION, Intent.SMALL_TALK, Intent.GREETING].includes(secondary)) {
      return CompatibilityRelation.COEXIST;
    }
    return CompatibilityRelation.SUPPRESS_SECONDARY;
  }

  // REJECTION primary allows conversational / objection / small talk secondaries
  if (primary === Intent.REJECTION) {
    if ([Intent.SMALL_TALK, Intent.OBJECTION, Intent.QUESTION, Intent.GREETING].includes(secondary)) {
      return CompatibilityRelation.COEXIST;
    }
    return CompatibilityRelation.SUPPRESS_SECONDARY;
  }

  // OFF_TOPIC / UNKNOWN allow QUESTION or SMALL_TALK secondaries
  if (primary === Intent.OFF_TOPIC || primary === Intent.UNKNOWN) {
    if ([Intent.QUESTION, Intent.SMALL_TALK, Intent.GREETING].includes(secondary)) {
      return CompatibilityRelation.COEXIST;
    }
    return CompatibilityRelation.SUPPRESS_SECONDARY;
  }

  // SUSPICION_BOT primary allows QUESTION, GREETING, SMALL_TALK, VPN_REQUEST
  if (primary === Intent.SUSPICION_BOT) {
    if ([Intent.QUESTION, Intent.GREETING, Intent.SMALL_TALK, Intent.VPN_REQUEST].includes(secondary)) {
      return CompatibilityRelation.COEXIST;
    }
    return CompatibilityRelation.SUPPRESS_SECONDARY;
  }

  // GOODBYE primary allows SUPPORT_REQUEST, PURCHASE_INTENT, QUESTION, SMALL_TALK
  if (primary === Intent.GOODBYE) {
    if ([Intent.SUPPORT_REQUEST, Intent.PURCHASE_INTENT, Intent.QUESTION, Intent.SMALL_TALK].includes(secondary)) {
      return CompatibilityRelation.COEXIST;
    }
    return CompatibilityRelation.SUPPRESS_SECONDARY;
  }

  // Commercial / Product intents (VPN, PRICE, PLAN, TRIAL, RELEVANT_NEED)
  // suppress generic discourse QUESTION as secondary UNLESS primary is PURCHASE_INTENT asking payment details
  if (
    [
      Intent.VPN_REQUEST,
      Intent.PRICE_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.TRIAL_REQUEST,
      Intent.RELEVANT_NEED,
    ].includes(primary) &&
    secondary === Intent.QUESTION
  ) {
    return CompatibilityRelation.SUPPRESS_SECONDARY;
  }

  return CompatibilityRelation.COEXIST;
}

/**
 * Evaluates whether a candidate qualifies as an independent secondary intent.
 */
export function isEligibleSecondary(
  candidate: IntentCandidateDetail,
  primary: IntentCandidateDetail,
  context: ContextSummary
): boolean {
  if (candidate.intent === primary.intent) {
    return false;
  }

  // Minimum confidence threshold for secondary intents
  if (candidate.confidence < 0.65) {
    return false;
  }
  if (candidate.negativeEvidence > 0.4) {
    return false;
  }

  // Check relationship in compatibility matrix
  const relation = getCompatibilityRelation(primary.intent, candidate.intent);
  if (relation === CompatibilityRelation.MUTUALLY_EXCLUSIVE || relation === CompatibilityRelation.SUPPRESS_SECONDARY) {
    return false;
  }

  return true;
}

export function getResolvedSecondaries(
  candidates: IntentCandidateDetail[],
  primary: IntentCandidateDetail,
  context: ContextSummary
): Intent[] {
  const eligibleCandidates = candidates.filter((c) => isEligibleSecondary(c, primary, context));
  if (eligibleCandidates.length === 0) return [];

  // Domain-specific secondary intent priority maps
  const priorityOrderMap: Partial<Record<Intent, Intent[]>> = {
    [Intent.PRICE_REQUEST]: [
      Intent.PLAN_REQUEST,
      Intent.PRODUCT_CURIOUS,
      Intent.PURCHASE_INTENT,
      Intent.TRIAL_REQUEST,
      Intent.VPN_REQUEST,
      Intent.QUESTION,
    ],
    [Intent.TRIAL_REQUEST]: [
      Intent.PRODUCT_CURIOUS,
      Intent.PRICE_REQUEST,
      Intent.VPN_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.QUESTION,
    ],
    [Intent.VPN_REQUEST]: [
      Intent.PRICE_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.RELEVANT_NEED,
      Intent.PRODUCT_CURIOUS,
      Intent.PURCHASE_INTENT,
      Intent.SUPPORT_REQUEST,
    ],
    [Intent.RELEVANT_NEED]: [
      Intent.VPN_REQUEST,
      Intent.PRODUCT_CURIOUS,
      Intent.PRICE_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.SUPPORT_REQUEST,
    ],
    [Intent.PURCHASE_INTENT]: [
      Intent.PRICE_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.SUPPORT_REQUEST,
      Intent.VPN_REQUEST,
    ],
    [Intent.OBJECTION]: [
      Intent.PURCHASE_INTENT,
      Intent.PRICE_REQUEST,
      Intent.PRODUCT_CURIOUS,
      Intent.SUPPORT_REQUEST,
      Intent.TRIAL_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.QUESTION,
    ],
    [Intent.PLAN_REQUEST]: [
      Intent.PRODUCT_CURIOUS,
      Intent.PRICE_REQUEST,
      Intent.PURCHASE_INTENT,
      Intent.QUESTION,
      Intent.VPN_REQUEST,
    ],
    [Intent.SUPPORT_REQUEST]: [
      Intent.PURCHASE_INTENT,
      Intent.OBJECTION,
      Intent.PLAN_REQUEST,
      Intent.PRODUCT_CURIOUS,
      Intent.VPN_REQUEST,
      Intent.GREETING,
    ],
    [Intent.GOODBYE]: [
      Intent.SUPPORT_REQUEST,
      Intent.PURCHASE_INTENT,
      Intent.QUESTION,
      Intent.SMALL_TALK,
    ],
    [Intent.SUSPICION_BOT]: [
      Intent.GREETING,
      Intent.QUESTION,
      Intent.VPN_REQUEST,
      Intent.SMALL_TALK,
    ],
    [Intent.INAPPROPRIATE]: [
      Intent.SMALL_TALK,
      Intent.REJECTION,
      Intent.QUESTION,
      Intent.GREETING,
    ],
    [Intent.REJECTION]: [
      Intent.SMALL_TALK,
      Intent.OBJECTION,
      Intent.QUESTION,
    ],
  };

  const priorityList = priorityOrderMap[primary.intent];

  if (priorityList) {
    for (const intent of priorityList) {
      const found = eligibleCandidates.find((c) => c.intent === intent);
      if (found) {
        return [found.intent];
      }
    }
  }

  // Fallback: highest confidence eligible candidate
  eligibleCandidates.sort((a, b) => b.confidence - a.confidence);
  return eligibleCandidates.length > 0 ? [eligibleCandidates[0].intent] : [];
}

/**
 * Resolves the structured multi-intent candidate set into a primary intent and valid secondary intents.
 */
export function resolveMultiIntentSet(
  candidates: IntentCandidateDetail[],
  normText: string,
  context: ContextSummary
): {
  primary: IntentCandidateDetail;
  secondaries: Intent[];
  allReasonCodes: string[];
} {
  const allReasonCodes: string[] = [];

  if (candidates.length === 0) {
    const isShort = normText.length <= 4;
    const fallbackIntent = Intent.UNKNOWN;
    const reason = isShort ? 'SHORT_AMBIGUOUS_MARKER' : 'UNKNOWN_BY_INSUFFICIENT_EVIDENCE';
    const fallbackCandidate: IntentCandidateDetail = {
      intent: fallbackIntent,
      lexicalEvidence: 0.3,
      semanticEvidence: 0.2,
      contextualEvidence: 0.1,
      negativeEvidence: 0.0,
      actionability: 0.0,
      confidence: 0.60,
      reasonCodes: [reason],
      matchedPatterns: [],
    };
    return {
      primary: fallbackCandidate,
      secondaries: [],
      allReasonCodes: [reason],
    };
  }

  candidates.forEach((c) => {
    allReasonCodes.push(...c.reasonCodes);
  });

  // 1. SAFETY OVERRIDES (INAPPROPRIATE, SPAM)
  const inapp = candidates.find((c) => c.intent === Intent.INAPPROPRIATE);
  if (inapp && inapp.confidence >= 0.85) {
    const secondaries = getResolvedSecondaries(candidates, inapp, context);
    return {
      primary: inapp,
      secondaries,
      allReasonCodes: ['SAFETY_OVERRIDE_INAPPROPRIATE', ...inapp.reasonCodes],
    };
  }

  const spam = candidates.find((c) => c.intent === Intent.SPAM);
  if (spam && spam.confidence >= 0.85) {
    return {
      primary: spam,
      secondaries: [],
      allReasonCodes: ['SAFETY_OVERRIDE_SPAM', ...spam.reasonCodes],
    };
  }

  // 2. SHORT UNKNOWN OVERRIDE (e.g. "خب؟", "یعنی چی؟")
  const unknownCand = candidates.find((c) => c.intent === Intent.UNKNOWN && c.reasonCodes.includes('SHORT_UNKNOWN_OVERRIDE'));
  if (unknownCand) {
    const secondaries = getResolvedSecondaries(candidates, unknownCand, context);
    return {
      primary: unknownCand,
      secondaries,
      allReasonCodes: ['SHORT_UNKNOWN_OVERRIDE', ...unknownCand.reasonCodes],
    };
  }

  // 3. REJECTION vs DISCLAIMER WITH PRICE/PLAN QUERY
  const rejection = candidates.find((c) => c.intent === Intent.REJECTION);
  const priceCand = candidates.find((c) => c.intent === Intent.PRICE_REQUEST);
  const isDisclaimerWithPrice =
    rejection &&
    priceCand &&
    /(قصد خرید ندارم ولی|نمیخوام بخرم ولی|خریدار نیستم ولی|کنجکاو شدم.*(قیمت|چنده))/i.test(normText);

  if (isDisclaimerWithPrice) {
    return {
      primary: priceCand,
      secondaries: [Intent.REJECTION],
      allReasonCodes: ['ACTIONABLE_COMMERCIAL_OVERRIDE', ...priceCand.reasonCodes],
    };
  }

  if (rejection && rejection.confidence >= 0.75) {
    const secondaries = getResolvedSecondaries(candidates, rejection, context);
    return {
      primary: rejection,
      secondaries,
      allReasonCodes: ['REJECTION_SAFETY_OVERRIDE', ...rejection.reasonCodes],
    };
  }

  // 4. CONDITIONAL TRIAL vs OBJECTION / PURCHASE
  const objection = candidates.find((c) => c.intent === Intent.OBJECTION);
  const trial = candidates.find((c) => c.intent === Intent.TRIAL_REQUEST);
  const purchaseCand = candidates.find((c) => c.intent === Intent.PURCHASE_INTENT);
  if (
    trial &&
    (objection || purchaseCand) &&
    /(اگر.*تست|تست.*بدی.*امتحان|اولش تست|تست بدی شاید|تست خوب بدی|تست.*بفرست.*میخرم|تست بده.*واریز|اگه تست|میشه اول امتحان|اول امتحان|بدون تست خرید)/i.test(normText)
  ) {
    const secondary = purchaseCand ? Intent.PURCHASE_INTENT : Intent.OBJECTION;
    return {
      primary: trial,
      secondaries: [secondary],
      allReasonCodes: ['CONDITIONAL_TRIAL_OVERRIDE', ...trial.reasonCodes],
    };
  }

  // 5. STRONG OBJECTION (Price resistance, trust concern, failure concern, competitor comparison)
  const isPriceQueryWithDiscount = priceCand && /(قیمت نهایی|چقدر میشه|چند درمیاد|لیست قیمت|چقدر هست)/i.test(normText);
  const isSupportInquiry = /(به کی بگم|راهنمایی|ست کنه|وارد برنامه کنم|برام ست کنه)/i.test(normText);
  const isGuaranteeInquiry = /(تضمین.*(میدید|میدین|دارید)|گارانتی.*(میدید|دارید))/i.test(normText) && !/(نکنه.*(قطع|فیلتر)|پولمون بسوزه)/i.test(normText);
  if (objection && objection.confidence >= 0.80 && !isPriceQueryWithDiscount && !isSupportInquiry && !isGuaranteeInquiry) {
    const secondaries = getResolvedSecondaries(candidates, objection, context);
    return {
      primary: objection,
      secondaries,
      allReasonCodes: ['STRONG_OBJECTION_OVERRIDE', ...objection.reasonCodes],
    };
  }

  // 6. POSITIVE OFF-TOPIC EVIDENCE (Commodity/Macro economy/Non-VPN commerce traps)
  const offTopic = candidates.find((c) => c.intent === Intent.OFF_TOPIC);
  const questionCand = candidates.find((c) => c.intent === Intent.QUESTION);

  if (offTopic && offTopic.confidence >= 0.80 && offTopic.reasonCodes.includes('OFF_TOPIC_BY_POSITIVE_EVIDENCE')) {
    const secondaries = questionCand ? [Intent.QUESTION] : getResolvedSecondaries(candidates, offTopic, context);
    return {
      primary: offTopic,
      secondaries,
      allReasonCodes: ['OFF_TOPIC_POSITIVE_OVERRIDE', ...offTopic.reasonCodes],
    };
  }

  // 7. BOT SUSPICION
  const botSuspicion = candidates.find((c) => c.intent === Intent.SUSPICION_BOT);
  const vpnReq = candidates.find((c) => c.intent === Intent.VPN_REQUEST);
  const greetingCand = candidates.find((c) => c.intent === Intent.GREETING);
  if (botSuspicion && botSuspicion.confidence >= 0.85) {
    if (vpnReq && vpnReq.confidence >= 0.90) {
      return {
        primary: vpnReq,
        secondaries: [Intent.SUSPICION_BOT],
        allReasonCodes: ['ACTIONABLE_VPN_OVER_SUSPICION', ...vpnReq.reasonCodes],
      };
    }
    const secondaries = greetingCand ? [Intent.GREETING] : getResolvedSecondaries(candidates, botSuspicion, context);
    return {
      primary: botSuspicion,
      secondaries,
      allReasonCodes: ['BOT_SUSPICION_OVERRIDE', ...botSuspicion.reasonCodes],
    };
  }

  // 8. ACTIONABLE COMMERCIAL / PRODUCT INTENTS
  const isDelayedFarewell = /(اسکرین گرفتم.*پیام میدم|سر ماه.*پیام میدم|حقوق دادن پیام میدم|حقوق بدن پیام میدم|بعدا سر میزنم|بعدا پیام میدم|شب پیام میدم|پیام میدم|فعلاً بای|فعلا بای)/i.test(normText);

  // Fine-grained actionability adjustments for ambiguous candidate sets
  const vpnCand = candidates.find((c) => c.intent === Intent.VPN_REQUEST);
  const planCand = candidates.find((c) => c.intent === Intent.PLAN_REQUEST);
  const prodCuriousCand = candidates.find((c) => c.intent === Intent.PRODUCT_CURIOUS);
  const needCand = candidates.find((c) => c.intent === Intent.RELEVANT_NEED);
  const smallTalkCand = candidates.find((c) => c.intent === Intent.SMALL_TALK);

  // 8a. PLAN query over generic VPN inquiry
  if (vpnCand && planCand && /(دو کاربره|تک کاربره|چند کاربره|چند گیگ|چند گیگه|سالیانه|ماهانه|پلن|ترافیک|حجم)/i.test(normText) && !/(یه چیز قوی میخوام)/i.test(normText)) {
    planCand.actionability = 0.98;
    planCand.confidence = 0.96;
    vpnCand.actionability = 0.50;
  }

  // 8f. PLAN query vs PRICE query
  if (priceCand && planCand && /(چند گیگ|چند گیگه|چقدر حجم|چقدر ترافیک|چه شرایطی داره|شرایط پلن)/i.test(normText) && !/(چقدر میشه|چند تومن|چقدر درمیاد|قیمت چنده)/i.test(normText)) {
    planCand.actionability = 0.98;
    planCand.confidence = 0.96;
    priceCand.actionability = 0.60;
  } else if (priceCand && planCand && /(چقدر درمیاد|چقدر در میاد|چقدر میشه|چند تومن|قیمتش|آخرش چقدر|چند درمیاد)/i.test(normText)) {
    priceCand.actionability = 0.98;
    priceCand.confidence = 0.96;
    planCand.actionability = 0.60;
  }

  // 8b. Product feature / location question over generic VPN inquiry
  if (vpnCand && prodCuriousCand && /(سرور.*ایران|ایران.*سرور|سرورهای|برای بازی|لوکیشن|آیپی چه کشوری|مال کدوم کشور|تعویض کانفیگ|پنل‌های عمومی|پنل عمومی|سرور اختصاصی خودتونه)/i.test(normText) && !/بالاترین پهنای باند|یه چیز قوی میخوام/i.test(normText)) {
    prodCuriousCand.actionability = 0.95;
    prodCuriousCand.confidence = 0.95;
    vpnCand.actionability = 0.50;
  }
  if (vpnCand && prodCuriousCand && /(بالاترین پهنای باند|یه چیز قوی میخوام|یه فیلترشکن.*میخوام|یه vpn.*میخوام)/i.test(normText)) {
    vpnCand.actionability = 0.98;
    vpnCand.confidence = 0.98;
    prodCuriousCand.actionability = 0.50;
  }

  // 8c. Problem / Need state over Product Curiosity when statement describes network breakdown
  if (prodCuriousCand && needCand && /(قطعه|قطع شده|خرابه|باز نمیشن|وا نمیشن|وصل نمیشه|لود نمیشه|نمیشه|از کار افتاده|نمیتونم|کنده|بالا نمیاد|فیلترینگ شدید|ارور کانکشن|ارور|بسته میشه|درمونده|قطع میشن|نصب میکنم.*قطع|[آا]پلود میکنم ولی.*نمیشه|اپلود میکنم ولی.*نمیشه|[آا]موزش.*ببینم ولی|اموزش.*ببینم ولی)/i.test(normText) && !/(دارین|موجود دارین|میخوام بخرم|میخوام سفارش|چنده|چجوریه|چطوره)/i.test(normText)) {
    needCand.actionability = 0.92;
    needCand.confidence = 0.95;
    prodCuriousCand.actionability = 0.50;
  }

  if (needCand && smallTalkCand && /(vpn|فیلترشکن|نت|قطع|وصل|اینترنت|کانفیگ)/i.test(normText)) {
    needCand.actionability = 0.95;
    needCand.confidence = 0.95;
    smallTalkCand.actionability = 0.30;
    smallTalkCand.confidence = 0.30;
  }

  // 8d. Small Talk social questions vs Question
  if (smallTalkCand && questionCand) {
    if (/(خودت اهل کجایی|سلام دختری|باشگاه میری|حیوون|شام چی|فیلم دیدن|کد زدن|کجایی هستی|موزیک رپ|شغل رویاییت|رویاییت)/i.test(normText)) {
      questionCand.confidence = 0.95;
      questionCand.actionability = 0.95;
      smallTalkCand.actionability = 0.50;
    } else if (/(اصل میدی|من \d{1,2} سالمه|\d{1,2}\s+[آ-ی\s]{3,20}|چخبر|چ خبر|چه خبر|چطوری|خوبی)/i.test(normText)) {
      smallTalkCand.confidence = 0.95;
      smallTalkCand.actionability = 0.95;
      questionCand.actionability = 0.50;
    }
  }

  // Product Curious vs Question (technical spec questions)
  if (prodCuriousCand && questionCand && /(پینگ.*(چنده|معمولا|معمولاً)|سرعت.*[آا]پلود|سرعت.*اپلود|سرعتش چقدره|سرعت.*چقدره|کیفیتش چطوره|چند دستگاه)/i.test(normText)) {
    prodCuriousCand.confidence = 0.95;
    prodCuriousCand.actionability = 0.95;
    questionCand.actionability = 0.40;
  }

  // Objection vs Product Curious
  const objCand = candidates.find((c) => c.intent === Intent.OBJECTION);
  if (prodCuriousCand && objCand && /(تضمین.*(میدید|میدین|دارید)|گارانتی.*(میدید|دارید))/i.test(normText) && !/(نکنه.*(قطع|فیلتر)|پولمون بسوزه)/i.test(normText)) {
    prodCuriousCand.confidence = 0.95;
    prodCuriousCand.actionability = 0.95;
    objCand.actionability = 0.40;
  }

  // Trial vs Purchase / Question
  const trialCand = candidates.find((c) => c.intent === Intent.TRIAL_REQUEST);
  const purchCand = candidates.find((c) => c.intent === Intent.PURCHASE_INTENT);
  if (trialCand && purchCand && /(اگه تست|اول تست|تست.*(میدی|بفرست|بدی)|تست کنم)/i.test(normText)) {
    trialCand.confidence = 0.98;
    trialCand.actionability = 0.98;
    purchCand.actionability = 0.40;
  }
  if (trialCand && questionCand && /(تست.*(داری|میدی|میشه))/i.test(normText)) {
    trialCand.confidence = 0.95;
    trialCand.actionability = 0.95;
    questionCand.actionability = 0.30;
  }

  // Support vs Objection
  const suppCand = candidates.find((c) => c.intent === Intent.SUPPORT_REQUEST);
  if (suppCand && objCand && /(به کی بگم|راهنمایی|ست کنه|وارد برنامه کنم)/i.test(normText)) {
    suppCand.confidence = 0.95;
    suppCand.actionability = 0.95;
    objCand.actionability = 0.40;
  }

  // 8j. GOODBYE vs GREETING / SMALL_TALK
  const goodbyeCand = candidates.find((c) => c.intent === Intent.GOODBYE);
  if (goodbyeCand && greetingCand && /^سلام/i.test(normText)) {
    greetingCand.confidence = 0.98;
    greetingCand.actionability = 0.98;
    goodbyeCand.confidence = 0.10;
    goodbyeCand.actionability = 0.10;
  }

  if (goodbyeCand && (smallTalkCand || questionCand) && /(بعدا سر میزنم|برم ببینم|سر میزنم بهت)/i.test(normText)) {
    goodbyeCand.confidence = 0.95;
    goodbyeCand.actionability = 0.95;
  }

  // 8k. PRODUCT_CURIOUS over PLAN_REQUEST / VPN_REQUEST for location & feature inquiries
  if (prodCuriousCand && planCand && /(برای یوتیوب|یوتیوب|دو کاربره|سروراش بدون قطعیه)/i.test(normText)) {
    prodCuriousCand.confidence = 0.95;
    prodCuriousCand.actionability = 0.95;
    planCand.actionability = 0.50;
  }

  if (prodCuriousCand && vpnCand && /(آلمان یا فنلاند|آیپی ثابت|برای ترید)/i.test(normText)) {
    prodCuriousCand.confidence = 0.95;
    prodCuriousCand.actionability = 0.95;
    vpnCand.actionability = 0.50;
  }

  if (vpnCand && needCand && /فیلترشکن شما.*باز میکنه/i.test(normText)) {
    vpnCand.confidence = 0.95;
    vpnCand.actionability = 0.95;
    needCand.actionability = 0.50;
  }

  // 8g. BOT_SUSPICION over GREETING
  const botCand = candidates.find((c) => c.intent === Intent.SUSPICION_BOT);

  if (botCand && smallTalkCand && /فکر کردم/i.test(normText)) {
    smallTalkCand.confidence = 0.95;
    smallTalkCand.actionability = 0.95;
    botCand.actionability = 0.10;
  }

  if (botCand && greetingCand && /(ربات|رباتی|پشت سیستم|هوش مصنوعی)/i.test(normText)) {
    botCand.confidence = 0.98;
    botCand.actionability = 0.98;
    greetingCand.actionability = 0.20;
    greetingCand.confidence = 0.20;
  }

  // 8h. PLAN_REQUEST over PRICE_REQUEST when user asks for plan conditions
  if (priceCand && planCand && /(شرایط پلن|شرایط پلن ها|پلن ها و قیمت|بسته ها)/i.test(normText)) {
    planCand.actionability = 0.98;
    planCand.confidence = 0.96;
    priceCand.actionability = 0.50;
    priceCand.confidence = 0.50;
  }

  // 8i. SUPPORT_REQUEST over REJECTION when phrase has preamble like "نمیخوام بگم"
  const rejCand = candidates.find((c) => c.intent === Intent.REJECTION);
  const suppReq = candidates.find((c) => c.intent === Intent.SUPPORT_REQUEST);
  if (rejCand && (suppReq || needCand) && /(نمیخوام بگم|فقط سرعتم|سرعتم پایینه)/i.test(normText)) {
    rejCand.actionability = 0.0;
    if (suppReq) {
      suppReq.actionability = 0.95;
      suppReq.confidence = 0.95;
    }
  }

  // 8e. Tutorial / guide questions as Question over Product Curiosity
  if (prodCuriousCand && questionCand && /(آموزش|چجوری وارد|چجوری ست|چطور وارد)/i.test(normText) && !/(خرید|قیمت|تست|اکانت)/i.test(normText)) {
    questionCand.confidence = 0.95;
    questionCand.actionability = 0.95;
    prodCuriousCand.confidence = 0.50;
    prodCuriousCand.actionability = 0.30;
  }

  const sortedActionable = [...candidates].sort((a, b) => {
    if (Math.abs(b.actionability - a.actionability) > 0.15) {
      return b.actionability - a.actionability;
    }
    return b.confidence - a.confidence;
  });

  const topCommercial = sortedActionable.find((c) =>
    [
      Intent.SUPPORT_REQUEST,
      Intent.PURCHASE_INTENT,
      Intent.PRICE_REQUEST,
      Intent.PLAN_REQUEST,
      Intent.TRIAL_REQUEST,
      Intent.VPN_REQUEST,
      Intent.RELEVANT_NEED,
      Intent.PRODUCT_CURIOUS,
    ].includes(c.intent) && c.confidence >= 0.75
  );

  if (topCommercial && !isDelayedFarewell) {
    // If product curious triggered purely by tech occupation mention without commercial inquiry
    const smallTalkCand = candidates.find((c) => c.intent === Intent.SMALL_TALK);
    const isSelfOccupationOnly =
      topCommercial.intent === Intent.PRODUCT_CURIOUS &&
      smallTalkCand &&
      /(من مهندس.*هستم|شغلم|کارم.*(هست|است)|کار میکنم|دانشجوی)/i.test(normText) &&
      !/(داری|میدی|چنده|چند درمیاد|میخوام|تست|پلن|اکانت|اشتراک|چی داری|چجوریه|چطوریه)/i.test(normText);

    if (!isSelfOccupationOnly) {
      const secondaries = getResolvedSecondaries(candidates, topCommercial, context);
      return {
        primary: topCommercial,
        secondaries,
        allReasonCodes: ['ACTIONABLE_COMMERCIAL_OVERRIDE', ...topCommercial.reasonCodes],
      };
    }
  }

  // 9. GOODBYE / FAREWELL
  const goodbye = candidates.find((c) => c.intent === Intent.GOODBYE);
  if (goodbye && goodbye.confidence >= 0.85) {
    const secondaries = getResolvedSecondaries(candidates, goodbye, context);
    return {
      primary: goodbye,
      secondaries,
      allReasonCodes: ['GOODBYE_OVERRIDE', ...goodbye.reasonCodes],
    };
  }

  // 10. GREETING WITH PHATIC CHECK-IN (e.g. "سلام چطوری", "سلااام شب خوش، احوال شما؟")
  const greeting = candidates.find((c) => c.intent === Intent.GREETING);
  const isAslProfile = /(^\s*(سلام|درود|هلو)?\s*\d{1,2}\s+[آ-ی\s]{3,20}|کارمند|دانشجو|شاغل)/i.test(normText);
  const isGreetingOpening =
    !isAslProfile &&
    /^(سلام|درود|هلو|hi|slm|hello|وقت بخیر|صبح بخیر|شب بخیر|شبت بخیر|روز خوش|سلااام|سلاام)/i.test(
      normText.trim()
    );

  if (greeting && isGreetingOpening && greeting.confidence >= 0.85) {
    const secondaries = getResolvedSecondaries(candidates, greeting, context);
    return {
      primary: greeting,
      secondaries,
      allReasonCodes: ['GREETING_OPENING_PRIMARY', ...greeting.reasonCodes],
    };
  }

  // 11. SPECIFIC GENERAL QUESTION (Asking about user/lifestyle: "پادکست چی گوش میدی", "اهل فیلم هستی؟")
  const smallTalk = candidates.find((c) => c.intent === Intent.SMALL_TALK);
  if (questionCand && questionCand.confidence >= 0.75) {
    const isNameQuery = /(اسم شما|اسمت) چیه/i.test(normText);
    const isDirectInterrogativeQuestion =
      !isNameQuery &&
      /(چی گوش میدی|چه پادکستی|چه فیلمی|اهل موزیک|باشگاه میری|حیوون خونگی|چی خوردی|اهل کد زدن|پایتون کار میکنی|دختری یا پسر|چند میشه|تو شهر شما چطوره|اهل فیلم|پیشنهاد بدی|دانشگاه رفتی|اهل کجایی|چه فیلم|شهریه دانشگاه|تست رانندگی|بهترین .* چیه|رفتی یا .* خوندی|چیه\?|چیه؟)/i.test(
        normText
      );
    if (isDirectInterrogativeQuestion) {
      const secondaries = getResolvedSecondaries(candidates, questionCand, context);
      return {
        primary: questionCand,
        secondaries,
        allReasonCodes: ['SPECIFIC_QUESTION_PRIMARY', ...questionCand.reasonCodes],
      };
    }
  }

  // 12. SMALL TALK (Personal sharing, routine, occupation, hobby)
  if (smallTalk && smallTalk.confidence >= 0.75) {
    const secondaries = getResolvedSecondaries(candidates, smallTalk, context);
    return {
      primary: smallTalk,
      secondaries,
      allReasonCodes: ['SMALL_TALK_PRIMARY', ...smallTalk.reasonCodes],
    };
  }

  // 13. GENERAL QUESTION
  if (questionCand && questionCand.confidence >= 0.75) {
    const secondaries = getResolvedSecondaries(candidates, questionCand, context);
    return {
      primary: questionCand,
      secondaries,
      allReasonCodes: ['GENERAL_QUESTION_PRIMARY', ...questionCand.reasonCodes],
    };
  }

  // 14. GREETING FALLBACK
  if (greeting) {
    const secondaries = getResolvedSecondaries(candidates, greeting, context);
    return {
      primary: greeting,
      secondaries,
      allReasonCodes: ['GREETING_FALLBACK', ...greeting.reasonCodes],
    };
  }

  // 15. TOP REMAINING CANDIDATE
  const primary = sortedActionable[0];
  const secondaries = getResolvedSecondaries(candidates, primary, context);

  return {
    primary,
    secondaries,
    allReasonCodes,
  };
}
