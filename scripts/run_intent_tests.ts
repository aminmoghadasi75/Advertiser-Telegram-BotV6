import { runIntentTestSuite } from '../src/conversation/intentTests';

console.log('--- RUNNING INTENT TEST SUITE ---');
const report = runIntentTestSuite();

console.log(`Total Tests: ${report.total}`);
console.log(`Passed: ${report.passed}`);
console.log(`Failed: ${report.failed}`);
console.log(`Accuracy: ${report.accuracy}%\n`);

report.results.forEach((r) => {
  const icon = r.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${r.id}] ${r.description}`);
  console.log(`     Input: "${r.input}"`);
  console.log(`     Expected: ${r.expected} | Actual: ${r.actual} | Conf: ${r.confidence}`);
  console.log(`     Reasons: ${r.reasonCodes.join(', ')}`);
});
