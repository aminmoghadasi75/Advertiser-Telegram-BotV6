import { ProductCampaign } from '../types.js';
import { GoogleGenAI } from '@google/genai';
import {
  getAdaptiveCandidateModels,
  recordGeminiSuccess,
  recordGeminiFailure,
  GEMINI_MODEL_METADATA,
} from './geminiAdaptiveRouter.js';

let aiClient: GoogleGenAI | null = null;
function getGenAiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  try {
    aiClient = new GoogleGenAI(
      apiKey
        ? {
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          }
        : {
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          }
    );
    return aiClient;
  } catch (e) {
    return null;
  }
}

export interface LeadDetectionResult {
  isMatch: boolean;
  category: 'vpn_filter' | 'net_speed' | 'ai_chatgpt' | 'social_media' | 'gaming_ping' | 'general_lead';
  matchedKeywords: string[];
  confidence: number;
}

// Built-in dictionary of lead indicators
const TAXONOMY = {
  vpn_filter: [
    'فیلترشکن',
    'فیلتر شکن',
    'فیلترشکن خوب',
    'فیلترشکن قوی',
    'فیلترشکن پولی',
    'وی پی ان',
    'وی‌پی‌ان',
    'vpn',
    'v2ray',
    'v2rayng',
    'کانفیگ',
    'کانفیگ اختصاصی',
    'پروکسی',
    'proxy',
    'دور زدن فیلتر',
    'فیلترینگ',
    'فیلتره',
    'ضدفیلتر',
    'نت ملی',
    'خرید vpn',
    'خرید فیلترشکن',
    'اکانت vpn',
  ],
  net_speed: [
    'سرعت اینترنت',
    'کندی سرعت',
    'افت سرعت',
    'نت ضعیفه',
    'نت قطعه',
    'قطعی اینترنت',
    'قطعی نت',
    'تایم اوت',
    'تایماوت',
    'پینگ بالا',
    'لود نمیشه',
    'باز نمیشه',
    'همراه اول قطعه',
    'ایرانسل قطعه',
    'مخابرات قطعه',
    'رایتل قطعه',
    'نت داغونه',
    'اینترنت ملی',
  ],
  ai_chatgpt: [
    'هوش مصنوعی',
    'chatgpt',
    'چت جی پی تی',
    'چت‌جی‌پی‌تی',
    'openai',
    'claude',
    'کلود',
    'gemini',
    'جمینای',
    'تحریم هوش مصنوعی',
    'اکانت هوش مصنوعی',
    'ثبت نام chatgpt',
    'ارور chatgpt',
  ],
  social_media: [
    'اینستا',
    'اینستاگرام',
    'استوری لود نمیشه',
    'استوری باز نمیشه',
    'دایرکت باز نمیشه',
    'یوتیوب',
    'youtube',
    'ویدیو لود نمیشه',
    'توییتر',
    'twitter',
    'شبکه ایکس',
    'x.com',
    'توییت',
    'واتساپ',
    'whatsapp',
  ],
  gaming_ping: [
    'پینگ',
    'کاهش پینگ',
    'پینگ تایم',
    'لگ دارم',
    'لگ بازی',
    'دی ان اس گیم',
    'dns گیم',
    'تحریم بازی',
    'پکت لاست',
    'packet loss',
    'بازی آنلاین',
    'رفع تحریم گیم',
  ],
};

// Game names that only count if a connection/ping problem indicator is also present
const GAME_NAMES = ['پابجی', 'کالاف', 'وارزون', 'فورتنایت', 'دوتا', 'پابجی موبایل', 'وارکرفت', 'ولورانت', 'apex'];
const GAMING_PROBLEM_INDICATORS = [
  'پینگ', 'ping', 'لگ', 'lag', 'دی ان اس', 'dns', 'تحریم', 'فیلتر', 'قطعی', 'قطع میشه',
  'تایم اوت', 'تایماوت', 'timeout', 'وصل نمیشه', 'باز نمیشه', 'ارور', 'تحریم شکن', 'تحریم‌شکن', 'الکترو', 'رادار'
];

