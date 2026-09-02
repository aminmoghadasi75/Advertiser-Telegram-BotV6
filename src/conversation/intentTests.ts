import { Intent } from '../types';
import { detectIntent, detectIntentDetailed } from './intentEngine';
import { normalizePersianText, tokenizePersianText } from './normalizer';

export interface IntentTestCase {
  id: string;
  category: string;
  description: string;
  input: string;
  history?: Array<{ sender: string; text: string }>;
  expectedPrimary: Intent;
  expectedSecondary?: Intent[];
  forbiddenIntents?: Intent[];
  minConfidence?: number;
}

export const INTENT_TEST_SUITE: IntentTestCase[] = [
  // -------------------------------------------------------------
  // Group A: Direct Intent Detection Tests
  // -------------------------------------------------------------
  {
    id: 'DIR_01',
    category: 'Direct Intent',
    description: 'Direct greeting with informal style',
    input: 'سلام چطوری؟ خوبی؟',
    expectedPrimary: Intent.GREETING,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_02',
    category: 'Direct Intent',
    description: 'Direct price inquiry for VPN',
    input: 'قیمت وی پی انت چنده؟',
    expectedPrimary: Intent.PRICE_REQUEST,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_03',
    category: 'Direct Intent',
    description: 'Direct trial request',
    input: 'اکانت تست رایگان میدی امتحان کنم؟',
    expectedPrimary: Intent.TRIAL_REQUEST,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_04',
    category: 'Direct Intent',
    description: 'Direct support request for admin id',
    input: 'آیدی ادمین رو بده پیام بدم برای خرید',
    expectedPrimary: Intent.SUPPORT_REQUEST,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_05',
    category: 'Direct Intent',
    description: 'Direct purchase intent with card request',
    input: 'شماره کارت بده الان واریز کنم برام فعال کن',
    expectedPrimary: Intent.PURCHASE_INTENT,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_06',
    category: 'Direct Intent',
    description: 'Direct VPN request for specific platform',
    input: 'فیلترشکن خوب برای تلگرام داری؟',
    expectedPrimary: Intent.VPN_REQUEST,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_07',
    category: 'Direct Intent',
    description: 'Direct objection regarding high price',
    input: 'خیلی گرونه بابا همه کانالا ارزونتر میدن',
    expectedPrimary: Intent.OBJECTION,
    minConfidence: 0.85,
  },
  {
    id: 'DIR_08',
    category: 'Direct Intent',
    description: 'Direct explicit rejection',
    input: 'نمیخوام تبلیغ نکن اسپم نکن',
    expectedPrimary: Intent.REJECTION,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_09',
    category: 'Direct Intent',
    description: 'Direct bot accusation',
    input: 'تو هوش مصنوعی یا رباتی؟',
    expectedPrimary: Intent.SUSPICION_BOT,
    minConfidence: 0.9,
  },
  {
    id: 'DIR_10',
    category: 'Direct Intent',
    description: 'Direct relevant need description',
    input: 'اینستاگرام کلا قطعه نمیتونم استوری آپلود کنم',
    expectedPrimary: Intent.RELEVANT_NEED,
    minConfidence: 0.85,
  },

  // -------------------------------------------------------------
  // Group B: Multi-Intent & Conflict Resolution Tests
  // -------------------------------------------------------------
  {
    id: 'MULTI_01',
    category: 'Multi-Intent',
    description: 'Greeting combined with price request',
    input: 'سلام قیمت وی پی انت چنده؟',
    expectedPrimary: Intent.PRICE_REQUEST,
    expectedSecondary: [Intent.GREETING],
    forbiddenIntents: [Intent.QUESTION, Intent.OFF_TOPIC],
  },
  {
    id: 'MULTI_02',
    category: 'Multi-Intent',
    description: 'Greeting combined with VPN request',
    input: 'سلام کانفیگ vless اختصاصی داری؟',
    expectedPrimary: Intent.VPN_REQUEST,
    expectedSecondary: [Intent.GREETING],
  },
  {
    id: 'MULTI_03',
    category: 'Multi-Intent',
    description: 'Support request with purchase intent',
    input: 'اوکی میخوامش، آیدی رو بده پیام بدم',
    expectedPrimary: Intent.SUPPORT_REQUEST,
    expectedSecondary: [Intent.PURCHASE_INTENT],
  },
  {
    id: 'MULTI_04',
    category: 'Multi-Intent',
    description: 'Bot suspicion with explicit product request',
    input: 'تو رباتی؟ راستی فیلترشکن خوب داری برام بفرستی؟',
    expectedPrimary: Intent.VPN_REQUEST,
    expectedSecondary: [Intent.SUSPICION_BOT],
  },
  {
    id: 'MULTI_05',
    category: 'Multi-Intent',
    description: 'Objection combined with conditional trial interest',
    input: 'خودم VPN دارم ولی اگر تست خوب بدی شاید امتحان کنم',
    expectedPrimary: Intent.TRIAL_REQUEST,
    expectedSecondary: [Intent.OBJECTION],
  },
  {
    id: 'MULTI_06',
    category: 'Multi-Intent',
    description: 'Price question immediately cancelled by rejection',
    input: 'قیمتش چنده؟ نه ولش کن نمیخوام اصلا',
    expectedPrimary: Intent.REJECTION,
    expectedSecondary: [Intent.PRICE_REQUEST],
  },
  {
    id: 'MULTI_07',
    category: 'Multi-Intent',
    description: 'Non-purchase disclaimer with price inquiry',
    input: 'نه قصد خرید ندارم ولی قیمتش چنده کنجکاو شدم؟',
    expectedPrimary: Intent.PRICE_REQUEST,
  },

  // -------------------------------------------------------------
  // Group C: Normalization & Slang Robustness Tests
  // -------------------------------------------------------------
  {
    id: 'NORM_01',
    category: 'Normalization',
    description: 'Elongated characters and Arabic Yeh/Kaf',
    input: 'سلااااام خوبیییی؟ قيمت وي پي ان چنده؟',
    expectedPrimary: Intent.PRICE_REQUEST,
  },
  {
    id: 'NORM_02',
    category: 'Normalization',
    description: 'Persian numerals and colloquial pricing syntax',
    input: 'اشتراک ۱ ماهه چندتومنه؟',
    expectedPrimary: Intent.PRICE_REQUEST,
  },
  {
    id: 'NORM_03',
    category: 'Normalization',
    description: 'Informal short ASL opening',
    input: 'سلام ۲۳ شیراز',
    expectedPrimary: Intent.SMALL_TALK,
  },
  {
    id: 'NORM_04',
    category: 'Normalization',
    description: 'Zero-width space and informal spelling for support handle',
    input: 'آيدی‌شو داری برای خرید؟',
    expectedPrimary: Intent.SUPPORT_REQUEST,
  },

  // -------------------------------------------------------------
  // Group D: Safety & Security Tests
  // -------------------------------------------------------------
  {
    id: 'SAFE_01',
    category: 'Safety',
    description: 'Inappropriate language with greeting',
    input: 'سلام کونی سیکتیر کن',
    expectedPrimary: Intent.INAPPROPRIATE,
  },
  {
    id: 'SAFE_02',
    category: 'Safety',
    description: 'Telegram link spam',
    input: 'سلام عضو کانال ما شو t.me/free_proxy_fast',
    expectedPrimary: Intent.SPAM,
  },

  // -------------------------------------------------------------
  // Group E: Residual Goodbye / Delayed Exit Tests
  // -------------------------------------------------------------
  {
    id: 'EXIT_01',
    category: 'Goodbye & Exit',
    description: 'Delayed support contact message',
    input: 'اسکرین گرفتم از آیدی، شب پیام میدم بهشون',
    expectedPrimary: Intent.GOODBYE,
  },
  {
    id: 'EXIT_02',
    category: 'Goodbye & Exit',
    description: 'Goodbye with reason and polite closing',
    input: 'من برم دوش بگیرم خستگیم در بره فعلا',
    expectedPrimary: Intent.GOODBYE,
  },
  {
    id: 'EXIT_03',
    category: 'Goodbye & Exit',
    description: 'Work exit and short farewell',
    input: 'باشه بعد از ظهر میام پیام میدم الان سر کارم',
    expectedPrimary: Intent.GOODBYE,
  },

  // -------------------------------------------------------------
  // Group F: Generalization & Root Cause Regression Tests
  // -------------------------------------------------------------
  {
    id: 'GEN_BENIGN_01',
    category: 'Safety Generalization',
    description: 'Benign word podcast should not trigger inappropriate filter',
    input: 'معمولا چه پادکست‌هایی گوش میدی تو وقت‌های آزادت؟',
    expectedPrimary: Intent.QUESTION,
    forbiddenIntents: [Intent.INAPPROPRIATE],
  },
  {
    id: 'GEN_BENIGN_02',
    category: 'Safety Generalization',
    description: 'Benign word proxy should not trigger inappropriate filter',
    input: 'پروکسی تلگرام با سرعت بالا و پینگ خوب سراغ داری؟',
    expectedPrimary: Intent.VPN_REQUEST,
    forbiddenIntents: [Intent.INAPPROPRIATE],
  },
  {
    id: 'GEN_BENIGN_03',
    category: 'Safety Generalization',
    description: 'Benign word photo with need should not trigger inappropriate filter',
    input: 'اینترنت ایرانسل خیلی کند شده عکسا تو تلگرام باز نمیشن',
    expectedPrimary: Intent.RELEVANT_NEED,
    forbiddenIntents: [Intent.INAPPROPRIATE],
  },
  {
    id: 'GEN_PLAN_01',
    category: 'Plan Request Generalization',
    description: 'Duration and tier inquiry should trigger PLAN_REQUEST',
    input: 'چه مدل اشتراک‌هایی دارین؟ مثلا ۶ ماهه هم موجوده؟',
    expectedPrimary: Intent.PLAN_REQUEST,
  },
  {
    id: 'GEN_PLAN_02',
    category: 'Plan Request Generalization',
    description: 'Volume type inquiry should trigger PLAN_REQUEST',
    input: 'اشتراک نامحدود هم دارین یا فقط حجم معین ارائه میدین؟',
    expectedPrimary: Intent.PLAN_REQUEST,
  },
  {
    id: 'GEN_PLAN_03',
    category: 'Plan Request Generalization',
    description: 'Multi-user family tier inquiry should trigger PLAN_REQUEST',
    input: 'اشتراک خانوادگی یا ۳ کاربره هم دارین که استفاده کنیم؟',
    expectedPrimary: Intent.PLAN_REQUEST,
  },
  {
    id: 'GEN_TRAP_01',
    category: 'Commercial Gating',
    description: 'Gold price query is off topic not VPN price request',
    input: 'قیمت سکه و انس جهانی طلا امروز چقدر شد؟',
    expectedPrimary: Intent.OFF_TOPIC,
    forbiddenIntents: [Intent.PRICE_REQUEST],
  },
  {
    id: 'GEN_TRAP_02',
    category: 'Commercial Gating',
    description: 'University tuition query is question not VPN price request',
    input: 'شهریه دانشگاه برای رشته حسابداری ترمی چقدر میشه؟',
    expectedPrimary: Intent.QUESTION,
    forbiddenIntents: [Intent.PRICE_REQUEST],
  },
  {
    id: 'GEN_TRAP_03',
    category: 'Commercial Gating',
    description: 'Driving license test query is question not VPN trial request',
    input: 'امتحان رانندگی آیین‌نامه رو بار اول قبول شدی؟',
    expectedPrimary: Intent.QUESTION,
    forbiddenIntents: [Intent.TRIAL_REQUEST],
  },
  {
    id: 'GEN_GOODBYE_01',
    category: 'Goodbye Disambiguation',
    description: 'Price question with bayad should not be classified as goodbye',
    input: 'ماهانه چقدر هزینه اشتراکش میشه؟',
    expectedPrimary: Intent.PRICE_REQUEST,
    forbiddenIntents: [Intent.GOODBYE],
  },
  {
    id: 'GEN_GOODBYE_02',
    category: 'Goodbye Disambiguation',
    description: 'Payment question with variz konim should not be goodbye',
    input: 'چند هزار تومان باید پرداخت کنیم برای اشتراک یک ماهه؟',
    expectedPrimary: Intent.PRICE_REQUEST,
    forbiddenIntents: [Intent.GOODBYE],
  },
  {
    id: 'GEN_UNKNOWN_01',
    category: 'Unknown Boundary',
    description: 'Short ambiguous expression should be UNKNOWN',
    input: 'خب؟',
    expectedPrimary: Intent.UNKNOWN,
  },
  {
    id: 'GEN_UNKNOWN_02',
    category: 'Unknown Boundary',
    description: 'Short clarification question should be UNKNOWN',
    input: 'یعنی چی؟',
    expectedPrimary: Intent.UNKNOWN,
  },
  {
    id: 'GEN_CORRECTION_01',
    category: 'Clarification & Correction',
    description: 'User correction regarding greeting should be small talk not greeting loop',
    input: 'من نپرسیدم چطوری :) فقط سلام کردم',
    expectedPrimary: Intent.SMALL_TALK,
    forbiddenIntents: [Intent.GREETING],
  },
];

