import * as fs from 'fs';
import * as path from 'path';
import { normalizePersianText, tokenizePersianText } from '../src/conversation/normalizer';
import { GOLD_DATASET } from '../src/evaluation/goldDataset';
import { INTENT_TEST_SUITE } from '../src/conversation/intentTests';

interface HoldoutCase {
  id: string;
  message: string;
  context: {
    previousUserMessages: string[];
    previousIntents: string[];
    conversationState: string | null;
    lastAssistantMessage: string | null;
    productMentioned: boolean;
    promotionState: string | null;
  };
  expectedPrimaryIntent: string;
  expectedSecondaryIntents: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceType: string;
  immutable: boolean;
}

function calculateJaccard(tokensA: string[], tokensB: string[]): number {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

async function auditIndependence() {
  const holdoutPath = path.resolve('evaluation/holdout_intent_v1.json');
  if (!fs.existsSync(holdoutPath)) {
    throw new Error('Holdout dataset not found at ' + holdoutPath);
  }

  const holdoutCases: HoldoutCase[] = JSON.parse(fs.readFileSync(holdoutPath, 'utf-8'));
  console.log(`Auditing ${holdoutCases.length} holdout cases...`);

  // Collect all Gold turns
  const goldItems: Array<{ source: string; id: string; raw: string; norm: string; tokens: string[] }> = [];
  GOLD_DATASET.forEach((conv) => {
    conv.turns.forEach((turn) => {
      const norm = normalizePersianText(turn.userMessage);
      goldItems.push({
        source: `Gold:${conv.conversationId}:Turn${turn.turnId}`,
        id: `${conv.conversationId}_t${turn.turnId}`,
        raw: turn.userMessage,
        norm,
        tokens: tokenizePersianText(norm),
      });
    });
  });

  // Collect all Unit test items
  INTENT_TEST_SUITE.forEach((test) => {
    const norm = normalizePersianText(test.input);
    goldItems.push({
      source: `UnitTest:${test.id}`,
      id: test.id,
      raw: test.input,
      norm,
      tokens: tokenizePersianText(norm),
    });
  });

  let exactDuplicates = 0;
  let normalizedDuplicates = 0;
  const potentialNearDuplicates: Array<{
    holdoutId: string;
    holdoutMessage: string;
    benchmarkSource: string;
    benchmarkMessage: string;
    similarity: number;
  }> = [];

  const intentDist: Record<string, number> = {};
  const diffDist: Record<string, number> = {};
  let contextualCount = 0;
  let multiIntentCount = 0;

  holdoutCases.forEach((hc) => {
    // Stats
    intentDist[hc.expectedPrimaryIntent] = (intentDist[hc.expectedPrimaryIntent] || 0) + 1;
    diffDist[hc.difficulty] = (diffDist[hc.difficulty] || 0) + 1;

    const hasContext =
      hc.context.previousUserMessages.length > 0 ||
      hc.context.previousIntents.length > 0 ||
      hc.context.lastAssistantMessage !== null ||
      hc.context.conversationState !== null ||
      hc.context.productMentioned === true;

    if (hasContext) {
      contextualCount++;
    }

    if (hc.expectedSecondaryIntents && hc.expectedSecondaryIntents.length > 0) {
      multiIntentCount++;
    }

    const normHoldout = normalizePersianText(hc.message);
    const tokensHoldout = tokenizePersianText(normHoldout);

    goldItems.forEach((gi) => {
      if (hc.message.trim() === gi.raw.trim()) {
        exactDuplicates++;
        console.warn(`[EXACT OVERLAP] Holdout ${hc.id} matches ${gi.source}: "${hc.message}"`);
      } else if (normHoldout === gi.norm) {
        normalizedDuplicates++;
        console.warn(`[NORMALIZED OVERLAP] Holdout ${hc.id} matches ${gi.source}: "${normHoldout}"`);
      } else {
        const jaccard = calculateJaccard(tokensHoldout, gi.tokens);
        if (jaccard >= 0.85) {
          potentialNearDuplicates.push({
            holdoutId: hc.id,
            holdoutMessage: hc.message,
            benchmarkSource: gi.source,
            benchmarkMessage: gi.raw,
            similarity: Number(jaccard.toFixed(3)),
          });
        }
      }
    });
  });

  const manifest = {
    datasetVersion: 'v1',
    createdBeforeEvaluation: true,
    modifiedAfterPrediction: false,
    goldOverlapExact: exactDuplicates,
    goldOverlapNormalized: normalizedDuplicates,
    potentialNearDuplicates,
    caseCount: holdoutCases.length,
    intentDistribution: intentDist,
    difficultyDistribution: diffDist,
    contextualCaseCount: contextualCount,
    contextualPercentage: ((contextualCount / holdoutCases.length) * 100).toFixed(1) + '%',
    multiIntentCaseCount: multiIntentCount,
    multiIntentPercentage: ((multiIntentCount / holdoutCases.length) * 100).toFixed(1) + '%',
    timestamp: new Date().toISOString(),
  };

  const manifestPath = path.resolve('evaluation/holdout_intent_v1_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Manifest written to:', manifestPath);
  console.log('Independence Summary:', {
    total: holdoutCases.length,
    exactDuplicates,
    normalizedDuplicates,
    potentialNearDuplicatesCount: potentialNearDuplicates.length,
    contextualCount,
    multiIntentCount,
    diffDist,
  });
}

auditIndependence().catch(console.error);