// Commercial trading words that should NOT trigger VPN/ping lead detection
const ACCOUNT_TRADE_EXCLUSIONS = [
  'خرید اکانت', 'خریدار اکانت', 'فروش اکانت', 'فروشگاه اکانت', 'خریدارم', 'فروشی',
  'طاق میزنم', 'طاق', 'معاوضه', 'واسطه', 'یوسی', 'uc', 'سیزن', 'لول', 'اسکین', 'متیک', 'امفور',
  'قیمت اکانت', 'کانال فروشی', 'پیج فروشی', 'چیکن', 'الایت', 'محبوبیت', 'استارت میزنین'
];

/**
 * Detects if a message contains intent/need for VPN, internet speed, AI access, etc.
 */
export function detectLeadInMessage(
  text: string,
  userCustomKeywords: string[] = []
): LeadDetectionResult {
  if (!text || typeof text !== 'string') {
    return {
      isMatch: false,
      category: 'general_lead',
      matchedKeywords: [],
      confidence: 0,
    };
  }

  const normalized = text.toLowerCase();

  // Exclude deleted messages or system noise
  if (normalized.includes('deleted message') || normalized.trim().length < 5) {
    return {
      isMatch: false,
      category: 'general_lead',
      matchedKeywords: [],
      confidence: 0,
    };
  }

  // Check if this message is merely account buying/selling or gaming trading
  const isTradeExcluded = ACCOUNT_TRADE_EXCLUSIONS.some(term => normalized.includes(term));
  const hasExplicitVpnTerms = TAXONOMY.vpn_filter.some(kw => normalized.includes(kw.toLowerCase()));
  if (isTradeExcluded && !hasExplicitVpnTerms) {
    // This is gaming account trading, NOT a VPN or networking lead
    return {
      isMatch: false,
      category: 'general_lead',
      matchedKeywords: [],
      confidence: 0,
    };
  }

  const matchedKeywords = new Set<string>();

  // Check categories with priority: AI -> VPN -> Net Speed -> Social Media -> Gaming
  let matchedCategory: LeadDetectionResult['category'] = 'general_lead';
  let categoryScore = 0;

  // 1. AI check
  for (const kw of TAXONOMY.ai_chatgpt) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.add(kw);
      matchedCategory = 'ai_chatgpt';
      categoryScore += 3;
    }
  }

  // 2. VPN / Filter check
  for (const kw of TAXONOMY.vpn_filter) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.add(kw);
      if (categoryScore < 4) {
        matchedCategory = 'vpn_filter';
      }
      categoryScore += 4;
    }
  }

  // 3. Net Speed check
  for (const kw of TAXONOMY.net_speed) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.add(kw);
      if (categoryScore < 3) {
        matchedCategory = 'net_speed';
      }
      categoryScore += 2;
    }
  }

  // 4. Social Media check
  for (const kw of TAXONOMY.social_media) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.add(kw);
      if (categoryScore < 2) {
        matchedCategory = 'social_media';
      }
      categoryScore += 2;
    }
  }

  // 5. Gaming check (high-confidence direct indicators)
  for (const kw of TAXONOMY.gaming_ping) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.add(kw);
      if (categoryScore < 2) {
        matchedCategory = 'gaming_ping';
      }
      categoryScore += 2;
    }
  }

  // 5b. Game names - ONLY count if a connection/ping problem is also present
  const hasGameName = GAME_NAMES.some(g => normalized.includes(g));
  const hasGamingProblem = GAMING_PROBLEM_INDICATORS.some(p => normalized.includes(p));
  if (hasGameName && hasGamingProblem) {
    matchedKeywords.add('پابجی/گیم');
    if (categoryScore < 2) {
      matchedCategory = 'gaming_ping';
    }
    categoryScore += 2;
  }

  // 6. User Custom Keywords check
  for (const kw of userCustomKeywords) {
    const cleanKw = (kw || '').trim().toLowerCase();
    if (cleanKw && normalized.includes(cleanKw)) {
      matchedKeywords.add(cleanKw);
      categoryScore += 2;
    }
  }

  const matchedList = Array.from(matchedKeywords);
  const isMatch = matchedList.length > 0;

  return {
    isMatch,
    category: isMatch ? matchedCategory : 'general_lead',
    matchedKeywords: matchedList,
    confidence: isMatch ? Math.min(1.0, 0.4 + matchedList.length * 0.2) : 0,
  };
}