/**
 * Runs the complete Intent Test Suite and returns a structured report.
 */
export function runIntentTestSuite(): {
  total: number;
  passed: number;
  failed: number;
  accuracy: number;
  results: Array<{
    id: string;
    description: string;
    input: string;
    expected: Intent;
    actual: Intent;
    passed: boolean;
    confidence: number;
    reasonCodes: string[];
  }>;
} {
  let passed = 0;
  const results = INTENT_TEST_SUITE.map((test) => {
    const res = detectIntentDetailed(test.input, test.history || []);
    const isPrimaryMatch = res.primaryIntent === test.expectedPrimary;

    let isSecondaryMatch = true;
    if (test.expectedSecondary) {
      isSecondaryMatch = test.expectedSecondary.every((sec) =>
        res.secondaryIntents.includes(sec)
      );
    }

    let isForbiddenClean = true;
    if (test.forbiddenIntents) {
      isForbiddenClean = !test.forbiddenIntents.includes(res.primaryIntent);
    }

    const testPassed = isPrimaryMatch && isSecondaryMatch && isForbiddenClean;
    if (testPassed) passed++;

    return {
      id: test.id,
      description: test.description,
      input: test.input,
      expected: test.expectedPrimary,
      actual: res.primaryIntent,
      passed: testPassed,
      confidence: res.confidence,
      reasonCodes: res.reasonCodes,
    };
  });

  return {
    total: INTENT_TEST_SUITE.length,
    passed,
    failed: INTENT_TEST_SUITE.length - passed,
    accuracy: Number(((passed / INTENT_TEST_SUITE.length) * 100).toFixed(2)),
    results,
  };
}
