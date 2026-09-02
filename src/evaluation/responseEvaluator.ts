import { Intent, ConversationState, PromotionLevel } from '../types';
import { ConversationTurnTrace, ResponseEvaluationMetrics } from './evaluationTypes';

export interface ResponseScoreResult {
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
  reasoning: string;
  detectedErrors: string[];
}

/**
 * Deterministic & Rule-based Response Quality Evaluator
 * Evaluates generated or mock response text against 9 core conversational dimensions.
 */
export function scoreResponseQuality(
  response: string,
  userMessage: string,
  intent: Intent,
  state: ConversationState,
  promotionLevel: PromotionLevel,
  promotionLock: boolean
): ResponseScoreResult {
  const text = (response || '').trim();
  const errors: string[] = [];

  let relevance = 2;
  let contextContinuity = 2;
  let naturalness = 2;
  let conciseness = 2;
  let salesAppropriateness = 2;
  let questionAnswered = 2;
  let repetition = 2;
  let tone = 2;
  let unsupportedClaims = 2;

  // 1. Length & Conciseness
  if (text.length > 280) {
    conciseness = 0;
    errors.push('TOO_LONG');
  } else if (text.length > 180) {
    conciseness = 1;
  } else if (text.length < 5) {
    conciseness = 0;
    errors.push('TOO_SHORT');
  }

  // 2. Robotic Tone & Prefixes
  const roboticPatterns = /(به عنوان یک هوش مصنوعی|من یک بات هستم|در پاسخ به پیام شما|پاسخ:|جواب:|سیستم:|درخواست شما دریافت شد)/i;
  if (roboticPatterns.test(text)) {
    tone = 0;
    naturalness = 0;
    errors.push('ROBOTIC_TONE');
    errors.push('NATURALNESS_FAILURE');
  }

  // 3. Fake Personal Experience & Clichés
  if (/(من خودم چند سال پیش وقتی با همسرم|وقتی رفتم دانشگاه هاروارد)/i.test(text)) {
    unsupportedClaims = 0;
    naturalness = 1;
    errors.push('FAKE_PERSONAL_EXPERIENCE');
  }

  // 4. Sales Appropriateness & Promotion Lock Violation
  const promotionalTerms = /(فیلترشکن|وی\s*پی\s*ان|vpn|کانفیگ|سرور|خرید|تعرفه|تومان|تست رایگان|پشتیبانی|آیدی|@\w+)/i;
  const containsPromo = promotionalTerms.test(text);

  if (promotionLock && containsPromo) {
    salesAppropriateness = 0;
    relevance = 0;
    errors.push('OVERSELLING');
    errors.push('UNNATURAL_PRODUCT_PITCH');
  } else if (promotionLevel === PromotionLevel.NO_PROMOTION && containsPromo) {
    salesAppropriateness = 0;
    errors.push('PREMATURE_PRODUCT_PITCH');
  } else if (
    (promotionLevel === PromotionLevel.SOFT_MENTION || promotionLevel === PromotionLevel.DIRECT_OFFER) &&
    !containsPromo &&
    (intent === Intent.VPN_REQUEST || intent === Intent.PRICE_REQUEST)
  ) {
    salesAppropriateness = 1;
    errors.push('MISSED_OPPORTUNITY');
  }

  // 5. Question Handling
  if (userMessage.includes('?') || userMessage.includes('؟') || userMessage.includes('کجا') || userMessage.includes('چند')) {
    if (intent === Intent.PRICE_REQUEST && !/(تومان|هزار|ماهانه|تعرفه|قیمت)/i.test(text)) {
      questionAnswered = 0;
      relevance = 1;
      errors.push('QUESTION_IGNORED');
    }
  }

  // 6. Objection Response
  if (intent === Intent.OBJECTION) {
    if (salesAppropriateness < 2 || !/(تست|کیفیت|پشتیبانی|ضمانت|حق داری|کاملا درکت میکنم|نگران نباش)/i.test(text)) {
      // Not an empathetic objection handling
      if (containsPromo && !/(تست|امتحان|خیالت)/i.test(text)) {
        errors.push('BAD_OBJECTION_RESPONSE');
      }
    }
  }

  // 7. Goodbye Response
  if (intent === Intent.GOODBYE) {
    if (containsPromo) {
      salesAppropriateness = 0;
      errors.push('BAD_GOODBYE');
    }
    if (!/(خوشحال شدم|قربانت|شبت|فعلا|بای|مراقب|خدافظ|خداحافظ)/i.test(text)) {
      contextContinuity = 1;
    }
  }

  // Compute Total Score
  const totalSum =
    relevance +
    contextContinuity +
    naturalness +
    conciseness +
    salesAppropriateness +
    questionAnswered +
    repetition +
    tone +
    unsupportedClaims;
  const maxPossible = 9 * 2; // 18
  const totalScorePercent = Math.round((totalSum / maxPossible) * 100);

  let reasoning = 'Response satisfies conversational and policy guidelines.';
  if (errors.length > 0) {
    reasoning = `Issues detected: ${errors.join(', ')}`;
  }

  return {
    relevance,
    contextContinuity,
    naturalness,
    conciseness,
    salesAppropriateness,
    questionAnswered,
    repetition,
    tone,
    unsupportedClaims,
    totalScorePercent,
    reasoning,
    detectedErrors: errors,
  };
}

