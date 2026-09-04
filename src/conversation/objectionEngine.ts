import { ObjectionCategory } from '../types';

export interface ObjectionAnalysis {
  category: ObjectionCategory;
  confidence: number;
  detectedKeywords: string[];
  suggestedStrategy: string;
  recommendedTalkingPoints: string[];
}

const OBJECTION_PATTERNS: Array<{
  category: ObjectionCategory;
  pattern: RegExp;
  strategy: string;
  talkingPoints: string[];
}> = [
  {
    category: ObjectionCategory.PRICE,
    pattern: /(گرونه|گرونه بابا|خیلی گرونه|تخفیف|قیمتش زیاده|هزینش بالاست|ارزونتر|پول ندارم)/i,
    strategy: 'توضیح کیفیت، پایداری، سرورهای اختصاصی و پشتیبانی ۲۴ ساعته + ارزش در برابر هزینه',
    talkingPoints: [
      'سرورها کاملاً اختصاصی و با پهنای باند نامحدود پرسرعت هستند.',
      'بدون افت سرعت در ساعات پیک مصرف و قطعی‌های سراسری اینترنت.',
      'ضمانت بازگشت وجه کامل در صورت عدم رضایت.',
    ],
  },
  {
    category: ObjectionCategory.TRUST,
    pattern: /(از کجا بدونم کار میکنه|تضمینیه|کلاهبرداری نباشه|نکنه قطع بشه|مطمئنه|اول کانفیگ بده)/i,
    strategy: 'پیشنهاد تست رایگان بدون نیاز به پرداخت + گارانتی کارکرد روی تمام اپراتورها',
    talkingPoints: [
      'می‌تونی اول اکانت تست رایگان بگیری و روی همراه اول/ایرانسل/وای‌فای امتحان کنی.',
      'اگر کاملاً راضی بودی بعدش پلن ماهانه بگیری.',
      'پشتیبانی مستقیم داریم که در صورت اختلال سرور، برات جایگزین میکنه.',
    ],
  },
  {
    category: ObjectionCategory.EXISTING_SOLUTION,
    pattern: /(خودم رایگان دارم|سایفون دارم|فعلا دارم|فیلترشکن دارم|نیازی ندارم دارم کار میکنه)/i,
    strategy: 'احترام به انتخاب کاربر + یادآوری خطرات امنیتی و کندی فیلترشکن‌های رایگان + پیشنهاد داشتن کانفیگ یدکی',
    talkingPoints: [
      'عالیه که وصل هستی! ولی فیلترشکن‌های رایگان معمولاً موقع قطعی‌های شدید نت از کار می‌افتن.',
      'می‌تونی آیدی کانال/پشتیبانی رو داشته باشی تا اگه یه وقت نت قطع شد دسترسی داشته باشی.',
    ],
  },
  {
    category: ObjectionCategory.IT_PROFESSIONAL,
    pattern: /(خودم\s*(?:سرور|vpn|وی\s*پی\s*ان|کانفیگ)\s*(?:دارم|میزنم|درست میکنم|راه میندازم)|کارم\s*(?:آی\s*تی|ایتی|it|شبکه|سرور|کامپیوتره)|بهت\s*(?:یه\s*)?(?:vpn|وی\s*پی\s*ان|کانفیگ)\s*میدم|برای\s*(?:آشناها|دوستام|خودم)\s*(?:فقط\s*)?کانفیگ|سرور\s*اختصاصی\s*خودم|نمیفروشم.*کانفیگ)/i,
    strategy: 'تحسین و احترام به تخصص آی‌تی کاربر، قفل قطعی فروش، عدم ارائه هرگونه آیدی یا پیشنهاد، گپ کوتاه و خودمانی',
    talkingPoints: [
      'ایول دمت گرم چه عالی',
      'کارت شبکه است یا نرم‌افزار؟',
    ],
  },
  {
    category: ObjectionCategory.COMPLEXITY,
    pattern: /(بلد نیستم|نصبش سخته|سخته برام|چجوری کار میکنه|پیچیده‌س|برنامه میخواد)/i,
    strategy: 'ساده‌سازی فرآیند اتصال (فقط با یک کلیک و کپی لینک در اپلیکیشن v2ray/streisand) + راهنمایی قدم به قدم',
    talkingPoints: [
      'اتصالش خیلی راحته و کلاً ۱۰ ثانیه زمان می‌بره.',
      'فقط کافیه لینک کانفیگ رو کپی کنی و داخل برنامه بزنی، خودش وصل میشه.',
      'پشتیبانی هم راهنمای ویدیویی برات می‌فرسته.',
    ],
  },
];

/**
 * Analyzes an objection message and provides category-specific handling tactics
 */
export function analyzeObjection(userMessage: string): ObjectionAnalysis {
  for (const item of OBJECTION_PATTERNS) {
    const match = item.pattern.exec(userMessage);
    if (match) {
      return {
        category: item.category,
        confidence: 0.9,
        detectedKeywords: [match[0]],
        suggestedStrategy: item.strategy,
        recommendedTalkingPoints: item.talkingPoints,
      };
    }
  }

  return {
    category: ObjectionCategory.GENERAL,
    confidence: 0.5,
    detectedKeywords: [],
    suggestedStrategy: 'پذیرش محترمانه، عدم اصرار، لحن دوستانه و طبیعی و ابراز همدلی کامل',
    recommendedTalkingPoints: [
      'کاملاً حق داری',
      'هر وقت خواستی من هستم',
    ],
  };
}