/**
 * Generates an intelligent, helpful reply in the group replying to the user's message.
 */
export function generateGroupReplyMessage(
  category: LeadDetectionResult['category'],
  matchedKeywords: string[],
  campaign: ProductCampaign,
  userFirstName?: string
): string {
  const contact = (campaign.contactHandle && campaign.contactHandle !== 'در عکس بالا') ? campaign.contactHandle : '@Nova_vpn10';
  const price = campaign.price ? `با تعرفه اقتصادی (${campaign.price})` : '';

  switch (category) {
    case 'ai_chatgpt':
      return `سلام دوست عزیز! برای دسترسی بدون تحریم و پرسرعت به ChatGPT و ابزارهای هوش مصنوعی، سرورهای اختصاصی V2ray با آی‌پی ثابت و بدون قطعی کاملاً تضمینی هستند (همراه با تست رایگان قبل از خرید).\n👤 ارتباط با پشتیبانی و دریافت تست رایگان: ${contact}`;

    case 'net_speed':
      return `سلام وقت بخیر، اگر درگیر کندی اینترنت یا اختلال اپراتورها (همراه اول و ایرانسل) هستید، کانفیگ‌های اختصاصی ما با پینگ پایین و سرعت پایدار تضمینی ${price} بهترین گزینه‌ست.\n👤 ارتباط با پشتیبانی و دریافت تست رایگان: ${contact}`;

    case 'social_media':
      return `سلام دوست عزیز، برای باز کردن فوری ویدیوهای یوتیوب و استوری‌های اینستا بدون معطلی و قطعی، سرورهای ضد فیلتر پرسرعت و پایدار ما رو امتحان کنید (با امکان تست رایگان قبل از خرید).\n👤 ارتباط مستقیم با پشتیبانی: ${contact}`;

    case 'gaming_ping':
      return `سلام وقت بخیر، برای کاهش پینگ، رفع لگ در بازی‌ها و ثبات اتصال، سرورهای اختصاصی با پینگ زیر ۸۰ میلی‌ثانیه فعالند.\n👤 ارتباط با پشتیبانی و دریافت تست رایگان: ${contact}`;

    case 'vpn_filter':
    default:
      return `سلام دوست عزیز، ${campaign.title || 'سرویس‌های اختصاصی V2ray و فیلترشکن پرسرعت'} با کیفیت تضمینی، آی‌پی ثابت و تست رایگان روی تمام اینترنت‌ها فعاله.\n👤 ارتباط با پشتیبانی و دریافت تست رایگان: ${contact}`;
  }
}

export interface MultiBubblePvMessage {
  greetingBubble: string; // حباب ۱: سلام و احوال‌پرسی صمیمانه
  contextBubble: string; // حباب ۲: اشاره به دیدن پیام در گروه
  productBubble: string; // حباب ۳: معرفی محصول و تجربه شخصی با اشاره به تست رایگان
  supportBubble: string; // حباب ۴: معرفی پشتیبانی و لینک تماس
  bannerCaption?: string; // کپشن کوتاه و طبیعی بنر تصویر
  allBubbles: string[]; // آرایه کامل حباب‌ها جهت ارسال متوالی
}

/**
 * Generates an authentic multi-bubble recommendation in private DM (PV)
 * Split into 4 distinct human chat bursts:
 * 1. Greeting
 * 2. Group context
 * 3. Product recommendation & free trial
 * 4. Support contact
 */
