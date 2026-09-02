import {
  ConversationState,
  Intent,
  PromotionLevel,
  ObjectionCategory,
  AnonymousProductPromotion,
  AnonymousChatMessage,
} from '../types';
import {
  createInitialConversationContext,
  processConversationTurn,
  validateAndSanitizeResponse,
} from './conversationEngine';
import { detectIntent } from './intentEngine';
import { calculateLeadScoreUpdate } from './leadScoring';
import { evaluatePromotionPolicy } from './promotionPolicy';
import { analyzeObjection } from './objectionEngine';
import { transitionConversationState } from './stateMachine';

export interface TestResultItem {
  name: string;
  category: 'UNIT' | 'E2E';
  passed: boolean;
  expected: string;
  actual: string;
  details?: string;
}

export interface TestSuiteSummary {
  total: number;
  passed: number;
  failed: number;
  results: TestResultItem[];
  durationMs: number;
}

const mockPromotionConfig: AnonymousProductPromotion = {
  enabled: true,
  productName: 'فیلترشکن اختصاصی پرسرعت',
  productDescription: 'سرورهای نامحدود اختصاصی V2ray با پینگ پایین',
  imageUrl: 'https://example.com/banner.jpg',
  contactHandleOrLink: 'nova_vpn10',
  sendMode: 'ai_natural_mention',
  minPhotoDelaySeconds: 120,
};

/**
 * Executes all 15 Unit Test Cases
 */
