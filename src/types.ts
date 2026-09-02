import type { ProductConfig, ProductPlan } from './config/productConfig';

export type { ProductConfig, ProductPlan };

export interface TelegramCredentials {
  apiId: string;
  apiHash: string;
  phoneNumber: string;
  botToken?: string;
  sessionString?: string;
  isConnected: boolean;
  phoneCodeHash?: string;
  userProfile?: {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    phone?: string;
  };
}

export interface TelegramAccount {
  id: string;
  phoneNumber: string;
  apiId?: string;
  apiHash?: string;
  sessionString: string;
  userProfile?: {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    phone?: string;
  };
  isActive: boolean; // Participates in system operations
  enableForGroupBroadcast?: boolean; // One-click flag for Group Promotion Broadcasts
  enableForAnonymousBot?: boolean; // One-click flag for Anonymous Chat Bot Automator
  isVerifiedLive?: boolean; // 100% verified active MTProto session
  lastVerifiedAt?: string; // ISO date of last live MTProto health check
  requiresReauth?: boolean; // True if session expired / revoked and needs renewal
  dailySentCount: number;
  lastUsedAt?: string;
  floodWaitUntil?: number; // Epoch timestamp in ms
  status: 'active' | 'connected' | 'session_expired' | 'flood_wait' | 'disabled' | 'error';
  statusMessage?: string;
}

export interface AccountMembershipInfo {
  accountId: string;
  accountPhone: string;
  accountName?: string;
  isMember: boolean;
  status: 'joined' | 'not_joined' | 'pending' | 'restricted' | 'banned';
  checkedAt: string;
  joinedAt?: string;
  error?: string;
}

export interface TargetGroup {
  id: string;
  title: string;
  usernameOrLink: string; // e.g. @my_group or t.me/group_link or -100123456789
  isActive: boolean;
  memberCount?: number;
  status: 'joined' | 'pending' | 'failed' | 'not_joined'; // Overall status
  membershipStatus?: 'joined' | 'not_joined' | 'joining' | 'failed' | 'restricted'; // Join engine specific status
  joinedAccountIds?: string[]; // IDs of accounts that are 100% verified members in Telegram
  joinedAccountPhones?: string[]; // Phone numbers of member accounts
  assignedAccountId?: string; // Account assigned for joining / sending via smart load balancing
  assignedAccountPhone?: string; // Phone of assigned account
  accountMemberships?: Record<string, AccountMembershipInfo>; // Detailed per-account ground truth
  lastJoinAttemptAt?: string;
  lastJoinError?: string;
  category?: string; // e.g. 'promotional' | 'exchange' | 'general'
  lastPostedAt?: string;
  lastPostedByAccountId?: string;
  lastPostedByAccountPhone?: string;
  errorMessage?: string;
  persistenceStatus?: 'verified' | 'auto_deleted' | 'pending_check' | 'not_checked';
  lastVerifiedAt?: string;
  strictFilterDetected?: boolean;
}

export interface GroupJoinStrategy {
  mode: 'balanced_distribution' | 'redundant_all_accounts' | 'single_account';
  delayBetweenJoinsSeconds: number; // e.g. 8 to 20 seconds safe delay
  maxJoinsPerAccountPerHour: number; // e.g. 15-20 per account to avoid flood wait
  autoResolveAntibotOnJoin: boolean;
}

export interface ActiveGroupJoinWorkerProgress {
  accountId: string;
  accountPhone: string;
  accountName?: string;
  currentGroupId?: string;
  currentGroupTitle?: string;
  status: 'idle' | 'preparing' | 'joining' | 'antibot' | 'cooldown' | 'flood_waited' | 'completed' | 'error';
  successCount: number;
  failedCount: number;
  lastAction?: string;
  cooldownEndsAt?: number;
}

export interface AccountDistributionSummary {
  accountId: string;
  accountPhone: string;
  accountName?: string;
  assignedCount: number;
  joinedCount: number;
  pendingCount: number;
  failedCount: number;
}

export interface ActiveGroupJoinProgress {
  isRunning: boolean;
  startTime: string;
  totalToJoin: number;
  completedCount: number;
  successCount: number;
  failedCount: number;
  strategy: 'balanced_distribution' | 'redundant_all_accounts' | 'single_account';
  workers: ActiveGroupJoinWorkerProgress[];
  distributionSummary?: AccountDistributionSummary[];
}

