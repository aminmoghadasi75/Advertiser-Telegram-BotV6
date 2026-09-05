/**
 * Decoupled Multi-Product & Campaign Configuration & Knowledge Base
 * Isolates product specifications, plans, pricing, and support details from the prompt.
 * Enables 1-click product switching and multi-campaign management for Anonymous AI Chat.
 */

export interface ProductPlan {
  id: string;
  name: string;
  price: string;
  priceNumeric?: number;
  duration: string;
  traffic: string;
  deviceLimit: string;
  popular?: boolean;
  description?: string;
}

export interface ProductFaqItem {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
}

export interface ProductConfig {
  productId: string;
  productName: string;
  productDescription: string;
  tagline: string;
  category?: 'vpn' | 'fashion' | 'digital' | 'education' | 'services' | 'other' | string;
  features: string[];
  plans: ProductPlan[];
  freeTrial: {
    available: boolean;
    durationHours: number;
    description: string;
  };
  refundPolicy: {
    available: boolean;
    guaranteeHours: number;
    description: string;
  };
  support: {
    handle: string; // e.g. "nova_vpn10" (strictly without @)
    link: string;   // e.g. "https://t.me/nova_vpn10"
    operatingHours: string;
  };
  bannerImageUrl?: string;
  faqItems?: ProductFaqItem[];
  knowledgeBaseText?: string;
  inappropriateKeywords?: string[];
  isActive?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastUsedAt?: string;
  stats?: {
    totalChatsPromoted?: number;
    totalInquiries?: number;
  };
}

export const BLANK_PRODUCT_CONFIG: ProductConfig = {
  productId: '',
  productName: '',
  productDescription: '',
  tagline: '',
  category: 'other',
  isActive: true,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  features: [],
  plans: [],
  freeTrial: {
    available: false,
    durationHours: 24,
    description: '',
  },
  refundPolicy: {
    available: false,
    guaranteeHours: 48,
    description: '',
  },
  support: {
    handle: '',
    link: '',
    operatingHours: '۲۴ ساعته',
  },
  bannerImageUrl: '',
  faqItems: [],
  knowledgeBaseText: '',
  stats: {
    totalChatsPromoted: 0,
    totalInquiries: 0,
  },
};

