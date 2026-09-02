import { ConversationTurnTrace, ReplayEvaluationReport } from './evaluationTypes';

/**
 * Converts evaluation traces into standard CSV string
 */
export function exportTracesToCSV(traces: ConversationTurnTrace[]): string {
  const headers = [
    'conversationId',
    'turnId',
    'timestamp',
    'userMessage',
    'expectedIntent',
    'actualIntent',
    'intentConfidence',
    'expectedState',
    'actualState',
    'leadScoreBefore',
    'leadScoreAfter',
    'expectedPromotion',
    'actualPromotion',
    'promotionLock',
    'validatorStatus',
    'wasFallbackUsed',
    'generatedResponse',
    'evaluationStatus',
    'errorCategories',
    'criticalErrors',
  ];

  const escapeCSV = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = traces.map((t) => [
    escapeCSV(t.conversationId),
    escapeCSV(t.turnId),
    escapeCSV(t.timestamp),
    escapeCSV(t.userMessage),
    escapeCSV(t.expected?.intent || ''),
    escapeCSV(t.primaryIntent),
    escapeCSV(t.intentConfidence),
    escapeCSV(t.expected?.state || ''),
    escapeCSV(t.nextState),
    escapeCSV(t.leadScoreBefore),
    escapeCSV(t.leadScoreAfter),
    escapeCSV(t.expected?.promotionLevel || ''),
    escapeCSV(t.promotionLevel),
    escapeCSV(t.promotionLock ? 'TRUE' : 'FALSE'),
    escapeCSV(t.validatorStatus.isValid ? 'VALID' : 'INVALID'),
    escapeCSV(t.validatorStatus.wasFallbackUsed ? 'TRUE' : 'FALSE'),
    escapeCSV(t.generatedResponse),
    escapeCSV(t.evaluationStatus),
    escapeCSV(t.errorCategories.join('; ')),
    escapeCSV(t.criticalErrors.join('; ')),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Converts complete report into formatted JSON string
 */
export function exportReportToJSON(report: ReplayEvaluationReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Browser download helper for CSV or JSON
 */
export function triggerFileDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
