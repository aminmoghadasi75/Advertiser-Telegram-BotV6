import React, { useState, useMemo } from 'react';
import {
  AnonymousChatAutomatorConfig,
  AnonymousBotProfile,
  AnonymousChatInstructions,
  AnonymousChatSession,
  AnonymousPromptTestRun,
  TelegramAccount,
  TelegramCredentials,
} from '../types';
import { AnonymousBotsListTab } from './anonymous/AnonymousBotsListTab';
import { AnonymousAiInstructionsTab } from './anonymous/AnonymousAiInstructionsTab';
import { AnonymousSimulatorTab } from './anonymous/AnonymousSimulatorTab';
import { AnonymousLiveMonitorTab } from './anonymous/AnonymousLiveMonitorTab';
import { AnonymousAnalyticsTab } from './anonymous/AnonymousAnalyticsTab';
import { AnonymousEvaluationTab } from './anonymous/AnonymousEvaluationTab';
import {
  Bot,
  Sparkles,
  Play,
  Square,
  Zap,
  MessageCircle,
  Repeat,
  Layers,
  Settings2,
  CheckCircle2,
  Phone,
  ChevronDown,
  Download,
  FileText,
  FileCode,
  TrendingUp,
  Loader2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface AnonymousBotsCardProps {
  config?: AnonymousChatAutomatorConfig;
  activeSession?: AnonymousChatSession;
  history?: AnonymousChatSession[];
  currentTestRun?: AnonymousPromptTestRun | null;
  previousTestRuns?: AnonymousPromptTestRun[];
  isConnected: boolean;
  credentials?: TelegramCredentials;
  accounts?: TelegramAccount[];
  activeAccountId?: string;
  onSelectActiveAccount?: (accountId: string) => Promise<void>;
  onOpenAddAccountModal?: () => void;
  onOpenAuthModal?: () => void;
  onUpdateConfig: (config: Partial<AnonymousChatAutomatorConfig>) => Promise<void>;
  onSaveBot: (bot: AnonymousBotProfile) => Promise<void>;
  onDeleteBot: (botId: string) => Promise<void>;
  onStartAutomator: (botId?: string, accountId?: string) => Promise<void>;
  onStopAutomator: () => Promise<void>;
  onNextStranger: () => Promise<void>;
  onSendManualMessage: (text: string) => Promise<void>;
  onClearHistory?: () => Promise<void>;
}

export const AnonymousBotsCard: React.FC<AnonymousBotsCardProps> = ({
  config,
  activeSession,
  history = [],
  currentTestRun,
  previousTestRuns = [],
  isConnected,
  credentials,
  accounts = [],
  activeAccountId,
  onSelectActiveAccount,
  onOpenAddAccountModal,
  onOpenAuthModal,
  onUpdateConfig,
  onSaveBot,
  onDeleteBot,
  onStartAutomator,
  onStopAutomator,
  onNextStranger,
  onSendManualMessage,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'bots' | 'instructions' | 'simulator' | 'live_chat' | 'analytics' | 'evaluation'>('evaluation');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const hasAnyValidAccount = isConnected || accounts.some((a) => a.isActive && a.status !== 'session_expired');

  const handleStartClick = async () => {
    if (!hasAnyValidAccount) {
      onOpenAuthModal?.();
      return;
    }
    setIsActionLoading(true);
    try {
      await onStartAutomator(config?.selectedBotId, activeAccountId);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleStopClick = async () => {
    setIsActionLoading(true);
    try {
      await onStopAutomator();
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleQuickDownload = async (format: 'txt' | 'json') => {
    setIsDownloading(true);
    try {
      let contentStr = '';
      let mimeType = '';
      let filename = '';
      const dateStr = new Date().toISOString().slice(0, 10);

      if (format === 'json') {
        const res = await fetch('/api/anonymous/export-history?format=json');
        if (!res.ok) throw new Error(`Export JSON failed with status: ${res.status}`);
        const jsonData = await res.json();
        contentStr = JSON.stringify(jsonData, null, 2);
        mimeType = 'application/json;charset=utf-8;';
        filename = `prompt_evaluation_run_${dateStr}.json`;
      } else {
        const res = await fetch('/api/anonymous/export-history?format=txt');
        if (!res.ok) throw new Error(`Export TXT failed with status: ${res.status}`);
        contentStr = await res.text();
        mimeType = 'text/plain;charset=utf-8;';
        filename = `anonymous_chat_analysis_${dateStr}.txt`;
      }

      const blob = new Blob([contentStr], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Quick download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const rawInstructions = config?.instructions;
  const configProducts = (Array.isArray(rawInstructions?.products) && rawInstructions.products.length > 0)
    ? rawInstructions.products
    : (Array.isArray(config?.products) ? config.products : []);
  const activeProdId = rawInstructions?.activeProductId || config?.activeProductId || configProducts[0]?.productId || '';

  const instructions: AnonymousChatInstructions = useMemo(() => {
    return {
      systemPrompt: rawInstructions?.systemPrompt || `شما یک دختر ۲۶ ساله ایرانی به نام ملودی اهل تهران هستید که در یک بات چت ناشناس تلگرام در حال صحبت با یک فرد ناشناس هستید.

دستورالعمل‌ها:
۱. طول هر پیام یا پاسخ کوتاه، روان و طبیعی (حداکثر ۳ الی ۵ کلمه) باشد.
۲. از علائم نگارشی کتابی مثل نقطه در انتهای پیام (.)، علامت تعجب (!)، ویرگول‌های متعدد (،) و گیومه اکیداً خودداری کنید تا حس ربات ندهد.
۳. در پاسخ به اصل بگویید «ملودی ۲۶ تهران» (سن ۲۶ به صورت عدد باشد و هرگز حروف ننویسید و از پرسیدن تکراری یا کلیشه‌ای «شما چطور؟» خودداری کنید).
۴. حافظه و جلوگیری از تکرار: پیام‌های قبلی چت را در نظر بگیرید و هرگز سوالی را که قبلاً پرسیده‌اید تکرار نکنید. اگر کاربر پرسید چیکار می‌کنی درباره کارهای خودتان پاسخ دهید.
۵. لحن کاملاً خودمانی، صمیمی و روان دخترانه باشد و هرگز نگویید ربات هستید.
۶. آیدی پشتیبانی را همیشه بدون علامت @ و با فرمت nova_vpn10 بنویسید.
۷. پیشوند «ملودی:» یا علامت نقل‌قول در پاسخ نگذارید و فقط خود پیام را ارسال کنید.`,
      maxMessagesPerChat: 4,
      initiateGreetingOnConnect: true,
      initialGreetingText: 'سلام خوبی؟',
      initialGreetings: ['سلام خوبی؟', 'سلام چطوری؟', 'سلام روزت بخیر', 'سلام خوبی چه خبر؟'],
      greetingMode: 'single',
      greetingDelaySeconds: 0.8,
      enablePreExitFarewell: true,
      preExitFarewellText: 'من دیگه باید برم مراقب خودت باش',
      preExitFarewells: ['من دیگه باید برم مراقب خودت باش', 'فعلا من میرم خوشحال شدم از آشناییت'],
      farewellMode: 'single',
      farewellDelaySeconds: 1.0,
      sendPromoBeforeExitAlways: true,
      replyDelaySeconds: 1.5,
      messageAggregationDelaySeconds: 1.5,
      silenceTimeoutSeconds: 30,
      enableSilenceNudge: true,
      silenceNudgeText: 'هستی؟',
      inappropriateKeywords: ['بلاک', 'اسپم', 'کس نگو', 'فحش', 'گمشو', 'کص', 'کیر', 'جنده', 'سکس', 'سیکتیر'],
      customIgnoredSystemPhrases: [],
      ...(rawInstructions || {}),
      products: configProducts,
      activeProductId: activeProdId,
      productPromotion: {
        enabled: true,
        productName: '',
        productDescription: '',
        imageUrl: '',
        contactHandleOrLink: '',
        sendMode: 'send_photo_with_caption_before_exit',
        sendAtMessageNumber: 3,
        ...(rawInstructions?.productPromotion || {}),
      },
    };
  }, [rawInstructions, configProducts, activeProdId]);

  return (
    <div
      id="anonymous-bots-card"
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4"
      dir="rtl"
    >
      {/* 1. Header Banner & Master Run Button */}
      <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-violet-950/50 via-slate-900 to-fuchsia-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 text-violet-400 flex items-center justify-center shadow-lg shadow-violet-950/50 flex-shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-white">اتوماسیون چت در ربات‌های ناشناس تلگرام</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                ترتیب کلیک‌ها + هوش مصنوعی Gemini
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              اجرای گام‌به‌گام دکمه‌های ورود ➔ تشخیص اتصال با جمله کلیدی ➔ مکالمه با هوش مصنوعی ➔ خروج با ترتیب کلیک‌ها و تکرار خودکار
            </p>
          </div>
        </div>

        {/* Master Start / Stop Button */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {config?.isActive ? (
            <button
              id="stop-anon-automator-btn"
              onClick={handleStopClick}
              disabled={isActionLoading}
              className="px-5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer disabled:opacity-60"
            >
              {isActionLoading ? (
                <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
              ) : (
                <Square className="w-4 h-4 text-red-400 fill-current" />
              )}
              <span>{isActionLoading ? 'در حال توقف...' : 'توقف اتوماسیون چت'}</span>
            </button>
          ) : (
            <button
              id="start-anon-automator-btn"
              onClick={handleStartClick}
              disabled={isActionLoading}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60 ${
                hasAnyValidAccount
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
              }`}
            >
              {isActionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : hasAnyValidAccount ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Phone className="w-4 h-4 text-amber-400" />
              )}
              <span>
                {isActionLoading
                  ? 'در حال راه‌اندازی و اتصال...'
                  : hasAnyValidAccount
                  ? 'شروع چت با ناشناس‌ها'
                  : 'ورود به تلگرام جهت شروع چت'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Failure Alert Banner if last session failed */}
      {activeSession?.status === 'failed' && !config?.isActive && (
        <div className="mx-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-300">آخرین تلاش برای چت ناشناس متوقف شد:</div>
              <div className="mt-1 text-slate-300 text-[11px] leading-relaxed">{activeSession.statusMessage}</div>
            </div>
          </div>
          <button
            onClick={handleStartClick}
            disabled={isActionLoading}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تلاش مجدد</span>
          </button>
        </div>
      )}

      {/* Live Active Session Status Banner */}
      {config?.isActive && activeSession && (
        <div className="mx-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
            <div>
              <span className="font-bold text-emerald-300">جلسه فعال چت #{activeSession.sessionIndex || 1}: </span>
              <span className="text-slate-300 text-[11px]">{activeSession.statusMessage || 'در حال اجرا...'}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('live_chat')}
            className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <Zap className="w-3 h-3" />
            <span>مشاهده مانیتور زنده</span>
          </button>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 px-5">
        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-center">
          <div className="text-[11px] text-slate-400">وضعیت اتوماسیون</div>
          <div className="text-xs font-bold mt-1 flex items-center justify-center gap-1.5">
            {config?.isActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400">در حال چت مداوم</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-slate-400">آماده به کار (متوقف)</span>
              </>
            )}
          </div>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <div className="text-[11px] text-slate-400">مکالمات آخرین اجرا (Run)</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {history.length || 0} <span className="text-[10px] text-slate-400 font-normal">مخاطب</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            از شروع اخیر
          </div>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 text-center flex flex-col justify-between">
          <div>
            <div className="text-[11px] text-slate-400">پاسخ‌های دریافتی از ناشناس</div>
            <div className="text-sm font-bold text-violet-400 mt-0.5">
              {config?.stats?.totalRepliesFromStrangers || 0} <span className="text-[10px] text-slate-400 font-normal">پیام</span>
            </div>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => handleQuickDownload('json')}
              disabled={isDownloading}
              className="mt-1.5 py-1 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
              title="دانلود فایل JSON مکالمات آخرین دوره شروع"
            >
              <Download className="w-3 h-3" />
              <span>دانلود خروجی (.JSON)</span>
            </button>
          )}
        </div>
      </div>

      {/* Clean Tabs Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 pt-2 gap-2 overflow-x-auto no-scrollbar">
        <button
          id="tab-bots-btn"
          onClick={() => setActiveTab('bots')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'bots'
              ? 'border-violet-500 text-violet-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>۱. کلیک‌های ورود و خروج ربات ({config?.bots?.length || 0})</span>
        </button>

        <button
          id="tab-instructions-btn"
          onClick={() => setActiveTab('instructions')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'instructions'
              ? 'border-fuchsia-500 text-fuchsia-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>۲. دستورالعمل هوش مصنوعی چت</span>
        </button>

        <button
          id="tab-simulator-btn"
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'border-sky-500 text-sky-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>۳. تست و شبیه‌ساز چت</span>
        </button>

        <button
          id="tab-livechat-btn"
          onClick={() => setActiveTab('live_chat')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap relative ${
            activeTab === 'live_chat'
              ? 'border-emerald-500 text-emerald-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>۴. مانیتور زنده و آرشیو ({history.length})</span>
          {activeSession && activeSession.status === 'chatting' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 right-2" />
          )}
        </button>

        <button
          id="tab-analytics-btn"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-amber-500 text-amber-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>۵. آمار و نرخ تبدیل (Analytics)</span>
        </button>

        <button
          id="tab-evaluation-btn"
          onClick={() => setActiveTab('evaluation')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'evaluation'
              ? 'border-pink-500 text-pink-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-pink-400" />
          <span>۶. بازپخش و ارزیابی جامع (Replay & Evaluation)</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-1">
        {activeTab === 'bots' && (
          <AnonymousBotsListTab
            config={config}
            onUpdateConfig={onUpdateConfig}
            onSaveBot={onSaveBot}
            onDeleteBot={onDeleteBot}
          />
        )}

        {activeTab === 'instructions' && (
          <AnonymousAiInstructionsTab
            instructions={instructions}
            onGoToSimulator={() => setActiveTab('simulator')}
            onSaveInstructions={async (newInstructions) => {
              await onUpdateConfig({
                instructions: newInstructions,
                products: newInstructions.products || [],
                activeProductId: newInstructions.activeProductId || '',
              });
            }}
          />
        )}

        {activeTab === 'simulator' && (
          <AnonymousSimulatorTab
            instructions={instructions}
            config={config}
            isConnected={hasAnyValidAccount}
            accounts={accounts}
            onStartAutomator={handleStartClick}
            onStopAutomator={handleStopClick}
            onUpdateConfig={onUpdateConfig}
            onOpenAuthModal={onOpenAuthModal}
            onSwitchTab={(tab) => setActiveTab(tab as any)}
            activeSession={activeSession}
          />
        )}

        {activeTab === 'live_chat' && (
          <AnonymousLiveMonitorTab
            activeSession={activeSession}
            config={config}
            history={history}
            currentTestRun={currentTestRun}
            previousTestRuns={previousTestRuns}
            onNextStranger={onNextStranger}
            onSendManualMessage={onSendManualMessage}
            onClearHistory={onClearHistory}
          />
        )}

        {activeTab === 'analytics' && (
          <AnonymousAnalyticsTab
            config={config}
            history={history}
            activeSession={activeSession}
            currentTestRun={currentTestRun}
            previousTestRuns={previousTestRuns}
          />
        )}

        {activeTab === 'evaluation' && <AnonymousEvaluationTab />}
      </div>
    </div>
  );
};
