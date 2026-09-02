/**
 * Spintax Parser & Dynamic Text Variables Engine
 * Supports nested spintax syntax: {option1|option2|{sub1|sub2}}
 * Supports Persian & English dynamic variables for anti-spam randomization
 */

export interface SpintaxContext {
  groupTitle?: string;
  accountName?: string;
  contactHandle?: string;
  price?: string;
  campaignTitle?: string;
}

const EMOJI_POOL = ['✨', '💎', '🚀', '📌', '🎁', '🔥', '⚡', '🌟', '🛍️', '👑', '🎉', '💼', '🏷️', '🎯', '💫'];
const GREETING_POOL = [
  'سلام دوستان',
  'درود بر همگی',
  'سلام وقت بخیر',
  'سلام و درود',
  'درود بر اعضای محترم',
  'سلام خدمت دوستان عزیز',
  'وقت بخیر دوستان',
];
const CTA_POOL = [
  'جهت ثبت سفارش پیام دهید',
  'ارتباط مستقیم از طریق آیدی زیر',
  'مشاوره و اطلاعات بیشتر',
  'برای سفارش فوری در ارتباط باشید',
  'جهت پاسخگویی و هماهنگی پیام دهید',
];

/**
 * Resolves nested Spintax: {A|B|{C|D}} recursively.
 * IMPORTANT: Only matches braces that contain the pipe '|' delimiter to avoid eating variables like {random_emoji}.
 */
export function parseSpintax(text: string): string {
  if (!text || typeof text !== 'string') return '';

  // Matches innermost curly braces containing at least one pipe '|'
  const spintaxRegex = /\{([^{}|]+\|[^{}]+)\}/;
  let matches: RegExpExecArray | null;

  let iterations = 0;
  const maxIterations = 50;

  let result = text;
  while ((matches = spintaxRegex.exec(result)) !== null && iterations < maxIterations) {
    iterations++;
    const fullMatch = matches[0];
    const options = matches[1].split('|');
    const chosen = options[Math.floor(Math.random() * options.length)] || '';
    result = result.replace(fullMatch, chosen);
  }

  return result;
}

/**
 * Replaces dynamic placeholders with contextual and randomized values
 */
export function applyDynamicVariables(text: string, context: SpintaxContext = {}): string {
  if (!text || typeof text !== 'string') return '';

  const now = new Date();
  const timeFa = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  const dateFa = now.toLocaleDateString('fa-IR');
  
  const weekDaysFa = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  const dayName = weekDaysFa[now.getDay()] || 'امروز';

  const randomEmoji = () => EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
  const randomGreeting = () => GREETING_POOL[Math.floor(Math.random() * GREETING_POOL.length)];
  const randomCta = () => CTA_POOL[Math.floor(Math.random() * CTA_POOL.length)];
  const randomId = () => '#' + Math.floor(1000 + Math.random() * 9000).toString();
  const randomNum = () => Math.floor(10 + Math.random() * 90).toString();

  let processed = text;

  // Group Title
  const cleanGroupTitle = context.groupTitle ? context.groupTitle.replace(/[#@]/g, '').trim() : 'گروه';
  processed = processed.replace(/\{(group_title|نام_گروه|گروه)\}/gi, cleanGroupTitle);

  // Time & Date
  processed = processed.replace(/\{(time|ساعت|زمان)\}/gi, timeFa);
  processed = processed.replace(/\{(date|تاریخ)\}/gi, dateFa);
  processed = processed.replace(/\{(day_of_week|روز_هفته|روز)\}/gi, dayName);

  // Randomizer Variables
  processed = processed.replace(/\{(random_emoji|اموجی|اموجی_رندوم|emoji)\}/gi, () => randomEmoji());
  processed = processed.replace(/\{(greeting|احوالپرسی|سلام)\}/gi, () => randomGreeting());
  processed = processed.replace(/\{(cta_text|متن_اقدام|اقدام_به_خرید|call_to_action)\}/gi, () => randomCta());
  processed = processed.replace(/\{(random_id|کد_پیگیری|شناسه_پیگیری|کد_رندوم)\}/gi, () => randomId());
  processed = processed.replace(/\{(random_num|عدد_رندوم|عدد_تصادفی)\}/gi, () => randomNum());

  // Contact & Price
  if (context.contactHandle) {
    processed = processed.replace(/\{(contact|آیدی_تماس|پشتیبانی|آیدی_پشتیبانی)\}/gi, context.contactHandle);
  }
  if (context.price) {
    processed = processed.replace(/\{(price|قیمت)\}/gi, context.price);
  }
  if (context.campaignTitle) {
    processed = processed.replace(/\{(campaign_title|نام_کمپین|عنوان_محصول)\}/gi, context.campaignTitle);
  }
  if (context.accountName) {
    processed = processed.replace(/\{(account_name|نام_اکانت)\}/gi, context.accountName);
  }

  return processed;
}

/**
 * Full Pipeline: Applies Spintax resolution and Dynamic Variable replacement safely
 */
export function processSpintaxMessage(
  rawText: string,
  context: SpintaxContext = {}
): {
  processedText: string;
  isSpintaxUsed: boolean;
  hasVariables: boolean;
} {
  if (!rawText) return { processedText: '', isSpintaxUsed: false, hasVariables: false };

  const isSpintaxUsed = /\{[^{}]+\|[^{}]+\}/.test(rawText);
  const hasVariables = /\{(group_title|نام_گروه|گروه|time|ساعت|زمان|date|تاریخ|day_of_week|روز_هفته|روز|random_emoji|اموجی|اموجی_رندوم|emoji|greeting|احوالپرسی|سلام|cta_text|متن_اقدام|اقدام_به_خرید|call_to_action|random_id|کد_پیگیری|شناسه_پیگیری|random_num|عدد_رندوم|contact|آیدی_تماس|پشتیبانی|price|قیمت|campaign_title|نام_کمپین|account_name|نام_اکانت)\}/i.test(rawText);

  // 1. Initial Variable replacement
  let output = applyDynamicVariables(rawText, context);
  // 2. Spintax resolution step
  output = parseSpintax(output);
  // 3. Final Variable replacement for any variables nested inside chosen Spintax options
  output = applyDynamicVariables(output, context);

  return {
    processedText: output,
    isSpintaxUsed,
    hasVariables,
  };
}

export function processMessageWithSpintaxAndVars(
  rawText: string,
  context: SpintaxContext = {}
): {
  text: string;
  spintaxApplied: boolean;
} {
  const res = processSpintaxMessage(rawText, context);
  return {
    text: res.processedText,
    spintaxApplied: res.isSpintaxUsed || res.hasVariables,
  };
}

/**
 * Generates N preview variations to demonstrate diversity
 */
export function generateSpintaxSamples(rawText: string, count = 3, context: SpintaxContext = {}): string[] {
  const samples = new Set<string>();
  for (let i = 0; i < count * 3; i++) {
    const res = processSpintaxMessage(rawText, context).processedText;
    samples.add(res);
    if (samples.size >= count) break;
  }
  return Array.from(samples);
}

export const SPINTAX_VARIABLE_TAGS = [
  { tag: '{random_emoji}', label: 'اموجی تصادفی', icon: '✨' },
  { tag: '{greeting}', label: 'احوالپرسی متغیر', icon: '👋' },
  { tag: '{group_title}', label: 'نام گروه جاری', icon: '👥' },
  { tag: '{time}', label: 'ساعت ارسال', icon: '⏰' },
  { tag: '{random_id}', label: 'کد پیگیری رندوم', icon: '🔢' },
  { tag: '{cta_text}', label: 'متن دعوت به اقدام', icon: '📢' },
];