export const DEFAULT_NOVA_VPN_CONFIG: ProductConfig = {
  productId: 'prod_nova_vpn',
  productName: 'نوا وی پی ان (Nova VPN)',
  productDescription: 'اتصال سریع، امن و پایدار به اینترنت با آزادی واقعی با یک کلیک! ویژه هوش مصنوعی (ChatGPT و Gemini)، استریم بدون محدودیت، پینگ پایین بازی و سرورهای متنوع.',
  tagline: 'آزادی واقعی، با یک کلیک! اتصال سریع، امن و پایدار',
  category: 'vpn',
  isActive: true,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  features: [
    'دسترسی روان به ابزارهای هوش مصنوعی و سرویس‌های جهانی (ChatGPT, Gemini, Claude)',
    'پینگ پایین و پایداری عالی برای بازی و گیم‌های آنلاین',
    'استریم بدون محدودیت در یوتیوب، اینستاگرام، فیلم و سریال',
    'سرورهای متنوع در کشورهای مختلف (آلمان، فنلاند، هلند، آمریکا)',
    'فعال‌سازی سریع در کمتر از ۵ دقیقه و پشتیبانی ۲۴/۷',
    'ضمانت کیفیت و بازگشت کامل وجه',
  ],
  plans: [
    {
      id: 'plan_special_ai',
      name: 'پلن تخصصی (پرفروش‌ترین - ویژه هوش مصنوعی)',
      price: '۲۰۰ هزار تومان',
      priceNumeric: 200000,
      duration: '۱ ماهه',
      traffic: '۱۰۰ گیگابایت',
      deviceLimit: '۱ کاربر',
      popular: true,
      description: 'مناسب ابزارهای هوش مصنوعی مانند ChatGPT و Gemini و ترید',
    },
    {
      id: 'plan_team_500g',
      name: 'پلن تیمی (اقتصادی)',
      price: '۴۲۰ هزار تومان',
      priceNumeric: 420000,
      duration: '۱ ماهه',
      traffic: '۵۰۰ گیگابایت',
      deviceLimit: '۳ کاربر',
      description: 'مناسب خانواده و تیم‌ها با بیشترین حجم و چند کاربره',
    },
    {
      id: 'plan_plus_300g',
      name: 'پلن پلاس',
      price: '۲۹۰ هزار تومان',
      priceNumeric: 290000,
      duration: '۱ ماهه',
      traffic: '۳۰۰ گیگابایت',
      deviceLimit: '۲ کاربر',
      description: 'مناسب استفاده روزمره، اینستاگرام و فیلم و سریال',
    },
    {
      id: 'plan_single_100g',
      name: 'پلن انفرادی',
      price: '۱۵۰ هزار تومان',
      priceNumeric: 150000,
      duration: '۱ ماهه',
      traffic: '۱۰۰ گیگابایت',
      deviceLimit: '۱ کاربر',
      description: 'مناسب وبگردی و استفاده سبک شخصی',
    },
  ],
  freeTrial: {
    available: true,
    durationHours: 24,
    description: 'اکانت تست رایگان برای بررسی کیفیت و پایداری اتصال قبل از خرید',
  },
  refundPolicy: {
    available: true,
    guaranteeHours: 48,
    description: 'ضمانت اتصال و بازگشت وجه در صورت عدم رضایت',
  },
  support: {
    handle: 'Nova_vpn10',
    link: 'https://t.me/Nova_vpn10',
    operatingHours: '۲۴ ساعته (پشتیبانی ۲۴/۷ تلگرام: @Nova_vpn10 | واتساپ: 09991719911)',
  },
  bannerImageUrl: '/uploads/banner_1788572452829_9lgm9.jpg',
  faqItems: [
    {
      id: 'faq_1',
      question: 'قیمت و پلن‌ها چطوریه؟',
      answer: 'چهار پلن داریم: انفرادی ۱ ماه ۱۰۰ گیگ ۱۵۰ ت، پلاس ۱ ماه ۳۰۰ گیگ ۲۹۰ ت، تیمی ۱ ماه ۵۰۰ گیگ ۴۲۰ ت و پلن تخصصی هوش مصنوعی (ChatGPT و Gemini) ۱ ماه ۱۰۰ گیگ ۲۰۰ ت.',
      keywords: ['قیمت', 'پلن', 'تعرفه', 'هزینه', 'چنده'],
    },
    {
      id: 'faq_2',
      question: 'تست رایگان هم میدید؟',
      answer: 'بله، قبل از خرید کانفیگ تست رایگان برای سنجش پایداری و سرعت تقدیمتون می‌شه.',
      keywords: ['تست', 'اکانت تست', 'رایگان', 'امتحان'],
    },
    {
      id: 'faq_3',
      question: 'برای ابزارهای هوش مصنوعی و چت جی پی تی چطوره؟',
      answer: 'پلن تخصصی ۲۰۰ تومنی اختصاصاً برای ChatGPT، Gemini، Claude و سایت‌های تحریمی کانفیگ شده و بدون مسدودی یا افت سرعت کار می‌کنه.',
      keywords: ['هوش مصنوعی', 'chatgpt', 'gemini', 'claude', 'تحریم'],
    },
    {
      id: 'faq_4',
      question: 'روی چه دستگاه‌هایی نصب می‌شه؟',
      answer: 'روی تمامی دستگاه‌ها اعم از آیفون (iOS)، اندروید و ویندوز قابل استفاده است و فعال‌سازی زیر ۵ دقیقه انجام میشه.',
      keywords: ['گوشی', 'آیفون', 'اندروید', 'ویندوز', 'دستگاه'],
    },
    {
      id: 'faq_5',
      question: 'چطور سفارش بدم و با کی در ارتباط باشم؟',
      answer: 'برای خرید و دریافت فوری در تلگرام به آیدی Nova_vpn10@ یا در واتساپ به شماره 09991719911 پیام بدید.',
      keywords: ['خرید', 'سفارش', 'پشتیبانی', 'آیدی', 'واتساپ'],
    },
  ],
  knowledgeBaseText: 'نام برند: Nova VPN. شعار: آزادی واقعی با یک کلیک. پشتیبانی تلگرام: Nova_vpn10 (در چت بدون @ ذکر شود). واتساپ: 09991719911. دارای ۴ پلن (۱۵۰، ۲۰۰، ۲۹۰ و ۴۲۰ هزار تومان). پلن ۲۰۰ ت پرفروش‌ترین پلن تخصصی هوش مصنوعی است. سرورها: فنلاند، آلمان، هلند، آمریکا. فعال‌سازی زیر ۵ دقیقه و دارای ضمانت بازگشت وجه.',
  stats: {
    totalChatsPromoted: 0,
    totalInquiries: 0,
  },
};

