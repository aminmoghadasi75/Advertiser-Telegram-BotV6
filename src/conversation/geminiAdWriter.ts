import { GoogleGenAI } from '@google/genai';
import { ProductCampaign } from '../types.js';
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
  } catch (e: any) {
    console.warn('[GeminiAdWriter] Failed to initialize GoogleGenAI client:', e?.message || e);
    return null;
  }
}

const EMOJI_POOL = [
  '⚡', '🚀', '📌', '💎', '🛡️', '✨', '🔥', '🌟', '🔑', '🎯',
  '💫', '👑', '🎉', '💼', '🏷️', '🌐', '📶', '📱', '💻', '💡',
  '🟢', '🟣', '🟠', '🔹', '🔸'
];

const GREETING_POOL = [
  'سلام و درود به اعضای محترم',
  'درود بر دوستان عزیز',
  'سلام خدمت همه دوستان گل',
  'وقت بخیر همراهان گرامی',
  'سلام به بچه‌های باانرژی',
  'سلام خدمت همه بچه‌ها',
  'درود و وقت همگی بخیر',
];

const CTA_POOL = [
  'جهت تست رایگان و اطلاعات بیشتر پیام دهید',
  'ارتباط مستقیم و دریافت فوری از طریق',
  'مشاوره، تست سرعت و سفارش',
  'برای تحویل آنی و ثبت سفارش پیام دهید',
  'پاسخگویی سریع و راهنمایی کامل در',
];

/**
 * 100% Robust Local Variable and Spintax Replacer
 * Guarantees NO raw curly braces ({...}) remain in the final message.
 */
