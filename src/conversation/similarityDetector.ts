/**
 * Semantic & String Similarity Detector for Bot Message Outputs
 * Prevents repetitive, looped, or duplicate messages during conversation turns.
 */

import { normalizePersianText } from './normalizer';

export interface SimilarityCheckResult {
  isDuplicate: boolean;
  maxSimilarity: number;
  matchedMessage?: string;
  matchedIndex?: number;
  reason?: string;
  isRepeatedQuestion?: boolean;
  repeatedQuestionCategory?: string;
  isMirroringLoop?: boolean;
  suggestedCorrection?: string;
}

/**
 * Calculates token-based Jaccard similarity between two Persian strings.
 */
export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const normA = normalizePersianText(textA);
  const normB = normalizePersianText(textB);

  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;

  const tokensA = new Set(normA.split(/\s+/).filter((t) => t.length > 1));
  const tokensB = new Set(normB.split(/\s+/).filter((t) => t.length > 1));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = new Set([...tokensA].filter((x) => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);

  return intersection.size / union.size;
}

/**
 * Calculates character-level Levenshtein distance similarity (0.0 to 1.0).
 */
export function calculateLevenshteinSimilarity(textA: string, textB: string): number {
  const normA = normalizePersianText(textA);
  const normB = normalizePersianText(textB);

  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;

  const lenA = normA.length;
  const lenB = normB.length;
  const maxLen = Math.max(lenA, lenB);
  if (maxLen === 0) return 1.0;

  const matrix: number[][] = [];
  for (let i = 0; i <= lenB; i++) matrix[i] = [i];
  for (let j = 0; j <= lenA; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      if (normB.charAt(i - 1) === normA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  const distance = matrix[lenB][lenA];
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * Combined hybrid similarity metric (Token Jaccard 50% + Levenshtein 50%).
 */
export function calculateCompositeSimilarity(textA: string, textB: string): number {
  const normA = normalizePersianText(textA);
  const normB = normalizePersianText(textB);

  if (normA === normB && normA.length > 0) return 1.0;

  const jaccard = calculateJaccardSimilarity(textA, textB);
  const levenshtein = calculateLevenshteinSimilarity(textA, textB);

  // If high word overlap or high character match
  return Math.max(jaccard, levenshtein, jaccard * 0.5 + levenshtein * 0.5);
}

/**
 * Known repetitive Persian conversation question patterns and categories
 */
const QUESTION_PATTERNS: Array<{
  category: string;
  regex: RegExp;
  naturalReplies: string[];
}> = [
  {
    category: 'activity',
    regex: /(?:تو\s+)?(?:داری\s+)?(?:چیکار|چیکارا)\s+(?:می\s*کنی|میکنی|داری)|(?:وقتت|روزت)\s*(?:رو|ت)?\s*(?:چطور|چگونه)\s*(?:می\s*گذرونی|میگذرونی|میگذره)|(?:مشغول|سرگرم)\s+(?:چی|چه کاری)\s+هستی/i,
    naturalReplies: [
      'بیشتر فیلم می‌بینم و آهنگ گوش می‌دم',
      'سرگرم کارامم توی اینستاگرام می‌چرخم',
      'پای لپ‌تاپم کارامو انجام می‌دم',
      'مشغول کار و وبگردی بودم',
    ],
  },
  {
    category: 'greeting_status',
    regex: /(?:چه\s*خبر|چخبر|چه\s*خبرها|چه\s*خبرایی)|(?:اوضاع\s*چطوره|احوالت\s*چطوره|خوبی\s*\?|چطوری\s*\?)/i,
    naturalReplies: [
      'سلامتی همه چی آرومه، شکر',
      'خداروشکر همه چی خوبه',
      'منم شکر خوبم، روزمرگی می‌گذره',
    ],
  },
  {
    category: 'asl_demographics',
    regex: /(?:اصل\s*میدی|اصل\s*بده|asl|چند\s*سالته|سنت\s*چقدره|اهل\s*کجایی|کجایی\s*هستی|کجا\s*زندگی\s*میکنی)/i,
    naturalReplies: [
      'ملودی ۲۶ تهرانم',
      '۲۶ سالمه از تهران',
    ],
  },
  {
    category: 'vpn_internet_inquiry',
    regex: /(?:وی\s*پی\s*ان|فیلترشکن|vpn|اینترنت|نت|پروکسی).*(?:خوب\s*کار\s*میکنه|وصله|داری|سرعت|چطوره|مشکل)/i,
    naturalReplies: [
      'منم کارامو انجام می‌دادم',
      'سلامتی همه چی خوبه',
    ],
  },
  {
    category: 'job_study',
    regex: /(?:شغلت\s*چیه|کارت\s*چیه|شاغلی|دانشجویی|رشته‌ت\s*چیه)/i,
    naturalReplies: [
      'کار آنلاین و فریلنسری انجام می‌دم',
      'مشغول کارهای طراحی و آنلاینم',
    ],
  },
];

/**
 * Extracts any recognized question categories present in the given message
 */
export function extractQuestionCategories(text: string): string[] {
  if (!text) return [];
  const found: string[] = [];
  for (const q of QUESTION_PATTERNS) {
    if (q.regex.test(text)) {
      found.push(q.category);
    }
  }
  return found;
}

/**
 * Detects if a candidate response repeats a question previously asked by the bot,
 * or if it reflects the user's question directly back (mirroring loop).
 * Only applies if the candidate is ACTUALLY asking a question (ends with ? or contains question interrogatives).
 */
export function detectQuestionRepetition(
  candidate: string,
  recentBotMessages: string[] = [],
  lastUserMsg?: string
): { isRepeatedQuestion: boolean; isMirroringLoop: boolean; category?: string; suggestedCorrection?: string } {
  if (!candidate) return { isRepeatedQuestion: false, isMirroringLoop: false };

  // Only check for question repetition if candidate is actually posing a question
  const isCandidatePosingQuestion = /[؟?]|(?:شما\s*چی|تو\s*چطور|شما\s*چطور|تو\s*چی|اسمت\s*چیه|چند\s*سالته|کجایی\s*هستی|چیکار\s*میکنی)/i.test(candidate);
  if (!isCandidatePosingQuestion) {
    return { isRepeatedQuestion: false, isMirroringLoop: false };
  }

  const candidateCategories = extractQuestionCategories(candidate);
  if (candidateCategories.length === 0) {
    return { isRepeatedQuestion: false, isMirroringLoop: false };
  }

  // 1. Check for True Mirroring Loop:
  // e.g. User asked "چیکار میکنی؟" and bot replied ONLY with "تو چیکار میکنی؟" without answering
  if (lastUserMsg) {
    const userCategories = extractQuestionCategories(lastUserMsg);
    for (const cat of candidateCategories) {
      // If user asked a question, and bot's ENTIRE message is just asking the same question back with no substantive answer
      if (userCategories.includes(cat) && candidate.trim().length < 30 && /(تو\s*چیکار|تو\s*چطور|شما\s*چطور|تو\s*چی)/i.test(candidate)) {
        const patternObj = QUESTION_PATTERNS.find((p) => p.category === cat);
        const randomReply = patternObj
          ? patternObj.naturalReplies[Math.floor(Math.random() * patternObj.naturalReplies.length)]
          : 'منم سرگرم کارامم';

        return {
          isRepeatedQuestion: true,
          isMirroringLoop: true,
          category: cat,
          suggestedCorrection: randomReply,
        };
      }
    }
  }

  // 2. Check if the bot has already asked this exact question category in its previous messages
  for (const cat of candidateCategories) {
    // Standard polite pleasantries like greeting_status and activity should NOT be blocked as repeated questions
    if (cat === 'greeting_status' || cat === 'activity') {
      continue;
    }

    const wasAlreadyAskedByBot = recentBotMessages.some((msg) => {
      const isMsgQuestion = /[؟?]/.test(msg) || /(?:شما|تو)/i.test(msg);
      if (!isMsgQuestion) return false;
      const msgCategories = extractQuestionCategories(msg);
      return msgCategories.includes(cat);
    });

    if (wasAlreadyAskedByBot) {
      // Strip the repeated question from candidate or keep the informative part
      const cleanCandidate = candidate.replace(/[؟?].*$/, '').replace(/(?:شما\s*چی|تو\s*چطور|شما\s*چطور|تو\s*چی|شما\s*اسمت\s*چیه|شما\s*اهل\s*کجایی).*/i, '').trim();
      if (cleanCandidate.length >= 6) {
        return {
          isRepeatedQuestion: false,
          isMirroringLoop: false,
          category: cat,
          suggestedCorrection: cleanCandidate,
        };
      }

      const patternObj = QUESTION_PATTERNS.find((p) => p.category === cat);
      const randomReply = patternObj
        ? patternObj.naturalReplies[Math.floor(Math.random() * patternObj.naturalReplies.length)]
        : 'منم خوبم مرسی';

      return {
        isRepeatedQuestion: true,
        isMirroringLoop: false,
        category: cat,
        suggestedCorrection: randomReply,
      };
    }
  }

  return { isRepeatedQuestion: false, isMirroringLoop: false };
}

/**
 * Checks whether candidate text is too similar to any recent bot message or repeats questions.
 * @param candidate Candidate bot message text
 * @param recentBotMessages Array of recently sent bot messages in current session
 * @param threshold Similarity threshold (default: 0.70)
 * @param lastUserMsg Optional most recent message sent by user
 */
export function checkResponseSimilarity(
  candidate: string,
  recentBotMessages: string[] = [],
  threshold: number = 0.70,
  lastUserMsg?: string
): SimilarityCheckResult {
  const normCandidate = normalizePersianText(candidate);

  // 1. Check for Question Category Repetition & Mirroring
  const qRepetition = detectQuestionRepetition(candidate, recentBotMessages, lastUserMsg);
  if (qRepetition.isRepeatedQuestion) {
    return {
      isDuplicate: true,
      maxSimilarity: 0.95,
      reason: qRepetition.isMirroringLoop
        ? `Mirroring loop: Bot reflected the exact question (${qRepetition.category}) back instead of answering`
        : `Repeated question (${qRepetition.category}) already asked previously by bot in this conversation`,
      isRepeatedQuestion: true,
      repeatedQuestionCategory: qRepetition.category,
      isMirroringLoop: qRepetition.isMirroringLoop,
      suggestedCorrection: qRepetition.suggestedCorrection,
    };
  }

  if (!normCandidate || recentBotMessages.length === 0) {
    return { isDuplicate: false, maxSimilarity: 0 };
  }

  let maxSim = 0;
  let matchedMsg: string | undefined;
  let matchedIdx: number | undefined;
  let reason: string | undefined;

  for (let i = recentBotMessages.length - 1; i >= 0; i--) {
    const prevMsg = recentBotMessages[i];
    const normPrev = normalizePersianText(prevMsg);

    // 1. Exact normalized match
    if (normCandidate === normPrev && normCandidate.length > 0) {
      return {
        isDuplicate: true,
        maxSimilarity: 1.0,
        matchedMessage: prevMsg,
        matchedIndex: i,
        reason: 'Exact duplicate of previously sent bot message',
      };
    }

    // 2. Composite similarity score
    const sim = calculateCompositeSimilarity(candidate, prevMsg);
    if (sim > maxSim) {
      maxSim = sim;
      matchedMsg = prevMsg;
      matchedIdx = i;
    }

    if (sim >= threshold) {
      reason = `High similarity (${(sim * 100).toFixed(1)}% >= ${(threshold * 100).toFixed(0)}%) with message at index ${i}`;
      return {
        isDuplicate: true,
        maxSimilarity: sim,
        matchedMessage: prevMsg,
        matchedIndex: i,
        reason,
      };
    }
  }

  return {
    isDuplicate: maxSim >= threshold,
    maxSimilarity: Number(maxSim.toFixed(3)),
    matchedMessage: matchedMsg,
    matchedIndex: matchedIdx,
    reason: maxSim >= threshold ? reason : undefined,
  };
}
