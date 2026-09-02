/**
 * Production Observability & Telemetry Collector
 * Collects and aggregates real-time metrics across:
 * - Conversation Lifecycle (transitions, state distribution, intent frequencies, promotion decisions)
 * - Performance (latency histograms p50/p95/p99, throughput, timeout rate, error rates)
 * - Business (funnel stages, conversion signals, objection rates, rejection rates)
 * - Security (suspicious inputs, prompt injection attempts, abnormal patterns)
 */

export interface LatencyHistogram {
  count: number;
  sumMs: number;
  minMs: number;
  maxMs: number;
  buckets: { le: number; count: number }[];
  p50: number;
  p95: number;
  p99: number;
}

export interface ObservabilitySnapshot {
  timestamp: string;
  uptimeSeconds: number;
  conversation: {
    totalConversations: number;
    activeSessions: number;
    totalTurns: number;
    stateDistribution: Record<string, number>;
    intentDistribution: Record<string, number>;
    promotionDecisions: {
      level0Count: number;
      level1Count: number;
      level2Count: number;
      ctaDeliveredCount: number;
      cooldownPreventedCount: number;
    };
  };
  performance: {
    turnsPerSecond: number;
    turnLatency: LatencyHistogram;
    errorCount: number;
    errorRate: number;
    timeoutCount: number;
    timeoutRate: number;
    circuitBreakerTrips: number;
  };
  business: {
    funnelCounts: Record<string, number>;
    conversionSignalCount: number;
    objectionCount: number;
    objectionResolvedCount: number;
    rejectionCount: number;
    rejectionRecoveryRate: number;
  };
  security: {
    suspiciousInputEvents: number;
    promptInjectionAttempts: number;
    abnormalRateLimits: number;
    sanitizedPiiOccurrences: number;
  };
}

export class ProductionTelemetryCollector {
  private startTime = Date.now();
  private totalConversations = 0;
  private activeSessions = new Set<string>();
  private totalTurns = 0;
  private stateCounts: Record<string, number> = {};
  private intentCounts: Record<string, number> = {};

  private promoLevel0 = 0;
  private promoLevel1 = 0;
  private promoLevel2 = 0;
  private ctaDelivered = 0;
  private cooldownPrevented = 0;

  private turnLatencies: number[] = [];
  private maxLatenciesRetained = 20000;
  private errorCount = 0;
  private timeoutCount = 0;
  private circuitBreakerTrips = 0;

  private funnelCounts: Record<string, number> = {
    DISCOVERY: 0,
    ENGAGED: 0,
    CONSIDERING: 0,
    EVALUATING: 0,
    INTENT: 0,
    CONVERTED: 0,
    LOST: 0,
  };

  private conversionSignals = 0;
  private objections = 0;
  private objectionsResolved = 0;
  private rejections = 0;
  private rejectionRecoveries = 0;

  private suspiciousInputs = 0;
  private promptInjections = 0;
  private abnormalRateLimits = 0;
  private sanitizedPiiCount = 0;

  public recordConversationStart(conversationId: string) {
    this.totalConversations++;
    this.activeSessions.add(conversationId);
  }

  public recordConversationEnd(conversationId: string) {
    this.activeSessions.delete(conversationId);
  }

  public recordTurn(params: {
    conversationId?: string;
    state: string;
    intent: string;
    promotionLevel: number;
    hasCta?: boolean;
    cooldownActive?: boolean;
    latencyMs: number;
    funnelStage?: string;
    isError?: boolean;
    isTimeout?: boolean;
  }) {
    this.totalTurns++;
    this.stateCounts[params.state] = (this.stateCounts[params.state] || 0) + 1;
    this.intentCounts[params.intent] = (this.intentCounts[params.intent] || 0) + 1;

    if (params.promotionLevel === 0) this.promoLevel0++;
    else if (params.promotionLevel === 1) this.promoLevel1++;
    else if (params.promotionLevel === 2) this.promoLevel2++;

    if (params.hasCta) this.ctaDelivered++;
    if (params.cooldownActive) this.cooldownPrevented++;

    if (params.latencyMs >= 0) {
      this.turnLatencies.push(params.latencyMs);
      if (this.turnLatencies.length > this.maxLatenciesRetained) {
        this.turnLatencies.shift();
      }
    }

    if (params.funnelStage) {
      this.funnelCounts[params.funnelStage] = (this.funnelCounts[params.funnelStage] || 0) + 1;
    }

    if (params.isError) this.errorCount++;
    if (params.isTimeout) this.timeoutCount++;
  }

  public recordBusinessEvent(event: 'conversion_signal' | 'objection' | 'objection_resolved' | 'rejection' | 'rejection_recovery') {
    switch (event) {
      case 'conversion_signal':
        this.conversionSignals++;
        break;
      case 'objection':
        this.objections++;
        break;
      case 'objection_resolved':
        this.objectionsResolved++;
        break;
      case 'rejection':
        this.rejections++;
        break;
      case 'rejection_recovery':
        this.rejectionRecoveries++;
        break;
    }
  }

  public recordSecurityEvent(event: 'suspicious_input' | 'prompt_injection' | 'rate_limit_exceeded' | 'pii_sanitized') {
    switch (event) {
      case 'suspicious_input':
        this.suspiciousInputs++;
        break;
      case 'prompt_injection':
        this.promptInjections++;
        break;
      case 'rate_limit_exceeded':
        this.abnormalRateLimits++;
        break;
      case 'pii_sanitized':
        this.sanitizedPiiCount++;
        break;
    }
  }

  public recordCircuitBreakerTrip() {
    this.circuitBreakerTrips++;
  }