/**
 * Aggregates Response Metrics across all evaluated traces
 */
export function evaluateResponses(traces: ConversationTurnTrace[]): ResponseEvaluationMetrics {
  let count = 0;
  let sumRel = 0;
  let sumCont = 0;
  let sumNat = 0;
  let sumConc = 0;
  let sumSales = 0;
  let sumQues = 0;
  let sumRep = 0;
  let sumTone = 0;
  let sumUnsupp = 0;

  let roboticToneCount = 0;
  let contextBreakCount = 0;
  let unsupportedClaimCount = 0;
  let oversellingCount = 0;
  let missedOpportunityCount = 0;

  const errorCategoryCounts: Record<string, number> = {
    NATURALNESS_FAILURE: 0,
    ROBOTIC_TONE: 0,
    TOO_LONG: 0,
    TOO_SHORT: 0,
    CONTEXT_BREAK: 0,
    QUESTION_IGNORED: 0,
    UNNECESSARY_QUESTION: 0,
    REPETITION: 0,
    UNNATURAL_PRODUCT_PITCH: 0,
    PREMATURE_PRODUCT_PITCH: 0,
    OVERSELLING: 0,
    MISSED_OPPORTUNITY: 0,
    UNSUPPORTED_CLAIM: 0,
    FAKE_PERSONAL_EXPERIENCE: 0,
    BAD_OBJECTION_RESPONSE: 0,
    BAD_GOODBYE: 0,
  };

  traces.forEach((trace) => {
    if (!trace.responseScores) {
      // Calculate score if not already attached
      const score = scoreResponseQuality(
        trace.generatedResponse,
        trace.userMessage,
        trace.primaryIntent,
        trace.nextState,
        trace.promotionLevel,
        trace.promotionLock
      );
      trace.responseScores = score;
      score.detectedErrors.forEach((err) => {
        if (!trace.errorCategories.includes(err)) {
          trace.errorCategories.push(err);
        }
      });
    }

    count++;
    const s = trace.responseScores;
    sumRel += s.relevance;
    sumCont += s.contextContinuity;
    sumNat += s.naturalness;
    sumConc += s.conciseness;
    sumSales += s.salesAppropriateness;
    sumQues += s.questionAnswered;
    sumRep += s.repetition;
    sumTone += s.tone;
    sumUnsupp += s.unsupportedClaims;

    trace.errorCategories.forEach((err) => {
      if (errorCategoryCounts[err] !== undefined) {
        errorCategoryCounts[err]++;
      }
      if (err === 'ROBOTIC_TONE') roboticToneCount++;
      if (err === 'CONTEXT_BREAK') contextBreakCount++;
      if (err === 'UNSUPPORTED_CLAIM' || err === 'FAKE_PERSONAL_EXPERIENCE') unsupportedClaimCount++;
      if (err === 'OVERSELLING') oversellingCount++;
      if (err === 'MISSED_OPPORTUNITY') missedOpportunityCount++;
    });
  });

  const avg = (sum: number) => (count > 0 ? Number((sum / count).toFixed(2)) : 0);
  const avgRel = avg(sumRel);
  const avgCont = avg(sumCont);
  const avgNat = avg(sumNat);
  const avgConc = avg(sumConc);
  const avgSales = avg(sumSales);
  const avgQues = avg(sumQues);
  const avgRep = avg(sumRep);
  const avgTone = avg(sumTone);
  const avgUnsupp = avg(sumUnsupp);

  const overallAverageQuality = Number(
    ((avgRel + avgCont + avgNat + avgConc + avgSales + avgQues + avgRep + avgTone + avgUnsupp) / 9).toFixed(2)
  );
  const overallPercentage = Math.round((overallAverageQuality / 2) * 100);

  return {
    totalResponsesEvaluated: count,
    averageScores: {
      relevance: avgRel,
      contextContinuity: avgCont,
      naturalness: avgNat,
      conciseness: avgConc,
      salesAppropriateness: avgSales,
      questionAnswered: avgQues,
      repetition: avgRep,
      tone: avgTone,
      unsupportedClaims: avgUnsupp,
      overallAverageQuality,
      overallPercentage,
    },
    roboticToneCount,
    contextBreakCount,
    unsupportedClaimCount,
    oversellingCount,
    missedOpportunityCount,
    errorCategoryCounts,
  };
}