export interface ProductCampaign {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string; // Base64 data URL or HTTP URL
  contactHandle: string; // e.g. @MyStoreAdmin
  hashtags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AntiBotSettings {
  autoClickCaptcha: boolean; // کلیک خودکار روی دکمه شیشه‌ای "من ربات نیستم"
  autoForceJoinChannels: boolean; // جوین خودکار در کانال‌های اجباری گروه
  autoInviteContacts: boolean; // اد کردن رندوم مخاطبین تلگرام جهت باز کردن قفل
  contactsToInviteCount: number; // تعداد مخاطبین جهت اد کردن (مثلاً ۳ تا ۵)
  sendGreetingFirst?: boolean; // ارسال پیام تست اولیه ("سلام بچه ها") جهت تست ربات نگهبان
  greetingMessage?: string; // متن پیام تست اولیه (پیش‌فرض: "سلام بچه ها")
  simulateTyping?: boolean; // شبیه‌سازی اکشن تایپینگ واقعی تلگرام قبل از ارسال (SetTyping)
  typingDurationSeconds?: number; // مدت زمان تایپینگ قبل از ارسال پیام (مثلاً ۱ تا ۴ ثانیه)
  enableSpintax?: boolean; // بهینه‌سازی و تنوع‌بخشی خودکار پیام با Spintax و متغیرها
  cacheMediaInput?: boolean; // کش کردن فایل رسانه در تلگرام جهت ارسال فوق‌سریع و کاهش ۹۹٪ ترافیک
  verifyMessagePersistence?: boolean; // پایش ماندگاری پیام و تشخیص حذف خودکار توسط ربات‌های ادمین
  persistenceCheckDelaySeconds?: number; // زمان شکیبایی جهت پایش ماندگاری پیام (مثلاً ۱۵ تا ۲۰ ثانیه)
}

export interface SchedulerConfig {
  intervalMinutes: number; // Interval in minutes selected by user
  jitterSeconds: number; // Random offset to prevent detection (e.g., 40 to 60 sec)
  dailyLimit: number; // Max messages per day (e.g., 30-50/day)
  dailySentCount?: number; // Tracked count for current date
  dailyResetDate?: string; // e.g. '2026-08-11'
  nightModePause: boolean; // Pause between night hours (e.g., 01:00 AM to 07:00 AM)
  nightModeStartHour?: number; // Default 1 (1 AM)
  nightModeEndHour?: number; // Default 7 (7 AM)
  onlyPromotionalGroups?: boolean; // Send ads only to groups marked as promotional/exchange
  multiAccountDispatchMode?: 'parallel_multichannel' | 'sequential_rotation'; // ارسال همزمان بین اکانت‌ها یا چرخش نوبتی
  maxConcurrentAccounts?: number; // سقف تعداد اکانت‌های همزمان فعال
  isAutoRunActive: boolean; // Master switch
  antiBot?: AntiBotSettings;
  lastRunTime?: string;
  nextRunTime?: string;
  totalSentCount: number;
  totalSuccessCount: number;
  totalFailedCount: number;
}

export interface BroadcastAccountStat {
  accountId: string;
  accountPhone: string;
  accountName?: string;
  sentCount: number;
  failedCount: number;
  hitRateLimit?: boolean;
}

export interface ActiveBroadcastWorkerProgress {
  accountId: string;
  accountPhone: string;
  accountName?: string;
  currentGroupId?: string;
  currentGroupTitle?: string;
  status: 'idle' | 'preparing' | 'antibot_verifying' | 'typing' | 'sending' | 'cooldown' | 'flood_waited' | 'finished';
  sentSuccessCount: number;
  failedCount: number;
  lastAction?: string;
  currentActionStartedAt?: number;
  cooldownEndsAt?: number;
  lastSampleMessage?: string;
}

export interface ActiveBroadcastProgress {
  isRunning: boolean;
  startTime: string;
  totalGroups: number;
  completedGroups: number;
  successCount: number;
  failedCount: number;
  dispatchMode: 'parallel_multichannel' | 'sequential_rotation';
  workers: ActiveBroadcastWorkerProgress[];
  estimatedTimeRemainingSeconds?: number;
  speedGroupsPerMinute?: number;
  mediaBandwidthSavedMb?: number;
  lastGeneratedSampleMessage?: {
    groupTitle: string;
    accountName: string;
    text: string;
    timestamp: string;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  groupTitle?: string;
  message: string;
  details?: string;
  campaignTitle?: string;
}

export interface GroupMonitoringReport {
  id: string;
  groupId: string;
  groupTitle: string;
  usernameOrLink: string;
  lastCheckedAt: string;
  step: 'JOINING' | 'GREETING_SENT' | 'ANTI_BOT_VERIFYING' | 'RE_TESTING' | 'CAMPAIGN_SENT' | 'MANUAL_REVIEW_NEEDED' | 'FAILED';
  botDetected: boolean;
  botTypeOrName?: string; // e.g. RoseBot, GroupHelp, Shield, CustomBot
  captchaClicked?: boolean;
  channelJoined?: boolean;
  contactsInvited?: number;
  statusMessage: string;
  requiresManualCheck: boolean; // Flag if manual check is needed
}

export interface BroadcastGroupDetail {
  groupId: string;
  groupTitle: string;
  usernameOrLink: string;
  status: 'success' | 'failed' | 'skipped';
  botDetected: boolean;
  botResolved: boolean;
  accountPhone?: string;
  accountName?: string;
  message?: string;
  postedAt?: string;
  persistenceStatus?: 'verified' | 'auto_deleted' | 'pending_check' | 'not_checked';
  spintaxApplied?: boolean;
  mediaFromCache?: boolean;
  typingSimulated?: boolean;
  sampleSnippet?: string;
}

export interface BroadcastAnalyticsSummary {
  bandwidthSavedMb: number;
  avgDurationPerGroupSeconds: number;
  spintaxDiversityScorePercent: number;
  verifiedPersistenceCount: number;
  autoDeletedCount: number;
  toxicGroupsList?: string[];
  recommendations: string[];
}

export interface BroadcastReport {
  id: string;
  timestamp: string;
  durationSeconds: number;
  campaignTitle: string;
  totalAttempted: number; // چند گروه اقدام شده
  successCount: number; // چند پیام موفق ثبت شده
  failedCount: number; // چند پیام ثبت نشده
  botDetectedCount: number; // تعداد کل گروه‌های دارای ربات ناظر
  botResolvedCount: number; // تعداد گروه‌های دارای بات که مانع آن‌ها حل شده و پیام به درستی ثبت شده
  accountsUsedCount: number;
  accountsList: string[];
  dispatchMode?: 'parallel_multichannel' | 'sequential_rotation';
  accountBreakdown?: BroadcastAccountStat[];
  details: BroadcastGroupDetail[];
  analytics?: BroadcastAnalyticsSummary;
}

export type BotButtonLocation = 'reply_keyboard' | 'inline_button' | 'text_command' | 'popup_ok' | 'any_location';
export type ButtonTriggerMode = 'after_delay' | 'on_any_message' | 'on_keyword_match' | 'on_popup_dialog';

export interface AnonymousBotButtonStep {
  id: string;
  label: string; // Text on button or command to send, e.g. "به یه ناشناس وصلم کن!" or "/start"
  buttonLocation: BotButtonLocation; // reply_keyboard (منوی پایین), inline_button (شیشه‌ای زیر پیام), text_command (دستور متنی), popup_ok (تایید دیالوگ), any_location
  triggerMode?: ButtonTriggerMode; // after_delay (بعد از تاخیر زمانی), on_any_message (بعد از دریافت هر پیام), on_keyword_match (بعد از کلیدواژه خاص)
  triggerKeyword?: string; // e.g. "جستجو"
  delaySeconds: number; // تاخیر به ثانیه قبل از زدن دکمه
  matchMode?: 'exact' | 'contains' | 'fuzzy';
  autoConfirmPopup?: boolean;
}

export interface AnonymousBotProfile {
  id: string;
  name: string; // e.g. 'ربات هایپر گپ (@HyperGap)'
  botUsername: string; // e.g. '@HyperGap'
  startCommand: string; // e.g. '/start'
  entrySteps: AnonymousBotButtonStep[]; // ترتیب کلیک‌ها و دکمه‌های ورود به چت
  connectionKeywords: string[]; // جملات کلیدی که نشان‌دهنده وصل شدن به ناشناس است
  exitSteps: AnonymousBotButtonStep[]; // ترتیب کلیک‌ها و دکمه‌های خروج از چت
  partnerDisconnectedKeywords: string[]; // جملات نشان‌دهنده خروج یا قطع شدن مخاطب
  notInChatKeywords?: string[]; // پیام‌های نشان‌دهنده خارج از چت بودن (مانند «متوجه نشدم 🤔»، «دستور نامعتبر») جهت شروع مجدد فرایند ورود
  alreadyInChatKeywords?: string[]; // پیام‌های خطای چت فعال (مانند «⚠️ خطا : هم اکنون شما در حال چت هستید !») جهت خروج فوری
  autoDismissPopups?: boolean;
  popupOkKeywords?: string[];
  fuzzyButtonMatching?: boolean;
  delayBetweenButtonsMs: number;
  enabled: boolean;
  notes?: string;
  customIgnoredKeywords?: string[]; // عبارات و پیام‌های سیستمی خاص ربات برای نادیده گرفتن
}

export interface ProductFaqItem {
  id: string;
  question: string;
  answer: string;
  keywords?: string[];
}

// ============================================================================
// STEP 4: CONVERSATION STATE MACHINE & INTENT TAXONOMY ENUMS
// ============================================================================

export enum ConversationState {
  CONNECTING = 'CONNECTING',
  INITIAL_GREETING = 'INITIAL_GREETING',
  EARLY_CONVERSATION = 'EARLY_CONVERSATION',
  ENGAGED = 'ENGAGED',
  NEED_DETECTED = 'NEED_DETECTED',
  QUALIFYING = 'QUALIFYING',
  PRODUCT_INTRODUCTION = 'PRODUCT_INTRODUCTION',
  PRODUCT_INTEREST = 'PRODUCT_INTEREST',
  TRIAL_DISCUSSION = 'TRIAL_DISCUSSION',
  PRICE_DISCUSSION = 'PRICE_DISCUSSION',
  SUPPORT_HANDOFF = 'SUPPORT_HANDOFF',
  OBJECTION_HANDLING = 'OBJECTION_HANDLING',
  LOW_INTEREST = 'LOW_INTEREST',
  REJECTED = 'REJECTED',
  GOODBYE = 'GOODBYE',
  EXITING = 'EXITING',
}

export enum Intent {
  UNKNOWN = 'UNKNOWN',
  GREETING = 'GREETING',
  SMALL_TALK = 'SMALL_TALK',
  QUESTION = 'QUESTION',
  RELEVANT_NEED = 'RELEVANT_NEED',
  VPN_REQUEST = 'VPN_REQUEST',
  PRODUCT_CURIOUS = 'PRODUCT_CURIOUS',
  TRIAL_REQUEST = 'TRIAL_REQUEST',
  PRICE_REQUEST = 'PRICE_REQUEST',
  PLAN_REQUEST = 'PLAN_REQUEST',
  SUPPORT_REQUEST = 'SUPPORT_REQUEST',
  PURCHASE_INTENT = 'PURCHASE_INTENT',
  OBJECTION = 'OBJECTION',
  REJECTION = 'REJECTION',
  GOODBYE = 'GOODBYE',
  INAPPROPRIATE = 'INAPPROPRIATE',
  SPAM = 'SPAM',
  SUSPICION_BOT = 'SUSPICION_BOT',
  OFF_TOPIC = 'OFF_TOPIC',
  SILENCE = 'SILENCE',
}

export enum PromotionLevel {
  NO_PROMOTION = 'NO_PROMOTION', // Level 0: Pure conversational / human chit-chat
  SOFT_MENTION = 'SOFT_MENTION', // Level 1: Soft bridge / seed planting without aggressive sell
  DIRECT_OFFER = 'DIRECT_OFFER', // Level 2: Direct pitch, pricing, plan options & CTA/banner
}

export enum ObjectionCategory {
  PRICE = 'PRICE',
  TRUST = 'TRUST',
  EXISTING_SOLUTION = 'EXISTING_SOLUTION',
  COMPLEXITY = 'COMPLEXITY',
  GENERAL = 'GENERAL',
}

export interface LeadScoreFactor {
  intent: Intent;
  points: number;
  reason: string;
  turn: number;
  timestamp: string;
}

export interface ConversationContext {
  state: ConversationState;
  previousState: ConversationState;
  intent: Intent;
  detectedIntentsHistory: Intent[];
  leadScore: number;
  scoreFactors: LeadScoreFactor[];
  scoredIntentCategories: Set<string> | string[];
  promotionLock: boolean;
  promotionLevel: PromotionLevel;
  productMentioned: boolean;
  lastPromotionTurn: number;
  lastCTATurn: number;
  turnCount: number;
  botMessageCount?: number;
  userMessageCount?: number;
  maxBotMessages?: number;
  conversationStartedAt?: string;
  endedAt?: string;
  elapsedSeconds?: number;
  supportIdAvailable?: boolean;
  salesState?: string;
  offerCount?: number;
  recentBotMessages?: string[];
  recentStrangerMessages?: string[];
  rejectionsCount: number;
  objectionsCount: number;
  lastObjectionCategory?: ObjectionCategory;
  partnerProfileSnippet?: string;
  partnerTag?: string;
}

export interface AnonymousProductPromotion {
  enabled: boolean;
  productName: string; // عنوان محصول مثلاً «فیلترشکن اختصاصی پرسرعت»
  productDescription: string; // متن توضیحات و پیشنهاد محصول برای ناشناس
  imageUrl?: string; // آدرس تصویر بنر یا محصول
  contactHandleOrLink?: string; // آیدی کانال یا پشتیبانی مثلاً @FastVpnSupport
  sendMode: 'ai_natural_mention' | 'send_photo_with_caption_before_exit' | 'send_custom_card_at_step'; 
  sendAtMessageNumber?: number; // پیام شماره چند (پیش‌فرض پیام آخر یا ۲)
  aiSendBannerWithPitch?: boolean; // ارسال خودکار عکس بنر همراه با معرفی متنی توسط هوش مصنوعی
  minPhotoDelaySeconds?: number; // حداقل زمان مکالمه قبل از مجاز بودن ارسال عکس (پیش‌فرض ۱۲۰ ثانیه / ۲ دقیقه)
  faqItems?: ProductFaqItem[]; // سوالات و پاسخ‌های متداول محصول برای پاسخ‌دهی هوشمند
  knowledgeBaseText?: string; // پایگاه دانش و توضیحات آزاد قیمت‌ها، پلن‌ها و گارانتی
}

export interface SavedAiPrompt {
  id: string;
  title: string;
  prompt: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ConversationStrategy = 'direct_pitch' | 'social_rapport' | 'consultative' | 'custom';

export interface BotPersonaConfig {
  name: string; // e.g. "پشتیبان آنلاین نوا" or "سارا" or "مشاور فروش"
  role: string; // e.g. "ویزیتور و فروشنده اشتراک فیلترشکن بدون قطعی با ارائه تست رایگان" or "دوست آنلاین"
  tone: 'casual' | 'friendly' | 'professional' | 'consultative' | 'playful'; // لحن
  bio?: string; // توضیحات و شخصیت
  age?: string; // اختیاری (مثلاً ۲۶ یا خالی)
  location?: string; // اختیاری (مثلاً تهران یا سراسر کشور)
}

export interface AnonymousChatInstructions {
  conversationStrategy?: ConversationStrategy; // استراتژی کلان گفتگو (ویزیتوری مستقیم، چت دوستانه، مشاوره، سفارشی)
  persona?: BotPersonaConfig; // هویت و پرسوناى داینامیک ربات
  systemPrompt: string; // دستورالعمل متنی کامل هوش مصنوعی برای نحوه صحبت با کاربر ناشناس
  savedPrompts?: SavedAiPrompt[]; // لیست دستورالعمل‌های اختصاصی ذخیره شده توسط خود کاربر
  maxMessagesPerChat: number; // تعداد پیامی که بات باید با کاربر صحبت کند قبل از خروج (مثلاً ۳ یا ۵)
  maxBotMessages?: number; // حداکثر تعداد پیام‌های مجاز ارسالی ربات (مثلا ۱۸)
  autoExitOnPartnerBye?: boolean; // تشخیص هوشمند خداحافظی یا قصد خروج مخاطب و اجرای بلافاصله فرآیند خروج با ارسال بنر تبلیغاتی
  memoryWindowSize?: number; // تعداد پیام‌های اخیر مکالمه جاری که در حافظه هوش مصنوعی نگهداری می‌شود (پیش‌فرض: ۱۰ پیام)
  enforceSessionIsolation?: boolean; // تضمین تفکیک کامل حافظه بین جلسات و فراموشی خودکار افراد قبلی
  extractPartnerProfileInfo?: boolean; // استخراج خودکار سن، جنسیت، شهر یا تگ کاربری از پیام ورود ربات و تزریق به حافظه
  dynamicSessionStatePrompt?: boolean; // تزریق هوشمند نوبت مکالمه و فاز گفتگو به پرامپت هوش مصنوعی
  
