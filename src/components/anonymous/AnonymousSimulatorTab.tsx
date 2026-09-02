import React, { useState, useEffect, useRef } from 'react';
import {
  AnonymousChatInstructions,
  AnonymousChatAutomatorConfig,
  AnonymousChatSession,
  ConversationState,
  Intent,
  PromotionLevel,
  ConversationContext,
  TelegramAccount,
} from '../../types';
import {
  MessageCircle,
  Sparkles,
  Send,
  RotateCcw,
  User,
  Zap,
  ShoppingBag,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  Shield,
  Activity,
  Award,
  Lock,
  Unlock,
  Clock,
  Code2,
  ChevronDown,
  ChevronUp,
  Settings2,
  Check,
  Phone,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Flame,
  Radio,
  Eye,
  RefreshCw,
  Pause,
} from 'lucide-react';

interface AnonymousSimulatorTabProps {
  instructions: AnonymousChatInstructions;
  config?: AnonymousChatAutomatorConfig;
  isConnected?: boolean;
  accounts?: TelegramAccount[];
  onStartAutomator?: () => Promise<void>;
  onStopAutomator?: () => Promise<void>;
  onUpdateConfig?: (config: Partial<AnonymousChatAutomatorConfig>) => Promise<void>;
  onOpenAuthModal?: () => void;
  onSwitchTab?: (tab: string) => void;
  activeSession?: AnonymousChatSession;
}

interface SimulatedMessage {
  id: string;
  sender: 'stranger' | 'ai';
  text: string;
  imageUrl?: string;
  isPromo?: boolean;
  time: string;
  elapsedAtSendSec?: number;
  stepOutput?: any;
  source?: 'ai_gemini' | 'offline_fallback';
  modelUsed?: string;
}