export function generateMultiBubbleFriendPv(
  category: LeadDetectionResult['category'],
  matchedKeywords: string[],
  campaign: ProductCampaign,
  userFirstName?: string,
  groupTitle?: string
): MultiBubblePvMessage {
  const nameGreeting = userFirstName ? `${userFirstName} جان` : 'دوست عزیز';
  const contact = campaign.contactHandle || '@Admin';
  const groupRef = groupTitle ? `گروه «${groupTitle}»` : 'گروه';
  const productName = campaign.title || 'کانفیگ اختصاصی';

  let topicPhrase = 'فیلترشکن خوب و پرسرعت';
  if (category === 'ai_chatgpt') {
    topicPhrase = 'دسترسی بدون تحریم به چت‌جی‌پی‌تی و هوش مصنوعی';
  } else if (category === 'net_speed') {
    topicPhrase = 'رفع افت سرعت و قطعی‌های اینترنت';
  } else if (category === 'social_media') {
    topicPhrase = 'باز کردن سریع اینستاگرام و ویدیوهای یوتیوب';
  } else if (category === 'gaming_ping') {
    topicPhrase = 'کاهش پینگ و قطعی‌های بازی آنلاین';
  }

  // 1. Greeting
  const greetingBubble = `سلام وقتت بخیر ${nameGreeting} ✋`;

  // 2. Context
  const contextBubble = `توی ${groupRef} دیدم پیام دادی دنبال ${topicPhrase} بودی`;

  // 3. Product
  const productBubble = `خواستم بهت بگم من خودم الان چند وقته برای دور زدن قطعی‌ها از ${productName} استفاده می‌کنم، پینگش عالیه و روی همراه اول و ایرانسل واقعاً ثابته. تست رایگان هم دارن که اول چک کنی بعد اگه خواستی تهیه کنی.`;

  // 4. Support
  const supportBubble = `به پشتیبانیشون پیام بدی سریع بهت لینک و اکانت تست میده: ${contact}`;

  // 5. Banner Caption
  const bannerCaption = `اینم عکس مشخصات سرورها و تعرفه‌هاشون 👇`;

  return {
    greetingBubble,
    contextBubble,
    productBubble,
    supportBubble,
    bannerCaption,
    allBubbles: [greetingBubble, contextBubble, productBubble, supportBubble],
  };
}

/**
 * Generates an authentic, friendly recommendation in private DM (PV)
 * written in the tone of an ordinary person / peer recommending a good service.
 */
export function generateCasualFriendPvMessage(
  category: LeadDetectionResult['category'],
  matchedKeywords: string[],
  campaign: ProductCampaign,
  userFirstName?: string
): string {
  const multi = generateMultiBubbleFriendPv(category, matchedKeywords, campaign, userFirstName);
  return multi.allBubbles.join('\n\n') + (multi.bannerCaption ? `\n\n📌 ${multi.bannerCaption}` : '');
}

/**
 * Intelligent AI-Powered Group Reply using Gemini (gemini-3.8-flash)
 * Adapts directly to the user's actual question in the group.
 */
