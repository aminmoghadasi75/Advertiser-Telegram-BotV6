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
  productDescription: 'سرویس کانفیگ و فیلترشکن اختصاصی پرسرعت و بدون قطعی با سرورهای قدرتمند، پینگ پایین و تست رایگان',
  tagline: 'پرسرعت، بدون قطعی و پایدار روی تمامی اپراتورها',
  category: 'vpn',
  isActive: true,
  isArchived: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  features: [
    'بدون قطعی روی همراه اول، ایرانسل، رایتل و مخابرات',
    'پینگ فوق‌العاده پایین برای وبگردی، اینستاگرام، یوتیوب و ترید',
    'پشتیبانی اختصاصی و ارائه تست رایگان قبل از خرید',
  ],
  plans: [
    {
      id: 'plan_1m_single',
      name: 'پلن یک‌ماهه تک‌کاربره',
      price: '۷۰ هزار تومان',
      duration: '۱ ماهه',
      traffic: 'حجم منصفانه/نامحدود',
      deviceLimit: '۱ کاربر',
    },
    {
      id: 'plan_1m_double',
      name: 'پلن یک‌ماهه دوکاربره',
      price: '۱۲۰ هزار تومان',
      duration: '۱ ماهه',
      traffic: 'نامحدود',
      deviceLimit: '۲ کاربر',
      popular: true,
    },
  ],
  freeTrial: {
    available: true,
    durationHours: 24,
    description: 'اکانت تست رایگان برای بررسی کیفیت و سرعت قبل از خرید',
  },
  refundPolicy: {
    available: true,
    guaranteeHours: 48,
    description: 'ضمانت اتصال و بازگشت وجه در صورت عدم رضایت تا ۴۸ ساعت',
  },
  support: {
    handle: 'nova_vpn10',
    link: 'https://t.me/nova_vpn10',
    operatingHours: '۲۴ ساعته',
  },
  bannerImageUrl: '',
  faqItems: [
    {
      id: 'faq_1',
      question: 'روی چه خط‌هایی وصل میشه؟',
      answer: 'روی همه خط‌ها مثل همراه اول، ایرانسل، رایتل و وای‌فای بدون قطعی وصل می‌شه.',
      keywords: ['اپراتور', 'همراه اول', 'ایرانسل', 'رایتل', 'وای فای'],
    },
    {
      id: 'faq_2',
      question: 'تست رایگان هم دارید؟',
      answer: 'آره حتماً، تست رایگان داریم تا اول وصل بشی و سرعتش رو چک کنی.',
      keywords: ['تست', 'اکانت تست', 'رایگان', 'امتحان'],
    },
  ],
  knowledgeBaseText: 'پشتیبانی فقط از طریق آیدی nova_vpn10 در تلگرام پاسخگو است. در چت تا قبل از ۲ دقیقه هیچ آیدی ارسال نمی‌شود و بعد از ۲ دقیقه آیدی به صورت nova_vpn10 بدون @ ارسال می‌گردد.',
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
