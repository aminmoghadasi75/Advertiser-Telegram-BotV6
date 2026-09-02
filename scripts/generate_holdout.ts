import * as fs from 'fs';
import * as path from 'path';

export interface HoldoutItem {
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
  sourceType: 'synthetic_blind';
  immutable: true;
}

// We will generate the 200 items programmatically to ensure perfect JSON formatting,
// strict schema compliance, zero duplication with Gold dataset, and balanced distribution.