export async function generateGeminiGroupReply(
  userMessageText: string,
  category: LeadDetectionResult['category'],
  matchedKeywords: string[],
  campaign: ProductCampaign,
  userFirstName?: string
): Promise<{ text: string; usedAi: boolean }> {
  const ai = getGenAiClient();
  if (!ai || !process.env.GEMINI_API_KEY) {
    return {
      text: generateGroupReplyMessage(category, matchedKeywords, campaign, userFirstName),
      usedAi: false,
    };
  }

  const contact = (campaign.contactHandle && campaign.contactHandle !== 'در عکس بالا') ? campaign.contactHandle : '@Nova_vpn10';
  const prompt = `شما یک کاربر عادی و بسیار بااخلاق و کاربلد در یک گروه تلگرامی هستید.
یک کاربر در گروه پیامی فرستاده و به مشکل فیلترینگ، اینترنت، هوش مصنوعی یا پینگ بازی اشاره کرده است:
پیام کاربر: "${userMessageText}"
نام کاربر: ${userFirstName || 'دوست عزیز'}
موضوع شناسایی‌شده: ${category}

شما می‌خواهید در همان گروه به این کاربر به صورت کاملاً دوستانه، طبیعی و مؤدبانه یک ریپلای بزنید و سرویس زیر را به او پیشنهاد دهید:
- نام سرویس: ${campaign.title}
- قیمت: ${campaign.price}
- راه تماس/تست: ${contact}

دستورات:
۱. ریپلای باید خیلی طبیعی، خودمانی و شبیه پیشنهاد یک هم‌گروهی دلسوز باشد (نه تبلیغ رباتی یا شرکتی).
۲. کوتاه باشد (۲ تا ۳ خط).
۳. حتماً به امکان تست رایگان قبل از خرید اشاره کند.
۴. آیدی تلگرام پشتیبانی (${contact}) را صریحاً در متن ذکر کند (مثلاً: برای دریافت اکانت تست به آیدی ${contact} پیام بده).
۵. به هیچ وجه از عبارات مبهم مثل "در عکس بالا" استفاده نکنید، چون باید آیدی مشخص ${contact} در پیام قید شود.
۶. خروجی فقط متن پاسخ بدون گیومه یا مقدمه باشد.`;

  const candidateModels = getAdaptiveCandidateModels();
  for (const modelName of candidateModels) {
    try {
      const timeoutMs = GEMINI_MODEL_METADATA[modelName]?.timeoutMs || 5000;
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
      );
      const apiPromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { temperature: 0.8 },
      });
      const res: any = await Promise.race([apiPromise, timeoutPromise]);
      const text = (res?.text || '').trim();
      if (text && text.length > 15) {
        recordGeminiSuccess(modelName);
        return { text: text.replace(/^["'«]/, '').replace(/["'»]$/, '').trim(), usedAi: true };
      }
    } catch (e: any) {
      recordGeminiFailure(modelName, e);
    }
  }

  return {
    text: generateGroupReplyMessage(category, matchedKeywords, campaign, userFirstName),
    usedAi: false,
  };
}

/**
 * Intelligent AI-Powered Casual Friend PV Message using Gemini with Multi-Model Fallback
 */
export async function generateGeminiCasualFriendPvMessage(
  userMessageText: string,
  category: LeadDetectionResult['category'],
  matchedKeywords: string[],
  campaign: ProductCampaign,
  userFirstName?: string
): Promise<{ text: string; usedAi: boolean }> {
  const ai = getGenAiClient();
  if (!ai || !process.env.GEMINI_API_KEY) {
    return {
      text: generateCasualFriendPvMessage(category, matchedKeywords, campaign, userFirstName),
      usedAi: false,
    };
  }

  const contact = campaign.contactHandle || '@Admin';
  const nameGreeting = userFirstName ? `${userFirstName} جان` : 'سلام دوست عزیز';

  const prompt = `شما یک فرد عادی در تلگرام هستید که پیامی را در گروه از ${userFirstName || 'یک کاربر'} با متن زیر دیده‌اید:
"${userMessageText}"

می‌خواهید در پی‌وی (چت خصوصی) به او پیام دهید و به عنوان یک تجربه شخصی و دوستانه، سرویس ${campaign.title} را معرفی کنید:
- قیمت: ${campaign.price}
- راه ارتباط و تست رایگان: ${contact}

دستورات:
۱. لحن کاملاً دوستانه، دلسوزانه و معمولی مثل فردی که خودش مشتری راضی سرویس است.
۲. اشاره کند که در گروه دیدم درباره این موضوع گفتی، گفتم اینجا برات بفرستم شاید به دردت بخوره.
۳. اشاره به تست رایگان و بدون قطعی بودن.
۴. ذکر کند که عکس مشخصات و تعرفه‌ها را هم همراه پیام فرستاده است.
۵. خروجی فقط متن نهایی بدون توضیح یا علامت گیومه باشد.`;

  const candidateModels = getAdaptiveCandidateModels();
  for (const modelName of candidateModels) {
    try {
      const timeoutMs = GEMINI_MODEL_METADATA[modelName]?.timeoutMs || 5000;
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
      );
      const apiPromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { temperature: 0.85 },
      });
      const res: any = await Promise.race([apiPromise, timeoutPromise]);
      const text = (res?.text || '').trim();
      if (text && text.length > 20) {
        recordGeminiSuccess(modelName);
        return { text: text.replace(/^["'«]/, '').replace(/["'»]$/, '').trim(), usedAi: true };
      }
    } catch (e: any) {
      recordGeminiFailure(modelName, e);
    }
  }

  return {
    text: generateCasualFriendPvMessage(category, matchedKeywords, campaign, userFirstName),
    usedAi: false,
  };
}

