# Step 7 — Architecture & System Audit for Analytics and Conversion Tracking

## Executive Summary
This architecture audit evaluates the conversational AI engine (`src/conversation/`) and evaluation framework (`src/evaluation/`) prior to the implementation of the **Step 7 Analytics, Conversion Tracking & Sales Intelligence Layer**.

The conversational engine is composed of deterministic, production-certified pipelines for:
- Intent classification & multi-intent resolution (`intentEngine.ts`, `intentCompatibility.ts`)
- Text normalization (`normalizer.ts`)
- Conversation state machine (`stateMachine.ts`)
- Lead scoring with deduplication (`leadScoring.ts`)
- Promotion policy & guardrails (`promotionPolicy.ts`)
- Objection handling (`objectionEngine.ts`)
- Response validation & sanitization (`responseValidator.ts`)
- Turn orchestration (`conversationEngine.ts`)

---

## 1. Current Architecture Findings

### 1.1 Conversation State Tracking
- **Lifecycle Representation**: `ConversationState` enum defines 16 explicit states spanning early greeting (`INITIAL_GREETING`, `CONNECTING`), qualification (`EARLY_CONVERSATION`, `ENGAGED`, `NEED_DETECTED`, `QUALIFYING`), commercial progression (`PRODUCT_INTRODUCTION`, `PRODUCT_INTEREST`, `TRIAL_DISCUSSION`, `PRICE_DISCUSSION`, `SUPPORT_HANDOFF`), and resolution (`OBJECTION_HANDLING`, `LOW_INTEREST`, `REJECTED`, `GOODBYE`, `EXITING`).
- **Context Immutability**: Each turn in `processConversationTurn` receives an input `ConversationContext` and produces a new updated context, preserving history (`detectedIntentsHistory`, `scoreFactors`, `turnCount`, `elapsedSeconds`).
- **Current Observation Gap**: Transitions between states are computed in `stateMachine.ts`, but transition telemetry (duration in state, bounce rates, exit reasons) is not currently structured into a unified event bus.

### 1.2 Intent Classification Output
- **Detection Structure**: `IntentDetectionResult` returns `primaryIntent`, `secondaryIntents`, `confidence`, `matchedPatterns`, `isExplicitProductIntent`, `isObjectionOrRejection`, and candidate distributions.
- **Intent Taxonomy**: 19 discrete intents covering conversational, commercial (`VPN_REQUEST`, `PRODUCT_CURIOUS`, `TRIAL_REQUEST`, `PRICE_REQUEST`, `PLAN_REQUEST`, `SUPPORT_REQUEST`, `PURCHASE_INTENT`), resistance (`OBJECTION`, `REJECTION`), and adversarial (`SPAM`, `INAPPROPRIATE`, `SUSPICION_BOT`).
- **Current Observation Gap**: Multi-intent co-occurrences and high-value commercial intent velocities are not aggregated into cohort-level conversion indices.

### 1.3 Lead Scoring Logic
- **Scoring Model**: Points are awarded per unique intent category (e.g. +35 for `PURCHASE_INTENT`, +30 for `TRIAL_REQUEST`, +25 for `PRICE_REQUEST`, +20 for `VPN_REQUEST`, +15 for `RELEVANT_NEED`, -30 for `REJECTION`).
- **Explainability**: `LeadScoreFactor` stores `{ intent, points, reason, turn, timestamp }`.
- **Current Observation Gap**: Score velocity, inflection attribution, and drop-off correlation are not aggregated across sessions.

### 1.4 Promotion Decisions & CTA Generation
- **Policy Enforcement**: `evaluatePromotionPolicy` regulates `PromotionLevel` (`NO_PROMOTION` = 0, `SOFT_MENTION` = 1, `DIRECT_OFFER` = 2), respecting the turn cooldown (`MIN_CTA_TURN_GAP = 2`), rejection locks, and hot-lead / explicit-request overrides.
- **Current Observation Gap**: CTA conversion rates by presentation timing, premature pitch detection, and missed opportunity tracking are not currently calculated.

### 1.5 User Session Lifecycle & Persistence
- **Runtime Flow**: Sessions originate in `AnonymousChatAutomatorConfig` and `AnonymousChatSession`.
- **Storage Layer**: Currently managed in-memory and React state with local serialization.
- **Current Observation Gap**: Lack of an extensible storage abstraction (`AnalyticsTracker` / `AnalyticsStorageAdapter`) that decouples analytics event streaming from storage backends.