  // ۱. ارسال پیام‌های چندتکه‌ای (Multi-bubble Messaging)
  enableMultiBubble?: boolean; // شکستن خودکار پاسخ‌های چندجمله‌ای به ۲ الی ۳ حباب پیام مجزا
  multiBubbleMaxChunks?: number; // حداکثر تعداد حباب پیام متوالی (پیش‌فرض: ۲ تا ۳)
  multiBubbleDelaySeconds?: number; // تاخیر بین حباب‌های متوالی (ثانیه، پیش‌فرض: ۱ الی ۲)
  maxWordsPerBubble?: number; // سقف کلمات در هر حباب پیام برای شبیه‌سازی دقیق تایپ انسانی تلگرام (پیش‌فرض: ۵ کلمه)
  antiFilterHandleFormat?: 'plain' | 'spaced' | 'search_hint' | 'banner_only'; // فرمت ضد سانسور آیدی پشتیبانی قبل از رفع محدودیت ۲ دقیقه

  // ۲. خروج فوق‌سریع در صورت عدم تمایل (Fast Skip on Rejection)
  fastDropOnRejection?: boolean; // تشخیص فوری رد تمایل (نه، نمیخوام، تبلیغ، لفت) و خروج آنی بدون معطلی و اتصال به نفر بعدی
  fastDropFarewellText?: string; // متن خداحافظی فوق‌کوتاه و صمیمی قبل از خروج سریع (مثلاً: «اوکی فعلا» یا «باشه موفق باشی»)