/**
 * Intelligent AI-Powered Multi-Bubble Friend PV Message using Gemini
 * Produces 4 human-like chat bursts:
 * 1. Greeting
 * 2. Group context
 * 3. Product recommendation & free trial
 * 4. Support handle
 */
export async function generateGeminiMultiBubbleFriendPv(
  userMessageText: string,
  category: LeadDetectionResult['category'],
  matchedKeywords: string[],
  campaign: ProductCampaign,
  userFirstName?: string,
  groupTitle?: string
): Promise<{ bubbles: MultiBubblePvMessage; usedAi: boolean }> {
  const fallback = generateMultiBubbleFriendPv(category, matchedKeywords, campaign, userFirstName, groupTitle);
  const ai = getGenAiClient();
  if (!ai || !process.env.GEMINI_API_KEY) {
    return { bubbles: fallback, usedAi: false };
  }

  const contact = campaign.contactHandle || '@Admin';
  const nameGreeting = userFirstName ? `${userFirstName} جان` : 'دوست عزیز';
  const groupRef = groupTitle ? `گروه «${groupTitle}»` : 'گروه';

  const prompt = `شما یک فرد عادی در تلگرام هستید که پیامی را از ${nameGreeting} در ${groupRef} با متن زیر دیده‌اید:
"${userMessageText}"

می‌خواهید در پی‌وی (چت شخصی تلگرام) دقیقاً مثل کاربران واقعی، پیام خود را به صورت ۴ حباب پیام کوتاه و مجزا (نه یک متن طولانی رباتی) به صورت JSON ارسال کنید:
- حباب ۱ (سلام): سلام و احوال‌پرسی خیلی کوتاه و خودمانی
- حباب ۲ (اشاره به گروه): اشاره کوتاه به اینکه توی ${groupRef} دیدم پیام دادی دنبال فیلترشکن/اینترنت/هوش مصنوعی بودی
- حباب ۳ (معرفی محصول): معرفی صمیمی سرویس بر اساس تجربه شخصی خودت (نام: ${campaign.title}، پینگ عالی و بدون قطعی، تست رایگان قبل خرید)
- حباب ۴ (پشتیبانی): معرفی آیدی پشتیبانی جهت دریافت تست رایگان: ${contact}

خروجی شما باید صرفاً یک آبجکت JSON معتبر به این صورت باشد:
{
  "greetingBubble": "سلام وقتت بخیر جان ✋",
  "contextBubble": "توی گروه دیدم گفتی فیلترشکن خوب می‌خوای",
  "productBubble": "من خودم از ${campaign.title} استفاده می‌کنم عالیه و قطعی نداره، تست رایگان هم دارن",
  "supportBubble": "به پشتیبانیشون پیام بدی سریع بهت تست میده: ${contact}",
  "bannerCaption": "اینم عکس تعرفه‌هاشون 👇"
}

نکته مهم: هر حباب باید حداکثر ۵ تا ۱۰ کلمه باشد. از جملات بلند یا ادبیات اداری خودداری کنید.`;

  const candidateModels = getAdaptiveCandidateModels();
  for (const modelName of candidateModels) {
    try {
      const timeoutMs = GEMINI_MODEL_METADATA[modelName]?.timeoutMs || 5000;
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
      );
      const apiPromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { 
          temperature: 0.8,
          responseMimeType: 'application/json'
        },
      });
      const res: any = await Promise.race([apiPromise, timeoutPromise]);
      const rawText = (res?.text || '').trim();
      if (rawText) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.greetingBubble && parsed.productBubble) {
            recordGeminiSuccess(modelName);
            const greeting = String(parsed.greetingBubble || fallback.greetingBubble).trim();
            const context = String(parsed.contextBubble || fallback.contextBubble).trim();
            const product = String(parsed.productBubble || fallback.productBubble).trim();
            const support = String(parsed.supportBubble || fallback.supportBubble).trim();
            const bannerCaption = String(parsed.bannerCaption || fallback.bannerCaption).trim();
            return {
              bubbles: {
                greetingBubble: greeting,
                contextBubble: context,
                productBubble: product,
                supportBubble: support,
                bannerCaption,
                allBubbles: [greeting, context, product, support].filter(Boolean),
              },
              usedAi: true,
            };
          }
        }
      }
    } catch (e: any) {
      recordGeminiFailure(modelName, e);
    }
  }

  return { bubbles: fallback, usedAi: false };
}

