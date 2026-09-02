import * as fs from 'fs';
import { replaySingleConversation } from '../src/evaluation/replayEngine';
import { GOLD_DATASET } from '../src/evaluation/goldDataset';
import { ReplayMode, ConversationTurnTrace } from '../src/evaluation/evaluationTypes';

async function fullBaselineAudit() {
  const traces: ConversationTurnTrace[] = [];

  for (const conv of GOLD_DATASET) {
    const convTraces = await replaySingleConversation(conv, ReplayMode.DETERMINISTIC_REPLAY);
    traces.push(...convTraces);
  }

  const totalTurns = traces.length;
  const stateMatches = traces.filter(t => t.expected && t.nextState === t.expected.state).length;
  const promoMatches = traces.filter(t => t.expected && t.promotionLevel === t.expected.promotionLevel).length;

  const stateErrors = traces.filter(t => t.expected && t.nextState !== t.expected.state).map(t => ({
    convId: t.conversationId,
    turnId: t.turnId,
    msg: t.userMessage,
    prevState: t.previousState,
    detectedIntent: t.primaryIntent,
    expectedIntent: t.expected?.intent,
    predictedState: t.nextState,
    expectedState: t.expected?.state,
    promoLevel: t.promotionLevel,
    expectedPromo: t.expected?.promotionLevel,
    lock: t.promotionLock,
    leadScore: t.leadScoreAfter,
  }));

  const promoErrors = traces.filter(t => t.expected && t.promotionLevel !== t.expected.promotionLevel).map(t => ({
    convId: t.conversationId,
    turnId: t.turnId,
    msg: t.userMessage,
    prevState: t.previousState,
    predictedState: t.nextState,
    detectedIntent: t.primaryIntent,
    expectedIntent: t.expected?.intent,
    actualPromo: t.promotionLevel,
    expectedPromo: t.expected?.promotionLevel,
    lock: t.promotionLock,
    leadScore: t.leadScoreAfter,
  }));

  fs.writeFileSync('evaluation/results/step_5_3_prechange_baseline.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTurns,
    stateMatches,
    stateAccuracy: stateMatches / totalTurns,
    promoMatches,
    promoAccuracy: promoMatches / totalTurns,
    promoErrorRate: (totalTurns - promoMatches) / totalTurns,
    stateErrorsCount: stateErrors.length,
    stateErrors,
    promoErrorsCount: promoErrors.length,
    promoErrors,
  }, null, 2));

  console.log(`Audited ${totalTurns} turns:`);
  console.log(`State Accuracy: ${(stateMatches / totalTurns * 100).toFixed(2)}% (${stateMatches}/${totalTurns})`);
  console.log(`Promo Accuracy: ${(promoMatches / totalTurns * 100).toFixed(2)}% (${promoMatches}/${totalTurns})`);
  console.log(`Promo Error Rate: ${((totalTurns - promoMatches) / totalTurns * 100).toFixed(2)}%`);
  console.log(`State Errors: ${stateErrors.length}`);
  console.log(`Promo Errors: ${promoErrors.length}`);
}

fullBaselineAudit().catch(console.error);
