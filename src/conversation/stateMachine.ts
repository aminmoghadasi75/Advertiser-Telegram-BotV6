import {
  ConversationState,
  Intent,
  ConversationContext,
  PromotionLevel,
  ConversationStrategy,
} from '../types';

export interface StateTransitionResult {
  newState: ConversationState;
  previousState: ConversationState;
  transitionReason: string;
  isTerminalState: boolean;
}

/**
 * Deterministic State Machine for Anonymous Conversational Sales
 * Transitions between conversation phases according to strict deterministic rules and chosen strategy.
 */
export function transitionConversationState(
  currentState: ConversationState,
  intent: Intent,
  context: ConversationContext,
  maxTurns: number = 4,
  strategy: ConversationStrategy = 'direct_pitch'
): StateTransitionResult {
  const previousState = currentState;

  // 1. Safety & Terminal Rules
  if (intent === Intent.INAPPROPRIATE || intent === Intent.SPAM) {
    return {
      newState: ConversationState.EXITING,
      previousState,
      transitionReason: `Terminal event: User triggered ${intent}`,
      isTerminalState: true,
    };
  }

  if (currentState === ConversationState.EXITING) {
    return {
      newState: ConversationState.EXITING,
      previousState,
      transitionReason: 'Already in exiting state',
      isTerminalState: true,
    };
  }

  if (currentState === ConversationState.GOODBYE) {
    if (
      intent === Intent.PURCHASE_INTENT ||
      intent === Intent.SUPPORT_REQUEST ||
      intent === Intent.TRIAL_REQUEST ||
      intent === Intent.PRICE_REQUEST ||
      intent === Intent.VPN_REQUEST ||
      intent === Intent.PLAN_REQUEST
    ) {
      // Allow recovery if user asks explicit commercial inquiry
    } else {
      return {
        newState: ConversationState.EXITING,
        previousState,
        transitionReason: 'Goodbye concluded, transitioning to exit',
        isTerminalState: true,
      };
    }
  }

  if (intent === Intent.GOODBYE) {
    return {
      newState: ConversationState.GOODBYE,
      previousState,
      transitionReason: 'User initiated farewell/goodbye',
      isTerminalState: false,
    };
  }

  // 2. Rejection Dominance
  if (intent === Intent.REJECTION) {
    return {
      newState: ConversationState.REJECTED,
      previousState,
      transitionReason: 'User expressed explicit rejection / no need for VPN. Transitioning cleanly to rejected state.',
      isTerminalState: true,
    };
  }

  // 3. Post-Rejection & Low Interest Recovery
  if (currentState === ConversationState.REJECTED || currentState === ConversationState.LOW_INTEREST) {
    if (intent === Intent.PURCHASE_INTENT || intent === Intent.SUPPORT_REQUEST) {
      return {
        newState: ConversationState.SUPPORT_HANDOFF,
        previousState,
        transitionReason: 'User requested purchase/support after rejection/low interest.',
        isTerminalState: false,
      };
    }
    if (intent === Intent.TRIAL_REQUEST) {
      return {
        newState: ConversationState.TRIAL_DISCUSSION,
        previousState,
        transitionReason: 'User requested trial after rejection/low interest.',
        isTerminalState: false,
      };
    }
    if (intent === Intent.PRICE_REQUEST) {
      return {
        newState: ConversationState.PRICE_DISCUSSION,
        previousState,
        transitionReason: 'User requested pricing after rejection/low interest.',
        isTerminalState: false,
      };
    }
    if (intent === Intent.VPN_REQUEST || intent === Intent.PRODUCT_CURIOUS || intent === Intent.PLAN_REQUEST) {
      return {
        newState: ConversationState.PRODUCT_INTEREST,
        previousState,
        transitionReason: 'User initiated product interest from rejection/low interest.',
        isTerminalState: false,
      };
    }
    return {
      newState: ConversationState.LOW_INTEREST,
      previousState,
      transitionReason: 'Maintaining low interest state until explicit intent or farewell',
      isTerminalState: false,
    };
  }

  // 4. Objection Handling Transitions
  if (intent === Intent.OBJECTION) {
    return {
      newState: ConversationState.OBJECTION_HANDLING,
      previousState,
      transitionReason: 'Objection detected regarding price, trust, complexity or existing solution',
      isTerminalState: false,
    };
  }

  if (currentState === ConversationState.OBJECTION_HANDLING) {
    if (intent === Intent.PURCHASE_INTENT || intent === Intent.SUPPORT_REQUEST) {
      return {
        newState: ConversationState.SUPPORT_HANDOFF,
        previousState,
        transitionReason: 'Objection resolved; user requested support/purchase',
        isTerminalState: false,
      };
    }
    if (intent === Intent.TRIAL_REQUEST) {
      return {
        newState: ConversationState.TRIAL_DISCUSSION,
        previousState,
        transitionReason: 'Objection addressed with trial request',
        isTerminalState: false,
      };
    }
    if (intent === Intent.PRICE_REQUEST || intent === Intent.PLAN_REQUEST) {
      return {
        newState: ConversationState.PRICE_DISCUSSION,
        previousState,
        transitionReason: 'Objection transitioned to pricing/plan discussion',
        isTerminalState: false,
      };
    }
    if (intent === Intent.VPN_REQUEST || intent === Intent.PRODUCT_CURIOUS) {
      return {
        newState: ConversationState.PRODUCT_INTEREST,
        previousState,
        transitionReason: 'Objection addressed; exploring product capabilities',
        isTerminalState: false,
      };
    }
    return {
      newState: ConversationState.PRODUCT_INTEREST,
      previousState,
      transitionReason: 'Objection acknowledged, returning to product interest dialogue',
      isTerminalState: false,
    };
  }

  // 4b. Support Handoff Persistence
  if (currentState === ConversationState.SUPPORT_HANDOFF) {
    const currentIntent = intent as Intent;
    if (
      currentIntent !== Intent.GOODBYE &&
      currentIntent !== Intent.REJECTION &&
      currentIntent !== Intent.INAPPROPRIATE &&
      currentIntent !== Intent.SPAM
    ) {
      return {
        newState: ConversationState.SUPPORT_HANDOFF,
        previousState,
        transitionReason: 'Maintaining support handoff state during post-handoff discussion',
        isTerminalState: false,
      };
    }
  }

  // 5. Actionable High-Priority Commercial Intents
  if (intent === Intent.PURCHASE_INTENT || intent === Intent.SUPPORT_REQUEST) {
    return {
      newState: ConversationState.SUPPORT_HANDOFF,
      previousState,
      transitionReason: 'Direct user purchase intent or support handoff request',
      isTerminalState: false,
    };
  }

  if (intent === Intent.TRIAL_REQUEST) {
    return {
      newState: ConversationState.TRIAL_DISCUSSION,
      previousState,
      transitionReason: 'User explicitly requested free test/trial',
      isTerminalState: false,
    };
  }

  if (intent === Intent.PRICE_REQUEST) {
    return {
      newState: ConversationState.PRICE_DISCUSSION,
      previousState,
      transitionReason: 'User inquired about pricing, tariffs, or package costs',
      isTerminalState: false,
    };
  }

  if (intent === Intent.PLAN_REQUEST) {
    if (currentState === ConversationState.PRICE_DISCUSSION) {
      return {
        newState: ConversationState.PRICE_DISCUSSION,
        previousState,
        transitionReason: 'Continuing plan/pricing discussion',
        isTerminalState: false,
      };
    }
    return {
      newState: ConversationState.PRODUCT_INTEREST,
      previousState,
      transitionReason: 'User inquired about plan configurations/multi-user capabilities',
      isTerminalState: false,
    };
  }

  if (intent === Intent.VPN_REQUEST) {
    if (
      currentState === ConversationState.INITIAL_GREETING ||
      currentState === ConversationState.CONNECTING ||
      currentState === ConversationState.EARLY_CONVERSATION ||
      currentState === ConversationState.NEED_DETECTED
    ) {
      return {
        newState: ConversationState.PRODUCT_INTRODUCTION,
        previousState,
        transitionReason: 'Initial VPN/product request in early conversation, introducing solution',
        isTerminalState: false,
      };
    }
    return {
      newState: ConversationState.PRODUCT_INTEREST,
      previousState,
      transitionReason: 'User asked about VPN / product capabilities',
      isTerminalState: false,
    };
  }

  if (intent === Intent.PRODUCT_CURIOUS) {
    if (
      currentState === ConversationState.INITIAL_GREETING ||
      currentState === ConversationState.CONNECTING ||
      currentState === ConversationState.NEED_DETECTED
    ) {
      return {
        newState: ConversationState.PRODUCT_INTRODUCTION,
        previousState,
        transitionReason: 'Early product curiosity, introducing solution',
        isTerminalState: false,
      };
    }
    return {
      newState: ConversationState.PRODUCT_INTEREST,
      previousState,
      transitionReason: 'User expressing curiosity in product features',
      isTerminalState: false,
    };
  }

  if (intent === Intent.RELEVANT_NEED) {
    return {
      newState: ConversationState.NEED_DETECTED,
      previousState,
      transitionReason: 'User shared problem/pain point regarding internet/filtering',
      isTerminalState: false,
    };
  }

  // Handle follow-up inquiry from NEED_DETECTED before max turns timeout
  if (currentState === ConversationState.NEED_DETECTED && intent === Intent.QUESTION) {
    return {
      newState: ConversationState.PRODUCT_INTEREST,
      previousState,
      transitionReason: 'User asked follow-up inquiry following pain point',
      isTerminalState: false,
    };
  }

  // 6. Max Turn Exceeded for Idle / Non-Commercial Conversational States
  const isCommercialActiveState = [
    ConversationState.PRODUCT_INTRODUCTION,
    ConversationState.PRODUCT_INTEREST,
    ConversationState.PRICE_DISCUSSION,
    ConversationState.TRIAL_DISCUSSION,
    ConversationState.SUPPORT_HANDOFF,
    ConversationState.OBJECTION_HANDLING,
    ConversationState.NEED_DETECTED,
  ].includes(currentState);

  const effectiveTurnLimit = isCommercialActiveState ? Math.max(maxTurns, 35) : maxTurns;
  const isMessageCeilingReached = (context.botMessageCount || 0) >= (isCommercialActiveState ? 35 : (context.maxBotMessages || 25));

  if ((context.turnCount >= effectiveTurnLimit || isMessageCeilingReached) && !isCommercialActiveState) {
    return {
      newState: ConversationState.GOODBYE,
      previousState,
      transitionReason: `Maximum conversation limit reached (${context.turnCount}/${effectiveTurnLimit}, bot msgs: ${context.botMessageCount})`,
      isTerminalState: false,
    };
  }

  // 7. Progressive Lifecycle Transitions
  switch (currentState) {
    case ConversationState.CONNECTING:
      return {
        newState: ConversationState.INITIAL_GREETING,
        previousState,
        transitionReason: 'Session connected, initial greeting phase',
        isTerminalState: false,
      };

    case ConversationState.INITIAL_GREETING:
      if (intent === Intent.GREETING || intent === Intent.SMALL_TALK) {
        return {
          newState: ConversationState.EARLY_CONVERSATION,
          previousState,
          transitionReason: 'User replied to initial greeting, moving to early chit-chat',
          isTerminalState: false,
        };
      }
      if (strategy === 'direct_pitch') {
        return {
          newState: ConversationState.PRODUCT_INTRODUCTION,
          previousState,
          transitionReason: 'Direct pitch strategy: Introducing product & free trial offer from initial turn',
          isTerminalState: false,
        };
      }
      return {
        newState: ConversationState.EARLY_CONVERSATION,
        previousState,
        transitionReason: 'User replied to initial greeting, moving to early chit-chat',
        isTerminalState: false,
      };

    case ConversationState.EARLY_CONVERSATION:
      if (strategy === 'direct_pitch') {
        return {
          newState: ConversationState.PRODUCT_INTEREST,
          previousState,
          transitionReason: 'Direct pitch strategy: Engaging user in product discussion',
          isTerminalState: false,
        };
      }
      if (intent === Intent.SMALL_TALK || intent === Intent.QUESTION || context.turnCount >= 2) {
        return {
          newState: ConversationState.ENGAGED,
          previousState,
          transitionReason: 'User actively engaged in conversation exchange',
          isTerminalState: false,
        };
      }
      return {
        newState: ConversationState.EARLY_CONVERSATION,
        previousState,
        transitionReason: 'Continuing early conversation',
        isTerminalState: false,
      };

    case ConversationState.ENGAGED:
      if (context.promotionLevel === PromotionLevel.SOFT_MENTION || context.leadScore >= 30) {
        return {
          newState: ConversationState.QUALIFYING,
          previousState,
          transitionReason: 'User engaged and qualified for subtle bridge',
          isTerminalState: false,
        };
      }
      return {
        newState: ConversationState.ENGAGED,
        previousState,
        transitionReason: 'Maintaining engaged casual rapport',
        isTerminalState: false,
      };

    case ConversationState.NEED_DETECTED:
      return {
        newState: ConversationState.QUALIFYING,
        previousState,
        transitionReason: 'Need acknowledged, qualifying user situation',
        isTerminalState: false,
      };

    case ConversationState.QUALIFYING:
      if (context.promotionLevel === PromotionLevel.DIRECT_OFFER || context.leadScore >= 40) {
        return {
          newState: ConversationState.PRODUCT_INTRODUCTION,
          previousState,
          transitionReason: 'Qualification complete, introducing product solution',
          isTerminalState: false,
        };
      }
      return {
        newState: ConversationState.QUALIFYING,
        previousState,
        transitionReason: 'Continuing qualification dialogue',
        isTerminalState: false,
      };

    case ConversationState.PRODUCT_INTRODUCTION:
      return {
        newState: ConversationState.PRODUCT_INTEREST,
        previousState,
        transitionReason: 'Product introduced, moving to interest dialogue',
        isTerminalState: false,
      };

    case ConversationState.PRODUCT_INTEREST:
      return {
        newState: ConversationState.PRODUCT_INTEREST,
        previousState,
        transitionReason: 'Continuing product interest discussion',
        isTerminalState: false,
      };

    case ConversationState.TRIAL_DISCUSSION:
    case ConversationState.PRICE_DISCUSSION:
      return {
        newState: currentState,
        previousState,
        transitionReason: 'Continuing commercial evaluation',
        isTerminalState: false,
      };

    case ConversationState.SUPPORT_HANDOFF:
      return {
        newState: ConversationState.GOODBYE,
        previousState,
        transitionReason: 'Support handoff provided, preparing graceful exit',
        isTerminalState: false,
      };

    default:
      return {
        newState: ConversationState.EARLY_CONVERSATION,
        previousState,
        transitionReason: 'Default fallback transition',
        isTerminalState: false,
      };
  }
}
