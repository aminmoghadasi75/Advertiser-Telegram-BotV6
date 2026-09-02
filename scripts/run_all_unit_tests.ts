import { runAllConversationTests } from '../src/conversation/conversationTests';
import { runAllEvaluationTests } from '../src/evaluation/evaluationTests';
import { runAllStep7AnalyticsTests } from '../src/conversation/step_7_analytics_tests';
import { runAllGeminiAdaptiveRouterTests } from '../src/conversation/geminiAdaptiveRouterTests';

async function main() {
  console.log('--- RUNNING GEMINI ADAPTIVE MULTI-MODEL ROUTER TESTS ---');
  const routerSuite = runAllGeminiAdaptiveRouterTests();
  console.log(`Passed: ${routerSuite.passed}/${routerSuite.total}`);
  for (const r of routerSuite.results) {
    if (!r.passed) {
      console.log(`FAILED: ${r.name} | Expected: ${r.expected} | Actual: ${r.actual}`);
    }
  }

  console.log('\n--- RUNNING ALL CONVERSATION UNIT & E2E TESTS ---');
  const convSuite = runAllConversationTests();
  console.log(`Passed: ${convSuite.passed}/${convSuite.total}`);
  for (const r of convSuite.results) {
    if (!r.passed) {
      console.log(`FAILED: ${r.name} | Expected: ${r.expected} | Actual: ${r.actual}`);
    }
  }

  console.log('\n--- RUNNING ALL EVALUATION TESTS ---');
  const evalSuite = await runAllEvaluationTests();
  console.log(`Passed: ${evalSuite.passed}/${evalSuite.total}`);
  for (const r of evalSuite.results) {
    if (!r.passed) {
      console.log(`FAILED: ${r.name} | Expected: ${r.expected} | Actual: ${r.actual}`);
    }
  }

  console.log('\n--- RUNNING STEP 7 ANALYTICS & CONVERSION TRACKING TESTS ---');
  const analyticsSuite = runAllStep7AnalyticsTests();
  console.log(`Passed: ${analyticsSuite.passed}/${analyticsSuite.total}`);
  for (const r of analyticsSuite.results) {
    if (!r.passed) {
      console.log(`FAILED: ${r.name} | Expected: ${r.expected} | Actual: ${r.actual}`);
    }
  }
}

main().catch(console.error);

