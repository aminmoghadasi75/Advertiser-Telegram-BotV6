import React, { useState } from 'react';
import {
  GroupPromotionStrategyConfig,
  GroupPromotionStrategyType,
  GroupLeadEvent,
  ProductCampaign,
  TargetGroup,
  TelegramAccount,
} from '../types';
import {
  Sparkles,
  Zap,
  Clock,
  Radio,
  Send,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Sliders,
  Tag,
  ArrowRight,
  ExternalLink,
  Bot,
  HelpCircle,
  Flame,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';

interface GroupPromotionStrategiesCardProps {
  strategyConfig?: GroupPromotionStrategyConfig;
  campaigns: ProductCampaign[];
  groups: TargetGroup[];
  accounts: TelegramAccount[];
  isConnected: boolean;
  onSwitchStrategy: (strategy: GroupPromotionStrategyType) => Promise<void>;
  onUpdateStrategyConfig: (updates: Partial<GroupPromotionStrategyConfig>) => Promise<void>;
  onRunStrategy1Now: () => Promise<void>;
  onToggleListener: (active: boolean) => Promise<void>;
  onTestSimulateLead: (sampleText: string) => Promise<any>;
  onClearLeads?: () => Promise<void>;
}

export const GroupPromotionStrategiesCard: React.FC<GroupPromotionStrategiesCardProps> = ({
  strategyConfig,
  campaigns,
  groups,
  accounts,
  isConnected,
  onSwitchStrategy,
  onUpdateStrategyConfig,
  onRunStrategy1Now,
  onToggleListener,
  onTestSimulateLead,
  onClearLeads,
}) => {
  // Safe default config
  const config = strategyConfig || {
    activeStrategy: 'periodic_broadcast',
    strategy1: {
      enabled: true,
      intervalHours: 2,
      intervalMinutes: 120,
      onlyFullyReadyGroups: true,
      includeBanner: true,
      randomJitterMinutes: 3,
      totalBroadcastsSent: 0,
      totalGroupsReached: 0,
    },
    strategy2: {
      enabled: false,
      isListeningActive: false,
      keywords: [
        'vpn',
        'فیلترشکن',
        'فیلتر شکن',
        'وی پی ان',
        'وی‌پی‌ان',
        'v2ray',
        'کانفیگ',
        'پروکسی',
        'سرعت اینترنت',
        'کندی اینترنت',
        'نت قطعه',
        'قطعی اینترنت',
        'هوش مصنوعی',
        'chatgpt',
        'چت جی پی تی',
        'claude',
        'gemini',
        'اینستا',
        'اینستاگرام',
        'یوتیوب',
        'youtube',
        'پینگ',
      ],
      replyInGroup: true,
      sendDirectMessage: true,
      sendBannerInDirectMessage: true,
      friendStylePvTone: true,
      groupReplyDelaySeconds: 4,
      pvMessageDelaySeconds: 8,
      userCooldownHours: 24,
      maxRepliesPerGroupPerHour: 5,
      useAiReasoning: true,
      totalMessagesScanned: 0,
      totalLeadsDetected: 0,
      totalGroupRepliesSent: 0,
      totalPvMessagesSent: 0,
    },
    recentLeads: [],
  };

  const [activeStrategyState, setActiveStrategyState] = useState<GroupPromotionStrategyType>(config.activeStrategy);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isRunningStrategy1, setIsRunningStrategy1] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [customTestMessage, setCustomTestMessage] = useState('سلام بچه‌ها، کسی فیلترشکن یا vpn پرسرعت بدون قطعی برای چت جی پی تی و اینستاگرام سراغ داره؟');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [selectedSubTab, setSelectedSubTab] = useState<'strategy1' | 'strategy2' | 'leads'>('strategy1');

  // Gemini AI Caption Live Generator State
  const [testAiGroupTitle, setTestAiGroupTitle] = useState('گروه برنامه‌نویسان و گیمرهای ایران');
  const [testAiTone, setTestAiTone] = useState<'friendly' | 'professional' | 'minimal' | 'story'>('friendly');
  const [isGeneratingAiCaption, setIsGeneratingAiCaption] = useState(false);
  const [generatedAiCaptionResult, setGeneratedAiCaptionResult] = useState<{ text: string; usedAi: boolean; model?: string } | null>(null);

  const handleTestGenerateAiCaption = async () => {
    setIsGeneratingAiCaption(true);
    try {
      const res = await fetch('/api/campaigns/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: activeCampaign?.id,
          groupTitle: testAiGroupTitle,
          tone: testAiTone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedAiCaptionResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAiCaption(false);
    }
  };

  const handleToggleGeminiRewriting = async (checked: boolean) => {
    await onUpdateStrategyConfig({
      strategy1: {
        ...config.strategy1,
        useGeminiRewriting: checked,
      },
    });
  };

  const handleChangeGeminiTone = async (tone: 'friendly' | 'professional' | 'minimal' | 'story') => {
    setTestAiTone(tone);
    await onUpdateStrategyConfig({
      strategy1: {
        ...config.strategy1,
        geminiCaptionTone: tone,
      },
    });
  };

  // Calculate 100% ready groups count
  const readyGroups = groups.filter(g => {
    const isJoined = g.status === 'joined' || g.membershipStatus === 'joined' || (g.joinedAccountIds && g.joinedAccountIds.length > 0);
    const canSend = g.canSendMessages !== false && g.readinessStatus !== 'no_permission_left';
    return g.isActive && isJoined && canSend;
  });

  const activeCampaign = campaigns.find(c => c.isActive) || campaigns[0];

  const handleStrategyClick = async (type: GroupPromotionStrategyType) => {
    setIsSwitching(true);
    setActiveStrategyState(type);
    try {
      await onSwitchStrategy(type);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleHourPreset = async (hours: number) => {
    const updatedStrategy1 = {
      ...config.strategy1,
      intervalHours: hours,
      intervalMinutes: hours * 60,
    };
    await onUpdateStrategyConfig({
      strategy1: updatedStrategy1,
    });
  };

  const handleToggleOnlyReady = async (checked: boolean) => {
    await onUpdateStrategyConfig({
      strategy1: {
        ...config.strategy1,
        onlyFullyReadyGroups: checked,
      },
    });
  };

  const handleToggleIncludeBanner = async (checked: boolean) => {
    await onUpdateStrategyConfig({
      strategy1: {
        ...config.strategy1,
        includeBanner: checked,
      },
    });
  };

  const handleStrategy2Toggle = async (key: keyof typeof config.strategy2, value: any) => {
    await onUpdateStrategyConfig({
      strategy2: {
        ...config.strategy2,
        [key]: value,
      },
    });
  };

  const handleAddKeyword = async () => {
    const trimmed = newKeywordInput.trim().toLowerCase();
    if (!trimmed) return;
    if (config.strategy2.keywords.includes(trimmed)) {
      setNewKeywordInput('');
      return;
    }
    const updatedKeywords = [...config.strategy2.keywords, trimmed];
    await onUpdateStrategyConfig({
      strategy2: {
        ...config.strategy2,
        keywords: updatedKeywords,
      },
    });
    setNewKeywordInput('');
  };

  const handleRemoveKeyword = async (kw: string) => {
    const updatedKeywords = config.strategy2.keywords.filter(k => k !== kw);
    await onUpdateStrategyConfig({
      strategy2: {
        ...config.strategy2,
        keywords: updatedKeywords,
      },
    });
  };

  const handleRunStrategy1Click = async () => {
    setIsRunningStrategy1(true);
    try {
      await onRunStrategy1Now();
    } catch (err: any) {
      alert(err?.message || 'خطا در اجرای استراتژی ۱');
    } finally {
      setIsRunningStrategy1(false);
    }
  };

  const handleRunSimulation = async () => {
    if (!customTestMessage.trim()) return;
    setIsSimulating(true);
    setSimulationResult(null);
    try {
      const res = await onTestSimulateLead(customTestMessage);
      setSimulationResult(res);
    } catch (err: any) {
      alert('خطا در اجرای تست: ' + (err?.message || 'نامشخص'));
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. MASTER ONE-CLICK STRATEGY SELECTOR HEADER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        
        {/* Background glow styling */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative space-y-5">
          
          {/* Header text */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-white tracking-tight">
                    استراتژی‌های ارسال و فعالیت تبلیغاتی در گروه‌ها
                  </h2>
                  <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
                    تغییر با ۱ کلیک
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  مشخص کنید ربات چگونه تبلیغات VPN کمپین را منتشر کند: ارسال دوره‌ای بنر یا شنود هوشمند پیام‌ها و جذب لید
                </p>
              </div>
            </div>

            {/* Current Active Strategy Badge */}
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs text-slate-400">استراتژی فعال:</span>
              <span className="text-xs font-black text-emerald-300">
                {activeStrategyState === 'periodic_broadcast' && 'استراتژی اول: ارسال دوره‌ای بنر'}
                {activeStrategyState === 'smart_listener_reply' && 'استراتژی دوم: دیده‌بان و ریپلای هوشمند + پی‌وی'}
                {activeStrategyState === 'hybrid_both' && 'حالت ترکیبی: هر دو استراتژی فعال'}
              </span>
            </div>
          </div>

          {/* 3 ONE-CLICK STRATEGY SELECTOR CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            {/* Strategy 1 Card */}
            <button
              type="button"
              onClick={() => handleStrategyClick('periodic_broadcast')}
              disabled={isSwitching}
              className={`text-right p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                activeStrategyState === 'periodic_broadcast'
                  ? 'bg-gradient-to-b from-sky-900/30 via-slate-900 to-slate-950 border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {activeStrategyState === 'periodic_broadcast' && (
                <div className="absolute top-3 left-3 bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>فعال شده</span>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeStrategyState === 'periodic_broadcast'
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">استراتژی اول (دوره‌ای)</h3>
                    <p className="text-[11px] text-sky-400 font-medium">ارسال دوره‌ای بنر و متن تبلیغات</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  ربات در همه گروه‌هایی که عضو است و قابلیت ارسال پیام دارند (<span className="text-sky-300 font-bold">۱۰۰٪ آماده</span>) بصورت دوره‌ای <span className="text-white font-bold">هر چند ساعت یک‌بار</span> بنر و متن کمپین را با رعایت اصول ضداسپم ارسال می‌کند.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  فواصل: هر <b className="text-white">{config.strategy1.intervalHours || 2} ساعت</b>
                </span>
                <span className="text-sky-400 font-bold flex items-center gap-1">
                  {readyGroups.length} گروه ۱۰۰٪ آماده
                </span>
              </div>
            </button>

            {/* Strategy 2 Card */}
            <button
              type="button"
              onClick={() => handleStrategyClick('smart_listener_reply')}
              disabled={isSwitching}
              className={`text-right p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                activeStrategyState === 'smart_listener_reply'
                  ? 'bg-gradient-to-b from-purple-900/30 via-slate-900 to-slate-950 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {activeStrategyState === 'smart_listener_reply' && (
                <div className="absolute top-3 left-3 bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>فعال شده</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeStrategyState === 'smart_listener_reply'
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}>
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">استراتژی دوم (شنود و ریپلای)</h3>
                    <p className="text-[11px] text-purple-400 font-medium">دیده‌بان هوشمند + ریپلای و پی‌وی</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  ربات به پیام‌های گروه گوش می‌دهد؛ با شناسایی مباحث <span className="text-purple-300 font-bold">VPN، فیلترشکن، سرعت نت یا هوش مصنوعی</span>، هوشمند به پیام ریپلای زده و همزمان در <span className="text-white font-bold">پی‌وی مانند یک فرد معمولی</span> راهنمایی و بنر می‌فرستد.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  شناسایی: <b className="text-white">{config.strategy2.keywords.length} کلیدواژه هوشمند</b>
                </span>
                <span className="text-purple-400 font-bold">
                  ریپلای گروه + پی‌وی
                </span>
              </div>
            </button>

            {/* Hybrid Both Card */}
            <button
              type="button"
              onClick={() => handleStrategyClick('hybrid_both')}
              disabled={isSwitching}
              className={`text-right p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between ${
                activeStrategyState === 'hybrid_both'
                  ? 'bg-gradient-to-b from-emerald-900/30 via-slate-900 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {activeStrategyState === 'hybrid_both' && (
                <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>فعال شده</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activeStrategyState === 'hybrid_both'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">حالت ترکیبی (Hybrid)</h3>
                    <p className="text-[11px] text-emerald-400 font-medium">اجرای همزمان هر دو استراتژی</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  حداکثر بازدهی تبلیغاتی: ارسال منظم و دوره‌ای بنر در گروه‌های ۱۰۰٪ آماده <span className="text-emerald-300 font-bold">+</span> حضور و شنود پیوسته برای پاسخگویی شخصی و سریع به کاربرانی که متقاضی فیلترشکن هستند.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">عملکرد چندکاناله</span>
                <span className="text-emerald-400 font-bold">بیشترین جذب مشتری</span>
              </div>
            </button>

          </div>

          {/* Sub Navigation Bar to configure details */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto">
            <button
              onClick={() => setSelectedSubTab('strategy1')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedSubTab === 'strategy1'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>پیکربندی استراتژی اول (ارسال دوره‌ای بنر)</span>
            </button>

            <button
              onClick={() => setSelectedSubTab('strategy2')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedSubTab === 'strategy2'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>پیکربندی استراتژی دوم (شنود، ریپلای و پی‌وی)</span>
            </button>

            <button
              onClick={() => setSelectedSubTab('leads')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedSubTab === 'leads'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>فید زنده لیدهای شناسایی شده</span>
              {config.recentLeads && config.recentLeads.length > 0 && (
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded-full font-mono">
                  {config.recentLeads.length}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-PANEL: STRATEGY 1 DETAILED CONTROLS (ارسال دوره‌ای بنر) */}
      {/* ========================================================================= */}
      {selectedSubTab === 'strategy1' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                تنظیمات و کنترل استراتژی اول: ارسال دوره‌ای بنر در گروه‌های ۱۰۰٪ آماده
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تنظیم ساعات ارسال، فیلتر گروه‌های با دسترسی ارسال پیام و اجرای دستی آنی
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunStrategy1Click}
              disabled={isRunningStrategy1 || !isConnected || readyGroups.length === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 ${
                isConnected && readyGroups.length > 0
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              {isRunningStrategy1 ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال انتشار در گروه‌ها...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ارسال فوری بنر و تبلیغ (اجرای آنی استراتژی ۱)</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">گروه‌های ۱۰۰٪ آماده (با دسترسی ارسال)</span>
              <div className="text-base font-black text-sky-400 mt-1 flex items-center gap-1.5">
                <span>{readyGroups.length}</span>
                <span className="text-xs text-slate-500 font-normal">از {groups.length} گروه</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">فاصله دوره ارسال</span>
              <div className="text-base font-black text-white mt-1">
                هر {config.strategy1.intervalHours || 2} ساعت
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">کل ارسال‌های دوره‌ای موفق</span>
              <div className="text-base font-black text-emerald-400 mt-1 font-mono">
                {(config.strategy1.totalBroadcastsSent || 0).toLocaleString('fa-IR')}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">زمان اجرای بعدی دوره‌ای</span>
              <div className="text-xs font-bold text-slate-300 mt-1.5 truncate">
                {config.strategy1.nextBroadcastAt
                  ? new Date(config.strategy1.nextBroadcastAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
                  : 'آماده شروع'}
              </div>
            </div>
          </div>

          {/* Interval Hours Selector */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>تنظیم دوره ارسال (هر چند ساعت یک‌بار ارسال شود):</span>
              </label>
              <span className="text-xs text-sky-400 font-mono font-bold">
                فعلی: هر {config.strategy1.intervalHours || 2} ساعت
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {[
                { label: 'هر ۱ ساعت', hours: 1 },
                { label: 'هر ۲ ساعت', hours: 2, recommended: true },
                { label: 'هر ۴ ساعت', hours: 4 },
                { label: 'هر ۶ ساعت', hours: 6 },
                { label: 'هر ۱۲ ساعت', hours: 12 },
                { label: 'هر ۲۴ ساعت', hours: 24 },
              ].map((p) => {
                const isSelected = (config.strategy1.intervalHours || 2) === p.hours;
                return (
                  <button
                    key={p.hours}
                    type="button"
                    onClick={() => handleHourPreset(p.hours)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{p.label}</span>
                    {p.recommended && (
                      <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${isSelected ? 'bg-sky-600 text-white' : 'bg-slate-800 text-sky-300'}`}>
                        محبوب
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkboxes for 100% Ready & Media Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
              <input
                type="checkbox"
                checked={config.strategy1.onlyFullyReadyGroups}
                onChange={(e) => handleToggleOnlyReady(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-sky-600 bg-slate-900 border-slate-700 focus:ring-sky-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  ارسال اختصاصی فقط به گروه‌های ۱۰۰٪ آماده
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  فقط گروه‌هایی که عضویت اکانت در آن‌ها تایید شده و دسترسی ارسال پیام فعال است انتخاب می‌شوند (رد کردن گروه‌های قفل‌دار یا بدون مجوز).
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
              <input
                type="checkbox"
                checked={config.strategy1.includeBanner}
                onChange={(e) => handleToggleIncludeBanner(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-sky-600 bg-slate-900 border-slate-700 focus:ring-sky-500"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">
                  ارسال پیوست بنر تصویری همراه متن تبلیغ
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  بنر آپلود شده در کمپین فعال ({activeCampaign?.title || 'کمپین'}) همراه متن ارسال شده و بازدهی بصری تبلیغ را چند برابر می‌کند.
                </p>
              </div>
            </label>

          </div>

          {/* AI-Powered Dynamic Caption Generation with Gemini */}
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      بازنویسی متن تبلیغ با هوش مصنوعی Gemini (فرار ۱۰۰٪ از سیستم ضد اسپم تلگرام)
                    </h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                      Gemini 3.8 Flash
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    متن ارسالی زیر عکس برای هر گروه کاملاً دگرگون و منحصربه‌فرد می‌شود تا تلگرام رفتار تبلیغ را الگوبرداری و مسدود نکند.
                  </p>
                </div>
              </div>

              <label className="flex items-center gap-2 shrink-0 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={config.strategy1.useGeminiRewriting !== false}
                  onChange={(e) => handleToggleGeminiRewriting(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                />
                <span className="text-xs font-bold text-indigo-300">
                  {config.strategy1.useGeminiRewriting !== false ? 'تولید با Gemini فعال است' : 'استفاده از الگوی محلی'}
                </span>
              </label>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">
                لحن تولید متن توسط هوش مصنوعی:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'friendly', label: '👋 دوستانه و صمیمی', desc: 'متن خودمانی با اموجی‌های جذاب' },
                  { id: 'professional', label: '💼 رسمی و تجاری', desc: 'معرفی مشخصات فنی و اطمینان‌بخش' },
                  { id: 'minimal', label: '⚡ کوتاه و خلاصه', desc: 'سریع و موجز با تمرکز بر اقدام فوری' },
                  { id: 'story', label: '💡 داستانی و تجربی', desc: 'از زبان کاربری که از قطعی نجات پیدا کرده' },
                ].map((t) => {
                  const isSelected = (config.strategy1.geminiCaptionTone || 'friendly') === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleChangeGeminiTone(t.id as any)}
                      className={`p-2.5 rounded-xl text-right transition-all border ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className="text-xs font-bold text-indigo-200">{t.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Live Generator Test */}
            <div className="bg-slate-950/80 rounded-xl p-3 sm:p-4 border border-slate-800/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-indigo-400" />
                  آزمایش زنده تولید متن با Gemini قبل از انتشار در تلگرام:
                </span>
                <span className="text-[10px] text-slate-500">
                  متغیرها مانند {`{random_emoji}`} و {`{group_title}`} خودکار پر می‌شوند
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={testAiGroupTitle}
                  onChange={(e) => setTestAiGroupTitle(e.target.value)}
                  placeholder="نام گروه فرضی (مثال: گروه تبادل ارز دیجیتال و کریپتو)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleTestGenerateAiCaption}
                  disabled={isGeneratingAiCaption}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shrink-0 disabled:opacity-50 transition-all active:scale-95"
                >
                  {isGeneratingAiCaption ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال نگارش با Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>تولید کپشن نمونه</span>
                    </>
                  )}
                </button>
              </div>

              {generatedAiCaptionResult && (
                <div className="mt-3 p-3.5 bg-slate-900/90 rounded-xl border border-indigo-500/30 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-indigo-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      متن تولید شده اختصاصی برای «{testAiGroupTitle}»:
                    </span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
                      {generatedAiCaptionResult.model || 'gemini-3.8-flash'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line select-text">
                    {generatedAiCaptionResult.text}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>طول متن: {generatedAiCaptionResult.text.length} کاراکتر</span>
                    <span className="text-emerald-400 font-bold">بدون متغیر خام و کاملاً ضد اسپم</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-PANEL: STRATEGY 2 DETAILED CONTROLS (شنود هوشمند، ریپلای و پی‌وی) */}
      {/* ========================================================================= */}
      {selectedSubTab === 'strategy2' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  تنظیمات استراتژی دوم: شنود هوشمند در گروه‌ها + ریپلای و پی‌وی (Lead Sniffer)
                </h3>
                {config.strategy2.isListeningActive && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    شنود فعال
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                گوش دادن به پیام‌های کاربران در گروه‌ها، تشخیص تقاضای فیلترشکن و اینترنت و جذب مشتری با ریپلای گروه و پیام شخصی
              </p>
            </div>

            {/* Listener Master Switch */}
            <button
              type="button"
              onClick={() => onToggleListener(!config.strategy2.isListeningActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                config.strategy2.isListeningActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-indigo-500'
              }`}
            >
              {config.strategy2.isListeningActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>توقف موقت شنود پیام‌ها</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>فعال‌سازی شنود زنده گروه‌ها</span>
                </>
              )}
            </button>
          </div>

          {/* Strategy 2 Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">کل پیام‌های شنود شده</span>
              <div className="text-base font-black text-white mt-1 font-mono">
                {(config.strategy2.totalMessagesScanned || 0).toLocaleString('fa-IR')}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">لیدهای شناسایی‌شده (متقاضیان)</span>
              <div className="text-base font-black text-purple-400 mt-1 font-mono">
                {(config.strategy2.totalLeadsDetected || 0).toLocaleString('fa-IR')}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">ریپلای‌های هوشمند در گروه</span>
              <div className="text-base font-black text-sky-400 mt-1 font-mono">
                {(config.strategy2.totalGroupRepliesSent || 0).toLocaleString('fa-IR')}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <span className="text-[11px] text-slate-400">پیام‌های شخصی ارسالی به پی‌وی</span>
              <div className="text-base font-black text-emerald-400 mt-1 font-mono">
                {(config.strategy2.totalPvMessagesSent || 0).toLocaleString('fa-IR')}
              </div>
            </div>
          </div>

          {/* 4 Feature Toggles: Group Reply, PV DM, PV Banner, Friendly Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Group Reply */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  ریپلای هوشمند در گروه به پیام کاربر
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ربات در همان گروه به پیام کاربر ریپلای می‌زند و توضیح می‌دهد این VPN مشکل او را برطرف می‌کند و آیدی پشتیبانی ({activeCampaign?.contactHandle || '@Admin'}) را ذکر می‌کند.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.strategy2.replyInGroup}
                onChange={(e) => handleStrategy2Toggle('replyInGroup', e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-sky-600 bg-slate-900 border-slate-700 focus:ring-sky-500"
              />
            </div>

            {/* 2. PV DM */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  ارسال پیام خصوصی به پی‌وی (DM) کاربر
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  همزمان در چت شخصی کاربر پیام داده و مانند یک فرد معمولی و دلسوز سرویس را توضیح می‌دهد و آیدی پشتیبانی را ارسال می‌کند.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.strategy2.sendDirectMessage}
                onChange={(e) => handleStrategy2Toggle('sendDirectMessage', e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-emerald-600 bg-slate-900 border-slate-700 focus:ring-emerald-500"
              />
            </div>

            {/* 3. Send Banner in PV */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  ارسال بنر تصویری تبلیغاتی در پی‌وی
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  همراه با پیام صمیمی در پی‌وی، عکس بنر تعرفه‌ها و سرویس کمپین نیز برای کاربر آپلود و ارسال می‌شود.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.strategy2.sendBannerInDirectMessage}
                onChange={(e) => handleStrategy2Toggle('sendBannerInDirectMessage', e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-purple-600 bg-slate-900 border-slate-700 focus:ring-purple-500"
              />
            </div>

            {/* 4. Casual Friend Style Tone */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  لحن طبیعی و شبیه‌سازی فرد معمولی
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  پرهیز از لحن‌های رباتیک و پیام‌های کلیشه‌ای تبلیغاتی، به نحوی که کاربر تصور کند یکی از اعضای عادی گروه از روی تجربه او را راهنمایی کرده است.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.strategy2.friendStylePvTone}
                onChange={(e) => handleStrategy2Toggle('friendStylePvTone', e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-amber-600 bg-slate-900 border-slate-700 focus:ring-amber-500"
              />
            </div>

          </div>

          {/* Keywords Management Section */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">کلیدواژه‌های ردیابی و شنود پیام‌ها</span>
                <span className="text-[10px] text-slate-400">
                  (فیلترشکن، کندی اینترنت، قطعی، هوش مصنوعی، اینستاگرام، پینگ و...)
                </span>
              </div>
              <span className="text-[11px] text-purple-400 font-mono font-bold">
                {config.strategy2.keywords.length} کلمه فعال
              </span>
            </div>

            {/* Add new keyword input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="افزودن کلمه کلیدی جدید (مثلا: کانفیگ، بازی، کلود، openai)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن</span>
              </button>
            </div>

            {/* Keywords tags badges */}
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto">
              {config.strategy2.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium transition-all group"
                >
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Delay & Safety Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] text-slate-300 font-bold block">
                تاخیر قبل از ریپلای در گروه:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={config.strategy2.groupReplyDelaySeconds || 4}
                  onChange={(e) => handleStrategy2Toggle('groupReplyDelaySeconds', Math.max(1, parseInt(e.target.value, 10) || 4))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-xs font-bold text-white"
                />
                <span className="text-xs text-slate-400">ثانیه (شبیه‌سازی خواندن)</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] text-slate-300 font-bold block">
                تاخیر قبل از ارسال پی‌وی:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={config.strategy2.pvMessageDelaySeconds || 8}
                  onChange={(e) => handleStrategy2Toggle('pvMessageDelaySeconds', Math.max(2, parseInt(e.target.value, 10) || 8))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-xs font-bold text-white"
                />
                <span className="text-xs text-slate-400">ثانیه (طبیعی‌تر شدن رفتار)</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] text-slate-300 font-bold block">
                کول‌داون پیام به هر کاربر:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={config.strategy2.userCooldownHours || 24}
                  onChange={(e) => handleStrategy2Toggle('userCooldownHours', Math.max(1, parseInt(e.target.value, 10) || 24))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center text-xs font-bold text-white"
                />
                <span className="text-xs text-slate-400">ساعت (عدم ارسال تکراری)</span>
              </div>
            </div>

          </div>

          {/* Interactive Simulation & Test Panel */}
          <div className="bg-gradient-to-br from-purple-950/30 via-slate-950 to-slate-950 border border-purple-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white">
                  شبیه‌ساز و تست زنده پاسخ هوشمند استراتژی ۲
                </h4>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                تست بدون ارسال به تلگرام
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              یک متن پیام کاربر را وارد کنید تا ببینید سیستم چطور تقاضا را تشخیص می‌دهد، چه پاسخی در گروه ریپلای می‌زند و چه پیام دوستانه‌ای به پی‌وی می‌فرستد:
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customTestMessage}
                onChange={(e) => setCustomTestMessage(e.target.value)}
                placeholder="متن پیام فرضی کاربر در گروه..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating || !customTestMessage.trim()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>تحلیل و شبیه‌سازی...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>شبیه‌سازی و مشاهده خروجی</span>
                  </>
                )}
              </button>
            </div>

            {/* Simulation Results Display */}
            {simulationResult && (
              <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-4 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓ لید با موفقیت شناسایی شد:</span>
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md font-bold">
                      {simulationResult.detectedCategory}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    کلمات کلیدی: {simulationResult.detectedKeywords?.join('، ') || 'ندارد'}
                  </span>
                </div>

                {/* 1. Group Reply Preview */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    پاسخ ریپلای در گروه (Group Reply):
                  </span>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    {simulationResult.groupReplyText}
                  </div>
                </div>

                {/* 2. PV Direct Message Preview */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    پیام ارسالی به پی‌وی کاربر به عنوان فرد معمولی (Direct DM + Banner):
                  </span>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                    <p>{simulationResult.pvText}</p>
                    {activeCampaign?.imageUrl && (
                      <div className="pt-2 flex items-center gap-2 text-[11px] text-purple-400 border-t border-slate-800/80">
                        <ImageIcon className="w-4 h-4" />
                        <span>همراه با پیوست بنر تبلیغاتی محصول ({activeCampaign.title})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-PANEL: RECENT LEADS & ACTIVITY FEED */}
      {/* ========================================================================= */}
      {selectedSubTab === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                فید زنده لیدها و متقاضیان شناسایی‌شده در گروه‌ها
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                گزارش شفاف کاربرانی که پیام مرتبط با فیلترشکن، اینترنت یا هوش مصنوعی ارسال کردند و وضعیت پاسخگویی
              </p>
            </div>

            {onClearLeads && config.recentLeads && config.recentLeads.length > 0 && (
              <button
                type="button"
                onClick={onClearLeads}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی تاریخچه</span>
              </button>
            )}
          </div>

          {config.recentLeads && config.recentLeads.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {config.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        {lead.userFirstName || 'کاربر تلگرام'} {lead.userUsername ? `(@${lead.userUsername})` : ''}
                      </span>
                      <span className="text-slate-500">در</span>
                      <span className="text-sky-400 font-bold">{lead.groupTitle || 'گروه'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                        {lead.detectedCategory}
                      </span>
                      <span>{new Date(lead.timestamp).toLocaleTimeString('fa-IR')}</span>
                    </div>
                  </div>

                  {/* Original Message */}
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 block mb-0.5">پیام شناسایی‌شده کاربر:</span>
                    «{lead.originalMessageText}»
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] pt-1">
                    <div className="flex items-center gap-1.5">
                      {lead.groupReplySent ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ریپلای در گروه: انجام شد
                        </span>
                      ) : (
                        <span className="text-slate-500">ریپلای گروه: -</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {lead.pvSent ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ارسال به پی‌وی: با موفقیت انجام شد {lead.pvHasBanner ? '(همراه بنر)' : ''}
                        </span>
                      ) : (
                        <span className="text-slate-500">ارسال به پی‌وی: -</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-bold text-slate-300">هنوز پیام یا لیدی ثبت نشده است</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                هنگامی که استراتژی دوم یا حالت ترکیبی فعال باشد، هر پیام مرتبط با فیلترشکن و اینترنت در این بخش به صورت زنده ثبت می‌شود.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