export const AnonymousSimulatorTab: React.FC<AnonymousSimulatorTabProps> = ({
  instructions,
  config,
  isConnected = false,
  accounts = [],
  onStartAutomator,
  onStopAutomator,
  onUpdateConfig,
  onOpenAuthModal,
  onSwitchTab,
  activeSession,
}) => {
  const generateUniqueMsgId = (prefix: string) => {
    const rnd = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').slice(0, 10) : Math.random().toString(36).substring(2, 10);
    return `${prefix}_${Date.now()}_${rnd}`;
  };

  const [messages, setMessages] = useState<SimulatedMessage[]>([
    {
      id: generateUniqueMsgId('init'),
      sender: 'ai',
      text: instructions.initialGreetingText || 'سلام چطوری؟ خوبی؟ 🌸',
      time: 'هم‌اکنون',
      elapsedAtSendSec: 0,
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<SimulatedMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  const [elapsedSec, setElapsedSec] = useState(60); // Default to 60s (<2min)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfigDetails, setShowConfigDetails] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccessMessage, setDeploySuccessMessage] = useState<string | null>(null);

  const [currentCtx, setCurrentCtx] = useState<Partial<ConversationContext>>({
    state: ConversationState.INITIAL_GREETING,
    intent: Intent.GREETING,
    leadScore: 0,
    promotionLevel: PromotionLevel.NO_PROMOTION,
    promotionLock: false,
    turnCount: 1,
  });

  const silenceTimeoutSec = instructions.silenceTimeoutSeconds || 45;
  const enableSilenceNudge = instructions.enableSilenceNudge !== false;
  const nudgeText = (instructions.silenceNudgeText || 'هستی؟ 🌸').replace(/[🌸🌹✨]/g, '').trim() || 'هستی؟';

  const [silenceCountdown, setSilenceCountdown] = useState<number>(silenceTimeoutSec);
  const silenceCountdownRef = useRef<number>(silenceTimeoutSec);
  silenceCountdownRef.current = silenceCountdown;
  const [isMultiPartMode, setIsMultiPartMode] = useState<boolean>(false);
  const [stagedParts, setStagedParts] = useState<string[]>([]);

  const [testSummary, setTestSummary] = useState<any>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  const [multiPartTimer, setMultiPartTimer] = useState<number | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isTypingRef = useRef(isTyping);
  isTypingRef.current = isTyping;
  const enableSilenceNudgeRef = useRef(enableSilenceNudge);
  enableSilenceNudgeRef.current = enableSilenceNudge;
  const silenceTimeoutSecRef = useRef(silenceTimeoutSec);
  silenceTimeoutSecRef.current = silenceTimeoutSec;
  const elapsedSecRef = useRef(elapsedSec);
  elapsedSecRef.current = elapsedSec;
  const nudgeTextRef = useRef(nudgeText);
  nudgeTextRef.current = nudgeText;

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, stagedParts]);

  // Live countdown/increment timer & silence nudge
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setElapsedSec((prev) => {
        const next = prev + 1;
        elapsedSecRef.current = next;
        return next;
      });

      const nextVal = (silenceCountdownRef.current || silenceTimeoutSecRef.current || 45) - 1;
      if (nextVal <= 0) {
        const resetVal = silenceTimeoutSecRef.current || 45;
        silenceCountdownRef.current = resetVal;
        setSilenceCountdown(resetVal);
        if (enableSilenceNudgeRef.current && !isTypingRef.current) {
          handleTriggerSilenceNudge();
        }
      } else {
        silenceCountdownRef.current = nextVal;
        setSilenceCountdown(nextVal);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Derive active product info
  const rawPromo = instructions.productPromotion;
  const activeProducts = instructions.products || config?.products || [];
  const currentProduct =
    activeProducts.find((p) => p.productId === instructions.activeProductId) ||
    activeProducts[0] ||
    null;

  const productName = currentProduct?.productName || rawPromo?.productName || 'فیلترشکن اختصاصی پرسرعت';
  const supportHandle = (
    currentProduct?.support?.handle ||
    rawPromo?.contactHandleOrLink ||
    'nova_vpn10'
  ).replace(/^@/, '');
  const activeStrategy = (instructions as any).strategy || (instructions as any).conversationStrategy || 'direct_pitch';
  const activePersonaName = (instructions as any).persona?.name || (instructions as any).personaName || (activeStrategy === 'direct_pitch' ? 'پشتیبان فروش و تست' : 'ملودی');
  const activePersonaTone = (instructions as any).persona?.tone || (instructions as any).personaTone || 'بسیار صمیمی، روان، محاوره‌ای و حرفه‌ای';

  const quickPromptCategories = [
    {
      category: 'احوال‌پرسی و شروع',
      prompts: [
        'سلام اصل میدی؟',
        'سلام چطوری؟ خوبی؟',
        'دختری یا پسر؟ کجایی هستی؟',
        'چیکارا میکنی الان؟ مشغولی؟',
      ],
    },
    {
      category: 'پیام‌های چندپارتی (پیاپی مثل تلگرام)',
      prompts: [
        'سلام / اسمت چیه؟ / بچه کجایی؟',
        'خوبی؟ / چیکارا میکنی؟ / مشغولی؟',
        'فیلترشکن داری؟ / قیمتش چنده؟ / تست میدی؟',
      ],
    },
    {
      category: 'نیاز و قطعی اینترنت',
      prompts: [
        'اینستاگرامم اصلاً وصل نمیشه، تو فیلترشکن خوب سراغ داری؟',
        'یوتیوب و واتساپم قطعه، یه VPN پرسرعت داری؟',
        'برای بازی و پینگ پایین چی خوبه؟',
      ],
    },
    {
      category: 'قیمت و تست رایگان',
      prompts: [
        'قیمت فیلترشکنت چنده؟ اکانت تست داری؟',
        'تعرفه اشتراک یک‌ماهه و سه‌ماهه چنده؟',
        'آیدی پشتیبانی رو بده بیام بگیرم',
      ],
    },
    {
      category: 'دستگاه و اپراتور',
      prompts: [
        'رو گوشی آیفون (iOS) و همراه اول جواب میده؟',
        'با نت ایرانسل و وای‌فای خانگی وصل میشه؟',
        'پروتکل v2ray هست یا اختصاصی؟',
      ],
    },
    {
      category: 'مخالفت و رد تبلیغ',
      prompts: [
        'نه اصلاً فیلترشکن نمی‌خوام، تبلیغات نکن!',
        'من خودم فروشنده‌ام نیاز ندارم',
        'تبلیغ کنی بلاکت می‌کنم',
      ],
    },
    {
      category: 'شخصی و خروج',
      prompts: [
        'عکس خودت رو میدی ببینمت؟',
        'آیدی یا شماره خودت چیه آشنا شیم؟',
        'بای من باید برم خوشحال شدم',
      ],
    },
  ];

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setShowTestModal(true);
    try {
      const res = await fetch('/api/anonymous/run-conversation-tests');
      const data = await res.json();
      if (data.success) {
        setTestSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to run conversation tests:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  // Trigger manual or automatic silence nudge from the bot (e.g. "هستی؟")
  const handleTriggerSilenceNudge = (forceSeconds?: number) => {
    const addSec = forceSeconds || silenceTimeoutSecRef.current || silenceTimeoutSec;
    const newElapsed = elapsedSecRef.current + addSec;
    setElapsedSec(newElapsed);
    silenceCountdownRef.current = silenceTimeoutSecRef.current || silenceTimeoutSec;
    setSilenceCountdown(silenceTimeoutSecRef.current || silenceTimeoutSec);

    const nudgeMessageText = nudgeTextRef.current || nudgeText;
    const newNudgeMsg: SimulatedMessage = {
      id: generateUniqueMsgId('ai_nudge'),
      sender: 'ai',
      text: nudgeMessageText,
      time: `پیگیری سکوت مخاطب (${addSec} ثانیه سکوت) ⏳`,
      elapsedAtSendSec: newElapsed,
      source: 'ai_gemini',
    };

    setMessages((prev) => {
      const updated = [...prev, newNudgeMsg];
      messagesRef.current = updated;
      return updated;
    });
  };

  // Dynamic contextual client-side fallback if network or server error occurs
  const getSmartClientFallback = (lastStrangerText?: string): string => {
    const clean = (lastStrangerText || '').trim().toLowerCase();
    if (/(احمق|دیوونه|روانی|خر|اسکل|چرت|بی‌شعور|بیشعور|احمقی)/i.test(clean)) {
      const insultResponses = [
        'ای بابا! چرا بد می‌گی؟ مگه من چی گفتم بهت؟ 😂',
        'نه بابا! مگه تو دلت چیه که اینطوری می‌گی؟',
        'چرا آخه؟ من که فقط داشتم باهات محترمانه چت می‌کردم!',
      ];
      return insultResponses[Math.floor(Math.random() * insultResponses.length)];
    }
    if (/(تهران|تهرانی|کجایی|کجا زندگی|اهل کجایی|بچه کجایی|کدوم شهری)/i.test(clean)) {
      return 'آره عزیزم ساکن تهرانم، شما اهل کجایی؟';
    }
    if (/(اسم|اسمت|نامت|چند سالته|سنت|کی هستی|معرفی)/i.test(clean)) {
      return `${activePersonaName} هستم ۲۶ سالمه از تهران، شما اسمت چیه؟`;
    }
    if (/(فیلترشکن|وی\s*پی\s*ان|vpn|سرور|تست|خرید|سرعت)/i.test(clean)) {
      return 'کانفیگ اختصاصی Nova VPN رو استفاده می‌کنم بدون قطعیه، می‌خوای برات تست بفرستم؟';
    }
    if (/(سلام|درود|hi|slm|هلو)/i.test(clean)) {
      return 'سلام به روی ماهت، خوبی روبراهی؟ چه خبر؟';
    }
    return 'آره متوجه شدم، روزت چطور بوده تا الان؟';
  };

  // Send accumulated messages to the backend
  const triggerAiTurn = async (allMessages: SimulatedMessage[]) => {
    setIsTyping(true);
    setSilenceCountdown(silenceTimeoutSec);
    const promo = instructions.productPromotion;
    const lastStrangerMsg = [...allMessages].reverse().find((m) => m.sender === 'stranger')?.text || '';

    try {
      let res: Response | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await fetch('/api/anonymous/simulate-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              history: allMessages.map((m) => ({
                sender: m.sender === 'stranger' ? 'stranger' : 'me_melody',
                text: m.text,
              })),
              instructions,
              sessionContext: {
                elapsedSeconds: elapsedSec,
                isUnder2Minutes: elapsedSec < 120,
                currentTurn: allMessages.filter((m) => m.sender === 'ai').length,
                maxTurns: instructions.maxMessagesPerChat || 4,
                conversationContext: currentCtx,
                partnerProfileSnippet: 'مخاطب تستی در شبیه‌ساز',
              },
            }),
          });
          if (res.ok) break;
        } catch {
          await new Promise((r) => setTimeout(r, 300));
        }
      }

      if (!res || !res.ok) {
        throw new Error('Server response failed');
      }

      const data = await res.json();
      const replyText = data.reply || (data.success && data.text ? data.text : '');
      const replySource = data.source || (replyText ? 'ai_gemini' : 'offline_fallback');

      if (data.stepOutput?.updatedContext) {
        setCurrentCtx(data.stepOutput.updatedContext);
      }

      if (!replyText) {
        const fallbackMsg: SimulatedMessage = {
          id: generateUniqueMsgId('ai'),
          sender: 'ai',
          text: getSmartClientFallback(lastStrangerMsg),
          time: 'هم‌اکنون',
          elapsedAtSendSec: elapsedSec,
          source: 'offline_fallback',
        };
        const updated = [...messagesRef.current, fallbackMsg];
        messagesRef.current = updated;
        setMessages(updated);
        return;
      }

      const shouldSendBanner =
        promo?.enabled &&
        (data.shouldSendPromoCard ||
          (data.promoMentioned && promo.sendMode === 'ai_natural_mention' && promo.imageUrl));

      const isPromo = Boolean(data.promoMentioned || shouldSendBanner);

      if (shouldSendBanner && promo.imageUrl) {
        let finalPromoText = replyText;
        if (promo.contactHandleOrLink && !finalPromoText.includes(promo.contactHandleOrLink)) {
          finalPromoText += `\n💬 آیدی: ${promo.contactHandleOrLink.replace(/^@/, '')}`;
        }
        const newMsg: SimulatedMessage = {
          id: generateUniqueMsgId('ai_promo'),
          sender: 'ai',
          text: finalPromoText,
          imageUrl: promo.imageUrl,
          isPromo: true,
          time: 'هم‌اکنون (معرفی هوشمند با بنر 🧠🖼)',
          elapsedAtSendSec: elapsedSec,
          stepOutput: data.stepOutput,
          source: replySource,
          modelUsed: data.modelUsed,
        };
        const updated = [...messagesRef.current, newMsg];
        messagesRef.current = updated;
        setMessages(updated);
      } else {
        const newMsg: SimulatedMessage = {
          id: generateUniqueMsgId('ai'),
          sender: 'ai',
          text: replyText,
          isPromo,
          time: isPromo ? 'هم‌اکنون (معرفی در متن 💬)' : 'هم‌اکنون',
          elapsedAtSendSec: elapsedSec,
          stepOutput: data.stepOutput,
          source: replySource,
          modelUsed: data.modelUsed,
        };
        const updated = [...messagesRef.current, newMsg];
        messagesRef.current = updated;
        setMessages(updated);
      }
    } catch (e) {
      const fallbackMsg: SimulatedMessage = {
        id: generateUniqueMsgId('ai'),
        sender: 'ai',
        text: getSmartClientFallback(lastStrangerMsg),
        time: 'هم‌اکنون',
        elapsedAtSendSec: elapsedSec,
        source: 'offline_fallback',
      };
      const updated = [...messagesRef.current, fallbackMsg];
      messagesRef.current = updated;
      setMessages(updated);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (customText?: string, immediate: boolean = true) => {
    const rawText = (customText || input).trim();
    if (!rawText || isTyping) return;

    // Check if customText contains slash-separated multi-parts e.g. "سلام / اسمت چیه؟ / کجایی؟"
    if (rawText.includes(' / ')) {
      const parts = rawText.split(' / ').map((p) => p.trim()).filter(Boolean);
      handleSendMultiPartsBatch(parts);
      return;
    }

    if (multiPartTimer) {
      clearTimeout(multiPartTimer);
      setMultiPartTimer(null);
    }

    const newMessage: SimulatedMessage = {
      id: generateUniqueMsgId('usr'),
      sender: 'stranger',
      text: rawText,
      time: 'هم‌اکنون',
      elapsedAtSendSec: elapsedSec,
    };

    const updatedHistory = [...messagesRef.current, newMessage];
    messagesRef.current = updatedHistory;
    setMessages(updatedHistory);
    setInput('');
    setSilenceCountdown(silenceTimeoutSec);

    if (immediate) {
      triggerAiTurn(updatedHistory);
    } else {
      // Allow brief buffer if multi-part delay is requested
      const timer = window.setTimeout(() => {
        triggerAiTurn(messagesRef.current);
      }, (instructions.messageAggregationDelaySeconds || 1.5) * 1000);
      setMultiPartTimer(timer);
    }
  };

  // Send a pre-assembled list of multi-parts at once as consecutive Telegram bubbles
  const handleSendMultiPartsBatch = (partsToSend?: string[]) => {
    const list = partsToSend || stagedParts;
    if (!list || list.length === 0 || isTyping) return;

    if (multiPartTimer) {
      clearTimeout(multiPartTimer);
      setMultiPartTimer(null);
    }

    const newMsgs: SimulatedMessage[] = list.map((text, idx) => ({
      id: generateUniqueMsgId(`usr_p${idx + 1}`),
      sender: 'stranger',
      text,
      time: `هم‌اکنون (پارت ${idx + 1} از ${list.length})`,
      elapsedAtSendSec: elapsedSec,
    }));

    const updatedHistory = [...messagesRef.current, ...newMsgs];
    messagesRef.current = updatedHistory;
    setMessages(updatedHistory);
    setStagedParts([]);
    setInput('');
    setSilenceCountdown(silenceTimeoutSec);

    triggerAiTurn(updatedHistory);
  };

  const handleAddStagedPart = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setStagedParts((prev) => [...prev, trimmed]);
    setInput('');
  };

  const handleRemoveStagedPart = (idx: number) => {
    setStagedParts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFlushNow = () => {
    if (multiPartTimer) {
      clearTimeout(multiPartTimer);
      setMultiPartTimer(null);
      triggerAiTurn(messages);
    }
  };

  const handleReset = () => {
    if (multiPartTimer) {
      clearTimeout(multiPartTimer);
      setMultiPartTimer(null);
    }
    setMessages([
      {
        id: generateUniqueMsgId('init'),
        sender: 'ai',
        text: instructions.initialGreetingText || 'سلام چطوری؟ خوبی؟ 🌸',
        time: 'هم‌اکنون',
        elapsedAtSendSec: 0,
      },
    ]);
    setInput('');
    setStagedParts([]);
    setElapsedSec(60);
    setSilenceCountdown(silenceTimeoutSec);
    setIsTimerRunning(false);
    setCurrentCtx({
      state: ConversationState.INITIAL_GREETING,
      intent: Intent.GREETING,
      leadScore: 0,
      promotionLevel: PromotionLevel.NO_PROMOTION,
      promotionLock: false,
      turnCount: 1,
    });
  };

  // Start / Deploy to Live Telegram Anonymous Chat
  const handleDeployAndStartLive = async () => {
    if (!isConnected && accounts.length === 0) {
      onOpenAuthModal?.();
      return;
    }

    setIsDeploying(true);
    setDeploySuccessMessage(null);
    try {
      // 1. First ensure config instructions are saved and applied to automator
      if (onUpdateConfig) {
        await onUpdateConfig({
          instructions,
          products: instructions.products || [],
          activeProductId: instructions.activeProductId || '',
        });
      }

      // 2. Start the live automator
      if (onStartAutomator) {
        await onStartAutomator();
      }

      setDeploySuccessMessage('دستورالعمل‌ها با موفقیت اعمال شدند و اتوماسیون چت با ناشناس‌ها در تلگرام آغاز گردید!');
      setTimeout(() => {
        setDeploySuccessMessage(null);
      }, 5000);
    } catch (err: any) {
      console.error('Failed to start automator from simulator:', err);
      alert(`خطا در شروع چت ناشناس: ${err?.message || err}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const isAutomatorRunning = Boolean(config?.isActive);
  const hasAccounts = isConnected || accounts.some((a) => a.isActive && a.status !== 'session_expired');

  return (
    <div className="p-4 sm:p-5 space-y-4 sm:space-y-5" dir="rtl">
      {/* 1. MASTER HERO ACTIVATION BAR: Test & Deploy to Telegram */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-5 rounded-2xl border border-sky-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold shadow-lg shadow-sky-950/50 flex-shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-white">
                محیط شبیه‌ساز ۱۰۰٪ واقعی چت و تایید نهایی دستورالعمل
              </h3>
              {isAutomatorRunning ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  در حال چت در تلگرام
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  آماده به کار (متوقف)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              شما به عنوان یک فرد ناشناس با بات چت کنید. تمام تغییرات دستورالعمل، پرامپت، استراتژی و محدودیت ۲ دقیقه به صورت ۱۰۰٪ عینی اجرا می‌شوند.
            </p>
          </div>
        </div>

        {/* Master Deploy & Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {isAutomatorRunning ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDeployAndStartLive}
                disabled={isDeploying}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg shadow-sky-950/50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="به‌روزرسانی دستورالعمل در بات در حال اجرا"
              >
                <RefreshCw className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} />
                <span>{isDeploying ? 'در حال اعمال...' : 'اعمال تغییرات در بات فعال'}</span>
              </button>

              <button
                type="button"
                onClick={onStopAutomator}
                className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="توقف اتوماسیون"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>توقف</span>
              </button>

              {onSwitchTab && (
                <button
                  type="button"
                  onClick={() => onSwitchTab('live_chat')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="رفتن به مانیتور زنده"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مانیتور زنده</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="simulator-start-chatting-btn"
                type="button"
                onClick={handleDeployAndStartLive}
                disabled={isDeploying}
                className={`px-5 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50 ${
                  hasAccounts
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isDeploying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : hasAccounts ? (
                  <Play className="w-4 h-4 fill-current" />
                ) : (
                  <Phone className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  {isDeploying
                    ? 'در حال راه‌اندازی و ورود به ربات...'
                    : hasAccounts
                    ? 'تایید و شروع چت با ناشناس‌ها در تلگرام'
                    : 'ورود به تلگرام جهت شروع چت'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                title="شروع مجدد چت تستی"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">شروع مجدد</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Toast on Successful Live Start */}
      {deploySuccessMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{deploySuccessMessage}</span>
          </div>
          {onSwitchTab && (
            <button
              type="button"
              onClick={() => onSwitchTab('live_chat')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <span>مشاهده مانیتور زنده چت (بخش ۴)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 2. Active Configuration & Parity Summary Accordion */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
        <button
          type="button"
          onClick={() => setShowConfigDetails(!showConfigDetails)}
          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Settings2 className="w-4 h-4 text-sky-400" />
            <span className="font-bold">دستورالعمل و مشخصات فعال در این شبیه‌ساز:</span>
            <span className="text-[11px] bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-slate-300">
              پرسونا: <strong className="text-white">{activePersonaName}</strong> ({activePersonaTone})
            </span>
            <span className="text-[11px] bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-slate-300">
              استراتژی: <strong className="text-sky-300">{activeStrategy === 'direct_pitch' ? 'فروش و تست مستقیم' : activeStrategy === 'consultative' ? 'مشاوره‌ای' : 'هم‌صحبتی صمیمی'}</strong>
            </span>
            <span className="text-[11px] bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 text-slate-300">
              محصول: <strong className="text-fuchsia-300">{productName}</strong> (آیدی: <code className="text-amber-300">{supportHandle}</code>)
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="text-[11px]">{showConfigDetails ? 'بستن جزئیات' : 'مشاهده جزئیات'}</span>
            {showConfigDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showConfigDetails && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold block flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  اطلاعات پرسونای فعال:
                </span>
                <p className="text-slate-200"><strong>نام و هویت:</strong> {activePersonaName}</p>
                <p className="text-slate-200"><strong>لحن:</strong> {activePersonaTone}</p>
                <p className="text-slate-400 text-[11px]">پاسخ‌ها کوتاه، روان و محاوره‌ای تلگرامی بدون علائم نگارشی کتابی.</p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold block flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-fuchsia-400" />
                  اطلاعات محصول و پشتیبانی:
                </span>
                <p className="text-slate-200"><strong>عنوان:</strong> {productName}</p>
                <p className="text-slate-200"><strong>آیدی پشتیبانی:</strong> <code className="text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">{supportHandle}</code> (بدون @)</p>
                <p className="text-slate-400 text-[11px]">ارسال عکس/بنر: {rawPromo?.imageUrl ? '✅ دارد' : '⚪ بدون عکس'}</p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  قوانین و محدودیت‌های چت:
                </span>
                <p className="text-slate-200"><strong>محدودیت زمانی:</strong> زیر ۲ دقیقه آیدی و عکس ارسال نمی‌شود.</p>
                <p className="text-slate-200"><strong>حداکثر پیام‌ها:</strong> {instructions.maxMessagesPerChat || 4} پیام</p>
                {onSwitchTab && (
                  <button
                    type="button"
                    onClick={() => onSwitchTab('instructions')}
                    className="text-fuchsia-400 hover:text-fuchsia-300 text-[11px] underline block pt-1"
                  >
                    ویرایش دستورالعمل و پرامپت در بخش ۲ ➔
                  </button>
                )}
              </div>
            </div>

            {instructions.systemPrompt && (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 font-bold block mb-1">پرامپت پایه سیستم (System Instruction):</span>
                <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans max-h-28 overflow-y-auto bg-black/40 p-2 rounded-lg border border-slate-800">
                  {instructions.systemPrompt}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Real-time State Machine Context & Time Controller Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">وضعیت زنده ماشین مکالمه (State Machine Context):</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Time Controls & Live Ticker */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] text-slate-300">مدت مکالمه:</span>
              <span className="font-bold text-[11px] text-white px-1">{elapsedSec}s</span>

              {/* Toggle Live Timer */}
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-1 rounded text-[10px] font-bold transition-colors ${
                  isTimerRunning ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isTimerRunning ? 'توقف گذر زمان' : 'شروع گذر زمان واقعی'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>

              {/* Time Presets */}
              <div className="flex items-center gap-1 pr-1 border-r border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setElapsedSec(60);
                    setIsTimerRunning(false);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                    elapsedSec < 120
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="تنظیم زمان روی ۶۰ ثانیه (زیر ۲ دقیقه)"
                >
                  ۶۰s (زیر ۲ دقیقه)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setElapsedSec(150);
                    setIsTimerRunning(false);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                    elapsedSec >= 120
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="تنظیم زمان روی ۱۵۰ ثانیه (بالای ۲ دقیقه)"
                >
                  ۱۵۰s (بالای ۲ دقیقه)
                </button>
              </div>
            </div>

            {/* Silence Nudge Quick Action & Countdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] text-slate-300">سکوت مخاطب:</span>
              <span className={`font-bold text-[11px] px-1 ${silenceCountdown <= 10 ? 'text-amber-400 animate-pulse' : 'text-sky-300'}`}>
                {silenceCountdown}s
              </span>
              <button
                type="button"
                onClick={() => handleTriggerSilenceNudge(silenceTimeoutSec)}
                disabled={isTyping}
                className="px-2 py-0.5 rounded bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 border border-sky-500/40 text-[10px] font-bold transition-all flex items-center gap-1"
                title="شبیه‌سازی سکوت ۴۵ ثانیه‌ای مخاطب ناشناس و ارسال خودکار پیگیری (هستی؟)"
              >
                <span>شبیه‌سازی سکوت {silenceTimeoutSec}s ⏳</span>
              </button>
            </div>

            {/* Promotion Lock Badge */}
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-xl border ${
                currentCtx.promotionLock
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              {currentCtx.promotionLock ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>قفل تبلیغ: فعال (رد صریح)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3" />
                  <span>قفل تبلیغ: غیرفعال</span>
                </>
              )}
            </div>

            {/* Multi-part Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsMultiPartMode(!isMultiPartMode)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 border ${
                isMultiPartMode
                  ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-950/50'
                  : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
              }`}
              title="ارسال چند پیام متوالی به عنوان یک نوبت مخاطب (Multi-part Message)"
            >
              <span>{isMultiPartMode ? '✅ حالت چندپارتی فعال' : '✉️ حالت چندپارتی'}</span>
            </button>

            {/* Unit & E2E Tests Button */}
            <button
              type="button"
              onClick={handleRunTests}
              className="px-2.5 py-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold transition-all shadow-md shadow-violet-950/50 flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>اجرای تست‌های خودکار</span>
            </button>
          </div>
        </div>

        {/* 2-Minute Policy Alert Banner */}
        <div
          className={`p-2.5 rounded-xl border text-[11px] flex items-center gap-2 ${
            elapsedSec < 120
              ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
          }`}
        >
          {elapsedSec < 120 ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>قانون پلتفرم (زیر ۲ دقیقه - {elapsedSec}s):</strong> طبق فیلتر ربات تلگرام، تا قبل از ۱۲۰ ثانیه هیچ آیدی پشتیبانی یا عکسی ارسال نمی‌شود. بات با پاسخ‌های صمیمی و هدایت‌کننده چت را گرم نگه می‌دارد.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>وضعیت مکالمه (بالای ۲ دقیقه - {elapsedSec}s):</strong> محدودیت زمانی برداشته شد. ارسال آیدی پشتیبانی (<code>{supportHandle}</code>) و بنر در صورت ابراز علاقه مخاطب مجاز است.
              </span>
            </>
          )}
        </div>

        {/* State Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">وضعیت ماشین (State):</span>
            <span className="font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 text-[11px] inline-block">
              {currentCtx.state || 'INITIAL_GREETING'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">قصد تشخیص داده شده (Intent):</span>
            <span className="font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40 text-[11px] inline-block">
              {currentCtx.intent || 'GREETING'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">امتیاز لید (Lead Score):</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, currentCtx.leadScore || 0))}%` }}
                />
              </div>
              <span className="font-bold text-emerald-400 text-[11px]">
                {currentCtx.leadScore || 0}/100
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-0.5">سطح مجاز تبلیغ:</span>
            <span
              className={`font-bold text-[11px] px-2 py-0.5 rounded border inline-block ${
                currentCtx.promotionLevel === PromotionLevel.DIRECT_OFFER
                  ? 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-800/40'
                  : currentCtx.promotionLevel === PromotionLevel.SOFT_MENTION
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {currentCtx.promotionLevel || 'NO_PROMOTION'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Categorized Quick Test Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400 font-bold block px-1">
          سناریوهای آماده تست به عنوان فرد ناشناس (روی هر سناریو کلیک کنید):
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 text-xs no-scrollbar">
          {quickPromptCategories.flatMap((cat) => cat.prompts).map((prompt, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => handleSend(prompt)}
              disabled={isTyping}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-950/80 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-200 transition-all whitespace-nowrap text-[11px] shadow-sm disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Realistic Telegram Chat Transcript Stage */}
      <div
        ref={chatContainerRef}
        className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 h-[440px] overflow-y-auto space-y-3.5 shadow-inner flex flex-col justify-between"
      >
        <div className="space-y-3 overflow-y-auto">
          {messages.map((m, mIdx) => (
            <div
              key={m.id ? `${m.id}_${mIdx}` : `sim_msg_${mIdx}`}
              className={`flex items-start gap-2.5 ${
                m.sender === 'stranger' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                  m.sender === 'stranger'
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : m.isPromo
                    ? 'bg-fuchsia-500/30 text-fuchsia-200 border border-fuchsia-500/50'
                    : 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                }`}
              >
                {m.sender === 'stranger' ? <User className="w-3.5 h-3.5" /> : m.isPromo ? '🛍' : '🌸'}
              </div>

              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  m.sender === 'stranger'
                    ? 'bg-slate-800 text-white rounded-tr-none shadow'
                    : m.isPromo
                    ? 'bg-gradient-to-br from-fuchsia-950/90 via-slate-900 to-violet-950/80 text-slate-100 border border-fuchsia-700/50 rounded-tl-none shadow-lg'
                    : 'bg-gradient-to-br from-violet-950/90 to-slate-900 text-slate-100 border border-violet-800/40 rounded-tl-none shadow'
                }`}
              >
                {/* Promo Image if sent */}
                {m.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 p-1">
                    <img
                      src={m.imageUrl}
                      alt="محصول تبلیغاتی"
                      referrerPolicy="no-referrer"
                      className="max-h-48 w-full object-contain rounded-lg"
                    />
                  </div>
                )}

                <div className="font-semibold whitespace-pre-wrap">{m.text}</div>

                {m.sender === 'ai' && (
                  <div className="pt-2 border-t border-white/5 space-y-1 text-[10px]">
                    <div className="flex items-center justify-between text-slate-400 gap-1 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-fuchsia-300 font-medium">
                          <Sparkles className="w-3 h-3" />
                          {m.isPromo
                            ? 'ارسال عکس و محصول'
                            : m.source === 'offline_fallback'
                            ? 'موتور مکالمه و سناریو (پشتیبان)'
                            : 'هوش مصنوعی زنده (Gemini)'}
                        </span>
                        {m.modelUsed && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                            {m.modelUsed}
                          </span>
                        )}
                      </div>
                      <span>{m.time} {m.elapsedAtSendSec !== undefined ? `(${m.elapsedAtSendSec}s)` : ''}</span>
                    </div>

                    {m.stepOutput && (
                      <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-300 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                        <span>🎯 قصد: {m.stepOutput.intentResult.intent}</span>
                        <span>•</span>
                        <span>🧠 وضعیت: {m.stepOutput.updatedContext.state}</span>
                        <span>•</span>
                        <span>📈 امتیاز: {m.stepOutput.updatedContext.leadScore}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-fuchsia-400 p-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
              <span>بات در حال پردازش پرامپت، لحن و تولید پاسخ است...</span>
            </div>
          )}
        </div>
      </div>

      {/* 6. Message Input Field with Multi-part buffering & Multi-Part Builder support */}
      <div className="space-y-2">
        {/* Multi-part Mode Staging Area */}
        {isMultiPartMode && (
          <div className="bg-slate-900/90 border border-sky-500/40 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-300 flex items-center gap-1.5">
                <span>✉️ ساخت بسته پیام چندپارتی (مانند ارسال پشت‌سر‌هم در تلگرام):</span>
                <span className="bg-sky-950 text-sky-200 px-2 py-0.5 rounded-full border border-sky-800 text-[10px]">
                  {stagedParts.length} پارت
                </span>
              </span>
              <button
                type="button"
                onClick={() => setStagedParts([])}
                disabled={stagedParts.length === 0}
                className="text-slate-400 hover:text-rose-400 text-[10px] disabled:opacity-40 transition-colors"
              >
                پاک کردن همه پارت‌ها
              </button>
            </div>

            {stagedParts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-black/40 rounded-xl border border-slate-800 max-h-32 overflow-y-auto">
                {stagedParts.map((part, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-sky-950/80 border border-sky-600/50 text-sky-200 px-2.5 py-1 rounded-lg text-xs animate-in fade-in"
                  >
                    <span className="font-bold text-[10px] text-sky-400 bg-sky-900/60 px-1 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <span className="font-medium">{part}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStagedPart(idx)}
                      className="text-sky-400 hover:text-rose-400 ml-1 text-xs"
                      title="حذف این پارت"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.ctrlKey || e.shiftKey) {
                      handleAddStagedPart();
                      setTimeout(() => handleSendMultiPartsBatch(), 50);
                    } else {
                      handleAddStagedPart();
                    }
                  }
                }}
                placeholder="متن پارت جدید را بنویسید و اینتر بزنید..."
                disabled={isTyping}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddStagedPart}
                disabled={!input.trim() || isTyping}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold transition-all border border-slate-700 disabled:opacity-40 flex-shrink-0"
              >
                + افزودن پارت
              </button>
              <button
                type="button"
                onClick={() => {
                  if (input.trim()) {
                    const newParts = [...stagedParts, input.trim()];
                    handleSendMultiPartsBatch(newParts);
                  } else {
                    handleSendMultiPartsBatch();
                  }
                }}
                disabled={(stagedParts.length === 0 && !input.trim()) || isTyping}
                className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-950/50 disabled:opacity-40 flex-shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>ارسال پارت‌ها به صورت یکجا 🚀</span>
              </button>
            </div>
          </div>
        )}

        {multiPartTimer !== null && (
          <div className="flex items-center justify-between bg-sky-950/40 border border-sky-800/40 rounded-xl px-3 py-1.5 text-[11px] text-sky-200 animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>در حال انتظار برای پیام بعدی شما (ارسال چندپارتی مانند تلگرام)...</span>
            </span>
            <button
              type="button"
              onClick={handleFlushNow}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-2 py-0.5 rounded text-[10px] transition-colors"
            >
              پاسخ فوری هوش مصنوعی ⚡
            </button>
          </div>
        )}

        {!isMultiPartMode && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(undefined, e.ctrlKey || e.shiftKey)}
              placeholder="پیام خود را بنویسید (چند پیام متوالی ارسال کنید یا اینتر بزنید)..."
              disabled={isTyping}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => handleSend(undefined, false)}
              disabled={!input.trim() || isTyping}
              className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-sky-950/50 flex-shrink-0 cursor-pointer"
              title="ارسال پیام با قابلیت دریافت پیام‌های متوالی چندپارتی"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>ارسال</span>
            </button>
            <button
              type="button"
              onClick={() => handleSend(undefined, true)}
              disabled={!input.trim() || isTyping}
              className="px-3 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-lg shadow-violet-950/50 flex-shrink-0 cursor-pointer"
              title="ارسال فوری و دریافت بلادرنگ پاسخ بدون وقفه"
            >
              <Zap className="w-4 h-4" />
              <span>فوری</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. Test Suite Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-400" />
                <h4 className="font-bold text-sm text-white">
                  نتایج آزمون‌های اعتبارسنجی خودکار موتور مکالمه (Unit & E2E Test Suite)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {isRunningTests ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-slate-300">در حال اجرای آزمون‌های واحد و سناریوهای انتها به انتها...</p>
                </div>
              ) : testSummary ? (
                <>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">کل آزمون‌ها</span>
                      <span className="font-bold text-sm text-white">{testSummary.total}</span>
                    </div>
                    <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                      <span className="text-[11px] text-emerald-400 block">موفق</span>
                      <span className="font-bold text-sm text-emerald-300">{testSummary.passed}</span>
                    </div>
                    <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
                      <span className="text-[11px] text-rose-400 block">ناموفق</span>
                      <span className="font-bold text-sm text-rose-300">{testSummary.failed}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block">زمان اجرا</span>
                      <span className="font-bold text-sm text-sky-400">{testSummary.durationMs}ms</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-300 text-xs">جزئیات آزمون‌ها:</h5>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto">
                      {testSummary.results.map((t: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            t.passed
                              ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-200'
                              : 'bg-rose-950/30 border-rose-800/40 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {t.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            )}
                            <span className="font-medium text-[11px]">{t.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{t.durationMs}ms</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
