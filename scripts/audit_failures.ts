import { runFullEvaluation } from '../src/evaluation/replayEngine';
import { GOLD_DATASET } from '../src/evaluation/goldDataset';

async function audit() {
  const report = await runFullEvaluation();
  console.log('--- CRITICAL ERRORS ---');
  report.intentMetrics.criticalErrors.forEach((e, idx) => {
    console.log(`${idx + 1}. [${e.conversationId} Turn ${e.turnId}] User: "${e.userMessage}"`);
    console.log(`   Expected: ${e.expected} | Actual: ${e.actual} | Rule: ${e.rule}`);
  });

  console.log('\n--- ALL FAILED TURNS ---');
  let failCount = 0;
  report.allTraces.forEach((t) => {
    if (t.expected && t.expected.intent !== 'AMBIGUOUS' && t.expected.intent !== t.primaryIntent) {
      failCount++;
      console.log(`[${t.conversationId} Turn ${t.turnId}] User: "${t.userMessage}"`);
      console.log(`   Expected: ${t.expected.intent} | Actual: ${t.primaryIntent} | Status: ${t.evaluationStatus}`);
    }
  });
  console.log(`\nTotal Intent Mismatches: ${failCount} / ${report.intentMetrics.evaluatedTurns}`);
}

audit().catch(console.error);