export function processVariablesAndSpintax(
  template: string,
  context: {
    groupTitle?: string;
    contactHandle?: string;
    price?: string;
    campaignTitle?: string;
    accountName?: string;
  } = {}
): string {
  if (!template || typeof template !== 'string') return '';

  const now = new Date();
  const timeFa = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  const dateFa = now.toLocaleDateString('fa-IR');
  const weekDaysFa = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  const dayName = weekDaysFa[now.getDay()] || 'امروز';

  const cleanGroupTitle = context.groupTitle
    ? context.groupTitle.replace(/[#@]/g, '').trim()
    : 'گروه';

  let text = template;

  // 1. Recursive Spintax resolver {opt1|opt2|opt3}
  const spintaxRegex = /\{([^{}|]+\|[^{}]+)\}/;
  let iterations = 0;
  while (spintaxRegex.test(text) && iterations < 30) {
    iterations++;
    text = text.replace(spintaxRegex, (_, choicesStr) => {
      const choices = choicesStr.split('|');
      return choices[Math.floor(Math.random() * choices.length)] || '';
    });
  }

  // 2. Dynamic variable replacements (case-insensitive & Persian aliases)
  text = text.replace(/\{(group_title|نام_گروه|گروه|عنوان_گروه)\}/gi, cleanGroupTitle);
  text = text.replace(/\{(time|ساعت|زمان|ساعت_الان)\}/gi, timeFa);
  text = text.replace(/\{(date|تاریخ)\}/gi, dateFa);
  text = text.replace(/\{(day_of_week|روز_هفته|روز)\}/gi, dayName);

  text = text.replace(/\{(random_emoji|اموجی|اموجی_رندوم|ایموجی|emoji)\}/gi, () => {
    return EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
  });

  text = text.replace(/\{(greeting|احوالپرسی|سلام|درود)\}/gi, () => {
    return GREETING_POOL[Math.floor(Math.random() * GREETING_POOL.length)];
  });

  text = text.replace(/\{(cta_text|متن_اقدام|اقدام_به_خرید|call_to_action)\}/gi, () => {
    return CTA_POOL[Math.floor(Math.random() * CTA_POOL.length)];
  });

  text = text.replace(/\{(random_id|کد_پیگیری|شناسه_پیگیری|کد_رندوم|کد_شناسه)\}/gi, () => {
    return '#' + Math.floor(1000 + Math.random() * 9000).toString();
  });

  text = text.replace(/\{(random_num|عدد_رندوم|عدد_تصادفی)\}/gi, () => {
    return Math.floor(10 + Math.random() * 90).toString();
  });

  if (context.contactHandle) {
    text = text.replace(/\{(contact|آیدی_تماس|پشتیبانی|آیدی_پشتیبانی|سفارش)\}/gi, context.contactHandle);
  }
  if (context.price) {
    text = text.replace(/\{(price|قیمت|تعرفه)\}/gi, context.price);
  }
  if (context.campaignTitle) {
    text = text.replace(/\{(campaign_title|نام_کمپین|عنوان_محصول|نام_محصول)\}/gi, context.campaignTitle);
  }
  if (context.accountName) {
    text = text.replace(/\{(account_name|نام_اکانت)\}/gi, context.accountName);
  }

  // 3. Safety Fallback: Remove ANY remaining {placeholder} patterns so raw templates NEVER leak
  text = text.replace(/\{[a-zA-Z0-9_\u0600-\u06FF\s]+\}/g, (match) => {
    // If it mentions emoji, replace with emoji
    if (/emoji|اموجی|ایموجی/i.test(match)) {
      return EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
    }
    // If it mentions time, replace with timeFa
    if (/time|ساعت|زمان/i.test(match)) {
      return timeFa;
    }
    // If it mentions group, replace with cleanGroupTitle
    if (/group|گروه/i.test(match)) {
      return cleanGroupTitle;
    }
    // Otherwise strip braces
    return match.replace(/[{}]/g, '').trim();
  });

  return text.trim();
}

/**
 * Local Fallback Ad Caption Builder
 * Generates an anti-spam compliant Persian ad caption when Gemini is offline.
 */
export function generateLocalDynamicCaption(
  campaign: ProductCampaign,
  context: {
    groupTitle?: string;
    accountName?: string;
  } = {}
): string {
  const cleanGroupTitle = context.groupTitle ? context.groupTitle.replace(/[#@]/g, '').trim() : 'گروه';
  const resolvedDesc = processVariablesAndSpintax(campaign.description || '', {
    groupTitle: cleanGroupTitle,
    contactHandle: campaign.contactHandle,
    price: campaign.price,
    campaignTitle: campaign.title,
    accountName: context.accountName,
  });

  const now = new Date();
  const timeFa = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  const randomEmoji1 = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
  const randomEmoji2 = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];

  // Construct structured Telegram caption
  const lines: string[] = [];
  lines.push(`📌 **${campaign.title}**`);
  if (campaign.price) {
    lines.push(`💰 **قیمت:** ${campaign.price}`);
  }
  lines.push('');
  lines.push(resolvedDesc);
  lines.push('');
  const effectiveContact = (campaign.contactHandle && campaign.contactHandle !== 'در عکس بالا') ? campaign.contactHandle : '@Nova_vpn10';
  lines.push(`👤 **سفارش و ارتباط:** ${effectiveContact}`);

  if (campaign.hashtags && campaign.hashtags.length > 0) {
    const formattedTags = campaign.hashtags
      .map(h => (h.startsWith('#') ? h : '#' + h))
      .join(' ');
    lines.push(formattedTags);
  }

  // Micro-variation anti-fingerprint tag at the very end
  lines.push(`\n${randomEmoji1} ساعت ارسال: ${timeFa} ${randomEmoji2}`);

  return lines.join('\n');
}

/**
 * Main AI-Powered Dynamic Caption Generator using Gemini (gemini-3.8-flash)
 * Generates a fresh, completely unique Persian Telegram advertising caption for each group
 * to effectively bypass Telegram's repetitive content and spam fingerprint analyzers.
 */
export async function generateGeminiDynamicAdCaption(params: {
  campaign: ProductCampaign;
  groupTitle?: string;
  accountName?: string;
  tone?: 'friendly' | 'marketing' | 'concise' | 'recommender';
}): Promise<{ text: string; usedAi: boolean; model?: string }> {
  const { campaign, groupTitle, accountName, tone = 'friendly' } = params;

  const cleanGroupTitle = groupTitle ? groupTitle.replace(/[#@]/g, '').trim() : 'گروه';
  const now = new Date();
  const timeFa = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

  const ai = getGenAiClient();

  if (!ai || !process.env.GEMINI_API_KEY) {
    // Graceful fallback to local engine
    const localText = generateLocalDynamicCaption(campaign, { groupTitle, accountName });
    return { text: localText, usedAi: false };
  }

  const toneInstructions = {
    friendly: 'صمیمی، خودمانی و جذاب، مانند پیامی از طرف یک دوست یا عضو فعال گروه که یک ابزار عالی را پیشنهاد می‌دهد.',
    marketing: 'بازاریابی حرفه‌ای، باکلاس، پرانرژی و ترغیب‌کننده برای تصمیم‌گیری فوری.',
    concise: 'بسیار خلاصه، مینیمال، سریع‌خوان و فقط حاوی نکات کلیدی و قیمت و راه ارتباطی.',
    recommender: 'تجربی و پیشنهادی، با تمرکز بر حل مشکلات قطعی اینترنت، اینستا، یوتیوب و ابزارهای هوش مصنوعی.',
  }[tone] || 'صمیمی، جذاب و باکلاس';

  const effectiveContactHandle = (campaign.contactHandle && campaign.contactHandle !== 'در عکس بالا') ? campaign.contactHandle : '@Nova_vpn10';

  const prompt = `شما یک کپی‌رایتر فوق‌حرفه‌ای تبلیغات تلگرام به زبان فارسی هستید.
وظیفه شما: نگارش یک «کپشن تبلیغاتی» برای قرار گرفتن در زیر عکس/بنر ارسالی به یک گروه تلگرامی است.

⚠️ دستور حیاتی و مهم ضد اسپم تلگرام:
سیستم شناسایی اسپم تلگرام متن‌های تکراری را بلافاصله شناسایی و مسدود می‌کند.
به همین دلیل شما باید این پیام را کاملاً منحصربه‌فرد، با واژگان تازه، شروع متفاوت، ساختار جمله‌بندی دگرگون‌شده و چیدمان جدید بنویسید به گونه‌ای که هیچ رباتی نتواند آن را به عنوان الگوی تکراری شناسایی کند.

مشخصات کمپین تبلیغاتی:
- نام محصول یا برند: ${campaign.title}
- قیمت یا تعرفه: ${campaign.price}
- راه تماس و سفارش: ${effectiveContactHandle}
- متن توضیحات مرجع کاربر (الهام بگیرید ولی واو به واو کپی نکنید):
"""
${campaign.description || ''}
"""
- نام گروه هدف: ${cleanGroupTitle}
- ساعت فعلی: ${timeFa}
- لحن مطلوب: ${toneInstructions}

قوانین الزامی نگارش:
۱. متن باید دقیقاً مناسب کپشن زیر عکس در تلگرام باشد (بین ۴ تا ۶ خط شکیل و خوانا).
۲. در ابتدای متن با یک احوالپرسی یا جمله ترغیب‌کننده متناسب با بچه‌های گروه (${cleanGroupTitle}) شروع کنید.
۳. اشاره به ویژگی‌ها: پایداری، سرعت بالا، بدون قطعی، مناسب یوتیوب، اینستاگرام، گیم و استفاده از هوش مصنوعی (مثل ChatGPT و جمنای).
۴. حتماً قیمت (${campaign.price}) و نحوه ارتباط/سفارش (${effectiveContactHandle}) در انتهای متن قید شود.
۵. از ایموجی‌های مناسب (📌، ⚡، 🚀، 💎، 🛡️، ✨، 💰، 🔥) به جا و با سلیقه استفاده کنید.
۶. ⚠️ هیچ‌گونه متغیر با آکولاد مانند {random_emoji}، {time}، {group_title} نباید در خروجی ظاهر شود! اگر در متن مرجع بود، کلمات و ایموجی‌های زنده بنویسید.
۷. خروجی فقط و فقط متن نهایی تلگرام باشد؛ بدون هیچ مقدمه، توضیح، پاورقی یا علامت گیومه اضافه.`;

  const candidateModels = getAdaptiveCandidateModels();

  for (const modelName of candidateModels) {
    try {
      const timeoutMs = GEMINI_MODEL_METADATA[modelName]?.timeoutMs || 6500;
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('GEMINI_CAPTION_TIMEOUT')), timeoutMs)
      );

      const apiCallPromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite Persian Telegram copywriter generating unique, spam-resistant marketing captions.',
          temperature: 0.95, // high temperature for creative variety
        },
      });

      const response: any = await Promise.race([apiCallPromise, timeoutPromise]);
      let generated = (response?.text || '').trim();

      if (generated && generated.length > 20) {
        recordGeminiSuccess(modelName);

        // Clean quotes or markdown wrappers if any
        generated = generated.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '').trim();
        generated = generated.replace(/^["'«]/, '').replace(/["'»]$/, '').trim();

        // Final pass to guarantee no stray braces leaked
        generated = processVariablesAndSpintax(generated, {
          groupTitle: cleanGroupTitle,
          contactHandle: campaign.contactHandle,
          price: campaign.price,
          campaignTitle: campaign.title,
          accountName,
        });

        return {
          text: generated,
          usedAi: true,
          model: modelName,
        };
      }
    } catch (err: any) {
      recordGeminiFailure(modelName, err);
      console.warn(`[GeminiAdWriter] Model ${modelName} failed, falling back to backup model:`, err?.message || err);
    }
  }

  // Fallback to local dynamic generator
  const fallback = generateLocalDynamicCaption(campaign, { groupTitle, accountName });
  return {
    text: fallback,
    usedAi: false,
  };
}
