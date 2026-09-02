import * as fs from 'fs';
import { runFullEvaluation } from '../src/evaluation/replayEngine';

async function main() {
  console.log('Running Baseline Evaluation...');
  const report = await runFullEvaluation();
  
  const baselineData = {
    timestamp: report.timestamp,
    datasetSummary: report.datasetSummary,
    intentMetrics: {
      totalTurns: report.intentMetrics.totalTurns,
      evaluatedTurns: report.intentMetrics.evaluatedTurns,
      ambiguousTurns: report.intentMetrics.ambiguousTurns,
      overallAccuracy: report.intentMetrics.overallAccuracy,
      macroF1: report.summaryStatus.intentF1Macro,
      byIntent: report.intentMetrics.byIntent,
      criticalErrors: report.intentMetrics.criticalErrors,
    },
    stateMetrics: {
      totalTransitions: report.stateMetrics.totalTransitions,
      correctTransitions: report.stateMetrics.correctTransitions,
      stateAccuracy: report.stateMetrics.stateAccuracy,
      invalidTransitionCount: report.stateMetrics.invalidTransitionCount,
      invalidTransitions: report.stateMetrics.invalidTransitions,
    },
    promotionMetrics: {
      totalTurns: report.promotionMetrics.totalTurns,
      promotionAccuracy: report.promotionMetrics.promotionAccuracy,
      errorRate: report.promotionMetrics.errorRate,
      oversellingCount: report.promotionMetrics.oversellingCount,
      missedOpportunityCount: report.promotionMetrics.missedOpportunityCount,
      criticalBugs: report.promotionMetrics.criticalBugs,
    },
    responseMetrics: {
      averageScores: report.responseMetrics.averageScores,
    },
    summaryStatus: report.summaryStatus,
  };

  fs.writeFileSync('baseline_step_5_2.json', JSON.stringify(baselineData, null, 2));
  console.log('Saved baseline_step_5_2.json successfully!');
  console.log('Baseline metrics:', {
    intentAccuracy: (report.intentMetrics.overallAccuracy * 100).toFixed(1) + '%',
    macroF1: report.summaryStatus.intentF1Macro,
    stateAccuracy: (report.stateMetrics.stateAccuracy * 100).toFixed(1) + '%',
    promotionErrorRate: (report.promotionMetrics.errorRate * 100).toFixed(1) + '%',
    criticalIntentErrors: report.intentMetrics.criticalErrors.length,
    criticalPromotionBugs: report.promotionMetrics.criticalBugs.length,
    responseQuality: report.responseMetrics.averageScores.overallPercentage,
    readiness: report.summaryStatus.readinessStatus,
  });
}

main().catch(console.error);