  private calculateHistogram(): LatencyHistogram {
    if (this.turnLatencies.length === 0) {
      return {
        count: 0,
        sumMs: 0,
        minMs: 0,
        maxMs: 0,
        buckets: [
          { le: 0.1, count: 0 },
          { le: 0.5, count: 0 },
          { le: 1.0, count: 0 },
          { le: 5.0, count: 0 },
          { le: 10.0, count: 0 },
          { le: 50.0, count: 0 },
        ],
        p50: 0,
        p95: 0,
        p99: 0,
      };
    }

    const sorted = [...this.turnLatencies].sort((a, b) => a - b);
    const count = sorted.length;
    const sumMs = sorted.reduce((acc, v) => acc + v, 0);
    const minMs = sorted[0];
    const maxMs = sorted[count - 1];

    const p50 = sorted[Math.floor(count * 0.5)];
    const p95 = sorted[Math.floor(count * 0.95)];
    const p99 = sorted[Math.floor(count * 0.99)];

    const bucketThresholds = [0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 50.0];
    const buckets = bucketThresholds.map(le => ({
      le,
      count: sorted.filter(v => v <= le).length,
    }));

    return {
      count,
      sumMs,
      minMs,
      maxMs,
      buckets,
      p50,
      p95,
      p99,
    };
  }

  public getSnapshot(): ObservabilitySnapshot {
    const uptimeSec = Math.max(1, (Date.now() - this.startTime) / 1000);
    const histogram = this.calculateHistogram();
    const tps = this.totalTurns / uptimeSec;
    const errorRate = this.totalTurns > 0 ? this.errorCount / this.totalTurns : 0;
    const timeoutRate = this.totalTurns > 0 ? this.timeoutCount / this.totalTurns : 0;
    const rejectionRecoveryRate = this.rejections > 0 ? this.rejectionRecoveries / this.rejections : 0;

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(uptimeSec),
      conversation: {
        totalConversations: this.totalConversations,
        activeSessions: this.activeSessions.size,
        totalTurns: this.totalTurns,
        stateDistribution: { ...this.stateCounts },
        intentDistribution: { ...this.intentCounts },
        promotionDecisions: {
          level0Count: this.promoLevel0,
          level1Count: this.promoLevel1,
          level2Count: this.promoLevel2,
          ctaDeliveredCount: this.ctaDelivered,
          cooldownPreventedCount: this.cooldownPrevented,
        },
      },
      performance: {
        turnsPerSecond: tps,
        turnLatency: histogram,
        errorCount: this.errorCount,
        errorRate,
        timeoutCount: this.timeoutCount,
        timeoutRate,
        circuitBreakerTrips: this.circuitBreakerTrips,
      },
      business: {
        funnelCounts: { ...this.funnelCounts },
        conversionSignalCount: this.conversionSignals,
        objectionCount: this.objections,
        objectionResolvedCount: this.objectionsResolved,
        rejectionCount: this.rejections,
        rejectionRecoveryRate,
      },
      security: {
        suspiciousInputEvents: this.suspiciousInputs,
        promptInjectionAttempts: this.promptInjections,
        abnormalRateLimits: this.abnormalRateLimits,
        sanitizedPiiOccurrences: this.sanitizedPiiCount,
      },
    };
  }

  public formatPrometheusMetrics(): string {
    const s = this.getSnapshot();
    const lines: string[] = [
      '# HELP bot_uptime_seconds Process uptime in seconds',
      '# TYPE bot_uptime_seconds counter',
      `bot_uptime_seconds ${s.uptimeSeconds}`,
      '',
      '# HELP bot_conversation_turns_total Total number of conversation turns processed',
      '# TYPE bot_conversation_turns_total counter',
      `bot_conversation_turns_total ${s.conversation.totalTurns}`,
      '',
      '# HELP bot_conversations_total Total conversations initiated',
      '# TYPE bot_conversations_total counter',
      `bot_conversations_total ${s.conversation.totalConversations}`,
      '',
      '# HELP bot_active_sessions Currently active conversation sessions',
      '# TYPE bot_active_sessions gauge',
      `bot_active_sessions ${s.conversation.activeSessions}`,
      '',
      '# HELP bot_turn_latency_ms Turn latency in milliseconds',
      '# TYPE bot_turn_latency_ms summary',
      `bot_turn_latency_ms{quantile="0.5"} ${s.performance.turnLatency.p50}`,
      `bot_turn_latency_ms{quantile="0.95"} ${s.performance.turnLatency.p95}`,
      `bot_turn_latency_ms{quantile="0.99"} ${s.performance.turnLatency.p99}`,
      `bot_turn_latency_ms_sum ${s.performance.turnLatency.sumMs}`,
      `bot_turn_latency_ms_count ${s.performance.turnLatency.count}`,
      '',
      '# HELP bot_errors_total Total unhandled or runtime errors',
      '# TYPE bot_errors_total counter',
      `bot_errors_total ${s.performance.errorCount}`,
      '',
      '# HELP bot_security_threats_total Total security and injection attempts',
      '# TYPE bot_security_threats_total counter',
      `bot_security_threats_total{type="prompt_injection"} ${s.security.promptInjectionAttempts}`,
      `bot_security_threats_total{type="suspicious_input"} ${s.security.suspiciousInputEvents}`,
      '',
    ];

    for (const [state, count] of Object.entries(s.conversation.stateDistribution)) {
      lines.push(`bot_state_turns_total{state="${state}"} ${count}`);
    }

    for (const [intent, count] of Object.entries(s.conversation.intentDistribution)) {
      lines.push(`bot_intent_turns_total{intent="${intent}"} ${count}`);
    }

    return lines.join('\n') + '\n';
  }
}

export const telemetry = new ProductionTelemetryCollector();