  // ۳. سرعت تایپ پویا و هوشمند (Dynamic Typing Speed)
  dynamicTypingSpeed?: boolean; // محاسبه زمان تایپ بر اساس تعداد حروف پیام به جای تاخیر ثابت
  typingSpeedMsPerChar?: number; // مدت زمان تایپ به ازای هر کاراکتر (میلی‌ثانیه، مثلاً ۳۵ میلی‌ثانیه)
  minTypingDelaySeconds?: number; // حداقل زمان تایپ (پیش‌فرض: ۱.۰ ثانیه)
  maxTypingDelaySeconds?: number; // حداکثر زمان تایپ (پیش‌فرض: ۶.۰ ثانیه)

  // ۳. فیلتر سریع ربات‌های تبلیغاتی و اسپم (Spam / Bot Skip)
  autoSkipSpamBots?: boolean; // تشخیص فوری ربات‌ها و پیام‌های تبلیغاتی هم‌صحبت و خروج سریع
  spamBotKeywords?: string[]; // عبارات شناسایی ربات و تبلیغات (لینک، آیدی کانال، عضویت، ربات و...)

  initiateGreetingOnConnect?: boolean; // ارسال خودکار پیام سلام/شروع به محض اتصال موفق به مخاطب ناشناس
  initialGreetingText?: string; // متن پیام شروع اولیه مثلاً «سلام خوبی؟ 🌸» یا «سلام چطوری؟»
  initialGreetings?: string[]; // لیست چندگانه متن‌های سلام برای ارسال تصادفی و چرخش پیام‌های شروع
  greetingMode?: 'single' | 'random_list'; // حالت ارسال سلام: تک پیام ثابت یا انتخاب تصادفی از لیست
  greetingDelaySeconds?: number; // تاخیر ارسال پیام سلام پس از اتصال (ثانیه، مثلاً ۰.۵ الی ۵)
  enablePreExitFarewell?: boolean; // ارسال متن خداحافظی دقیقا پس از رسیدن به سقف پیام و قبل از ارسال تبلیغ و خروج
  preExitFarewellText?: string; // متن پیام خداحافظی مثلاً «خب عزیزم من کار برام پیش اومد باید برم، مراقب خودت باش 🌸»
  preExitFarewells?: string[]; // لیست چندگانه متن‌های خداحافظی برای انتخاب تصادفی
  farewellMode?: 'single' | 'random_list'; // حالت ارسال خداحافظی: تک پیام ثابت یا انتخاب تصادفی از لیست
  farewellDelaySeconds?: number; // تاخیر بین پیام خداحافظی و پیام تبلیغاتی/خروج (ثانیه)
  sendPromoBeforeExitAlways?: boolean; // ارسال حتمی عکس و توضیحات کمپین تبلیغاتی در پایان چت قبل از خروج (در صورتی که قبلاً ارسال نشده باشد)
  replyDelaySeconds: number; // تاخیر شبیه‌سازی تایپ قبل از ارسال پاسخ (ثانیه)
  messageAggregationDelaySeconds?: number; // زمان انتظار برای تجمیع پیام‌های متوالی مخاطب قبل از پاسخ (ثانیه، مثلاً ۲.۵ الی ۳.۵)
  silenceTimeoutSeconds: number; // حداکثر زمان انتظار در صورت عدم پاسخ مخاطب (ثانیه)
  enableSilenceNudge: boolean; // ارسال پیام پیگیری در صورت سکوت مخاطب
  silenceNudgeText: string; // متن پیگیری مثلاً «هستی؟ 🌸»
  inappropriateKeywords: string[]; // کلیدواژه‌های نامناسب برای خروج فوری
  customIgnoredSystemPhrases?: string[]; // عبارات سیستمی ربات که نباید پیام مخاطب تلقی شوند
  products?: ProductConfig[]; // کاتالوگ و سوابق تمام محصولات و کمپین‌های تبلیغاتی ربات
  activeProductId?: string; // شناسه محصول/کمپین فعال جاری برای تبلیغ در چت با ۱ کلیک
  productPromotion?: AnonymousProductPromotion; // محصول و عکس تبلیغاتی اختصاصی چت ناشناس (همگام با محصول فعال)
}

export interface AnonymousChatMessage {
  id: string;
  sender: 'bot_system' | 'stranger' | 'me_melody' | 'operator_manual';
  text: string;
  timestamp: string;
}

export interface AnonymousChatSession {
  id: string;
  sessionIndex?: number; // شماره ترتیب مکالمه در چرخه
  botId: string;
  botUsername: string;
  botName: string;
  accountId: string;
  accountPhone: string;
  accountName?: string;
  partnerTag?: string; // شناسه یا تگ هم‌صحبت جاری (مثلاً /user_80Wazd)
  partnerProfileSnippet?: string; // مشخصات استخراج شده هم‌صحبت (مثلاً «پسر ۲۲ ساله از تهران»)
  status: 'idle' | 'navigating_buttons' | 'waiting_for_stranger' | 'chatting' | 'exiting_chat' | 'ended' | 'failed';
  statusMessage?: string;
  exitReason?: 'max_messages_reached' | 'stranger_silence' | 'stranger_disconnected' | 'inappropriate_content' | 'manual_operator_skip' | 'bot_timeout' | 'partner_bye_exit' | 'spam_bot_skipped';
  startedAt: string;
  connectedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  messagesCount: number;
  strangerMessagesCount: number;
  aiMessagesCount: number;
  botMessageCount?: number;
  userMessageCount?: number;
  offerCount?: number;
  supportIdAvailable?: boolean;
  salesState?: string;
  promoSent?: boolean; // مشخص‌کننده اینکه آیا بنر و متن تبلیغاتی کمپین در این چت ارسال شده است یا خیر
  inquiryDetected?: boolean; // آیا مخاطب به تبلیغ علاقه نشان داد یا سوال پرسید؟
  inquirySnippet?: string; // خلاصه سوال یا درخواست هم‌صحبت پس از دیدن تبلیغ
  isSpamBot?: boolean; // هم‌صحبت به عنوان ربات/اسپمر شناخته شد
  targetMaxBotMessages?: number; // سقف پیام پویا و تصادفی ربات برای این چت (بین ۱۸ تا ۲۵)
  
