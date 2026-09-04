import {
  ConversationState,
  Intent,
  PromotionLevel,
  ConversationContext,
  AnonymousProductPromotion,
} from '../types';
import { checkResponseSimilarity, SimilarityCheckResult } from './similarityDetector';
import { DEFAULT_PRODUCT_CONFIG, ProductConfig } from '../config/productConfig';

export interface ValidationRuleResult {
  ruleName: string;
  passed: boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedText: string;
  violations: string[];
  ruleResults: ValidationRuleResult[];
  requiresRegeneration: boolean;
  wasFallbackUsed: boolean;
  similarityInfo?: SimilarityCheckResult;
}

export const MAX_BOT_MESSAGES_LIMIT = 25;
export const MAX_COMMERCIAL_LEAD_MESSAGES_LIMIT = 35;

/**
 * Repairs broken, truncated, or incomplete Persian sentence endings
 * e.g., "چیکار می" -> "چیکار می‌کنی؟", dangling conjunctions/prepositions stripped
 */
export function repairIncompleteSentences(text: string): string {
  if (!text) return '';
  let fixed = text.trim();

  // Repair specific common truncated verb phrases
  if (/(?:چیکار|داری|داری چیکار|چیکارا)\s+می$/i.test(fixed)) {
    fixed = fixed.replace(/\s+می$/i, ' می‌کنی؟');
  } else if (/(?:کجا|داری)\s+می$/i.test(fixed)) {
    fixed = fixed.replace(/\s+می$/i, ' می‌ری؟');
  } else if (/(?:چی|چی شد|که)\s+می$/i.test(fixed)) {
    fixed = fixed.replace(/\s+می$/i, ' می‌شه؟');
  } else if (/\bمی$/i.test(fixed)) {
    fixed = fixed.replace(/\s*می$/i, ' کنی؟');
  } else if (/\bنمی$/i.test(fixed)) {
    fixed = fixed.replace(/\s*نمی$/i, ' خوای؟');
  }

  // Remove dangling conjunctions or prepositions left at the very end
  fixed = fixed.replace(/\s+(که|چون|اگر|اگه|برای|واسه|تا|به|با|از|رو|در|اما|ولی|یا|و)\s*$/i, '').trim();

  // Remove leading dangling conjunctions on split bubbles (e.g. "و تست رایگان داریم" -> "تست رایگان داریم")
  fixed = fixed.replace(/^(?:و|یا)\s+/i, '').trim();

  // Remove dangling commas or trailing colons
  fixed = fixed.replace(/[,،:;\-–—]+$/, '').trim();

  return fixed;
}

/**
 * Aggressively removes overly affectionate, over-familiar, and cringe vocatives
 * (عزیزم, جانم, جان, گلم, گل من, فدات, فدات شم, قربونت, عشقم, جیگرم)
 * when chatting with unfamiliar strangers on Telegram.
 */
export function stripAffectionateTerms(text: string): string {
  if (!text) return '';
  // Match affectionate words when isolated or preceded/followed by punctuation/spaces/boundaries
  const pattern = /(?:^|[\s،,؛;:\-–])(?:عزیزم|عزیز دلم|عزیز دل|عزیز جان|عزیز|جانم|جان|گلم|گل من|فدات شم|فدات بشم|فدات|قربونت برم|قربونت بشم|قربونت|عشقم|عشق من|جیگرم|جیگر)(?=[\s،,؛;:\-–!؟?.]|$)/gi;
  let res = text.replace(pattern, ' ');
  res = res.replace(pattern, ' '); // Run twice to catch adjacent phrases like "سلام عزیزم گلم"
  return res.replace(/\s+/g, ' ').trim();
}

/**
 * Cleans prompt leakage, code artifacts, markdown remnants, stray slashes, quotes, brackets,
 * and strips unnatural punctuation (periods at end of chat bubbles, multiple exclamation marks, formal quotes, colons).
 * Normalizes textual age representations (e.g., "بیست و شش" -> "۲۶") into human-like digits.
 */
