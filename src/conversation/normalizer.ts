/**
 * Persian Message Normalizer
 * Standardizes characters, zero-width spaces, numerals, repeated letters,
 * and colloquial variations while preserving semantic boundaries.
 */

export interface NormalizedMessage {
  raw: string;
  normalized: string;
  tokens: string[];
}

/**
 * Normalizes raw Persian input into standardized Unicode form.
 */
export function normalizePersianText(input: string): string {
  if (!input) return '';

  let text = input.trim().toLowerCase();

  // 1. Remove non-printable and invisible control characters, tatweel / kashida (ـ)
  text = text.replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00A0]/g, ' ');
  text = text.replace(/[\u0640ـ]/g, ''); // strip tatweel / kashida completely
  text = text.replace(/[《》【】«»]/g, ' ');

  // 2. Standardize Arabic characters to Persian
  text = text
    .replace(/ي/g, 'ی')
    .replace(/ى/g, 'ی')
    .replace(/ئ/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/ۀ/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/إ/g, 'ا')
    .replace(/أ/g, 'ا')
    .replace(/آ/g, 'ا');

  // 3. Convert Persian and Arabic digits to English digits
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  for (let i = 0; i < 10; i++) {
    text = text.replace(new RegExp(persianDigits[i], 'g'), String(i));
    text = text.replace(new RegExp(arabicDigits[i], 'g'), String(i));
  }

  // 4. Remove diacritics / Tashkeel / Tanween
  text = text.replace(/[\u064B-\u065F\u0670]/g, '');

  // 5. Compress 3+ repeated characters (e.g., سلاااااام -> سلام, خخخخخ -> خ)
  text = text.replace(/(.)\1{2,}/g, '$1');

  // 6. Colloquial spelling normalization (prefixes, negations, compounds)
  // Standardize common VPN spellings
  text = text.replace(/فیلتر\s*شکن/gi, 'فیلترشکن');
  text = text.replace(/وی\s*پی\s*ان/gi, 'وی پی ان');
  text = text.replace(/ویپیان/gi, 'وی پی ان');
  text = text.replace(/وی\s*تو\s*ری/gi, 'v2ray');
  text = text.replace(/ویتوری/gi, 'v2ray');
  text = text.replace(/v\s*2\s*ray/gi, 'v2ray');

  // Standardize ID / Username variants
  text = text.replace(/ای\s*دی/gi, 'آیدی');
  text = text.replace(/ایدی/gi, 'آیدی');
  text = text.replace(/\bid\b/gi, 'آیدی');

  // Standardize verbs & negations
  text = text.replace(/نمی\s*خوام/g, 'نمیخوام');
  text = text.replace(/می\s*خوام/g, 'میخوام');
  text = text.replace(/نمی\s*شه/g, 'نمیشه');
  text = text.replace(/می\s*شه/g, 'میشه');
  text = text.replace(/نمی\s*تونم/g, 'نمیتونم');
  text = text.replace(/می\s*تونم/g, 'میتونم');
  text = text.replace(/نمی\s*خوره/g, 'نمیخوره');
  text = text.replace(/می\s*خوره/g, 'میخوره');

  // Standardize price inquiry slang
  text = text.replace(/چند\s*تومنه/g, 'چندتومنه');
  text = text.replace(/چقد\s*میشه/g, 'چقدر میشه');
  text = text.replace(/چقد\s*درمیاد/g, 'چند درمیاد');
  text = text.replace(/چقد\s*باید/g, 'چقدر باید');

  // 7. Normalize multiple whitespace and punctuation spaces
  text = text.replace(/[،,]/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Tokenizes text into distinct normalized words/tokens.
 */
export function tokenizePersianText(text: string): string[] {
  const norm = normalizePersianText(text);
  if (!norm) return [];
  // Split on whitespace or punctuation
  return norm
    .split(/[\s?!؟.:;()\[\]{}«»""'’،,\-_/\\]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Checks if tokens array contains an exact token or one of candidate tokens.
 */
export function hasExactToken(tokens: string[], candidates: string | string[]): boolean {
  const set = new Set(Array.isArray(candidates) ? candidates : [candidates]);
  return tokens.some((t) => set.has(t));
}

/**
 * Checks if any token starts with a prefix or matches an exact word.
 */
export function hasTokenMatching(tokens: string[], matcher: (token: string) => boolean): boolean {
  return tokens.some(matcher);
}

/**
 * Safe Unicode boundary matcher for Persian expressions.
 * Ensures that pattern is bounded by start/end of string, whitespace, or punctuation.
 */
export function matchBoundedPattern(text: string, regexPattern: string, flags: string = 'iu'): boolean {
  // Bounded by non-Persian letter/digits or string edges
  const bounded = `(?:^|[^\\p{L}\\p{N}])${regexPattern}(?:[^\\p{L}\\p{N}]|$)`;
  try {
    const rx = new RegExp(bounded, flags);
    return rx.test(text);
  } catch {
    const fallbackRx = new RegExp(`(?:^|\\s|[.,!؟?؛])${regexPattern}(?:\\s|[.,!؟?؛]|$)`, 'i');
    return fallbackRx.test(text);
  }
}

