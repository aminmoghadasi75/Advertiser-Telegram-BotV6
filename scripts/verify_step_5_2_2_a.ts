import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { detectIntent, IntentDetectionResult } from '../src/conversation/intentEngine';
import { Intent } from '../src/types';
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

interface CaseEvaluationResult {
  id: string;
  message: string;
  context: HoldoutCase['context'];
  groundTruthPrimary: string;
  groundTruthSecondary: string[];
  predictedPrimary: string;
  predictedSecondary: string[];
  confidence: number;
  reasonCodes: string[];
  rawCandidates: Array<{ intent: string; score: number }>;
  match: boolean;
  secondaryExactMatch: boolean;
  secondaryPrecision: number;
  secondaryRecall: number;
  criticalError: boolean;
  errorType?: string;
  category: string;
  difficulty: string;
}

const ALL_TAXONOMY_INTENTS: Intent[] = [
  Intent.GREETING,
  Intent.SMALL_TALK,
  Intent.QUESTION,
  Intent.RELEVANT_NEED,
  Intent.VPN_REQUEST,
  Intent.PRODUCT_CURIOUS,
  Intent.TRIAL_REQUEST,
  Intent.PRICE_REQUEST,
  Intent.PLAN_REQUEST,
  Intent.SUPPORT_REQUEST,
  Intent.PURCHASE_INTENT,
  Intent.OBJECTION,
  Intent.REJECTION,
  Intent.GOODBYE,
  Intent.SUSPICION_BOT,
  Intent.INAPPROPRIATE,
  Intent.SPAM,
  Intent.OFF_TOPIC,
  Intent.UNKNOWN,
];

const COMMERCIAL_INTENTS = new Set([
  Intent.PRICE_REQUEST,
  Intent.TRIAL_REQUEST,
  Intent.PURCHASE_INTENT,
  Intent.SUPPORT_REQUEST,
  Intent.VPN_REQUEST,
  Intent.PLAN_REQUEST,
  Intent.PRODUCT_CURIOUS,
]);

const SAFETY_INTENTS = new Set([
  Intent.INAPPROPRIATE,
  Intent.SPAM,
  Intent.REJECTION,
]);

