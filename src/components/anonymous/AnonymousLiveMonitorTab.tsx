import React, { useState } from 'react';
import {
  AnonymousChatSession,
  AnonymousChatAutomatorConfig,
  AnonymousPromptTestRun,
} from '../../types';
import {
  Zap,
  User,
  Bot,
  Send,
  SkipForward,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  LogOut,
  Sparkles,
  Download,
  FileText,
  FileCode,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  History,
  Info,
  Filter,
  Eye,
  X,
  Layers,
  Terminal,
} from 'lucide-react';

interface AnonymousLiveMonitorTabProps {
  activeSession?: AnonymousChatSession;
  config?: AnonymousChatAutomatorConfig;
  history?: AnonymousChatSession[];
  currentTestRun?: AnonymousPromptTestRun | null;
  previousTestRuns?: AnonymousPromptTestRun[];
  onNextStranger: () => Promise<void>;
  onSendManualMessage: (text: string) => Promise<void>;
  onClearHistory?: () => Promise<void>;
}

export const AnonymousLiveMonitorTab: React.FC<AnonymousLiveMonitorTabProps> = ({
  activeSession,
  config,
  history = [],
  currentTestRun,
  previousTestRuns = [],
  onNextStranger,
  onSendManualMessage,
  onClearHistory,
}) => {
  const [manualText, setManualText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [filterSystemMessages, setFilterSystemMessages] = useState(true);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonModalContent, setJsonModalContent] = useState<string>('');

  const handleSendManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendManualMessage(manualText.trim());
      setManualText('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'chatting':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>در حال گفتگو با کاربر ناشناس</span>
          </span>
        );
      case 'waiting_for_stranger':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-700/80 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>در انتظار اتصال به ناشناس...</span>
          </span>
        );
      case 'navigating_buttons':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-950/80 text-violet-300 border border-violet-700/80 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" />
            <span>اجرای ترتیب کلیک‌های ورود به چت...</span>
          </span>
        );
      case 'exiting_chat':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-700/80 flex items-center gap-1.5">
            <LogOut className="w-3.5 h-3.5" />
            <span>اجرای کلیک‌های خروج از چت...</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
            آماده به کار (متوقف)
          </span>
        );
    }
  };

  // Combine active session and history sessions for inspection
  const allRecordedSessions: AnonymousChatSession[] = [];
  if (activeSession && activeSession.transcript && activeSession.transcript.length > 0) {
    allRecordedSessions.push(activeSession);
  }
  history.forEach((h) => {
    if (!allRecordedSessions.some((s) => s.id === h.id)) {
      allRecordedSessions.push(h);
    }
  });

  const handleDownloadReport = async (format: 'txt' | 'json') => {
    setIsDownloading(true);
    try {
      let contentStr = '';
      let mimeType = '';
      let filename = '';
      const dateStr = new Date().toISOString().slice(0, 10);

      if (format === 'json') {
        if (jsonModalContent && isJsonModalOpen) {
          contentStr = jsonModalContent;
        } else {
          const res = await fetch('/api/anonymous/export-history?format=json');
          if (!res.ok) throw new Error(`Export JSON failed with status: ${res.status}`);
          const jsonData = await res.json();
          contentStr = JSON.stringify(jsonData, null, 2);
        }
        mimeType = 'application/json;charset=utf-8;';
        filename = `prompt_evaluation_clean_${dateStr}.json`;
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
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyJson = async () => {
    try {
      const res = await fetch('/api/anonymous/export-history?format=json');
      const data = await res.json();
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    } catch (err) {
      console.error('Copy JSON error:', err);
    }
  };

  const handlePreviewJson = async () => {
    try {
      const res = await fetch('/api/anonymous/export-history?format=json');
      const data = await res.json();
      setJsonModalContent(JSON.stringify(data, null, 2));
      setIsJsonModalOpen(true);
    } catch (err) {
      console.error('Preview JSON error:', err);
    }
  };

  const handleCopyAllAnalysis = async () => {
    try {
      const res = await fetch('/api/anonymous/export-history?format=txt');
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  const handleCopySingleSession = async (session: AnonymousChatSession) => {
    const lines = [
      `=== مکالمه #${session.sessionIndex || 1} ===`,
      `زمان شروع: ${session.startedAt ? new Date(session.startedAt).toLocaleString('fa-IR') : 'نامشخص'}`,
      `علت خاتمه: ${session.exitReason || 'عادی'}`,
      session.partnerProfileSnippet ? `مشخصات هم‌صحبت: ${session.partnerProfileSnippet}` : '',
      '----------------------------------------',
    ].filter(Boolean);

    (session.transcript || []).forEach((m) => {
      if (filterSystemMessages && m.sender === 'bot_system') return;
      const senderLabel =
        m.sender === 'me_melody'
          ? 'ربات (Gemini)'
          : m.sender === 'operator_manual'
          ? 'اپراتور'
          : m.sender === 'bot_system'
          ? 'سیستم'
          : 'کاربر ناشناس';
      lines.push(`[${senderLabel}]: ${m.text}`);
    });

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedSessionId(session.id);
      setTimeout(() => setCopiedSessionId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm('آیا از پاکسازی تاریخچه مکالمات این دوره اطمینان دارید؟')) {
      return;
    }
    setIsClearing(true);
    try {
      if (onClearHistory) {
        await onClearHistory();
      }
    } finally {
      setIsClearing(false);
    }
  };

  const currentRunIndex = currentTestRun?.runIndex || 1;
  const partnersCount = currentTestRun?.analyticsSummary?.totalPartnersChatted ?? allRecordedSessions.length;
  const partnerMessagesCount = currentTestRun?.analyticsSummary?.totalPartnerMessagesReceived ?? config?.stats?.totalRepliesFromStrangers ?? 0;
  const aiRepliesCount = currentTestRun?.analyticsSummary?.totalAiRepliesSent ?? 0;
  const avgTurns = currentTestRun?.analyticsSummary?.averageTurnsPerPartner ?? (partnersCount > 0 ? Number(((partnerMessagesCount + aiRepliesCount) / partnersCount).toFixed(2)) : 0);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP LIVE SESSION STATUS HEADER */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-white">جلسه چت فعال:</span>
            {getStatusBadge(activeSession?.status)}
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30">
              دوره ارزیابی پرامپت #{currentRunIndex}
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
            <span>
              ربات: <strong className="text-slate-200">@{config?.bots.find((b) => b.id === config.selectedBotId)?.botUsername?.replace('@', '') || 'تنظیم نشده'}</strong>
            </span>
            <span>•</span>
            <span>
              پیام‌های رد و بدل شده در این چت: <strong className="text-emerald-400">{activeSession?.messagesCount || 0}</strong> از{' '}
              {config?.instructions.maxMessagesPerChat || 4}
            </span>
            {activeSession?.partnerTag && (
              <>
                <span>•</span>
                <span>
                  تگ هم‌صحبت: <strong className="text-sky-300">{activeSession.partnerTag}</strong>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onNextStranger}
            disabled={!config?.isActive}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 disabled:opacity-40 text-violet-300 border border-violet-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            title="خروج از چت فعلی و شروع مکالمه با کاربر ناشناس بعدی"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>خروج و اتصال به نفر بعدی</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED PROMPT EVALUATION & CLEAN JSON EXPORT TOOLBAR */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-violet-950/50 via-slate-900 to-indigo-950/50 p-4 sm:p-5 rounded-2xl border border-violet-500/40 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center font-bold shadow-lg shadow-violet-900/40 flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base text-white">
                  ارزیابی و بهینه‌سازی عملکرد دستورالعمل هوش مصنوعی (Prompt Performance)
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  دوره شماره #{currentRunIndex}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                با هر بار کلیک روی «شروع چت با ناشناس»، تمام مکالمات به صورت تفکیک‌شده با هر مخاطب از صفر ضبط می‌شوند. خروجی JSON فقط شامل دستورالعمل فعال و دیالوگ‌های خالص است و پیام‌های سیستمی و دکمه‌های ربات کاملاً فیلتر شده‌اند.
              </p>
            </div>
          </div>

          {/* Quick Metrics of Active Run */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-center flex-shrink-0">
            <div className="px-2">
              <div className="text-[10px] text-slate-400">مخاطبان تفکیک‌شده</div>
              <div className="text-xs font-bold text-white mt-0.5">{partnersCount} کاربر</div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400">پیام کاربر ناشناس</div>
              <div className="text-xs font-bold text-sky-400 mt-0.5">{partnerMessagesCount} پیام</div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400">پاسخ هوش مصنوعی</div>
              <div className="text-xs font-bold text-violet-400 mt-0.5">{aiRepliesCount} پیام</div>
            </div>
            <div className="px-2 border-r border-slate-800">
              <div className="text-[10px] text-slate-400">میانگین رفت‌وبرگشت</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{avgTurns}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary JSON Clean Export (Recommended by User) */}
            <button
              id="download-clean-prompt-json-btn"
              type="button"
              onClick={() => handleDownloadReport('json')}
              disabled={isDownloading || partnersCount === 0}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
              title="دانلود فایل ساختاریافته JSON تفکیک‌شده برای تحلیل در ChatGPT یا Gemini"
            >
              <FileCode className="w-4 h-4 text-emerald-200" />
              <span>دانلود خروجی تحلیلی JSON (بدون پیام‌های سیستمی)</span>
            </button>

            {/* Quick Copy Clean JSON */}
            <button
              type="button"
              onClick={handleCopyJson}
              disabled={partnersCount === 0}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="کپی مستقیم دیتای JSON در کلیپ‌بورد جهت الصاق فوری در هوش مصنوعی"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">JSON کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>کپی JSON</span>
                </>
              )}
            </button>

            {/* Preview JSON Modal */}
            <button
              type="button"
              onClick={handlePreviewJson}
              disabled={partnersCount === 0}
              className="px-3.5 py-2.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 disabled:opacity-40 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="مشاهده ساختار داده‌های JSON بدون نیاز به باز کردن فایل"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>پیش‌نمایش JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Switch */}
            <button
              type="button"
              onClick={() => setFilterSystemMessages(!filterSystemMessages)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                filterSystemMessages
                  ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{filterSystemMessages ? 'پیام‌های سیستمی مخفی است ✓' : 'نمایش تمام پیام‌ها'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LIVE CHAT WINDOW */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 h-[380px] overflow-y-auto space-y-3 flex flex-col justify-between shadow-inner">
        {activeSession && activeSession.transcript && activeSession.transcript.length > 0 ? (
          <div className="space-y-3 overflow-y-auto pr-1">
            {activeSession.transcript
              .filter((m) => !filterSystemMessages || m.sender !== 'bot_system')
              .map((msg, idx) => {
                const isMe = msg.sender === 'me_melody' || msg.sender === 'operator_manual';
                const isSystem = msg.sender === 'bot_system';

                if (isSystem) {
                  return (
                    <div key={idx} className="flex justify-center my-2">
                      <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                        <Bot className="w-3 h-3 text-violet-400" />
                        <span>{msg.text}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${isMe ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isMe
                          ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isMe ? <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" /> : <User className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                        isMe
                          ? msg.text.startsWith('[🖼')
                            ? 'bg-gradient-to-br from-fuchsia-950/80 to-slate-900 text-white border border-fuchsia-800/40 rounded-tl-none shadow-md'
                            : 'bg-slate-900 text-white border border-slate-800 rounded-tl-none'
                          : 'bg-slate-800 text-slate-100 rounded-tr-none'
                      }`}
                    >
                      {msg.text.startsWith('[🖼') && (
                        <div className="flex items-center gap-1 text-[10px] text-fuchsia-300 font-bold mb-1">
                          <span>📸 ارسال عکس و بنر تبلیغاتی محصول چت ناشناس</span>
                        </div>
                      )}
                      <div className="font-semibold whitespace-pre-wrap">{msg.text}</div>
                      <div className="text-[9px] text-slate-500 text-left pt-0.5">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('fa-IR') : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <MessageCircle className="w-10 h-10 opacity-40 text-slate-600" />
            <p className="text-xs">هنوز هیچ مکالمه فعالی شروع نشده است.</p>
            <p className="text-[11px] text-slate-600">
              دکمه «شروع چت با ناشناس‌ها» را از بالای صفحه بزنید تا ربات طبق پرامپت فعال با مخاطبان گفتگو کند.
            </p>
          </div>
        )}
      </div>

      {/* Manual Message Input */}
      <form onSubmit={handleSendManual} className="flex items-center gap-2">
        <input
          type="text"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="ارسال پیام دستی توسط اپراتور در این چت زنده..."
          disabled={!activeSession || activeSession.status !== 'chatting'}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 disabled:opacity-50 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!manualText.trim() || isSending || !activeSession || activeSession.status !== 'chatting'}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>ارسال دستی</span>
        </button>
      </form>

      {/* ========================================================================= */}
      {/* 4. SEPARATED PARTNER CONVERSATIONS ARCHIVE */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">
                🗂 مکالمات تفکیک‌شده این دوره ({allRecordedSessions.length} هم‌صحبت)
              </h4>
              <p className="text-[11px] text-slate-400">
                مشاهده دیالوگ‌های خالص به تفکیک هر کاربر تا زمان توقف اتوماسیون
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allRecordedSessions.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllHistory}
                disabled={isClearing}
                className="px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-300 border border-rose-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="پاک کردن تمامی تاریخچه مکالمات ذخیره شده"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>پاکسازی آرشیو این دوره</span>
              </button>
            )}
          </div>
        </div>

        {allRecordedSessions.length === 0 ? (
          <div className="p-6 text-center text-slate-500 space-y-1 bg-slate-900/40 rounded-xl border border-slate-800/60">
            <Info className="w-6 h-6 mx-auto opacity-40 mb-2 text-slate-400" />
            <div className="text-xs text-slate-300 font-medium">هنوز مکالمه‌ای در دوره جاری ضبط نشده است.</div>
            <div className="text-[11px] text-slate-500">
              با زدن دکمه «شروع چت با ناشناس‌ها»، هر مکالمه به صورت تفکیک‌شده ثبت می‌شود و با دکمه «توقف» پرونده این دوره بسته خواهد شد.
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {allRecordedSessions.map((session, idx) => {
              const isExpanded = expandedSessionId === session.id;
              const isCopied = copiedSessionId === session.id;
              const partnerNumber = session.sessionIndex || allRecordedSessions.length - idx;
              const isActiveNow = activeSession?.id === session.id && activeSession?.status === 'chatting';

              const cleanTranscript = (session.transcript || []).filter(
                (m) => !filterSystemMessages || m.sender !== 'bot_system'
              );

              return (
                <div
                  key={session.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isActiveNow
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Session Header Bar */}
                  <div
                    onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer select-none gap-2"
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isActiveNow
                            ? 'bg-emerald-500 text-slate-950 font-black animate-pulse'
                            : 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        }`}
                      >
                        #{partnerNumber}
                      </div>

                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>کاربر ناشناس شماره {partnerNumber}</span>
                        {isActiveNow && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            در حال گفتگو
                          </span>
                        )}
                        {session.partnerTag && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {session.partnerTag}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>
                          {session.startedAt ? new Date(session.startedAt).toLocaleTimeString('fa-IR') : ''}
                        </span>
                        <span>•</span>
                        <span>
                          {session.aiMessagesCount || 0} پیام بات / {session.strangerMessagesCount || 0} پیام کاربر
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopySingleSession(session);
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center gap-1 border border-slate-700 cursor-pointer"
                        title="کپی متن مکالمه این کاربر"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>

                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Dialogue Transcript */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
                      {session.partnerProfileSnippet && (
                        <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-sky-200">
                          <strong className="text-sky-400 font-bold">مشخصات هم‌صحبت:</strong>{' '}
                          {session.partnerProfileSnippet}
                        </div>
                      )}

                      {cleanTranscript.length === 0 ? (
                        <div className="text-xs text-slate-500 py-2 text-center">
                          (پیام متنی خالص رد و بدل نشد)
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {cleanTranscript.map((m, mIdx) => {
                            const isMe = m.sender === 'me_melody' || m.sender === 'operator_manual';
                            return (
                              <div
                                key={mIdx}
                                className={`p-2.5 rounded-xl text-xs space-y-1 ${
                                  isMe
                                    ? 'bg-violet-950/30 border border-violet-800/30 text-violet-100 ml-4'
                                    : 'bg-slate-900 border border-slate-800 text-slate-100 mr-4'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                  <span>
                                    {isMe
                                      ? '🤖 هوش مصنوعی (Gemini)'
                                      : '👤 کاربر ناشناس'}
                                  </span>
                                  <span>
                                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString('fa-IR') : ''}
                                  </span>
                                </div>
                                <div className="whitespace-pre-wrap font-medium">{m.text}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. JSON PREVIEW MODAL */}
      {/* ========================================================================= */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  پیش‌نمایش خروجی ساختاریافته JSON (ارزیابی پرامپت چت ناشناس)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'کپی شد!' : 'کپی کل JSON'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-slate-950/90 font-mono text-xs text-emerald-300 leading-relaxed dir-ltr text-left">
              <pre>{jsonModalContent}</pre>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                این فایل آماده ارسال مستقیم به ChatGPT یا Google AI Studio برای مهندسی و بهینه‌سازی پرامپت است.
              </span>
              <button
                type="button"
                onClick={() => handleDownloadReport('json')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>دانلود فایل (.JSON)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