export const DEFAULT_PRODUCT_CONFIG: ProductConfig = DEFAULT_NOVA_VPN_CONFIG;

export const DEFAULT_PRODUCTS_CATALOG: ProductConfig[] = [DEFAULT_NOVA_VPN_CONFIG];

/**
 * Builds formatted product context string for injection into prompts or decision engines.
 * Restricts Support ID exposure when supportIdAvailable is false (<120 seconds).
 */
export function formatProductPromptContext(
  config?: ProductConfig,
  supportIdAvailable: boolean = false
): string {
  if (!config || !config.productName || !config.productName.trim()) {
    return '';
  }

  const lines: string[] = [];

  lines.push(`[اطلاعات ساختاریافته محصول / کمپین فعال جاری]:`);
  lines.push(`- نام محصول: ${config.productName}`);
  if (config.tagline) {
    lines.push(`- شعار/مزیت اصلی: ${config.tagline}`);
  }
  if (config.productDescription) {
    lines.push(`- خلاصه توضیحات: ${config.productDescription}`);
  }

  if (config.features && config.features.length > 0) {
    lines.push(`- مزایا و ویژگی‌ها:`);
    config.features.forEach((feat) => lines.push(`  • ${feat}`));
  }

  if (config.plans && config.plans.length > 0) {
    lines.push(`- پلن‌ها و تعرفه‌ها:`);
    config.plans.forEach((p) => {
      const parts = [p.name, p.price];
      if (p.duration) parts.push(p.duration);
      if (p.traffic) parts.push(p.traffic);
      if (p.deviceLimit) parts.push(p.deviceLimit);
      lines.push(`  • ${parts.join(' - ')}`);
    });
  }

  if (config.freeTrial?.available && config.freeTrial.description) {
    lines.push(`- تست رایگان / آفر اولیه: ${config.freeTrial.description}`);
  }

  if (config.refundPolicy?.available && config.refundPolicy.description) {
    lines.push(`- گارانتی و ضمانت: ${config.refundPolicy.description}`);
  }

  if (config.faqItems && config.faqItems.length > 0) {
    lines.push(`- سوالات متداول پاسخ داده شده (FAQ):`);
    config.faqItems.forEach((faq, i) => {
      lines.push(`  ${i + 1}. سوال: ${faq.question} -> پاسخ: ${faq.answer}`);
    });
  }

  if (config.knowledgeBaseText && config.knowledgeBaseText.trim()) {
    lines.push(`- پایگاه دانش تکمیلی: ${config.knowledgeBaseText.trim()}`);
  }

  const cleanHandle = (config.support?.handle || '').replace(/^@/, '').trim();
  if (cleanHandle) {
    if (supportIdAvailable) {
      lines.push(`- آیدی پشتیبانی تلگرام: ${cleanHandle} (اکیداً بدون علامت @)`);
    } else {
      lines.push(`- آیدی پشتیبانی: [قفل زمانی: مکالمه زیر ۱۲۰ ثانیه است - هنوز مجاز به ارسال آیدی پشتیبانی نیستید]`);
    }
  }

  return lines.join('\n');
}
