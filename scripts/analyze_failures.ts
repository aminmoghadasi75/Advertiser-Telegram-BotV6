import * as fs from 'fs';
import * as path from 'path';

interface FailureRecord {
  id: string;
  message: string;
  context: any;
  groundTruthPrimary: string;
  groundTruthSecondary: string[];
  predictedPrimary: string;
  predictedSecondary: string[];
  confidence: number;
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

function analyzeErrors() {
  const metricsPath = path.resolve('evaluation/results/step_5_2_1_metrics.json');
  const raw = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
  const failures: FailureRecord[] = raw.failures;

  console.log(`Total Failures: ${failures.length}`);

  // Failure categories:
  // 1. SMALL_TALK -> OFF_TOPIC / QUESTION (Brittle ASL pattern list & fallback)
  // 2. RELEVANT_NEED -> OFF_TOPIC / QUESTION (Narrow regex vocabulary for pain points)
  // 3. PLAN_REQUEST -> PRICE_REQUEST / PRODUCT_CURIOUS / OFF_TOPIC (Plan patterns mapped or missing in candidate gen)
  // 4. OBJECTION -> QUESTION / PRODUCT_CURIOUS (Objection expressions not matching specific regex)
  // 5. COMMERCIAL_TRAPS (General questions with words like 'خرید', 'قیمت', 'شهریه' misclassified)
  // 6. SAFETY / CRITICAL (REJECTION missed or INAPPROPRIATE over-flagging)
  // 7. INAPPROPRIATE over-flagging (Colloquial Persian words like 'کیر' in expressions or 'لاشی' triggering safety over-conservatively)

  const taxonomyBreakdown: Record<string, { total: number; targetPredictions: Record<string, number>; sampleCases: FailureRecord[] }> = {};

  failures.forEach((f) => {
    const key = f.groundTruthPrimary;
    if (!taxonomyBreakdown[key]) {
      taxonomyBreakdown[key] = { total: 0, targetPredictions: {}, sampleCases: [] };
    }
    taxonomyBreakdown[key].total++;
    taxonomyBreakdown[key].targetPredictions[f.predictedPrimary] = (taxonomyBreakdown[key].targetPredictions[f.predictedPrimary] || 0) + 1;
    taxonomyBreakdown[key].sampleCases.push(f);
  });

  console.log('\n=== FAILURE BREAKDOWN BY GROUND TRUTH INTENT ===');
  Object.keys(taxonomyBreakdown).forEach((intent) => {
    const data = taxonomyBreakdown[intent];
    console.log(`\n[${intent}] Failures: ${data.total}`);
    console.log('  Predicted As:', data.targetPredictions);
    console.log('  Sample Cases:');
    data.sampleCases.slice(0, 3).forEach((c) => {
      console.log(`    - ID: ${c.id} | Msg: "${c.message}" | Pred: ${c.predictedPrimary} (Conf: ${c.confidence})`);
    });
  });

  // Root cause categories
  const rootCauses = {
    brittle_regex_lexicon_gap: 0,
    missing_plan_request_generator: 0,
    priority_ranking_conflict: 0,
    commercial_trap_vulnerability: 0,
    overly_aggressive_safety_or_question: 0,
    short_fallback_misclassification: 0,
  };

  failures.forEach((f) => {
    if (f.groundTruthPrimary === 'PLAN_REQUEST') {
      rootCauses.missing_plan_request_generator++;
    } else if (f.groundTruthPrimary === 'SMALL_TALK' || f.groundTruthPrimary === 'RELEVANT_NEED') {
      rootCauses.brittle_regex_lexicon_gap++;
    } else if (f.groundTruthPrimary === 'COMMERCIAL_TRAP' || f.category === 'COMMERCIAL_TRAP') {
      rootCauses.commercial_trap_vulnerability++;
    } else if (f.groundTruthPrimary === 'UNKNOWN' || f.difficulty === 'hard') {
      rootCauses.short_fallback_misclassification++;
    } else {
      rootCauses.brittle_regex_lexicon_gap++;
    }
  });

  console.log('\n=== ROOT CAUSE DISTRIBUTION ===', rootCauses);
}

analyzeErrors();