export function runUnitTests(): TestResultItem[] {
  const results: TestResultItem[] = [];

  // 1. GREETING Intent detection and initial transition
  (() => {
    const intentRes = detectIntent('سلام چطوری؟ خوبی؟');
    const ctx = createInitialConversationContext();
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed = intentRes.intent === Intent.GREETING && transition.newState === ConversationState.EARLY_CONVERSATION;
    results.push({
      name: 'Test 1: GREETING Intent Detection & Initial State Transition',
      category: 'UNIT',
      passed,
      expected: 'Intent=GREETING, NewState=EARLY_CONVERSATION',
      actual: `Intent=${intentRes.intent}, NewState=${transition.newState}`,
    });
  })();

  // 2. SMALL_TALK / ASL intent detection and lead score calculation
  (() => {
    const intentRes = detectIntent('اصل میدی آشنا شیم؟ ۲۲ تهران');
    const scoreRes = calculateLeadScoreUpdate(0, intentRes.intent, [], 1);
    const passed = intentRes.intent === Intent.SMALL_TALK && scoreRes.newScore === 10;
    results.push({
      name: 'Test 2: SMALL_TALK (ASL) Intent & Initial Score (+10)',
      category: 'UNIT',
      passed,
      expected: 'Intent=SMALL_TALK, Score=10',
      actual: `Intent=${intentRes.intent}, Score=${scoreRes.newScore}`,
    });
  })();

  // 3. RELEVANT_NEED -> NEED_DETECTED & SOFT_MENTION allowed
  (() => {
    const intentRes = detectIntent('اینستاگرامم اصلاً باز نمیشه، اینترنت قطعه');
    const ctx = {
      ...createInitialConversationContext(),
      turnCount: 2,
      elapsedSeconds: 60,
      state: ConversationState.ENGAGED,
    };
    const policy = evaluatePromotionPolicy(ctx, intentRes.intent, mockPromotionConfig);
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed =
      intentRes.intent === Intent.RELEVANT_NEED &&
      policy.allowedLevel === PromotionLevel.SOFT_MENTION &&
      transition.newState === ConversationState.NEED_DETECTED;
    results.push({
      name: 'Test 3: RELEVANT_NEED -> NEED_DETECTED & SOFT_MENTION Level',
      category: 'UNIT',
      passed,
      expected: 'Intent=RELEVANT_NEED, Level=SOFT_MENTION, State=NEED_DETECTED',
      actual: `Intent=${intentRes.intent}, Level=${policy.allowedLevel}, State=${transition.newState}`,
    });
  })();

  // 4. VPN_REQUEST intent & Explicit Override bypass of time constraint
  (() => {
    const intentRes = detectIntent('فیلترشکن خوب سراغ داری؟');
    const ctx = {
      ...createInitialConversationContext(),
      turnCount: 1,
      elapsedSeconds: 15, // < 120 seconds
      state: ConversationState.INITIAL_GREETING,
    };
    const policy = evaluatePromotionPolicy(ctx, intentRes.intent, mockPromotionConfig);
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed =
      intentRes.intent === Intent.VPN_REQUEST &&
      policy.isExplicitOverride === true &&
      policy.allowedLevel === PromotionLevel.DIRECT_OFFER &&
      (transition.newState === ConversationState.PRODUCT_INTEREST || transition.newState === ConversationState.PRODUCT_INTRODUCTION);
    results.push({
      name: 'Test 4: VPN_REQUEST Explicit Intent Override (<120s Bypassed)',
      category: 'UNIT',
      passed,
      expected: 'Intent=VPN_REQUEST, Override=true, Level=DIRECT_OFFER, State=PRODUCT_INTRODUCTION/PRODUCT_INTEREST',
      actual: `Intent=${intentRes.intent}, Override=${policy.isExplicitOverride}, Level=${policy.allowedLevel}, State=${transition.newState}`,
    });
  })();

  // 5. PRODUCT_CURIOUS intent detection
  (() => {
    const intentRes = detectIntent('روی آیفون و ios هم کار میکنه؟');
    const ctx = {
      ...createInitialConversationContext(),
      state: ConversationState.PRODUCT_INTRODUCTION,
    };
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed = intentRes.intent === Intent.PRODUCT_CURIOUS && transition.newState === ConversationState.PRODUCT_INTEREST;
    results.push({
      name: 'Test 5: PRODUCT_CURIOUS Technical Inquiry Detection',
      category: 'UNIT',
      passed,
      expected: 'Intent=PRODUCT_CURIOUS, State=PRODUCT_INTEREST',
      actual: `Intent=${intentRes.intent}, State=${transition.newState}`,
    });
  })();

  // 6. TRIAL_REQUEST intent -> TRIAL_DISCUSSION
  (() => {
    const intentRes = detectIntent('میشه یه اکانت تست رایگان بدی تست کنم؟');
    const ctx = {
      ...createInitialConversationContext(),
      state: ConversationState.PRODUCT_INTEREST,
    };
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed = intentRes.intent === Intent.TRIAL_REQUEST && transition.newState === ConversationState.TRIAL_DISCUSSION;
    results.push({
      name: 'Test 6: TRIAL_REQUEST -> TRIAL_DISCUSSION State',
      category: 'UNIT',
      passed,
      expected: 'Intent=TRIAL_REQUEST, State=TRIAL_DISCUSSION',
      actual: `Intent=${intentRes.intent}, State=${transition.newState}`,
    });
  })();

  // 7. PRICE_REQUEST intent -> PRICE_DISCUSSION
  (() => {
    const intentRes = detectIntent('قیمتش چنده؟ پلن یک ماهه چند تومنه؟');
    const ctx = {
      ...createInitialConversationContext(),
      state: ConversationState.PRODUCT_INTEREST,
    };
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed = intentRes.intent === Intent.PRICE_REQUEST && transition.newState === ConversationState.PRICE_DISCUSSION;
    results.push({
      name: 'Test 7: PRICE_REQUEST -> PRICE_DISCUSSION State',
      category: 'UNIT',
      passed,
      expected: 'Intent=PRICE_REQUEST, State=PRICE_DISCUSSION',
      actual: `Intent=${intentRes.intent}, State=${transition.newState}`,
    });
  })();

  // 8. SUPPORT_REQUEST & PURCHASE_INTENT -> SUPPORT_HANDOFF
  (() => {
    const intentRes = detectIntent('شماره کارت بده واریز کنم میخوام بخرم');
    const ctx = {
      ...createInitialConversationContext(),
      state: ConversationState.PRICE_DISCUSSION,
    };
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed = intentRes.intent === Intent.PURCHASE_INTENT && transition.newState === ConversationState.SUPPORT_HANDOFF;
    results.push({
      name: 'Test 8: PURCHASE_INTENT -> SUPPORT_HANDOFF State',
      category: 'UNIT',
      passed,
      expected: 'Intent=PURCHASE_INTENT, State=SUPPORT_HANDOFF',
      actual: `Intent=${intentRes.intent}, State=${transition.newState}`,
    });
  })();

  // 9. OBJECTION Handling & Analysis
  (() => {
    const intentRes = detectIntent('خیلی گرونه بابا، تخفیف نداری؟');
    const objAnalysis = analyzeObjection('خیلی گرونه بابا، تخفیف نداری؟');
    const ctx = {
      ...createInitialConversationContext(),
      state: ConversationState.PRICE_DISCUSSION,
    };
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed =
      intentRes.intent === Intent.OBJECTION &&
      objAnalysis.category === ObjectionCategory.PRICE &&
      transition.newState === ConversationState.OBJECTION_HANDLING;
    results.push({
      name: 'Test 9: OBJECTION (Price) Analysis & State Transition',
      category: 'UNIT',
      passed,
      expected: 'Intent=OBJECTION, Category=PRICE, State=OBJECTION_HANDLING',
      actual: `Intent=${intentRes.intent}, Category=${objAnalysis.category}, State=${transition.newState}`,
    });
  })();

  // 10. REJECTION intent -> REJECTED state & Promotion Lock
  (() => {
    const intentRes = detectIntent('نمیخوام تبلیغ کنی، ولم کن');
    const ctx = {
      ...createInitialConversationContext(),
      turnCount: 2,
      state: ConversationState.ENGAGED,
    };
    const step = processConversationTurn('نمیخوام تبلیغ کنی، ولم کن', ctx, mockPromotionConfig, 4);
    const passed =
      step.intentResult.intent === Intent.REJECTION &&
      step.updatedContext.promotionLock === true &&
      step.updatedContext.state === ConversationState.REJECTED &&
      step.promotionDecision.allowedLevel === PromotionLevel.NO_PROMOTION;
    results.push({
      name: 'Test 10: REJECTION Intent -> REJECTED State & Promotion Lock Activated',
      category: 'UNIT',
      passed,
      expected: 'Intent=REJECTION, Lock=true, State=REJECTED, Level=NO_PROMOTION',
      actual: `Intent=${step.intentResult.intent}, Lock=${step.updatedContext.promotionLock}, State=${step.updatedContext.state}, Level=${step.promotionDecision.allowedLevel}`,
    });
  })();

  // 11. Promotion Lock Enforcement during subsequent chit-chat
  (() => {
    const ctx = {
      ...createInitialConversationContext(),
      turnCount: 3,
      elapsedSeconds: 180, // > 120s
      leadScore: 40,
      promotionLock: true, // Locked!
      state: ConversationState.LOW_INTEREST,
    };
    const step = processConversationTurn('هوا چقدر سرده امروز', ctx, mockPromotionConfig, 4);
    const passed =
      step.updatedContext.promotionLock === true &&
      step.promotionDecision.allowedLevel === PromotionLevel.NO_PROMOTION;
    results.push({
      name: 'Test 11: Promotion Lock Enforced (No promotion during chit-chat)',
      category: 'UNIT',
      passed,
      expected: 'Lock=true, Level=NO_PROMOTION',
      actual: `Lock=${step.updatedContext.promotionLock}, Level=${step.promotionDecision.allowedLevel}`,
    });
  })();

  // 12. Promotion Lock Release on Explicit Product Inquiry
  (() => {
    const ctx = {
      ...createInitialConversationContext(),
      turnCount: 3,
      promotionLock: true, // Currently locked
      state: ConversationState.LOW_INTEREST,
    };
    const step = processConversationTurn('راستی فیلترشکن خوب چی داری؟', ctx, mockPromotionConfig, 4);
    const passed =
      step.intentResult.intent === Intent.VPN_REQUEST &&
      step.updatedContext.promotionLock === false &&
      step.promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER &&
      step.updatedContext.state === ConversationState.PRODUCT_INTEREST;
    results.push({
      name: 'Test 12: Promotion Lock Released on Explicit User VPN Request',
      category: 'UNIT',
      passed,
      expected: 'Lock=false, Level=DIRECT_OFFER, State=PRODUCT_INTEREST',
      actual: `Lock=${step.updatedContext.promotionLock}, Level=${step.promotionDecision.allowedLevel}, State=${step.updatedContext.state}`,
    });
  })();

  // 13. Lead Score Deduplication (Repeated greetings do not exceed cap)
  (() => {
    let ctx = createInitialConversationContext();
    // 4 repeated greetings
    for (let i = 0; i < 4; i++) {
      const step = processConversationTurn('سلام درود', ctx, mockPromotionConfig, 4);
      ctx = step.updatedContext;
    }
    // GREETING cap is 10 points
    const passed = ctx.leadScore === 10;
    results.push({
      name: 'Test 13: Lead Score Deduplication (Capped at 10 for repeated greetings)',
      category: 'UNIT',
      passed,
      expected: 'Score=10 (Cap met, deduplicated)',
      actual: `Score=${ctx.leadScore}`,
    });
  })();

  // 14. CTA Cooldown (MIN_CTA_TURN_GAP = 2)
  (() => {
    const ctx = {
      ...createInitialConversationContext(),
      turnCount: 3,
      elapsedSeconds: 150,
      leadScore: 60,
      lastCTATurn: 2, // CTA was sent on turn 2
      state: ConversationState.ENGAGED,
    };
    // Turn 3: 1 turn since last CTA (< 2 gap)
    const policy = evaluatePromotionPolicy(ctx, Intent.SMALL_TALK, mockPromotionConfig);
    const passed = policy.allowedLevel === PromotionLevel.SOFT_MENTION; // Restricted from direct offer due to cooldown
    results.push({
      name: 'Test 14: CTA Cooldown Policy (Restricts to Soft Mention within 2 turns)',
      category: 'UNIT',
      passed,
      expected: 'Level=SOFT_MENTION (Cooldown active)',
      actual: `Level=${policy.allowedLevel}`,
    });
  })();

  // 15. Inappropriate / Spam detection -> EXITING Terminal State
  (() => {
    const intentRes = detectIntent('کس ننت بیا کانال t.me/free_proxy');
    const ctx = createInitialConversationContext();
    const transition = transitionConversationState(ctx.state, intentRes.intent, ctx, 4);
    const passed =
      (intentRes.intent === Intent.INAPPROPRIATE || intentRes.intent === Intent.SPAM) &&
      transition.newState === ConversationState.EXITING &&
      transition.isTerminalState === true;
    results.push({
      name: 'Test 15: Inappropriate Content Detection & Immediate Terminal Exit',
      category: 'UNIT',
      passed,
      expected: 'Intent=INAPPROPRIATE/SPAM, State=EXITING, isTerminal=true',
      actual: `Intent=${intentRes.intent}, State=${transition.newState}, isTerminal=${transition.isTerminalState}`,
    });
  })();

  return results;
}