/**
 * Generates an intelligent, human-like reply when a user responds to our direct message in private chat (PV).
 * Guides them politely to support or answers their question.
 */
export function generateInboundPvReply(
  userMessageText: string,
  conversationHistory: Array<{ sender: 'user' | 'bot'; text: string }>,
  campaign: ProductCampaign,
  userFirstName?: string
): { bubbles: string[]; isHandoff: boolean } {
  const contact = campaign.contactHandle || '@Admin';
  const price = campaign.price || 'قیمت‌های خیلی مناسب و اقتصادی';
  const lower = (userMessageText || '').toLowerCase().trim();

  // 1. Negative / refusal
  if (/^(نه|مرسی|ممنون|نمیخوام|لازم ندارم|نمی‌خوام|علاقه‌ای ندارم|خیر|بای|مزاحم نشو)/.test(lower)) {
    return {
      bubbles: ['باشه عزیزم موفق باشی 🌹 اگر بعداً نیاز داشتی در خدمتم.'],
      isHandoff: false,
    };
  }

  // 2. Price query
  if (/قیمت|چنده|هزینه|تعرفه|پلن|اشتراک|چقدره/.test(lower)) {
    return {
      bubbles: [
        `تعرفه‌هاشون از ${price} شروع میشه و پلن‌های متنوع دارن`,
        `به پشتیبانیشون پیام بدی لیست دقیق پلن‌ها به همراه تست رایگان رو برات می‌فرسته: ${contact}`,
      ],
      isHandoff: true,
    };
  }

  // 3. Test / trial inquiry
  if (/تست|کانفیگ تست|اکانت تست|امتحان|رایگان|لینک/.test(lower)) {
    return {
      bubbles: [
        'آره تست رایگان دارن که قبل خرید کیفیت رو خودت چک کنی',
        `به آیدی پشتیبانی پیام بده بگو کانفیگ تست می‌خوای سریع برات ارسال می‌کنن: ${contact}`,
      ],
      isHandoff: true,
    };
  }

  // 4. Operator inquiry (Hamrah Aval, Irancell, Wi-Fi, etc.)
  if (/همراه اول|ایرانسل|رایتل|وای فای|مخابرات|مودم|نت ثابت|شاتل|زی تل|اپراتور/.test(lower)) {
    return {
      bubbles: [
        'روی تمام اپراتورها مخصوصاً همراه اول، ایرانسل و وای‌فای خانگی فعاله و سرورهای مختلف داره',
        `برای اینکه روی خط خودت تست کنی به پشتیبانیشون پیام بده تا کانفیگ مناسب رو برات بفرسته: ${contact}`,
      ],
      isHandoff: true,
    };
  }

  // 5. Contact handle inquiry
  if (/آیدی|ایدی|ادمین|پشتیبانی|کجا پیام بدم|لینک بد|شماره/.test(lower)) {
    return {
      bubbles: [
        `آیدی پشتیبانی تلگرامشون اینه: ${contact}`,
        'پیام بدی زیر ۵ دقیقه برات اکانت تست فعال می‌کنن',
      ],
      isHandoff: true,
    };
  }

  // Default helpful response
  return {
    bubbles: [
      'من خودم چند وقته دارم استفاده می‌کنم و سرعتش واقعاً خوبه',
      `برای دریافت کانفیگ تست رایگان و اطلاعات بیشتر با پشتیبانیشون در ارتباط باش: ${contact}`,
    ],
    isHandoff: true,
  };
}