  // Step 4 Conversation Engine State Tracking:
  conversationContext?: ConversationContext;
  conversationState?: ConversationState;
  previousState?: ConversationState;
  lastIntent?: Intent;
  leadScore?: number;
  promotionLock?: boolean;
  promotionLevel?: PromotionLevel;
  lastPromotionTurn?: number;
  lastCTATurn?: number;
  rejectionsCount?: number;
  objectionsCount?: number;

  transcript: AnonymousChatMessage[];
}

export interface AnonymousAnalyticsReport {
  totalChatsInitiated: number;
  totalCompletedChats: number;
  totalPromoSent: number;
  totalInquiriesAfterPromo: number;
  totalSpamBotsSkipped: number;
  conversionRatePercent: number;
  promoPitchRatePercent: number;
  averageChatDurationSeconds: number;
  averageMessagesPerChat: number;
  exitReasonsBreakdown: Record<string, number>;
  topInquiries: Array<{
    sessionId: string;
    partnerTag?: string;
    partnerSnippet?: string;
    inquiryText: string;
    timestamp: string;
  }>;
}

export interface AnonymousChatAutomatorConfig {
  isActive: boolean;
  selectedBotId: string;
  bots: AnonymousBotProfile[];
  instructions: AnonymousChatInstructions;
  products?: ProductConfig[]; // لیست و تاریخچه تمام محصولات و کمپین‌ها
  activeProductId?: string; // شناسه محصول فعال چت
  loopForever: boolean; // تکرار مداوم و رفتن خودکار به هم‌صحبت بعدی بعد از خروج
  cooldownBetweenChatsSeconds: number; // استراحت کوتاه بین چت‌ها (ثانیه)
  currentRunStartedAt?: string; // زمان آغاز دور جاری اتوماسیون چت
  stats: {
    totalChatsInitiated: number;
    totalCompletedChats?: number;
    totalRepliesFromStrangers: number;
    totalPromoSent?: number;
    totalInquiriesAfterPromo?: number;
    totalSpamBotsSkipped?: number;
    lastActiveAt?: string;
    exitReasonsBreakdown?: Record<string, number>;
  };
}

export interface AnonymousDialogueTurn {
  sender: 'partner' | 'ai_bot' | 'operator_manual';
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface AnonymousPartnerConversation {
  partnerNumber: number;
  sessionId: string;
  partnerTag?: string; // شناسه یا تگ کاربر مثلاً /user_abc
  partnerProfile?: string; // سن، جنسیت، شهر استخراج شده
  startedAt: string;
  endedAt?: string;
  exitReason?: string;
  messagesCount: {
    partner: number;
    aiBot: number;
  };
  dialogue: AnonymousDialogueTurn[];
}

export interface AnonymousPromptTestRun {
  id: string;
  runIndex: number;
  startedAt: string;
  endedAt?: string;
  status: 'running' | 'stopped';
  botProfile: {
    id: string;
    name: string;
    botUsername: string;
  };
  aiInstructionsAndContext: {
    systemPrompt: string;
    maxMessagesPerChat: number;
    memoryWindowSize: number;
    initialGreeting?: {
      enabled: boolean;
      text?: string;
      mode?: string;
    };
    preExitFarewell?: {
      enabled: boolean;
      text?: string;
    };
    productPromotion?: {
      enabled: boolean;
      productName: string;
      productDescription: string;
      contactHandleOrLink?: string;
      sendMode: string;
    };
    inappropriateKeywords?: string[];
  };
  analyticsSummary: {
    totalPartnersChatted: number;
    totalPartnerMessagesReceived: number;
    totalAiRepliesSent: number;
    averageTurnsPerPartner: number;
    totalPromoSent?: number;
    totalInquiriesAfterPromo?: number;
    totalSpamBotsSkipped?: number;
    conversionRatePercent?: number;
  };
  conversationsByPartner: AnonymousPartnerConversation[];
  sessions?: AnonymousChatSession[];
}

export interface IntentDetectionResult {
  intent: Intent;
  primaryIntent: Intent;
  secondaryIntents: Intent[];
  confidence: number;
  priority: number;
  matchedPatterns: string[];
  isExplicitProductIntent: boolean;
  isObjectionOrRejection: boolean;
  evidence: string[];
  reasonCodes: string[];
  topCandidates: Array<{ intent: Intent; score: number }>;
  actionabilityScore: number;
}

export interface AppState {
  credentials: TelegramCredentials;
  accounts?: TelegramAccount[];
  activeAccountId?: string;
  groups: TargetGroup[];
  campaigns: ProductCampaign[];
  scheduler: SchedulerConfig;
  logs: LogEntry[];
  monitoringReports?: GroupMonitoringReport[];
  lastBroadcastReport?: BroadcastReport;
  broadcastHistory?: BroadcastReport[];
  activeBroadcastProgress?: ActiveBroadcastProgress;
  activeGroupJoinProgress?: ActiveGroupJoinProgress;
  groupJoinStrategy?: GroupJoinStrategy;
  anonymousAutomator?: AnonymousChatAutomatorConfig;
  activeAnonymousSession?: AnonymousChatSession;
  anonymousSessionHistory?: AnonymousChatSession[];
  currentTestRun?: AnonymousPromptTestRun | null;
  previousTestRuns?: AnonymousPromptTestRun[];
}

