import { Intent, LeadScoreFactor } from '../types';

export interface ScoreUpdateResult {
  newScore: number;
  delta: number;
  reason: string;
  factor?: LeadScoreFactor;
  isDeduplicated: boolean;
  scoreClassification: 'COLD' | 'WARM' | 'HOT';
}

interface ScoreCategoryRule {
  points: number;
  maxTotalPointsForCategory: number;
  description: string;
}

const SCORE_RULES: Partial<Record<Intent, ScoreCategoryRule>> = {
  [Intent.GREETING]: {
    points: 5,
    maxTotalPointsForCategory: 10,
    description: 'سلام و احوال‌پرسی اولیه',
  },
  [Intent.SMALL_TALK]: {
    points: 10,
    maxTotalPointsForCategory: 20,
    description: 'گپ و گفت صمیمی و تبادل مشخصات',
  },
  [Intent.QUESTION]: {
    points: 5,
    maxTotalPointsForCategory: 15,
    description: 'پرسیدن سوال و تعامل فعال',
  },
  [Intent.RELEVANT_NEED]: {
    points: 25,
    maxTotalPointsForCategory: 25,
    description: 'ابراز مشکل اینترنت و فیلترینگ',
  },
  [Intent.VPN_REQUEST]: {
    points: 35,
    maxTotalPointsForCategory: 35,
    description: 'درخواست صریح فیلترشکن / وی‌پی‌ان',
  },
  [Intent.PRODUCT_CURIOUS]: {
    points: 30,
    maxTotalPointsForCategory: 30,
    description: 'کنجکاوی درباره مشخصات فنی سرویس',
  },
  [Intent.TRIAL_REQUEST]: {
    points: 40,
    maxTotalPointsForCategory: 40,
    description: 'درخواست اکانت تست رایگان',
  },
  [Intent.PRICE_REQUEST]: {
    points: 45,
    maxTotalPointsForCategory: 45,
    description: 'استعلام قیمت و تعرفه پلن‌ها',
  },
  [Intent.PLAN_REQUEST]: {
    points: 40,
    maxTotalPointsForCategory: 40,
    description: 'پرسش درباره انواع پلن‌ها و حجم',
  },
  [Intent.SUPPORT_REQUEST]: {
    points: 50,
    maxTotalPointsForCategory: 50,
    description: 'درخواست آیدی پشتیبانی و لینک خرید',
  },
  [Intent.PURCHASE_INTENT]: {
    points: 60,
    maxTotalPointsForCategory: 60,
    description: 'قصد خرید قطعی و درخواست واریز',
  },
  [Intent.OBJECTION]: {
    points: -5,
    maxTotalPointsForCategory: -15,
    description: 'ایراد و اعتراض به قیمت یا اعتماد',
  },
  [Intent.REJECTION]: {
    points: -50,
    maxTotalPointsForCategory: -50,
    description: 'رد صریح پیشنهاد و عدم تمایل',
  },
  [Intent.INAPPROPRIATE]: {
    points: -100,
    maxTotalPointsForCategory: -100,
    description: 'الفاظ رکیک یا رفتار نامناسب',
  },
  [Intent.SPAM]: {
    points: -100,
    maxTotalPointsForCategory: -100,
    description: 'اسپم یا تبلیغات ربات',
  },
};

/**
 * Calculates lead score update with strict deduplication
 */
export function calculateLeadScoreUpdate(
  currentScore: number,
  intent: Intent,
  existingFactors: LeadScoreFactor[] = [],
  turn: number = 1
): ScoreUpdateResult {
  const safeScore = Number.isFinite(currentScore) ? currentScore : 0;
  const rule = SCORE_RULES[intent];
  if (!rule) {
    return {
      newScore: safeScore,
      delta: 0,
      reason: 'No score rule for intent',
      isDeduplicated: true,
      scoreClassification: getScoreClassification(safeScore),
    };
  }

  // Calculate existing accumulated points for this specific intent
  const currentCategoryPoints = existingFactors
    .filter((f) => f.intent === intent)
    .reduce((sum, f) => sum + f.points, 0);

  let delta = 0;

  if (rule.points > 0) {
    // Positive scoring category
    const remainingCap = Math.max(0, rule.maxTotalPointsForCategory - currentCategoryPoints);
    delta = Math.min(rule.points, remainingCap);
  } else {
    // Negative scoring category
    const remainingCap = Math.min(0, rule.maxTotalPointsForCategory - currentCategoryPoints);
    delta = Math.max(rule.points, remainingCap);
  }

  if (delta === 0) {
    return {
      newScore: safeScore,
      delta: 0,
      reason: `سقف امتیاز رده (${rule.description}) قبلاً تکمیل شده است (Deduplicated)`,
      isDeduplicated: true,
      scoreClassification: getScoreClassification(safeScore),
    };
  }

  const boundedScore = Math.max(0, Math.min(100, safeScore + delta));

  const factor: LeadScoreFactor = {
    intent,
    points: delta,
    reason: rule.description,
    turn,
    timestamp: new Date().toISOString(),
  };

  return {
    newScore: boundedScore,
    delta,
    reason: rule.description,
    factor,
    isDeduplicated: false,
    scoreClassification: getScoreClassification(boundedScore),
  };
}

export function getScoreClassification(score: number): 'COLD' | 'WARM' | 'HOT' {
  if (score >= 56) return 'HOT';
  if (score >= 26) return 'WARM';
  return 'COLD';
}