---

## 2. Recommended Analytics Insertion Points

```
[User Message Ingestion]
        │
        ▼ (1) USER EVENT: MESSAGE_RECEIVED
[Intent Engine]
        │
        ▼ (2) INTENT EVENT: INTENT_DETECTED / MULTI_INTENT / HIGH_VALUE / OBJECTION / REJECTION
[Lead Scoring Engine]
        │
        ▼ (3) SALES EVENT: LEAD_SCORE_UPDATED / LEAD_CREATED
[Promotion Policy Engine]
        │
        ▼ (4) SAFETY & SALES EVENTS: PROMOTION_BLOCKED / CTA_SHOWN / GUARDRAIL_TRIGGERED
[State Machine Engine]
        │
        ▼ (5) STATE EVENT: STATE_EXITED -> STATE_CHANGED -> STATE_ENTERED
[Response Generation & Validation]
        │
        ▼ (6) SALES EVENT: CTA_ACCEPTED / CONVERSION_COMPLETED / USER_ABANDONED
[Analytics Observer Pipeline (Non-Intrusive)]
```

### Key Insertion Principles:
1. **Zero Side-Effects**: Analytics tracking must be strictly passive / observer pattern. It must never mutate conversation states or alter promotion decisions.
2. **Deterministic Processing**: All timestamp calculations and metric reductions must be deterministic and replayable.
3. **Structured Event Envelope**: Uniform schema across user, intent, state, sales, and safety domains.

---

## 3. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CONVERSATION RUNTIME                                  │
│                                                                                 │
│   User Message ──► [ Intent Engine ] ──► [ Lead Scoring ] ──► [ State Machine ] │
│                           │                     │                     │         │
│                           │                     │                     │         │
│                           ▼                     ▼                     ▼         │
│                      IntentResult          ScoreUpdate          StateTransition │
└───────────────────────────┼─────────────────────┼─────────────────────┼─────────┘
                            │                     │                     │
                            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         ANALYTICS TRACKER LAYER                                 │
│                                                                                 │
│   AnalyticsTracker.trackEvent() / trackLeadChange() / trackStateTransition()    │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                      Unified Event Pipeline                             │   │
│   │  - User Events    - Intent Events    - State Events                     │   │
│   │  - Sales Events   - Safety Events                                       │   │
│   └───────────────────────────────────┬─────────────────────────────────────┘   │
│                                       │                                         │
│          ┌────────────────────────────┼────────────────────────────┐            │
│          ▼                            ▼                            ▼            │
│  [ Funnel Engine ]          [ Lead Intelligence ]       [ Objection Analytics ] │
│  (8 Stages: Started         (Explainable Score          (Frequency, Category,   │
│   to Conversion)             Changes, High vs Low)       Recovery & Loss)       │
│          │                            │                            │            │
│          └────────────────────────────┼────────────────────────────┘            │
│                                       ▼                                         │
│                         [ Promotion Analytics Engine ]                          │
│                         (CTA Effectiveness, Timing,                             │
│                          Premature & Missed Opportunity)                        │
│                                       │                                         │
│                                       ▼                                         │
│                         [ Storage Adapter Abstraction ]                         │
│                         - InMemoryStorageAdapter (Active)                       │
│                         - CloudDatabaseAdapter (Extensible Interface)           │
│                                       │                                         │
│                                       ▼                                         │
│                     [ Dashboard Metrics DTO Contract ]                          │
│                     (Conversation, Lead, Funnel, Promotion,                     │
│                      Objection, Safety Metrics)                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Risks of Regression & Mitigation Strategies

| Potential Risk | Root Cause | Mitigation Strategy |
| :--- | :--- | :--- |
| **Decision Interference** | Injecting analytics logic into core decision loops that could alter return values | Pure observer design: analytics functions consume readonly outputs and cannot mutate context or state machine decisions. |
| **Performance Overhead** | In-memory event accumulator growing unboundedly during long benchmarks | Lightweight O(1) indexed aggregations and configurable retention buffers. |
| **Schema Divergence** | Inconsistent event property naming across modules | Strict TypeScript DTO contracts with compile-time type verification. |
| **Benchmark Corruption** | Modifying baseline datasets or evaluation scripts | Zero changes to frozen baseline datasets or existing test suites (`goldDataset.ts`, `step_5_6_dataset.ts`). |