function getFileSha256(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function main() {
  console.log('=====================================================');
  console.log(' STEP 5.2.2-A: FROZEN HOLDOUT VERIFICATION & AUDIT');
  console.log('=====================================================');

  const holdoutPath = path.resolve('evaluation/holdout_intent_v1.json');
  if (!fs.existsSync(holdoutPath)) {
    console.error('CRITICAL: Holdout dataset file not found at:', holdoutPath);
    console.log('HOLDOUT_INTEGRITY_UNVERIFIABLE');
    process.exit(1);
  }

  const rawHoldoutContent = fs.readFileSync(holdoutPath, 'utf-8');
  const holdoutSha256 = getFileSha256(holdoutPath);
  const holdoutCases: HoldoutCase[] = JSON.parse(rawHoldoutContent);

  console.log(`1. Holdout File Path: ${holdoutPath}`);
  console.log(`2. Total Holdout Cases: ${holdoutCases.length}`);
  console.log(`3. Holdout SHA-256 Checksum: ${holdoutSha256}`);

  // Check 5.2.1 baseline results artifact for checksum / metadata match
  const step521MetricsPath = path.resolve('evaluation/results/step_5_2_1_metrics.json');
  let step521Metadata: any = null;
  if (fs.existsSync(step521MetricsPath)) {
    step521Metadata = JSON.parse(fs.readFileSync(step521MetricsPath, 'utf-8'));
    console.log('4. Step 5.2.1 Baseline Metadata verified from artifact:', step521Metadata.metadata);
  }

  // Check Leakage against Gold Dataset & Unit Tests
  const goldItems: Array<{ id: string; raw: string; norm: string; tokens: string[] }> = [];
  GOLD_DATASET.forEach((conv) => {
    conv.turns.forEach((turn) => {
      const norm = normalizePersianText(turn.userMessage);
      goldItems.push({
        id: `${conv.conversationId}_t${turn.turnId}`,
        raw: turn.userMessage,
        norm,
        tokens: tokenizePersianText(norm),
      });
    });
  });

  INTENT_TEST_SUITE.forEach((test) => {
    const norm = normalizePersianText(test.input);
    goldItems.push({
      id: test.id,
      raw: test.input,
      norm,
      tokens: tokenizePersianText(norm),
    });
  });

  // Check Leakage against Synthetic Dataset
  const synthPath = path.resolve('evaluation/synthetic_generalization_v1.json');
  const synthItems: Array<{ id: string; raw: string; norm: string }> = [];
  if (fs.existsSync(synthPath)) {
    const synthCases = JSON.parse(fs.readFileSync(synthPath, 'utf-8'));
    synthCases.forEach((sc: any) => {
      const msg = sc.text || sc.message || '';
      const norm = normalizePersianText(msg);
      synthItems.push({
        id: sc.id,
        raw: msg,
        norm,
      });
    });
  }

  let goldExactOverlap = 0;
  let goldNormOverlap = 0;
  let synthExactOverlap = 0;
  let synthNormOverlap = 0;

  holdoutCases.forEach((hc) => {
    const normH = normalizePersianText(hc.message);
    goldItems.forEach((gi) => {
      if (hc.message.trim() === gi.raw.trim()) goldExactOverlap++;
      if (normH === gi.norm) goldNormOverlap++;
    });
    synthItems.forEach((si) => {
      if (hc.message.trim() === si.raw.trim()) synthExactOverlap++;
      if (normH === si.norm) synthNormOverlap++;
    });
  });

  console.log(`5. Exact overlap with Gold Dataset + Unit Tests: ${goldExactOverlap}`);
  console.log(`6. Normalized overlap with Gold Dataset + Unit Tests: ${goldNormOverlap}`);
  console.log(`7. Exact overlap with Synthetic Generalization Dataset: ${synthExactOverlap}`);
  console.log(`8. Normalized overlap with Synthetic Generalization Dataset: ${synthNormOverlap}`);

  // Search production source code for leakages
  const srcDir = path.resolve('src');
  const productionFiles: string[] = [];
  function scanDir(dir: string) {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(ts|tsx|js|json)$/.test(file) && !fullPath.includes('/evaluation/')) {
        productionFiles.push(fullPath);
      }
    });
  }
  scanDir(srcDir);

  const leakagesFound: Array<{ file: string; match: string; type: string }> = [];
  productionFiles.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('holdout_intent_v1.json') || content.includes('holdout_')) {
      // Check if it's an evaluation file inside src (e.g. goldDataset is fine, but holdout shouldn't be imported)
      leakagesFound.push({ file: filePath, match: 'holdout reference', type: 'REFERENCE' });
    }
    // Check if any exact holdout sentence is hardcoded in production
    holdoutCases.forEach((hc) => {
      if (hc.message.length > 8 && content.includes(hc.message)) {
        leakagesFound.push({ file: filePath, match: hc.message, type: `HOLDOUT_CASE_${hc.id}` });
      }
    });
  });

  console.log(`9. Production Source Leakage Scan (${productionFiles.length} files scanned): ${leakagesFound.length} leaks found.`);
  if (leakagesFound.length > 0) {
    console.warn('LEAKAGES FOUND:', leakagesFound);
  }

  // RUN EVALUATION ACROSS ALL 200 HOLDOUT CASES
  const results: CaseEvaluationResult[] = [];
  const intentIndexMap: Record<string, number> = {};
  ALL_TAXONOMY_INTENTS.forEach((intent, idx) => {
    intentIndexMap[intent] = idx;
  });

  const numIntents = ALL_TAXONOMY_INTENTS.length;
  const confusionMatrix: number[][] = Array.from({ length: numIntents }, () =>
    Array(numIntents).fill(0)
  );

  let totalCorrect = 0;
  let criticalErrorCount = 0;

  const sliceStats: Record<string, { total: number; correct: number }> = {
    easy: { total: 0, correct: 0 },
    medium: { total: 0, correct: 0 },
    hard: { total: 0, correct: 0 },
    contextual: { total: 0, correct: 0 },
    standalone: { total: 0, correct: 0 },
  };

  const criticalErrorsList: any[] = [];
  const commercialFPsList: any[] = [];
  const rejectionFNsList: any[] = [];

  holdoutCases.forEach((hc) => {
    const history: Array<{ sender: string; text: string }> = [];
    if (hc.context.previousUserMessages && hc.context.previousUserMessages.length > 0) {
      hc.context.previousUserMessages.forEach((msg) => {
        history.push({ sender: 'user', text: msg });
      });
    }
    if (hc.context.lastAssistantMessage) {
      history.push({ sender: 'assistant', text: hc.context.lastAssistantMessage });
    }

    const prediction: IntentDetectionResult = detectIntent(hc.message, history);

    const actualPrimary = hc.expectedPrimaryIntent;
    const predPrimary = prediction.primaryIntent;
    const match = actualPrimary === predPrimary;

    if (match) totalCorrect++;

    const actualIdx = intentIndexMap[actualPrimary] ?? -1;
    const predIdx = intentIndexMap[predPrimary] ?? -1;
    if (actualIdx >= 0 && predIdx >= 0) {
      confusionMatrix[actualIdx][predIdx]++;
    }

    sliceStats[hc.difficulty].total++;
    if (match) sliceStats[hc.difficulty].correct++;

    const isContextual =
      (hc.context.previousUserMessages && hc.context.previousUserMessages.length > 0) ||
      (hc.context.previousIntents && hc.context.previousIntents.length > 0) ||
      hc.context.lastAssistantMessage !== null ||
      hc.context.conversationState !== null ||
      hc.context.productMentioned === true;

    if (isContextual) {
      sliceStats.contextual.total++;
      if (match) sliceStats.contextual.correct++;
    } else {
      sliceStats.standalone.total++;
      if (match) sliceStats.standalone.correct++;
    }

    const expectedSec = new Set<string>(hc.expectedSecondaryIntents || []);
    const predictedSec = new Set<string>(prediction.secondaryIntents || []);

    let secMatches = 0;
    predictedSec.forEach((p) => {
      if (expectedSec.has(p)) secMatches++;
    });

    const secPrecision = predictedSec.size > 0 ? secMatches / predictedSec.size : (expectedSec.size === 0 ? 1 : 0);
    const secRecall = expectedSec.size > 0 ? secMatches / expectedSec.size : 1;
    const setsEqual = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((x) => b.has(x));
    const secondaryExactMatch = setsEqual(expectedSec, predictedSec);

    let isCritical = false;
    let errorType: string | undefined = undefined;

    if (!match) {
      if (SAFETY_INTENTS.has(actualPrimary as Intent) && !SAFETY_INTENTS.has(predPrimary as Intent)) {
        isCritical = true;
        errorType = 'CRITICAL_SAFETY_FALSE_NEGATIVE';
      } else if (COMMERCIAL_INTENTS.has(predPrimary as Intent) && !COMMERCIAL_INTENTS.has(actualPrimary as Intent)) {
        isCritical = actualPrimary === Intent.REJECTION || actualPrimary === Intent.INAPPROPRIATE;
        errorType = isCritical ? 'CRITICAL_REJECTION_TO_COMMERCIAL' : 'COMMERCIAL_FALSE_POSITIVE';
      } else {
        errorType = 'INTENT_MISCLASSIFICATION';
      }
    }

    if (isCritical) {
      criticalErrorCount++;
      criticalErrorsList.push({
        id: hc.id,
        message: hc.message,
        expected: actualPrimary,
        predicted: predPrimary,
        reasonCodes: prediction.reasonCodes,
        candidates: prediction.topCandidates,
        category: hc.category,
        errorType,
      });
    }

    if (!COMMERCIAL_INTENTS.has(actualPrimary as Intent) && COMMERCIAL_INTENTS.has(predPrimary as Intent)) {
      commercialFPsList.push({
        id: hc.id,
        message: hc.message,
        expected: actualPrimary,
        predicted: predPrimary,
        reasonCodes: prediction.reasonCodes,
        candidates: prediction.topCandidates,
      });
    }

    if (actualPrimary === Intent.REJECTION && predPrimary !== Intent.REJECTION) {
      rejectionFNsList.push({
        id: hc.id,
        message: hc.message,
        expected: actualPrimary,
        predicted: predPrimary,
        reasonCodes: prediction.reasonCodes,
        candidates: prediction.topCandidates,
      });
    }

    results.push({
      id: hc.id,
      message: hc.message,
      context: hc.context,
      groundTruthPrimary: actualPrimary,
      groundTruthSecondary: hc.expectedSecondaryIntents || [],
      predictedPrimary: predPrimary,
      predictedSecondary: (prediction.secondaryIntents || []).map((i) => i.toString()),
      confidence: prediction.confidence,
      reasonCodes: prediction.reasonCodes || [],
      rawCandidates: (prediction.topCandidates || []).map((c) => ({ intent: c.intent.toString(), score: c.score })),
      match,
      secondaryExactMatch,
      secondaryPrecision: Number(secPrecision.toFixed(3)),
      secondaryRecall: Number(secRecall.toFixed(3)),
      criticalError: isCritical,
      errorType,
      category: hc.category,
      difficulty: hc.difficulty,
    });
  });

  // Calculate Metrics
  interface PerClassMetric {
    intent: string;
    tp: number;
    fp: number;
    fn: number;
    support: number;
    precision: number;
    recall: number;
    f1: number;
  }

  const perClassMetrics: Record<string, PerClassMetric> = {};
  let macroPrecisionSum = 0;
  let macroRecallSum = 0;
  let macroF1Sum = 0;
  let weightedPrecisionSum = 0;
  let weightedRecallSum = 0;
  let weightedF1Sum = 0;
  let activeClassesCount = 0;

  ALL_TAXONOMY_INTENTS.forEach((intent, idx) => {
    const tp = confusionMatrix[idx][idx];
    let fp = 0;
    let fn = 0;
    let support = 0;

    for (let i = 0; i < numIntents; i++) {
      if (i !== idx) {
        fp += confusionMatrix[i][idx];
        fn += confusionMatrix[idx][i];
      }
      support += confusionMatrix[idx][i];
    }

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    perClassMetrics[intent] = {
      intent,
      tp,
      fp,
      fn,
      support,
      precision: Number(precision.toFixed(4)),
      recall: Number(recall.toFixed(4)),
      f1: Number(f1.toFixed(4)),
    };

    if (support > 0) {
      macroPrecisionSum += precision;
      macroRecallSum += recall;
      macroF1Sum += f1;
      weightedPrecisionSum += precision * support;
      weightedRecallSum += recall * support;
      weightedF1Sum += f1 * support;
      activeClassesCount++;
    }
  });

  const totalSupport = holdoutCases.length;
  const macroPrecision = activeClassesCount > 0 ? macroPrecisionSum / activeClassesCount : 0;
  const macroRecall = activeClassesCount > 0 ? macroRecallSum / activeClassesCount : 0;
  const macroF1 = activeClassesCount > 0 ? macroF1Sum / activeClassesCount : 0;

  const weightedPrecision = totalSupport > 0 ? weightedPrecisionSum / totalSupport : 0;
  const weightedRecall = totalSupport > 0 ? weightedRecallSum / totalSupport : 0;
  const weightedF1 = totalSupport > 0 ? weightedF1Sum / totalSupport : 0;
  const overallAccuracy = totalSupport > 0 ? totalCorrect / totalSupport : 0;

  let nonCommercialCount = 0;
  let commercialFalsePositives = 0;
  let rejectionCases = 0;
  let rejectionFalseNegatives = 0;
  let safetyCases = 0;
  let safetyTruePositives = 0;
  let safetyFalsePositives = 0;
  let botCases = 0;
  let botTruePositives = 0;

  results.forEach((r) => {
    const isActualCommercial = COMMERCIAL_INTENTS.has(r.groundTruthPrimary as Intent);
    const isPredCommercial = COMMERCIAL_INTENTS.has(r.predictedPrimary as Intent);

    if (!isActualCommercial) {
      nonCommercialCount++;
      if (isPredCommercial) commercialFalsePositives++;
    }

    if (r.groundTruthPrimary === Intent.REJECTION) {
      rejectionCases++;
      if (r.predictedPrimary !== Intent.REJECTION) rejectionFalseNegatives++;
    }

    if (SAFETY_INTENTS.has(r.groundTruthPrimary as Intent)) {
      safetyCases++;
      if (SAFETY_INTENTS.has(r.predictedPrimary as Intent)) safetyTruePositives++;
    }

    if (SAFETY_INTENTS.has(r.predictedPrimary as Intent) && !SAFETY_INTENTS.has(r.groundTruthPrimary as Intent)) {
      safetyFalsePositives++;
    }

    if (r.groundTruthPrimary === Intent.SUSPICION_BOT) {
      botCases++;
      if (r.predictedPrimary === Intent.SUSPICION_BOT) botTruePositives++;
    }
  });

  const commercialFPR = nonCommercialCount > 0 ? commercialFalsePositives / nonCommercialCount : 0;
  const rejectionFNR = rejectionCases > 0 ? rejectionFalseNegatives / rejectionCases : 0;
  const safetyPrecision = safetyTruePositives + safetyFalsePositives > 0 ? safetyTruePositives / (safetyTruePositives + safetyFalsePositives) : 1;
  const botDetectionRecall = botCases > 0 ? botTruePositives / botCases : 0;

  let multiIntentTotal = 0;
  let multiIntentExactMatches = 0;
  let secondaryPrecSum = 0;
  let secondaryRecSum = 0;

  results.forEach((r) => {
    if (r.groundTruthSecondary.length > 0) {
      multiIntentTotal++;
      if (r.secondaryExactMatch) multiIntentExactMatches++;
      secondaryPrecSum += r.secondaryPrecision;
      secondaryRecSum += r.secondaryRecall;
    }
  });

  const multiIntentExactMatchRate = multiIntentTotal > 0 ? multiIntentExactMatches / multiIntentTotal : 1;
  const secondaryIntentPrecision = multiIntentTotal > 0 ? secondaryPrecSum / multiIntentTotal : 1;
  const secondaryIntentRecall = multiIntentTotal > 0 ? secondaryRecSum / multiIntentTotal : 1;
  const secondaryIntentF1 =
    secondaryIntentPrecision + secondaryIntentRecall > 0
      ? (2 * secondaryIntentPrecision * secondaryIntentRecall) / (secondaryIntentPrecision + secondaryIntentRecall)
      : 0;

  // Unknown & Off-topic confusion stats
  const unknownIdx = intentIndexMap[Intent.UNKNOWN];
  const offTopicIdx = intentIndexMap[Intent.OFF_TOPIC];
  const unknownRow = confusionMatrix[unknownIdx];
  const offTopicRow = confusionMatrix[offTopicIdx];

  const summary = {
    metadata: {
      evaluationStep: '5.2.2-A',
      dataset: 'holdout_intent_v1.json',
      datasetSha256: holdoutSha256,
      timestamp: new Date().toISOString(),
      totalCases: totalSupport,
    },
    primaryMetrics: {
      holdoutIntentAccuracy: Number((overallAccuracy * 100).toFixed(2)),
      macroPrecision: Number(macroPrecision.toFixed(4)),
      macroRecall: Number(macroRecall.toFixed(4)),
      macroF1: Number(macroF1.toFixed(4)),
      weightedPrecision: Number(weightedPrecision.toFixed(4)),
      weightedRecall: Number(weightedRecall.toFixed(4)),
      weightedF1: Number(weightedF1.toFixed(4)),
    },
    multiIntentMetrics: {
      multiIntentCasesCount: multiIntentTotal,
      multiIntentExactMatchRate: Number((multiIntentExactMatchRate * 100).toFixed(2)),
      secondaryIntentPrecision: Number(secondaryIntentPrecision.toFixed(4)),
      secondaryIntentRecall: Number(secondaryIntentRecall.toFixed(4)),
      secondaryIntentF1: Number(secondaryIntentF1.toFixed(4)),
    },
    commercialSafetyMetrics: {
      nonCommercialCount,
      commercialFalsePositives,
      commercialFalsePositiveRate: Number((commercialFPR * 100).toFixed(2)),
      rejectionCases,
      rejectionFalseNegatives,
      rejectionFalseNegativeRate: Number((rejectionFNR * 100).toFixed(2)),
      safetyPrecision: Number(safetyPrecision.toFixed(4)),
      botDetectionRecall: Number((botDetectionRecall * 100).toFixed(2)),
      criticalErrorsCount: criticalErrorCount,
    },
    sliceMetrics: {
      easy: {
        total: sliceStats.easy.total,
        correct: sliceStats.easy.correct,
        accuracy: Number(((sliceStats.easy.correct / sliceStats.easy.total) * 100).toFixed(2)),
      },
      medium: {
        total: sliceStats.medium.total,
        correct: sliceStats.medium.correct,
        accuracy: Number(((sliceStats.medium.correct / sliceStats.medium.total) * 100).toFixed(2)),
      },
      hard: {
        total: sliceStats.hard.total,
        correct: sliceStats.hard.correct,
        accuracy: Number(((sliceStats.hard.correct / sliceStats.hard.total) * 100).toFixed(2)),
      },
      contextual: {
        total: sliceStats.contextual.total,
        correct: sliceStats.contextual.correct,
        accuracy: Number(((sliceStats.contextual.correct / sliceStats.contextual.total) * 100).toFixed(2)),
      },
      standalone: {
        total: sliceStats.standalone.total,
        correct: sliceStats.standalone.correct,
        accuracy: Number(((sliceStats.standalone.correct / sliceStats.standalone.total) * 100).toFixed(2)),
      },
    },
    perClassMetrics,
    confusionMatrix: {
      labels: ALL_TAXONOMY_INTENTS,
      matrix: confusionMatrix,
    },
    criticalErrors: criticalErrorsList,
    commercialFalsePositivesList: commercialFPsList,
    rejectionFalseNegativesList: rejectionFNsList,
    failures: results.filter((r) => !r.match),
  };

  const resDir = path.resolve('evaluation/results');
  if (!fs.existsSync(resDir)) {
    fs.mkdirSync(resDir, { recursive: true });
  }

  const rawOutPath = path.join(resDir, 'step_5_2_2_a_holdout_raw.json');
  fs.writeFileSync(rawOutPath, JSON.stringify(results, null, 2), 'utf-8');

  const metricsOutPath = path.join(resDir, 'step_5_2_2_a_metrics.json');
  fs.writeFileSync(metricsOutPath, JSON.stringify(summary, null, 2), 'utf-8');

  console.log('\n=====================================================');
  console.log(' EVALUATION EXECUTION RESULTS (CURRENT CODE)');
  console.log('=====================================================');
  console.log(`Accuracy: ${summary.primaryMetrics.holdoutIntentAccuracy}% (${totalCorrect}/${totalSupport})`);
  console.log(`Macro F1: ${summary.primaryMetrics.macroF1}`);
  console.log(`Weighted F1: ${summary.primaryMetrics.weightedF1}`);
  console.log(`Critical Errors: ${criticalErrorCount}`);
  console.log(`Commercial FPR: ${summary.commercialSafetyMetrics.commercialFalsePositiveRate}% (${commercialFalsePositives}/${nonCommercialCount})`);
  console.log(`Rejection FNR: ${summary.commercialSafetyMetrics.rejectionFalseNegativeRate}% (${rejectionFalseNegatives}/${rejectionCases})`);
  console.log(`Multi-Intent Exact Match: ${summary.multiIntentMetrics.multiIntentExactMatchRate}% (${multiIntentExactMatches}/${multiIntentTotal})`);
  console.log(`Bot Suspicion Recall: ${summary.commercialSafetyMetrics.botDetectionRecall}%`);
  console.log(`Failures Total: ${summary.failures.length}`);
  console.log(`Raw Artifact: ${rawOutPath}`);
  console.log(`Metrics Artifact: ${metricsOutPath}`);

  // Acceptance Gates Evaluation
  const gates = [
    { name: 'Accuracy >= 80%', actual: `${summary.primaryMetrics.holdoutIntentAccuracy}%`, pass: summary.primaryMetrics.holdoutIntentAccuracy >= 80.0 },
    { name: 'Macro F1 >= 0.75', actual: summary.primaryMetrics.macroF1, pass: summary.primaryMetrics.macroF1 >= 0.75 },
    { name: 'Weighted F1 >= 0.80', actual: summary.primaryMetrics.weightedF1, pass: summary.primaryMetrics.weightedF1 >= 0.80 },
    { name: 'Critical Intent Errors = 0', actual: criticalErrorCount, pass: criticalErrorCount === 0 },
    { name: 'Commercial FPR <= 3%', actual: `${summary.commercialSafetyMetrics.commercialFalsePositiveRate}%`, pass: summary.commercialSafetyMetrics.commercialFalsePositiveRate <= 3.0 },
    { name: 'Rejection FNR <= 5%', actual: `${summary.commercialSafetyMetrics.rejectionFalseNegativeRate}%`, pass: summary.commercialSafetyMetrics.rejectionFalseNegativeRate <= 5.0 },
    { name: 'Multi-Intent Exact Match >= 70%', actual: `${summary.multiIntentMetrics.multiIntentExactMatchRate}%`, pass: summary.multiIntentMetrics.multiIntentExactMatchRate >= 70.0 },
  ];

  console.log('\n--- ACCEPTANCE GATES ---');
  let allPass = true;
  gates.forEach((g) => {
    console.log(`[${g.pass ? 'PASS' : 'FAIL'}] ${g.name} | Measured: ${g.actual}`);
    if (!g.pass) allPass = false;
  });

  const finalVerdict = allPass ? 'READY_FOR_STEP_5_2_3' : 'BLOCKED_INTENT_GENERALIZATION';
  console.log('\n=====================================================');
  console.log(`FINAL VERDICT: ${finalVerdict}`);
  console.log('=====================================================');
}

main().catch((err) => {
  console.error(err);
  console.log('HOLDOUT_INTEGRITY_UNVERIFIABLE');
});