/**
 * AI-Powered Inbound PV Reply using Gemini with Multi-Model Fallback
 */
export async function generateGeminiInboundPvReply(
  userMessageText: string,
  conversationHistory: Array<{ sender: 'user' | 'bot'; text: string }>,
  campaign: ProductCampaign,
  userFirstName?: string
): Promise<{ bubbles: string[]; usedAi: boolean; isHandoff: boolean }> {
  const fallback = generateInboundPvReply(userMessageText, conversationHistory, campaign, userFirstName);
  const ai = getGenAiClient();
  if (!ai || !process.env.GEMINI_API_KEY) {
    return { ...fallback, usedAi: false };
  }

  const contact = campaign.contactHandle || '@Admin';
  const historySnippet = conversationHistory
    .slice(-4)
    .map((m) => `${m.sender === 'user' ? 'کاربر' : 'شما'}: ${m.text}`)
    .join('\n');

  const prompt = `شما یک فرد عادی در تلگرام هستید که قبلاً به عنوان یک پیشنهاد دوستانه سرویس ${campaign.title} را به این کاربر معرفی کرده بودید.
اکنون او در پی‌وی به شما پیام داده است:
پیام کاربر: "${userMessageText}"

تاریخچه گفتگو:
${historySnippet}

اطلاعات سرویس:
- نام: ${campaign.title}
- تعرفه: ${campaign.price}
- پشتیبانی و اکانت تست: ${contact}
- ویژگی‌ها: آی‌پی ثابت، سرورهای V2ray اختصاصی، مناسب تمام اپراتورها (همراه اول و ایرانسل)، تست رایگان قبل خرید

وظیفه شما:
۱. به عنوان یک دوست در تلگرام، در ۱ یا نهایتاً ۲ حباب کوتاه (هر حباب ۵ تا ۱۰ کلمه روان محاوره‌ای) پاسخ دهید.
۲. اگر سوالی پرسید (قیمت، اپراتور، کیفیت، تست)، راهنمایی کنید و حتماً او را به پشتیبانی (${contact}) هدایت کنید تا تست رایگان بگیرد.
۳. اگر گفت تمایلی ندارد، محترمانه بگویید: «باشه عزیزم موفق باشی 🌹» و اصرار نکنید.
۴. خروجی را در قالب JSON با کلید "bubbles" (آرایه‌ای از ۱ یا ۲ رشته کوتاه) برگردانید:
{
  "bubbles": ["...", "..."],
  "isHandoff": true
}`;

  const candidateModels = getAdaptiveCandidateModels();
  for (const modelName of candidateModels) {
    try {
      const timeoutMs = GEMINI_MODEL_METADATA[modelName]?.timeoutMs || 5000;
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), timeoutMs)
      );
      const apiPromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { 
          temperature: 0.75,
          responseMimeType: 'application/json'
        },
      });
      const res: any = await Promise.race([apiPromise, timeoutPromise]);
      const rawText = (res?.text || '').trim();
      if (rawText) {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.bubbles) && parsed.bubbles.length > 0) {
            recordGeminiSuccess(modelName);
            const cleanBubbles = parsed.bubbles
              .map((b: any) => String(b || '').trim())
              .filter(Boolean);
            if (cleanBubbles.length > 0) {
              return {
                bubbles: cleanBubbles,
                usedAi: true,
                isHandoff: parsed.isHandoff !== false,
              };
            }
          }
        }
      }
    } catch (e: any) {
      recordGeminiFailure(modelName, e);
    }
  }

  return { ...fallback, usedAi: false };
}