export function cleanCodeArtifactsAndPunctuation(rawText: string): string {
  if (!rawText) return '';
  let cleaned = rawText;

  // 1. Strip internal system prompt tags, banner tags, and control tokens in all formats
  cleaned = cleaned.replace(/\[?\s*(?:SEND_PROMO_BANNER|PROMO_BANNER|SEND_PROMO_CARD|PROMO_TRIGGER|PROMO_CARD|SEND\s+PROMO\s+CARD|SEND_PROMO|SEND\s+PROMO|BANNER|PROMO|ارسال_تبلیغ|ارسال\s*بنر|کپشن\s*عکس|کپشن:?)\s*\]?/gi, ' ');
  cleaned = cleaned.replace(/[_—–\-\s]*\b(?:BANNER|SEND_PROMO_BANNER|PROMO_BANNER|PROMO_CARD)\b[_—–\-\s]*/gi, ' ');
  cleaned = cleaned.replace(/[_—–\-]+BANNER[_—–\-]+/gi, ' ');
  cleaned = cleaned.replace(/(?:^|\s)[_—–\-]*BANNER[_—–\-]*(?:\s|$)/gi, ' ');
  cleaned = cleaned.replace(/\[?BANNER\]?/gi, ' ');

  // 1.2 Strip AI reasoning, draft prefixes, and option labels
  cleaned = cleaned.replace(/(?:^|[\n\r]+)\s*(?:پیش[\s‌-]*نویس|نویس|پاسخ|گزینه|پیام|حباب|پیشنهاد|متن|Draft|Option|Response|Message|Bubble)\s*(?:شماره\s*)?[۰-۹\d]+[\s:：\-–—]*/gi, ' ');
  cleaned = cleaned.replace(/\b(?:پیش[\s‌-]*نویس|نویس)\s+[۰-۹\d]+\s*/gi, ' ');

  // 1.3 Strip English AI chain-of-thought, meta-reasoning, and thinking leakage
  cleaned = cleaned.replace(/(?:^|[\n\r]+|\b)(?:wait|thinking|thought|reasoning|internal|user\s+asked|the\s+user\s+asked|direct\s+question|as\s+an\s+ai|as\s+a\s+bot|i\s+should|i\s+need\s+to|let\s+me|note\s+that|my\s+response|here\s+is\s+the\s+reply)\b[^\n\r]*[\n\r]*/gi, ' ');
  cleaned = cleaned.replace(/\b(?:wait|direct\s+question|user\s+asked|specific\s+question)\b/gi, ' ');

  // 2. Remove markdown code blocks and inline code formatting
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 3. Remove comments and syntax artifacts (e.g. /* ... */, // ..., / "). * ", etc.)
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  cleaned = cleaned.replace(/(?:\/{2,}|\/\*+|\*+\/|[\\\/]\s*["')\]]+\s*(?:\.\s*\*?\s*")?).*/g, '');
  cleaned = cleaned.replace(/[\/\\*#~`^<>{}[\]|•]+/g, ' ');
  // Clean isolated formatting underscores without breaking handle names like nova_vpn10
  cleaned = cleaned.replace(/(?<![a-zA-Z0-9])_(?![a-zA-Z0-9])|(?<=\s)_(?=\s)|_{2,}/g, ' ');

  // 3.5 Strip non-allowed English words (strictly keep only valid technical tokens like vpn, v2ray, ios, android, nova_vpn10)
  const ALLOWED_ENGLISH_WORDS = new Set([
    'vpn', 'v2ray', 'v2rayng', 'vless', 'vmess', 'shadowsocks', 'trojan', 'ssh', 'ping',
    'ios', 'android', 'windows', 'mac', 'streisand', 'nekoray', 'hiddify', 'singbox', 'sing-box',
    'outline', 'warp', 'wireguard', 'app', 'bot', 'ip', 'gb', 'mb', 'wifi', 'dns', 'tg', 't.me',
    'nova_vpn10', 'fastvpnsupport', 'config', 'support', 'online', 'id', 'asl', 'gbps', 'mbps', 'udp', 'tcp'
  ]);

  // Strip English words that are not in allowed list
  cleaned = cleaned.replace(/\b[a-zA-Z]{2,}\b/g, (match) => {
    const lower = match.toLowerCase();
    if (ALLOWED_ENGLISH_WORDS.has(lower) || lower.startsWith('nova_vpn')) {
      return match;
    }
    return '';
  });

  // 4. Remove all emojis (sparkles, flowers, faces, etc.)
  cleaned = cleaned.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ');
  cleaned = cleaned.replace(/[🌸🌹✨💐🌺🌷🌻❤️🤍💙]/g, ' ');

  // 5. Remove @ from telegram handles and normalize nova_vpn10 (strictly no @ and with underscore _)
  cleaned = cleaned.replace(/@([a-zA-Z0-9_]+)/g, '$1');
  cleaned = cleaned.replace(/\bnova\s+vpn\s*10\b/gi, 'nova_vpn10');
  cleaned = cleaned.replace(/\bFastVpnSupport\b/gi, 'nova_vpn10');

  // 6. Remove stray quote and paren artifacts in middle of text
  cleaned = cleaned.replace(/["'«»“”\(\)]\s*[\.\*\/\\\-]+\s*["'«»“”\(\)]/g, ' ');
  cleaned = cleaned.replace(/["'«»“”]/g, '');

  // 7. Remove leading/trailing symbols, quotes, brackets, slashes, colons
  cleaned = cleaned.replace(/^["'«»“”(.)\/\\:;؛،,\s\-–—]+/, '');
  cleaned = cleaned.replace(/["'«»“”(.)\/\\:;؛،,\s\-–—]+$/, '');

  // 8. Clean unnatural punctuation for Telegram chat:
  // - Remove multiple exclamation marks
  cleaned = cleaned.replace(/!+/g, '');
  // - Clean redundant question marks (leave at most one ؟)
  cleaned = cleaned.replace(/([؟?]){2,}/g, '$1');
  // - Clean redundant commas, semicolons, and colons
  cleaned = cleaned.replace(/[,،;؛:：]+/g, ' ');
  // - Remove trailing dots or dots at the end of sentences
  cleaned = cleaned.replace(/\.+$/g, '');
  cleaned = cleaned.replace(/\.+/g, ' ');

  // 9. Normalize age: Convert written Persian words for age 26 (e.g. "بیست و شش") to natural digits "۲۶"
  cleaned = cleaned
    .replace(/بیست\s+و\s+شش/g, '۲۶')
    .replace(/بیست\s+و\s+شیش/g, '۲۶')
    .replace(/بیست\s+و\s+6/g, '۲۶')
    .replace(/20\s+ساله/g, '۲۶ ساله')
    .replace(/۲۰\s+ساله/g, '۲۶ ساله')
    .replace(/بیست\s+ساله/g, '۲۶ ساله')
    .replace(/بیست\s+سالمه/g, '۲۶ سالمه');

  // 10. Aggressively strip over-familiar / affectionate words (عزیزم, جانم, جان, گلم, فدات, قربونت, etc.)
  cleaned = stripAffectionateTerms(cleaned);

  // 10.5. Strip robotic textbook clichés like "شما چطور؟", "شما چی؟", "تو چطور؟"
  // When appended at the end of sentences (e.g. "مرسی خوبم خوشبختم مجردم شما چطور؟" -> "مرسی خوبم خوشبختم مجردم")
  cleaned = cleaned.replace(/(?:[\n،,؛;\s]+|^)(?:شما\s*چطور\s*[؟?]?|شما\s*چی\s*[؟?]?|تو\s*چطور\s*[؟?]?|شما\s*چطوری\s*[؟?]?|خودت\s*چطور\s*[؟?]?)$/gi, '').trim();

  // 11. Clean multi-spaces and redundant whitespace
  cleaned = cleaned.replace(/[ \t]+/g, ' ').trim();

  // 12. Repair truncated verbs/prefixes
  cleaned = repairIncompleteSentences(cleaned);

  // 13. Final trim of trailing punctuation
  cleaned = cleaned.replace(/[\.\:،,!;؛\-–—]+$/g, '').trim();

  return cleaned;
}

/**
 * Splits text into natural Telegram chat bubbles respecting Persian syntactic & semantic boundaries.
 * Guarantees that sentences are NEVER sliced mid-phrase or left with dangling prepositions/particles.
 */
export function splitIntoNaturalBubbles(
  text: string,
  maxChunks: number = 2,
  maxWordsPerBubble: number = 8
): string[] {
  if (!text) return [];
  const clean = cleanCodeArtifactsAndPunctuation(text).trim();
  if (!clean) return [];

  // 1. Initial split on explicit line breaks, dash separators, or distinct question/exclamation delimiters
  const initialSegments = clean
    .split(/\n+|(?:\s*[-–—]{2,}\s*)|(?<=[!؟?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (initialSegments.length === 0) {
    return [clean];
  }

  // Persian syntactic and conversational markers
  const FORBIDDEN_ENDINGS = new Set([
    'به', 'با', 'از', 'در', 'برای', 'واسه', 'توی', 'روی', 'درگیر', 'تست',
    'آیدی', 'درباره', 'مثل', 'سر', 'و', 'یا', 'اگر', 'اگه', 'چون', 'تا',
    'که', 'هم', 'اما', 'ولی', 'بلکه', 'خیلی', 'بیشتر', 'کمتر', 'هر', 'هیچ',
    'یه', 'یک', 'این', 'اون', 'گوش', 'پیام', 'وصل', 'چت', 'امتحان', 'تماس',
    'خرید', 'سرگرم', 'نوا', 'وی', 'پی', 'ان', 'همراه', 'ایرانسل', 'گوگل',
    'اینکه', 'کارم', 'واسم', 'برام', 'جهت', 'طریق'
  ]);

  const FORBIDDEN_STARTS = new Set([
    'رو', 'را', 'که', 'تا', 'تر', 'ترین', 'کن', 'بده', 'کرد', 'زد', 'میدم',
    'می‌دم', 'بفرستم', 'هستم', 'باشم', 'بشم', 'میشه', 'می‌شه', 'بشه', 'میکنه',
    'می‌کنه', 'میکنم', 'می‌کنم', 'می‌بینم', 'میبینم', 'بگیر', 'راه'
  ]);

  const COMPOUND_VERB_PAIRS: [string, string][] = [
    ['امتحان', 'کن'],
    ['پیام', 'بده'],
    ['وصل', 'میشه'],
    ['وصل', 'می‌شه'],
    ['وصل', 'بشه'],
    ['کانفیگ', 'میزنم'],
    ['چت', 'کنیم'],
    ['تست', 'بگیر'],
    ['برات', 'بفرستم'],
    ['گوش', 'میدم'],
    ['گوش', 'می‌دم'],
    ['فیلم', 'می‌بینم'],
    ['فیلم', 'میبینم'],
    ['تست', 'کن'],
    ['سر', 'در'],
    ['قطعی', 'داره'],
    ['قطعی', 'داری'],
    ['وی', 'پی'],
    ['پی', 'ان'],
    ['همراه', 'اول'],
  ];

  const BONUS_ENDINGS = new Set([
    'مرسی', 'ممنون', 'قربانت', 'فدات', 'خوبم', 'سلام', 'درود', 'جان',
    'عالی', 'دمت', 'گرم', 'چطوری', 'هستم', 'نیستم', 'شدم', 'کردم', 'بودم',
    'دارم', 'ندارم', 'میکنم', 'میکنی', 'میشه', 'گفتم', 'میشینم', 'هستی'
  ]);

  const BONUS_STARTS = new Set([
    'راستی', 'ولی', 'اما', 'چون', 'اگه', 'پس', 'خب', 'حالا', 'تازه', 'تو', 'شما', 'من'
  ]);

  const APPROVED_STANDALONE_SHORT = new Set([
    'سلام', 'سلامتی', 'درود', 'مرسی', 'ممنون', 'خوبم', 'فدات', 'قربانت', 'خوشبختم',
    'آره', 'اره', 'نه', 'باشه', 'اوکیه', 'اوکی', 'دقیقا', 'اوهوم', 'نوچ', 'ایول', 'عالی', 'چطور', 'چطوری', 'هستی؟', 'هستی'
  ]);

  // Clause-based natural splitting of a single segment
  function splitSegmentByClauses(seg: string): string[] {
    const trimmed = seg.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);

    // Rule 1: A single cohesive proposition (< 9-10 words) should NEVER be sliced!
    if (words.length <= Math.max(8, (maxWordsPerBubble || 8) + 2)) {
      return [trimmed];
    }

    // Rule 2: Try splitting on Greeting / Acknowledgement prefix
    const greetingMatch = trimmed.match(
      /^(سلام\s+خوبی|سلام\s+چطوری|سلام\s+درود|سلام|منم\s+خوبم|شکر\s+خوبم|خوبم\s+مرسی|قربانت|فدات|مرسی|سلامتی|اره|نه|باشه|ایول)[\s،,]+(.+)$/i
    );
    if (greetingMatch && greetingMatch[2]) {
      const p1 = greetingMatch[1].trim();
      const p2 = greetingMatch[2].trim();
      if (p1 && p2 && p2.split(/\s+/).length >= 2) {
        return [p1, ...splitSegmentByClauses(p2)];
      }
    }

    // Rule 3: Try splitting on Conversational Pivots (راستی، ولی، اما، چون، اگه)
    const pivotMatch = trimmed.match(/^(.+?)[\s،,]+(راستی|ولی|اما|چون|اگه|پس)[\s،,]+(.+)$/i);
    if (pivotMatch && pivotMatch[1] && pivotMatch[2] && pivotMatch[3]) {
      const left = pivotMatch[1].trim();
      const pivot = pivotMatch[2].trim();
      const right = pivotMatch[3].trim();
      if (left.split(/\s+/).length >= 2 && right.split(/\s+/).length >= 2) {
        return [left, `${pivot} ${right}`.trim()];
      }
    }

    // Rule 4: Try splitting on Question Suffix (e.g. توام قطعی داری؟ / تو کجایی؟)
    const questionSuffixMatch = trimmed.match(
      /^(.+?)[\s،,]+(توام\s+قطعی\s+داری\s*[؟?]?|واسه\s+توام\s+کنده\s*[؟?]?|تو\s+کجایی\s*[؟?]?|تو\s+چطور\s*[؟?]?|خطت\s+چیه\s*[؟?]?|گوشیت\s+چیه\s*[؟?]?)$/i
    );
    if (questionSuffixMatch && questionSuffixMatch[1] && questionSuffixMatch[2]) {
      const left = questionSuffixMatch[1].trim();
      const right = questionSuffixMatch[2].trim();
      if (left.split(/\s+/).length >= 3) {
        return [left, right];
      }
    }

    // Rule 5: Comma pause splitting if both sides have substantial words
    const commaParts = trimmed.split(/(?<=[،,])\s+/).map((s) => s.trim()).filter(Boolean);
    if (commaParts.length > 1 && commaParts.every((p) => p.split(/\s+/).length >= 3)) {
      return commaParts;
    }

    // Rule 6: Syntactic fallback scoring (only if sentence is genuinely long >= 10 words)
    let bestK = -1;
    let bestScore = -9999;
    const targetMax = Math.max(5, Math.min(maxWordsPerBubble || 8, 9));

    for (let k = Math.min(targetMax, words.length - 2); k >= 3; k--) {
      let score = 0;
      const lastWord = words[k - 1];
      const nextWord = words[k];

      // Absolute grammatical penalties
      if (FORBIDDEN_ENDINGS.has(lastWord)) score -= 500;
      if (FORBIDDEN_STARTS.has(nextWord)) score -= 500;

      for (const [w1, w2] of COMPOUND_VERB_PAIRS) {
        if (lastWord === w1 && nextWord === w2) score -= 500;
      }

      const remainingLen = words.length - k;
      if (remainingLen <= 2) score -= 300;
      else if (remainingLen <= 7) score += 40;

      if (BONUS_ENDINGS.has(lastWord)) score += 80;
      if (BONUS_STARTS.has(nextWord)) score += 70;

      if (
        lastWord.endsWith('م') ||
        lastWord.endsWith('ی') ||
        lastWord.endsWith('یم') ||
        lastWord.endsWith('ید') ||
        lastWord.endsWith('ند')
      ) {
        score += 35;
      }

      if (score > bestScore) {
        bestScore = score;
        bestK = k;
      }
    }

    if (bestK > 0 && bestScore > 0) {
      const c1 = words.slice(0, bestK).join(' ').trim();
      const c2 = words.slice(bestK).join(' ').trim();
      if (c1 && c2) return [c1, c2];
    }

    return [trimmed];
  }

  const rawSubBubbles: string[] = [];
  for (const part of initialSegments) {
    const chunks = splitSegmentByClauses(part);
    rawSubBubbles.push(...chunks);
  }

  // Post-processing & Invariant Safety:
  const processedBubbles: string[] = [];
  for (let i = 0; i < rawSubBubbles.length; i++) {
    let part = repairIncompleteSentences(rawSubBubbles[i]);
    part = part.replace(/[\.\:،,!;؛\-–—]+$/g, '').trim();
    if (!part) continue;

    // Drop robotic cliché bubbles
    if (/^(?:شما\s*چطور\s*[؟?]?|شما\s*چی\s*[؟?]?|تو\s*چطور\s*[؟?]?|شما\s*چطوری\s*[؟?]?|خودت\s*چطور\s*[؟?]?)$/i.test(part)) {
      continue;
    }

    // Drop bubble if it contains only English/Latin words with no Persian letters and is not an allowed handle/token
    const hasPersian = /[\u0600-\u06FF]/.test(part);
    const hasAllowedHandleOrToken = /(?:nova_vpn|vpn|v2ray|vless|vmess|ios|android)/i.test(part);
    if (!hasPersian && !hasAllowedHandleOrToken) {
      continue;
    }

    const bWords = part.split(/\s+/).filter(Boolean);
    const firstWord = bWords[0];
    const isCurStandalone = APPROVED_STANDALONE_SHORT.has(part) || /[؟?]$/.test(part);

    if (processedBubbles.length > 0) {
      const prev = processedBubbles[processedBubbles.length - 1];
      const prevWords = prev.split(/\s+/).filter(Boolean);
      const prevLastWord = prevWords[prevWords.length - 1];

      const isPrevEndingForbidden = FORBIDDEN_ENDINGS.has(prevLastWord);
      const isCurStartForbidden = FORBIDDEN_STARTS.has(firstWord);
      const isCompoundVerbSevered = COMPOUND_VERB_PAIRS.some(
        ([w1, w2]) => prevLastWord === w1 && firstWord === w2
      );
      const isCurOrphan = bWords.length <= 2 && !isCurStandalone;

      if (isPrevEndingForbidden || isCurStartForbidden || isCompoundVerbSevered || isCurOrphan) {
        processedBubbles[processedBubbles.length - 1] = `${prev} ${part}`.trim();
        continue;
      }
    }

    processedBubbles.push(part);
  }

  const effectiveMaxChunks = Math.max(1, Math.min(maxChunks || 2, 3));
  if (processedBubbles.length > effectiveMaxChunks) {
    const head = processedBubbles.slice(0, effectiveMaxChunks - 1);
    const tail = processedBubbles.slice(effectiveMaxChunks - 1).join(' ');
    return [...head, tail];
  }

  return processedBubbles.length > 0 ? processedBubbles : [clean];
}

/**
 * Validates and sanitizes AI-generated responses according to state, policy, similarity, and safety constraints.
 */
export function validateAndSanitizeResponse(
  rawAiReply: string,
  context: ConversationContext,
  promotionConfig?: AnonymousProductPromotion,
  productConfig: ProductConfig = DEFAULT_PRODUCT_CONFIG
): ValidationResult {
  const violations: string[] = [];
  const ruleResults: ValidationRuleResult[] = [];
  let requiresRegeneration = false;
  let text = (rawAiReply || '').trim();

  // 1. Strip unwanted prefixes (e.g. "من:", "پاسخ:", "Melody:", "بات:")
  text = text.replace(/^(من|بات|ملودی|پاسخ|جواب|AI|Assistant|Melody)\s*[:：\-–]\s*/i, '');
  text = text.replace(/^["'«»](.*)["'«»]$/s, '$1').trim();

  // 2. Clean code artifacts, slashes, asterisks, brackets, hallucinated prompt remnants
  text = cleanCodeArtifactsAndPunctuation(text);

  // 3. Empty or Meaningful Persian Text Check
  const persianCharCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const isMeaningful = persianCharCount >= 2 && text.length >= 2;
  ruleResults.push({
    ruleName: 'meaningful_persian_text',
    passed: isMeaningful,
    message: isMeaningful ? undefined : 'Response was empty, too short, or contained non-meaningful symbols/gibberish',
  });
  if (!isMeaningful) {
    violations.push('Response lacked meaningful Persian text or contained code artifacts');
    requiresRegeneration = true;
    text = getSafeFallbackText(context.state, context.intent, context.supportIdAvailable);
    return {
      isValid: false,
      sanitizedText: text,
      violations,
      ruleResults,
      requiresRegeneration,
      wasFallbackUsed: true,
    };
  }

  // 3. Message Length Check (Max 600 characters for Telegram single turn bubble)
  const validLength = text.length <= 600;
  ruleResults.push({
    ruleName: 'message_length',
    passed: validLength,
    message: validLength ? undefined : `Message length (${text.length}) exceeded 600 character ceiling`,
  });
  if (!validLength) {
    violations.push('Message length exceeded limit');
    text = text.slice(0, 500).trim() + '...';
  }

  // 4. Message Counter Constraint Check (Dynamic 18-25 messages, up to 35 for interested leads)
  const isCommercialActive = [
    ConversationState.PRODUCT_INTRODUCTION,
    ConversationState.PRODUCT_INTEREST,
    ConversationState.PRICE_DISCUSSION,
    ConversationState.TRIAL_DISCUSSION,
    ConversationState.SUPPORT_HANDOFF,
    ConversationState.OBJECTION_HANDLING,
    ConversationState.NEED_DETECTED,
  ].includes(context.state);

  const effectiveMaxLimit = (isCommercialActive || context.leadScore >= 35)
    ? (context.maxBotMessages ? Math.max(context.maxBotMessages, MAX_COMMERCIAL_LEAD_MESSAGES_LIMIT) : MAX_COMMERCIAL_LEAD_MESSAGES_LIMIT)
    : (context.maxBotMessages || MAX_BOT_MESSAGES_LIMIT);

  const isWithinMessageLimit = (context.botMessageCount || 0) < effectiveMaxLimit;
  ruleResults.push({
    ruleName: 'message_count',
    passed: isWithinMessageLimit,
    message: isWithinMessageLimit ? undefined : `Bot message count (${context.botMessageCount}) reached limit (${effectiveMaxLimit})`,
  });
  if (!isWithinMessageLimit) {
    violations.push(`Max bot message limit (${effectiveMaxLimit}) reached. Bot should cease producing new turns.`);
  }

  // 5. Similarity / Duplicate Response Check against recent bot messages (A7) & Anti-Repetition
  const recentMessages = context.recentBotMessages || [];
  const lastUserMsg = (context.recentStrangerMessages || []).slice(-1)[0] || '';
  const similarityInfo = checkResponseSimilarity(text, recentMessages, 0.72, lastUserMsg);
  ruleResults.push({
    ruleName: 'duplicate_response',
    passed: !similarityInfo.isDuplicate,
    message: similarityInfo.isDuplicate ? similarityInfo.reason : undefined,
  });

  if (similarityInfo.isDuplicate) {
    const suggested = (similarityInfo.suggestedCorrection || '').trim();
    if (suggested && suggested.length >= 5 && !recentMessages.includes(suggested)) {
      text = suggested;
    } else if (text && text.length >= 4 && !recentMessages.includes(text)) {
      // Keep Gemini's response if it is distinct from recent messages
      // Only append minor variation if needed
    } else {
      violations.push(`Duplicate/Repetitive response detected (${similarityInfo.reason})`);
      text = getAlternativeVariedFallback(context.state, context.intent, recentMessages, context.supportIdAvailable, lastUserMsg);
    }
  }

  // 6. Support ID Access Gating Check (A3 & A2: Duration >= 120s)
  const effectiveSupportHandle = (productConfig.support.handle || promotionConfig?.contactHandleOrLink || 'nova_vpn10')
    .replace(/^@/, '')
    .trim();
  const supportIdRegex = new RegExp(`(@?${effectiveSupportHandle}|@FastVpnSupport|@nova_vpn10|آیدی\\s*پشتیبانی|به\\s*آیدی|پیام\\s*بده\\s*به)`, 'i');

  const isSupportIdExposed = supportIdRegex.test(text);
  const isSupportAllowed = Boolean(context.supportIdAvailable || context.coinRewarded || context.mediaUnlocked || (context.elapsedSeconds || 0) >= 120);

  if (isSupportIdExposed && !isSupportAllowed) {
    ruleResults.push({
      ruleName: 'support_id_access',
      passed: false,
      message: `Support ID exposed when conversation duration (${context.elapsedSeconds}s) < 120s`,
    });
    violations.push('Support ID gated: Conversation duration is under 120 seconds. Support handle must not be exposed.');
    requiresRegeneration = true;
    // Sanitize by removing the handle or using safe pre-120s response
    text = text.replace(new RegExp(`@?${effectiveSupportHandle}`, 'gi'), '').trim();
    text = text.replace(/@FastVpnSupport/gi, '').trim();
    text = text.replace(/@nova_vpn10/gi, '').trim();
    if (text.length < 5) {
      text = getSafeFallbackText(context.state, context.intent, false);
      return {
        isValid: false,
        sanitizedText: text,
        violations,
        ruleResults,
        requiresRegeneration,
        wasFallbackUsed: true,
      };
    }
  } else {
    ruleResults.push({
      ruleName: 'support_id_access',
      passed: true,
    });
  }

  // 7. Promotion Lock Violation Check
  if (context.promotionLock) {
    const promotionalKeywordsRegex = /(فیلترشکن|وی\s*پی\s*ان|vpn|کانفیگ|سرور|خرید|تعرفه|تومان|تست رایگان|پشتیبانی|آیدی|@\w+)/i;
    if (promotionalKeywordsRegex.test(text)) {
      ruleResults.push({
        ruleName: 'promotion_lock',
        passed: false,
        message: 'AI attempted promotional pitch while Promotion Lock is active',
      });
      violations.push('Promotion Lock active: AI attempted to mention promotional keywords after rejection');
      text = getSafeFallbackText(context.state, context.intent, context.supportIdAvailable);
      return {
        isValid: false,
        sanitizedText: text,
        violations,
        ruleResults,
        requiresRegeneration: true,
        wasFallbackUsed: true,
      };
    }
  }

  // 8. Repeated CTA / Promotion Frequency Check
  if (context.promotionLevel === PromotionLevel.DIRECT_OFFER && context.lastCTATurn && context.turnCount - context.lastCTATurn < 2) {
    const ctaRegex = /(پیام بده|خرید کن|ثبت سفارش|آیدی پشتیبانی)/i;
    if (ctaRegex.test(text) && context.intent !== Intent.PURCHASE_INTENT && context.intent !== Intent.SUPPORT_REQUEST) {
      ruleResults.push({
        ruleName: 'repeated_CTA',
        passed: false,
        message: 'Repeated CTA without intervening turns',
      });
      violations.push('Repeated CTA within short turn window');
    }
  }

  // 9. Format Support Handle (ensure NO @ character)
  if (effectiveSupportHandle) {
    if (text.includes(`@${effectiveSupportHandle}`)) {
      text = text.replace(new RegExp(`@${effectiveSupportHandle}`, 'g'), effectiveSupportHandle);
    }
  }

  // 10. Passive Listening Turn Enforcement: Strip questions and ensure minimal natural response
  if (context.isPassiveListeningTurn) {
    // Remove questions and interrogatives to cede initiative to the user
    const questionStripped = text
      .replace(/[؟?].*$/s, '')
      .replace(/(?:^|[\s،,؛;])(?:تو چی|شما چی|چیکار میکنی|چیکارا میکنی|روزت چطور بود|دانشجویی|کجایی|اسمت چیه|اهل کجایی|چند سالته).*/gi, '')
      .trim();

    if (questionStripped.length >= 2) {
      text = questionStripped;
    } else {
      const minimalReactions = ['اوهوم', 'آره والا', 'دقیقا', 'آره واقعا', 'نوچ', 'خوبه', 'درکت می‌کنم'];
      text = minimalReactions[Math.floor(Math.random() * minimalReactions.length)];
    }
  }

  // Ensure affectionate terms are cleanly stripped one more time
  text = stripAffectionateTerms(text);

  return {
    isValid: violations.length === 0,
    sanitizedText: text,
    violations,
    ruleResults,
    requiresRegeneration,
    wasFallbackUsed: false,
    similarityInfo,
  };
}

/**
 * Returns deterministic fallback text for various conversation states and intents
 */
export function getSafeFallbackText(
  state: ConversationState,
  intent: Intent,
  supportIdAvailable: boolean = false
): string {
  // Exit / Goodbye: strictly natural, no unsolicited ad
  if (intent === Intent.GOODBYE || state === ConversationState.GOODBYE) {
    return 'منم کار برام پیش اومد باید برم مراقب خودت باش';
  }

  if (intent === Intent.REJECTION || state === ConversationState.REJECTED || state === ConversationState.LOW_INTEREST) {
    return 'باشه حله مراقب خودت باش فعلا';
  }

  if (intent === Intent.GREETING || state === ConversationState.INITIAL_GREETING) {
    return 'سلام چطوری خوبی';
  }

  if (intent === Intent.SMALL_TALK || intent === Intent.QUESTION || state === ConversationState.EARLY_CONVERSATION) {
    return 'سارا ۲۶ تهران';
  }

  if (intent === Intent.VPN_REQUEST || state === ConversationState.PRODUCT_INTEREST) {
    return 'آره من خودم یه سرور اختصاصی پرسرعت بدون قطعی استفاده می‌کنم';
  }

  if (intent === Intent.PRICE_REQUEST || state === ConversationState.PRICE_DISCUSSION) {
    return 'تعرفه‌هاش خیلی مناسبه پلن‌های ماهانه پرسرعت داره تست هم می‌تونی بگیری';
  }

  if (intent === Intent.TRIAL_REQUEST || state === ConversationState.TRIAL_DISCUSSION) {
    return 'آره حتماً اکانت تست رایگان داره اول چک کن بعد تصمیم بگیر';
  }

  if (intent === Intent.SUPPORT_REQUEST || intent === Intent.PURCHASE_INTENT || state === ConversationState.SUPPORT_HANDOFF) {
    if (supportIdAvailable) {
      return 'می‌تونی به پشتیبانی nova_vpn10 پیام بدی برات فعال کنن';
    }
    return 'می‌تونی به پشتیبانی پیام بدی برات فعال کنن';
  }

  if (intent === Intent.RELEVANT_NEED || state === ConversationState.NEED_DETECTED) {
    return 'وای آره واقعاً اوضاع نت این روزا خیلی اذیت می‌کنه';
  }

  if (state === ConversationState.QUALIFYING) {
    return 'شکر خوبم، راستی نتم امروز خیلی کنده توام قطعی داری؟';
  }

  return 'سلامت باشی، این روزا تلگرامت خوب کار میکنه یا با تاخیر میاد؟';
}

/**
 * Returns varied fallback to prevent repeating the exact same fallback response
 */
export function getAlternativeVariedFallback(
  state: ConversationState,
  intent: Intent,
  recentMessages: string[] = [],
  supportIdAvailable: boolean = false,
  lastUserMsg?: string
): string {
  const candidatesByIntent: Record<string, string[]> = {
    [Intent.GREETING]: [
      'سلام روزت بخیر باشه',
      'سلام چطوری اوضاع چطوره',
      'درود روز خوبی داشته باشی',
    ],
    [Intent.SMALL_TALK]: [
      'شکر خوبم، راستی نتم امروز کنده توام قطعی داری؟',
      'سرگرم کارامم، فقط این روزا فیلترینگ کلافم کرده',
      'مشغول وبگردی‌ام، تلگرامت راحت بالا میاد یا دیر وصل میشه؟',
      'خداروشکر، راستی فیلترشکن خوب داری استفاده کنی؟',
    ],
    [Intent.GOODBYE]: [
      'باشه حله مراقب خودت باش فعلاً',
      'خوشحال شدم روزت بخیر',
      'فعلا به امید دیدار',
    ],
    [Intent.REJECTION]: [
      'باشه حله روزت بخیر',
      'اوکی موفق باشی فعلا',
    ],
    [Intent.PRICE_REQUEST]: [
      'پلن‌های ماهانه‌ش خیلی مناسبه و نامحدود هم داره',
      'قیمتاش خیلی اقتصادیه با گارانتی کامل',
    ],
  };

  const pool = candidatesByIntent[intent] || [
    'شکر خوبم، راستی نتم امروز خیلی کنده توام قطعی داری؟',
    'درکت می‌کنم، این روزا کار با اینترنت واقعاً اعصاب‌خردکن شده',
    'مشغول کارهای روزمره‌ام، تلگرامت بدون قطعی وصل میشه؟',
  ];

  for (const candidate of pool) {
    const sim = checkResponseSimilarity(candidate, recentMessages, 0.70, lastUserMsg);
    if (!sim.isDuplicate) {
      return candidate;
    }
  }

  return getSafeFallbackText(state, intent, supportIdAvailable);
}
