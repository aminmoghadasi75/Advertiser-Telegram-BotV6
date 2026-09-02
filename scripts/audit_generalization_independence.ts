import fs from 'fs';
import path from 'path';
import { normalizePersianText } from '../src/conversation/normalizer';
import { GOLD_DATASET } from '../src/evaluation/goldDataset';

export function runIndependenceAudit(): void {
  console.log('====================================================');
  console.log(' AUDIT: GENERALIZATION DATASET INDEPENDENCE CHECK');
  console.log('====================================================\n');

  // 1. Extract Gold messages
  const goldTexts = new Set<string>();
  GOLD_DATASET.forEach((conv) => {
    conv.turns.forEach((turn) => {
      goldTexts.add(normalizePersianText(turn.userMessage));
    });
  });

  // 2. Extract Holdout messages
  const holdoutPath = path.join(process.cwd(), 'evaluation', 'holdout_intent_v1.json');
  let holdoutTexts = new Set<string>();
  if (fs.existsSync(holdoutPath)) {
    const raw = fs.readFileSync(holdoutPath, 'utf-8');
    const holdoutData: Array<{ message?: string; input?: string; userMessage?: string; text?: string }> = JSON.parse(raw);
    holdoutData.forEach((item) => {
      const msg = item.message || item.input || item.userMessage || item.text || '';
      if (msg) holdoutTexts.add(normalizePersianText(msg));
    });
  }

  // 3. Extract Synthetic messages
  const synthPath = path.join(process.cwd(), 'evaluation', 'synthetic_generalization_v1.json');
  let synthTexts = new Set<string>();
  if (fs.existsSync(synthPath)) {
    const raw = fs.readFileSync(synthPath, 'utf-8');
    const synthData: Array<{ text: string }> = JSON.parse(raw);
    synthData.forEach((item) => {
      synthTexts.add(normalizePersianText(item.text));
    });
  }

  console.log(`Unique Gold Sentences:      ${goldTexts.size}`);
  console.log(`Unique Holdout Sentences:   ${holdoutTexts.size}`);
  console.log(`Unique Synthetic Sentences: ${synthTexts.size}`);

  // Check Overlaps
  let goldHoldoutOverlap: string[] = [];
  goldTexts.forEach((gt) => {
    if (holdoutTexts.has(gt)) goldHoldoutOverlap.push(gt);
  });

  let goldSynthOverlap: string[] = [];
  goldTexts.forEach((gt) => {
    if (synthTexts.has(gt)) goldSynthOverlap.push(gt);
  });

  let holdoutSynthOverlap: string[] = [];
  holdoutTexts.forEach((ht) => {
    if (synthTexts.has(ht)) holdoutSynthOverlap.push(ht);
  });

  console.log('\n--- Overlap Analysis ---');
  console.log(`Gold <-> Holdout Overlap:     ${goldHoldoutOverlap.length} (${goldHoldoutOverlap.length === 0 ? 'CLEAN / ZERO LEAKAGE' : 'WARNING'})`);
  if (goldHoldoutOverlap.length > 0) console.log('  Details:', goldHoldoutOverlap);

  console.log(`Gold <-> Synthetic Overlap:   ${goldSynthOverlap.length} (${goldSynthOverlap.length === 0 ? 'CLEAN / ZERO LEAKAGE' : 'WARNING'})`);
  if (goldSynthOverlap.length > 0) console.log('  Details:', goldSynthOverlap);

  console.log(`Holdout <-> Synthetic Overlap:${holdoutSynthOverlap.length} (${holdoutSynthOverlap.length === 0 ? 'CLEAN / ZERO LEAKAGE' : 'WARNING'})`);
  if (holdoutSynthOverlap.length > 0) console.log('  Details:', holdoutSynthOverlap);

  if (goldHoldoutOverlap.length === 0 && goldSynthOverlap.length === 0 && holdoutSynthOverlap.length === 0) {
    console.log('\n✅ INDEPENDENCE AUDIT PASSED: All 3 datasets are strictly disjoint (0-phrase overlap).');
  } else {
    console.error('\n❌ INDEPENDENCE AUDIT FAILED: Overlap detected.');
    process.exit(1);
  }
}

runIndependenceAudit();