/**
 * Executes 5 End-to-End Dialog Scenarios with Mock LLM Responses
 */
export function runE2EScenarios(): TestResultItem[] {
  const results: TestResultItem[] = [];

  // SCENARIO 1: Happy Path (Greeting -> Small Talk -> Need -> Soft Mention -> Direct Offer -> Support Handoff -> Farewell)
  (() => {
    let ctx = createInitialConversationContext('/user_101', 'پسر ۲۴ تهران');
    const history: AnonymousChatMessage[] = [];

    // Turn 1: User greets
    const t1 = processConversationTurn('سلام اصل میدی؟', ctx, mockPromotionConfig, 5, history);
    ctx = { ...t1.updatedContext, elapsedSeconds: 30 };
    history.push({ id: '1', sender: 'stranger', text: 'سلام اصل میدی؟', timestamp: new Date().toISOString() });
    history.push({ id: '2', sender: 'me_melody', text: 'سلام منم ملودی ۲۱ تهران، تو چی؟', timestamp: new Date().toISOString() });

    // Turn 2: User complains about filtering
    const t2 = processConversationTurn('منم علی ۲۴ تهرانم، اینستام چند روزه قطعه نمیتونم بیام بالا', ctx, mockPromotionConfig, 5, history);
    ctx = { ...t2.updatedContext, elapsedSeconds: 90 };
    history.push({ id: '3', sender: 'stranger', text: 'منم علی ۲۴ تهرانم، اینستام چند روزه قطعه نمیتونم بیام بالا', timestamp: new Date().toISOString() });
    history.push({ id: '4', sender: 'me_melody', text: 'آره نت واقعا خرابه، من خودم یه سرور اختصاصی دارم خیلی خوبه', timestamp: new Date().toISOString() });

    // Turn 3: User asks for pricing
    const t3 = processConversationTurn('جدی؟ قیمتش چنده تعرفه‌هاش چطوریه؟', ctx, mockPromotionConfig, 5, history);
    ctx = { ...t3.updatedContext, elapsedSeconds: 140 };

    // Turn 4: User wants to buy / asks for contact
    const t4 = processConversationTurn('عالیه آیدی بده بهشون پیام بدم بگیرم', ctx, mockPromotionConfig, 5, history);

    const passed =
      t1.updatedContext.state === ConversationState.EARLY_CONVERSATION &&
      t2.updatedContext.state === ConversationState.NEED_DETECTED &&
      t3.updatedContext.state === ConversationState.PRICE_DISCUSSION &&
      t4.updatedContext.state === ConversationState.SUPPORT_HANDOFF;

    results.push({
      name: 'E2E Scenario 1: Natural Happy Path (Discovery -> Pain -> Price -> Support Handoff)',
      category: 'E2E',
      passed,
      expected: 'Final State: SUPPORT_HANDOFF with progressive intent pipeline',
      actual: `Final State: ${t4.updatedContext.state}, Final Score: ${t4.updatedContext.leadScore}`,
    });
  })();

  // SCENARIO 2: Early Explicit VPN Request (Override Time Delay)
  (() => {
    let ctx = createInitialConversationContext('/user_202');
    // Turn 1: User immediately asks for VPN
    const t1 = processConversationTurn('سلام خوبی فیلترشکن خوب سراغ داری؟', ctx, mockPromotionConfig, 4);

    const passed =
      t1.intentResult.intent === Intent.VPN_REQUEST &&
      t1.promotionDecision.isExplicitOverride === true &&
      (t1.updatedContext.state === ConversationState.PRODUCT_INTEREST || t1.updatedContext.state === ConversationState.PRODUCT_INTRODUCTION) &&
      t1.promotionDecision.allowedLevel === PromotionLevel.DIRECT_OFFER;

    results.push({
      name: 'E2E Scenario 2: Immediate VPN Request Override (<120s bypassed, direct offer triggered)',
      category: 'E2E',
      passed,
      expected: 'Override=true, State=PRODUCT_INTRODUCTION/PRODUCT_INTEREST, Level=DIRECT_OFFER',
      actual: `Override=${t1.promotionDecision.isExplicitOverride}, State=${t1.updatedContext.state}, Level=${t1.promotionDecision.allowedLevel}`,
    });
  })();

  // SCENARIO 3: Rejection & Recovery
  (() => {
    let ctx = createInitialConversationContext('/user_303');
    // Turn 1: Normal greeting
    const t1 = processConversationTurn('سلام', ctx, mockPromotionConfig, 5);
    ctx = { ...t1.updatedContext, elapsedSeconds: 40 };

    // Turn 2: User explicitly rejects
    const t2 = processConversationTurn('نمیخوام تبلیغ کنی ولم کن', ctx, mockPromotionConfig, 5);
    ctx = { ...t2.updatedContext, elapsedSeconds: 80 };

    // Turn 3: Casual chit-chat (Promotion lock enforced)
    const t3 = processConversationTurn('دانشجویی؟', ctx, mockPromotionConfig, 5);
    ctx = { ...t3.updatedContext, elapsedSeconds: 130 };

    // Turn 4: User changes mind & asks for trial
    const t4 = processConversationTurn('راستی تست رایگان میدی امتحان کنم؟', ctx, mockPromotionConfig, 5);

    const passed =
      t2.updatedContext.promotionLock === true &&
      t3.promotionDecision.allowedLevel === PromotionLevel.NO_PROMOTION &&
      t4.updatedContext.promotionLock === false &&
      t4.updatedContext.state === ConversationState.TRIAL_DISCUSSION;

    results.push({
      name: 'E2E Scenario 3: Rejection & Recovery (Locked on rejection -> Unlocked on explicit inquiry)',
      category: 'E2E',
      passed,
      expected: 'T2 Lock=true -> T3 No promo -> T4 Lock=false & State=TRIAL_DISCUSSION',
      actual: `T2 Lock=${t2.updatedContext.promotionLock}, T3 Level=${t3.promotionDecision.allowedLevel}, T4 State=${t4.updatedContext.state}`,
    });
  })();

  // SCENARIO 4: Objection Handling (Price objection resolved to test account)
  (() => {
    let ctx = createInitialConversationContext('/user_404');
    ctx = { ...ctx, state: ConversationState.PRICE_DISCUSSION, leadScore: 45, elapsedSeconds: 130 };

    // Turn 1: User objects to price
    const t1 = processConversationTurn('خیلی گرونه بابا، تخفیف نداری؟', ctx, mockPromotionConfig, 5);
    ctx = { ...t1.updatedContext };

    // Turn 2: User accepts test proposal
    const t2 = processConversationTurn('باشه اکانت تست بده ببینم چطوره', ctx, mockPromotionConfig, 5);

    const passed =
      t1.updatedContext.state === ConversationState.OBJECTION_HANDLING &&
      t1.objectionAnalysis?.category === ObjectionCategory.PRICE &&
      t2.updatedContext.state === ConversationState.TRIAL_DISCUSSION;

    results.push({
      name: 'E2E Scenario 4: Objection Handling (Price objection -> Strategy -> Trial Discussion)',
      category: 'E2E',
      passed,
      expected: 'T1 State=OBJECTION_HANDLING (PRICE) -> T2 State=TRIAL_DISCUSSION',
      actual: `T1 State=${t1.updatedContext.state} (${t1.objectionAnalysis?.category}), T2 State=${t2.updatedContext.state}`,
    });
  })();

  // SCENARIO 5: Stranger Silence / Early Goodbye
  (() => {
    let ctx = createInitialConversationContext('/user_505');
    // Turn 1: User says goodbye early
    const t1 = processConversationTurn('خداحافظ من باید برم بای', ctx, mockPromotionConfig, 4);

    const passed =
      t1.intentResult.intent === Intent.GOODBYE &&
      t1.updatedContext.state === ConversationState.GOODBYE;

    results.push({
      name: 'E2E Scenario 5: Early User Goodbye (Graceful farewell and transition to GOODBYE)',
      category: 'E2E',
      passed,
      expected: 'Intent=GOODBYE, State=GOODBYE',
      actual: `Intent=${t1.intentResult.intent}, State=${t1.updatedContext.state}`,
    });
  })();

  return results;
}

/**
 * Runs the full test suite and returns formatted summary
 */
export function runAllConversationTests(): TestSuiteSummary {
  const startTime = Date.now();
  const unitResults = runUnitTests();
  const e2eResults = runE2EScenarios();
  const allResults = [...unitResults, ...e2eResults];
  const passed = allResults.filter((r) => r.passed).length;
  const failed = allResults.filter((r) => !r.passed).length;

  return {
    total: allResults.length,
    passed,
    failed,
    results: allResults,
    durationMs: Date.now() - startTime,
  };
}
