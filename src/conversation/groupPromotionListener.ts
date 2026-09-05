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
    'ایکس',
    'واتساپ',
    'whatsapp',
  ],
  gaming_ping: [
    'پینگ',
    'کاهش پینگ',
    'پینگ تایم',
    'لگ دارم',
    'لگ بازی',
    'کالاف',
    'پابجی',
    'وارزون',
    'بازی آنلاین',
  ],
};

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

  // 5. Gaming check
  for (const kw of TAXONOMY.gaming_ping) {
    if (normalized.includes(kw.toLowerCase())) {
      matchedKeywords.add(kw);
      if (categoryScore < 2) {
        matchedCategory = 'gaming_ping';
      }
      categoryScore += 2;
    }
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
  const contact = campaign.contactHandle || '@Admin';
  const price = campaign.price ? `با تعرفه اقتصادی (${campaign.price})` : '';

  switch (category) {
    case 'ai_chatgpt':
      return `سلام دوست عزیز! برای دسترسی بدون تحریم و پرسرعت به ChatGPT و ابزارهای هوش مصنوعی، سرورهای اختصاصی V2ray با آی‌پی ثابت و بدون قطعی کاملاً تست شده و فعالند. قبل از خرید تست رایگان هم داریم. جهت راهنمایی سریع به پشتیبانی پیام بدید: ${contact}`;

    case 'net_speed':
      return `سلام وقت بخیر، اگر درگیر کندی اینترنت یا اختلال اپراتورها (همراه اول و ایرانسل) هستید، کانفیگ‌های اختصاصی ما با پینگ پایین و سرعت پایدار تضمینی ${price} بهترین گزینه‌ست. جهت تست رایگان با پشتیبانی در ارتباط باشید: ${contact}`;

    case 'social_media':
      return `سلام دوست عزیز، برای باز کردن فوری ویدیوهای یوتیوب و استوری‌های اینستا بدون معطلی و قطعی، سرورهای ضد فیلتر پرسرعت و پایدار ما رو امتحان کنید (با امکان تست رایگان). ارتباط مستقیم با ادمین: ${contact}`;

    case 'gaming_ping':
      return `سلام وقت بخیر، برای کاهش پینگ، رفع لگ در بازی‌ها و ثبات اتصال، سرورهای اختصاصی با پینگ زیر ۸۰ میلی‌ثانیه فعالند. تست رایگان قبل از خرید: ${contact}`;

    case 'vpn_filter':
    default:
      return `سلام دوست عزیز، ${campaign.title || 'سرویس‌های اختصاصی V2ray و فیلترشکن پرسرعت'} با کیفیت تضمینی، آی‌پی ثابت و تست رایگان روی تمام اینترنت‌ها فعاله. جهت تست و مشاوره به پشتیبانی پیام بدید: ${contact}`;
  }
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
  const nameGreeting = userFirstName ? `${userFirstName} جان` : 'دوست عزیز';
  const contact = campaign.contactHandle || '@Admin';
  const priceNotice = campaign.price ? `قیمت‌هاشون هم خیلی مناسبه (${campaign.price})` : 'قیمتش هم خیلی به‌صرفه و مناسبه';

  let topicPhrase = 'فیلترشکن و مشکل اینترنت';
  if (category === 'ai_chatgpt') {
    topicPhrase = 'هوش مصنوعی و باز کردن چت‌جی‌پی‌تی';
  } else if (category === 'net_speed') {
    topicPhrase = 'افت سرعت و قطعی اینترنت';
  } else if (category === 'social_media') {
    topicPhrase = 'مشکل لود اینستاگرام و یوتیوب';
  } else if (category === 'gaming_ping') {
    topicPhrase = 'کاهش پینگ و قطعی گیم';
  }

  return `سلام وقتت بخیر ${nameGreeting} ✋
دیدم توی گروه در مورد ${topicPhrase} پیام داده بودی.

خواستم به عنوان یه پیشنهاد بهت بگم من خودم مدتیه برای دور زدن قطعی‌ها و کار با اینستا، یوتیوب و چت‌جی‌پی‌تی از این کانفیگ و وی‌پی‌ان اختصاصی استفاده می‌کنم. واقعاً سرعتش عالیه، آی‌پی ثابته و برخلاف بقیه مدام قطع و وصل نمیشه.

${priceNotice} و خوبی‌شون اینه که تست رایگان هم دارن، یعنی اول بهت کانفیگ می‌دن تست کنی اگر راضی بودی بعد تمدید کنی.
گفتم معرفیش کنم شاید مشکلت حل بشه:
👤 آیدی پشتیبانیشون در تلگرام: ${contact}

📌 عکس تعرفه‌ها و مشخصات سرورهاشون رو هم برات فرستادم 👇`;
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

  const contact = campaign.contactHandle || '@Admin';
  const prompt = `شما یک کاربر عادی و بسیار بااخلاق و کاربلد در یک گروه تلگرامی هستید.
یک کاربر در گروه پیامی فرستاده و به مشکل فیلترینگ، اینترنت، هوش مصنوعی یا وی‌پی‌ان اشاره کرده است:
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
۴. آیدی پشتیبانی (${contact}) را ذکر کند.
۵. خروجی فقط متن پاسخ بدون گیومه یا مقدمه باشد.`;

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

