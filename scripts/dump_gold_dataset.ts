import { GOLD_DATASET } from '../src/evaluation/goldDataset';

console.log('--- ALL GOLD TURNS DUMP ---');
GOLD_DATASET.forEach((conv) => {
  console.log(`\n=== [${conv.conversationId}] ${conv.category} : "${conv.title}" ===`);
  conv.turns.forEach((t) => {
    console.log(`  Turn ${t.turnId}: [Expected: ${t.expectedIntent}] "${t.userMessage}"`);
  });
});
