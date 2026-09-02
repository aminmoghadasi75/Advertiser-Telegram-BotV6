import fs from 'fs';
import path from 'path';
import { detectIntent } from '../src/conversation/intentEngine';
import { Intent } from '../src/types';
import { SyntheticTestCase } from './generate_synthetic_generalization';

interface EvalResult {
  accuracy: number;
  macroF1: number;
  weightedF1: number;
  totalSamples: number;
  correctSamples: number;
  forbiddenViolations: number;
  byCategory: Record<string, { total: number; correct: number; accuracy: number }>;
  byIntent: Record<string, { tp: number; fp: number; fn: number; precision: number; recall: number; f1: number }>;
  avgLatencyMs: number;
  failedCases: Array<{
    id: string;
    text: string;
    expected: string;
    predicted: string;
    confidence: number;
    reasons: string[];
    violation?: string;
  }>;
}

export function runSyntheticEvaluation(): EvalResult {
  const filePath = path.join(process.cwd(), 'evaluation', 'synthetic_generalization_v1.json');
  if (!fs.existsSync(filePath)) {
    throw new Error(`Synthetic dataset not found at ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const dataset: SyntheticTestCase[] = JSON.parse(raw);

  const byCategory: Record<string, { total: number; correct: number; accuracy: number }> = {};
  const byIntent: Record<string, { tp: number; fp: number; fn: number; precision: number; recall: number; f1: number }> = {};

  Object.values(Intent).forEach((intent) => {
    byIntent[intent] = { tp: 0, fp: 0, fn: 0, precision: 0, recall: 0, f1: 0 };
  });

  let correctCount = 0;
  let forbiddenViolations = 0;
  const failedCases: EvalResult['failedCases'] = [];
  const latencies: number[] = [];

  for (const item of dataset) {
    if (!byCategory[item.category]) {
      byCategory[item.category] = { total: 0, correct: 0, accuracy: 0 };
    }
    byCategory[item.category].total++;

    const start = performance.now();
    const result = detectIntent(item.text);
    const end = performance.now();
    latencies.push(end - start);

    const predicted = result.primaryIntent;
    const isCorrect = predicted === item.expectedIntent;

    // Check forbidden intents
    if (item.forbiddenIntents && item.forbiddenIntents.includes(predicted)) {
      forbiddenViolations++;
      failedCases.push({
        id: item.id,
        text: item.text,
        expected: item.expectedIntent,
        predicted: predicted,
        confidence: result.confidence,
        reasons: result.reasonCodes,
        violation: `FORBIDDEN_INTENT_DETECTED: ${predicted}`,
      });
    } else if (isCorrect) {
      correctCount++;
      byCategory[item.category].correct++;
      if (byIntent[item.expectedIntent]) {
        byIntent[item.expectedIntent].tp++;
      }
    } else {
      failedCases.push({
        id: item.id,
        text: item.text,
        expected: item.expectedIntent,
        predicted: predicted,
        confidence: result.confidence,
        reasons: result.reasonCodes,
      });

      if (byIntent[item.expectedIntent]) {
        byIntent[item.expectedIntent].fn++;
      }
      if (byIntent[predicted]) {
        byIntent[predicted].fp++;
      }
    }
  }

  // Calculate Category Accuracies
  Object.keys(byCategory).forEach((cat) => {
    byCategory[cat].accuracy = byCategory[cat].total > 0 ? byCategory[cat].correct / byCategory[cat].total : 0;
  });

  // Calculate Precision, Recall, F1 for each intent
  let macroF1Sum = 0;
  let weightedF1Sum = 0;
  let evaluatedIntentCount = 0;

  Object.keys(byIntent).forEach((intent) => {
    const stats = byIntent[intent];
    const totalActual = stats.tp + stats.fn;
    stats.precision = stats.tp + stats.fp > 0 ? stats.tp / (stats.tp + stats.fp) : 0;
    stats.recall = stats.tp + stats.fn > 0 ? stats.tp / (stats.tp + stats.fn) : 0;
    stats.f1 = stats.precision + stats.recall > 0 ? (2 * stats.precision * stats.recall) / (stats.precision + stats.recall) : 0;

    if (totalActual > 0) {
      macroF1Sum += stats.f1;
      weightedF1Sum += stats.f1 * totalActual;
      evaluatedIntentCount++;
    }
  });

  const accuracy = dataset.length > 0 ? correctCount / dataset.length : 0;
  const macroF1 = evaluatedIntentCount > 0 ? macroF1Sum / evaluatedIntentCount : 0;
  const weightedF1 = dataset.length > 0 ? weightedF1Sum / dataset.length : 0;
  const avgLatencyMs = latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1);

  const evalResult: EvalResult = {
    accuracy,
    macroF1,
    weightedF1,
    totalSamples: dataset.length,
    correctSamples: correctCount,
    forbiddenViolations,
    byCategory,
    byIntent,
    avgLatencyMs,
    failedCases,
  };

  console.log('====================================================');
  console.log(' SYNTHETIC GENERALIZATION EVALUATION REPORT');
  console.log('====================================================');
  console.log(`Total Samples:       ${evalResult.totalSamples}`);
  console.log(`Correct:             ${evalResult.correctSamples}`);
  console.log(`Accuracy:            ${(evalResult.accuracy * 100).toFixed(2)}%`);
  console.log(`Macro F1:            ${evalResult.macroF1.toFixed(4)}`);
  console.log(`Weighted F1:         ${evalResult.weightedF1.toFixed(4)}`);
  console.log(`Forbidden Violations:${evalResult.forbiddenViolations}`);
  console.log(`Avg Latency:         ${evalResult.avgLatencyMs.toFixed(3)} ms/sample`);
  console.log('----------------------------------------------------');
  console.log('CATEGORY BREAKDOWN:');
  Object.entries(byCategory).forEach(([cat, stats]) => {
    console.log(`  - ${cat.padEnd(20)}: ${(stats.accuracy * 100).toFixed(1)}% (${stats.correct}/${stats.total})`);
  });

  if (failedCases.length > 0) {
    console.log('\n----------------------------------------------------');
    console.log(`FAILED SAMPLES (${failedCases.length}):`);
    failedCases.forEach((f) => {
      console.log(`  [${f.id}] "${f.text}"`);
      console.log(`    Expected: ${f.expected} | Predicted: ${f.predicted} (Conf: ${f.confidence.toFixed(2)})`);
      const reasonsStr = Array.isArray(f.reasons) ? f.reasons.join(', ') : 'NONE';
      console.log(`    Reasons: ${reasonsStr}`);
      if (f.violation) console.log(`    ⚠️ ${f.violation}`);
    });
  }

  // Save report to evaluation/results/
  const resDir = path.join(process.cwd(), 'evaluation', 'results');
  if (!fs.existsSync(resDir)) {
    fs.mkdirSync(resDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(resDir, 'synthetic_eval_report.json'),
    JSON.stringify(evalResult, null, 2),
    'utf-8'
  );

  return evalResult;
}

runSyntheticEvaluation();
