import React, { useMemo, useState } from 'react';
import {
  AnonymousChatAutomatorConfig,
  AnonymousChatSession,
  AnonymousPromptTestRun,
  ConversationState,
  Intent,
  PromotionLevel,
} from '../../types';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Clock,
  ArrowUpRight,
  MessageSquare,
  Bot,
  Percent,
  Layers,
  Award,
  AlertCircle,
  Zap,
  BarChart3,
  CheckCircle2,
  Filter,
  History,
  Calendar,
  ChevronRight,
  ArrowRightLeft,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  AnalyticsTracker,
  AnalyticsEventName,
  AnalyticsObjectionCategory,
  FunnelStage,
  Step7AnalyticsReport,
} from '../../analytics';

interface AnonymousAnalyticsTabProps {
  config?: AnonymousChatAutomatorConfig;
  history?: AnonymousChatSession[];
  activeSession?: AnonymousChatSession;
  currentTestRun?: AnonymousPromptTestRun | null;
  previousTestRuns?: AnonymousPromptTestRun[];
}

export const AnonymousAnalyticsTab: React.FC<AnonymousAnalyticsTabProps> = ({
  config,
  history = [],
  activeSession,
  currentTestRun,
  previousTestRuns = [],
}) => {
  const [selectedRunId, setSelectedRunId] = useState<string>('current');
  const [activeAnalyticsSubTab, setActiveAnalyticsSubTab] = useState<
    'funnel' | 'leads' | 'objections' | 'promotions' | 'compare'
  >('funnel');

  // Build the list of all available runs for selection
  const allRunsList = useMemo(() => {
    const runs: Array<{
      id: string;
      label: string;
      subLabel: string;
      runIndex: number;
      startedAt: string;
      endedAt?: string;
      isCurrent: boolean;
      botName: string;
      promptSnippet: string;
      sessionsCount: number;
      conversionRate: number;
      rawRun?: AnonymousPromptTestRun | null;
    }> = [];

    // 1. Current / Active Run
    const currentRunIdx = currentTestRun?.runIndex || (previousTestRuns.length + 1);
    const activeSessionsCount = history.length + (activeSession && activeSession.transcript?.length ? 1 : 0);
    const currentInquiries = history.filter((s) => s.inquiryDetected).length;
    const currentPitches = history.filter((s) => s.promoSent).length;
    const currentConvRate = currentPitches > 0
      ? Number(((currentInquiries / currentPitches) * 100).toFixed(1))
      : (activeSessionsCount > 0 ? Number(((currentInquiries / activeSessionsCount) * 100).toFixed(1)) : 0);

    runs.push({
      id: 'current',
      label: `راند #${currentRunIdx} (اجرای جاری / آخرین)`,
      subLabel: currentTestRun?.status === 'running' ? 'در حال اجرا (Live)' : 'آخرین اجرای ثبت‌شده',
      runIndex: currentRunIdx,
      startedAt: currentTestRun?.startedAt || config?.currentRunStartedAt || new Date().toISOString(),
      isCurrent: true,
      botName: currentTestRun?.botProfile?.name || config?.bots?.find((b) => b.id === config?.selectedBotId)?.name || 'ربات ناشناس',
      promptSnippet: (currentTestRun?.aiInstructionsAndContext?.systemPrompt || config?.instructions?.systemPrompt || '').slice(0, 70),
      sessionsCount: activeSessionsCount,
      conversionRate: currentConvRate,
      rawRun: currentTestRun,
    });

    // 2. Previous Archived Runs
    previousTestRuns.forEach((run) => {
      const pastSessionsCount = run.sessions?.length || run.conversationsByPartner?.length || run.analyticsSummary?.totalPartnersChatted || 0;
      const pastPitches = run.analyticsSummary?.totalPromoSent || 0;
      const pastInquiries = run.analyticsSummary?.totalInquiriesAfterPromo || 0;
      const pastConv = run.analyticsSummary?.conversionRatePercent ??
        (pastPitches > 0 ? Number(((pastInquiries / pastPitches) * 100).toFixed(1)) : 0);

      runs.push({
        id: run.id,
        label: `راند #${run.runIndex} (${new Date(run.startedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })})`,
        subLabel: `${pastSessionsCount} مکالمه | تبدیل: ${pastConv}%`,
        runIndex: run.runIndex,
        startedAt: run.startedAt,
        endedAt: run.endedAt,
        isCurrent: false,
        botName: run.botProfile?.name || 'ربات ناشناس',
        promptSnippet: (run.aiInstructionsAndContext?.systemPrompt || '').slice(0, 70),
        sessionsCount: pastSessionsCount,
        conversionRate: pastConv,
        rawRun: run,
      });
    });

    return runs;
  }, [currentTestRun, previousTestRuns, history, activeSession, config]);

  // Selected Run Object
  const currentSelectedRunMeta = allRunsList.find((r) => r.id === selectedRunId) || allRunsList[0];

  // Resolve Sessions Strictly Belonging to the Selected Run
  const resolvedSessions: AnonymousChatSession[] = useMemo(() => {
    if (selectedRunId === 'all') {
      // All runs aggregated
      const all: AnonymousChatSession[] = [];
      if (activeSession && activeSession.transcript && activeSession.transcript.length > 0) {
        all.push(activeSession);
      }
      history.forEach((h) => {
        if (!all.some((s) => s.id === h.id)) all.push(h);
      });
      previousTestRuns.forEach((pr) => {
        if (pr.sessions) {
          pr.sessions.forEach((s) => {
            if (!all.some((x) => x.id === s.id)) all.push(s);
          });
        }
      });
      return all;
    }

    if (selectedRunId === 'current') {
      const currentList: AnonymousChatSession[] = [];
      if (activeSession && activeSession.transcript && activeSession.transcript.length > 0) {
        currentList.push(activeSession);
      }
      history.forEach((h) => {
        if (!currentList.some((s) => s.id === h.id)) currentList.push(h);
      });
      if (currentTestRun?.sessions) {
        currentTestRun.sessions.forEach((s) => {
          if (!currentList.some((x) => x.id === s.id)) currentList.push(s);
        });
      }
      return currentList;
    }

    // Specific Previous Run
    const matchedPrevRun = previousTestRuns.find((r) => r.id === selectedRunId);
    if (matchedPrevRun) {
      if (matchedPrevRun.sessions && matchedPrevRun.sessions.length > 0) {
        return matchedPrevRun.sessions;
      }
      // Synthesize session objects from conversationsByPartner if raw sessions were not archived
      if (matchedPrevRun.conversationsByPartner && matchedPrevRun.conversationsByPartner.length > 0) {
        return matchedPrevRun.conversationsByPartner.map((c, idx) => ({
          id: c.sessionId || `session_prev_${matchedPrevRun.runIndex}_${idx}`,
          sessionIndex: c.partnerNumber,
          botId: matchedPrevRun.botProfile.id,
          botUsername: matchedPrevRun.botProfile.botUsername,
          botName: matchedPrevRun.botProfile.name,
          accountId: 'archived',
          accountPhone: 'archived',
          partnerTag: c.partnerTag,
          partnerProfileSnippet: c.partnerProfile,
          status: 'ended' as const,
          startedAt: c.startedAt,
          endedAt: c.endedAt,
          messagesCount: (c.messagesCount.partner || 0) + (c.messagesCount.aiBot || 0),
          strangerMessagesCount: c.messagesCount.partner || 0,
          aiMessagesCount: c.messagesCount.aiBot || 0,
          promoSent: c.dialogue?.some((d) => d.text.includes('فیلترشکن') || d.text.includes('سرویس') || d.text.includes('اکانت') || d.text.includes('تصویر بنر')),
          inquiryDetected: c.dialogue?.some((d) => d.role === 'user' && /(قیمت|چنده|تست|خرید|تعرفه|اکانت|سرویس)/i.test(d.text)),
          inquirySnippet: c.dialogue?.find((d) => d.role === 'user' && /(قیمت|چنده|تست|خرید|تعرفه|اکانت|سرویس)/i.test(d.text))?.text,
          transcript: (c.dialogue || []).map((d, dIdx) => ({
            id: `msg_conv_${dIdx}`,
            sender: d.role === 'user' ? 'stranger' : 'me_melody',
            text: d.text,
            timestamp: d.timestamp,
          })),
        }));
      }
    }

    return [];
  }, [selectedRunId, history, activeSession, currentTestRun, previousTestRuns]);

  // Real, Exact Per-Round Metrics Derived from Resolved Sessions
  const totalChats = resolvedSessions.length;
  let totalReplies = 0;
  let totalPitches = 0;
  let totalInquiries = 0;
  let totalSpamSkipped = 0;

  resolvedSessions.forEach((s) => {
    const strangerMsgs = s.strangerMessagesCount ||
      (s.transcript ? s.transcript.filter((m) => m.sender === 'stranger').length : 0);
    totalReplies += strangerMsgs;

    if (s.promoSent || (s.transcript && s.transcript.some((m) => m.sender === 'me_melody' && (m.text.includes('تصویر بنر') || m.text.includes('فیلترشکن'))))) {
      totalPitches++;
    }

    if (s.inquiryDetected || (s.transcript && s.transcript.some((m) => m.sender === 'stranger' && /(قیمت|چنده|چند|تست|خرید|تعرفه|اکانت|سرویس|vpn|وی پی ان)/i.test(m.text)))) {
      totalInquiries++;
    }

    if (s.isSpamBot || s.exitReason === 'spam_bot_skipped') {
      totalSpamSkipped++;
    }
  });

  // Pitch Conversion Rate (Inquiries / Pitches)
  const conversionRate = totalPitches > 0
    ? ((totalInquiries / totalPitches) * 100).toFixed(1)
    : (totalChats > 0 ? ((totalInquiries / totalChats) * 100).toFixed(1) : '0.0');

  // Overall Conversion Rate (Inquiries / Total Chats)
  const overallConversionRate = totalChats > 0
    ? ((totalInquiries / totalChats) * 100).toFixed(1)
    : '0.0';

  // Average stranger replies per chat
  const avgRepliesPerChat = totalChats > 0
    ? (totalReplies / totalChats).toFixed(1)
    : '0.0';

  // Step 7 Analytics Report generation from the strictly scoped sessions
  const analyticsReport: Step7AnalyticsReport = useMemo(() => {
    const tracker = new AnalyticsTracker();

    if (resolvedSessions.length === 0) {
      return tracker.generateReport();
    }

    for (const session of resolvedSessions) {
      const sessId = session.id;
      const startTime = session.startedAt || new Date().toISOString();

      tracker.trackEvent({
        eventName: AnalyticsEventName.SESSION_STARTED,
        timestamp: startTime,
        sessionId: sessId,
        previousState: ConversationState.CONNECTING,
        currentState: session.conversationState || ConversationState.INITIAL_GREETING,
        detectedIntent: session.lastIntent || Intent.GREETING,
        leadScore: session.leadScore || 0,
        metadata: {
          turnCount: 1,
          botUsername: session.botUsername,
        },
      });

      if (session.transcript && session.transcript.length > 0) {
        let currentTurn = 1;
        for (const msg of session.transcript) {
          if (msg.sender === 'stranger') {
            const hasInquiry = /(قیمت|چنده|چند|تست|خرید|تعرفه|اکانت|سرویس|vpn|وی پی ان)/i.test(msg.text);
            const detectedIntent = hasInquiry ? Intent.PRICE_REQUEST : (session.lastIntent || Intent.QUESTION);
            const leadScore = hasInquiry ? 80 : (session.leadScore || (currentTurn > 2 ? 35 : 15));

            tracker.trackEvent({
              eventName: AnalyticsEventName.MESSAGE_RECEIVED,
              timestamp: msg.timestamp || startTime,
              sessionId: sessId,
              previousState: session.previousState || ConversationState.INITIAL_GREETING,
              currentState: hasInquiry ? ConversationState.PRICE_DISCUSSION : (session.conversationState || ConversationState.ENGAGED),
              detectedIntent,
              leadScore,
              metadata: {
                turnCount: currentTurn,
                userMessage: msg.text,
              },
            });
            currentTurn++;
          }
        }
      }

      if (session.promoSent || session.lastPromotionTurn) {
        tracker.trackEvent({
          eventName: AnalyticsEventName.CTA_SHOWN,
          timestamp: session.endedAt || startTime,
          sessionId: sessId,
          previousState: session.previousState || ConversationState.ENGAGED,
          currentState: session.conversationState || ConversationState.PRODUCT_INTEREST,
          detectedIntent: session.lastIntent || Intent.PRODUCT_CURIOUS,
          leadScore: session.leadScore || 50,
          metadata: {
            promotionLevel: session.promotionLevel || PromotionLevel.DIRECT_OFFER,
            turnCount: session.lastPromotionTurn || 2,
            ctaShown: true,
          },
        });
      }

      if (session.inquiryDetected || session.conversationState === ConversationState.SUPPORT_HANDOFF) {
        tracker.trackEvent({
          eventName: AnalyticsEventName.CTA_ACCEPTED,
          timestamp: session.endedAt || startTime,
          sessionId: sessId,
          previousState: session.conversationState || ConversationState.PRODUCT_INTEREST,
          currentState: ConversationState.SUPPORT_HANDOFF,
          detectedIntent: Intent.PURCHASE_INTENT,
          leadScore: Math.max(session.leadScore || 0, 85),
          metadata: {
            ctaAccepted: true,
            inquirySnippet: session.inquirySnippet,
          },
        });

        tracker.trackConversion(
          sessId,
          ConversationState.SUPPORT_HANDOFF,
          Intent.PURCHASE_INTENT,
          Math.max(session.leadScore || 0, 85),
          { inquirySnippet: session.inquirySnippet }
        );
      }

      if (session.objectionsCount && session.objectionsCount > 0) {
        tracker.trackEvent({
          eventName: AnalyticsEventName.OBJECTION_DETECTED,
          timestamp: startTime,
          sessionId: sessId,
          previousState: ConversationState.PRODUCT_INTEREST,
          currentState: ConversationState.OBJECTION_HANDLING,
          detectedIntent: Intent.OBJECTION,
          leadScore: session.leadScore || 30,
          metadata: {
            objectionCategory: session.conversationContext?.lastObjectionCategory || AnalyticsObjectionCategory.PRICE,
          },
        });
      }

      if (session.rejectionsCount && session.rejectionsCount > 0) {
        tracker.trackEvent({
          eventName: AnalyticsEventName.REJECTION_DETECTED,
          timestamp: startTime,
          sessionId: sessId,
          previousState: ConversationState.PRODUCT_INTEREST,
          currentState: ConversationState.REJECTED,
          detectedIntent: Intent.REJECTION,
          leadScore: 0,
          metadata: { isPromotionLocked: true },
        });
      }
    }

    return tracker.generateReport();
  }, [resolvedSessions]);

  // Extract Inquiries strictly belonging to the resolved sessions
  const inquiriesList = useMemo(() => {
    const list: Array<{
      id: string;
      partnerSummary: string;
      questionSnippet: string;
      timestamp: string;
      leadScore: number;
    }> = [];

    resolvedSessions.forEach((s) => {
      let inquiryText = s.inquirySnippet;
      if (!inquiryText && s.transcript) {
        const matchingMsg = s.transcript.find(
          (m) => m.sender === 'stranger' && /(قیمت|چنده|چند|تست|خرید|تعرفه|اکانت|سرویس|vpn|وی پی ان)/i.test(m.text)
        );
        if (matchingMsg) inquiryText = matchingMsg.text;
      }

      if (s.inquiryDetected || inquiryText) {
        list.push({
          id: s.id,
          partnerSummary: s.partnerProfileSnippet || s.partnerTag || `هم‌صحبت جلسه #${s.sessionIndex || 1}`,
          questionSnippet: inquiryText || 'ابراز علاقه و درخواست راهنمایی برای خرید سرویس',
          timestamp: s.endedAt || s.startedAt || new Date().toISOString(),
          leadScore: s.leadScore || 80,
        });
      }
    });

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [resolvedSessions]);

  const funnel = analyticsReport.funnelMetrics.funnelReport;
  const leadInsights = analyticsReport.leadMetrics.insights;
  const objectionReport = analyticsReport.objectionMetrics.objectionReport;
  const promoReport = analyticsReport.promotionMetrics.promotionReport;

  return (
    <div className="space-y-4 p-2 sm:p-4">
      {/* 1. RUN SELECTION & ITERATION SCOPING HEADER */}
      <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold border border-violet-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">آمار و نرخ تبدیل چت ناشناس</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-700/60 font-mono font-bold">
                  تحلیل تفکیک‌شده به ازای هر راند
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                مشاهده عملکرد دقیق بات در هر راند و سنجش تغییرات پرامپت و سناریو
              </p>
            </div>
          </div>

          {/* Run Selector Dropdown / Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded-xl p-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <span className="text-[11px] text-slate-400 font-medium ml-1">انتخاب راند:</span>
              <select
                value={selectedRunId}
                onChange={(e) => setSelectedRunId(e.target.value)}
                className="bg-slate-950 text-white text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-violet-500"
              >
                {allRunsList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} ({r.sessionsCount} چت - تبدیل {r.conversionRate}%)
                  </option>
                ))}
                {previousTestRuns.length > 0 && (
                  <option value="all">🌐 مجموع تمام راندها ({previousTestRuns.length + 1} دوره)</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Run Banner Details */}
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-violet-600/30 text-violet-300 font-bold border border-violet-500/40 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              <span>{currentSelectedRunMeta.botName}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>شروع: {new Date(currentSelectedRunMeta.startedAt).toLocaleTimeString('fa-IR')}</span>
            </span>
            {currentSelectedRunMeta.promptSnippet && (
              <span className="text-slate-400 text-[11px] max-w-md truncate" title={currentSelectedRunMeta.promptSnippet}>
                پرامپت: «{currentSelectedRunMeta.promptSnippet}...»
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedRunId === 'current' && config?.isActive ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>در حال ثبت لحظه‌ای</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                ثبت شده
              </span>
            )}
            <span className="text-[11px] text-emerald-400 font-mono font-bold">
              {resolvedSessions.length} مکالمه در این راند
            </span>
          </div>
        </div>

        {/* 4 Major KPI Cards strictly scoped to the selected run */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* KPI 1: Total Chats */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>اتصالات این راند</span>
              <Users className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">{totalChats}</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <span>میانگین {avgRepliesPerChat} پاسخ در هر گفتگو</span>
            </div>
          </div>

          {/* KPI 2: Pitches Sent */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>معرفی محصول و بنر</span>
              <ShoppingBag className="w-4 h-4 text-fuchsia-400" />
            </div>
            <div className="text-2xl font-black text-fuchsia-300 font-mono">{totalPitches}</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <span>{totalChats > 0 ? `${((totalPitches / totalChats) * 100).toFixed(0)}%` : '۰%'} کل چت‌ها</span>
            </div>
          </div>

          {/* KPI 3: Inquiries / Conversion Leads */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/40 space-y-1 bg-emerald-950/10">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span className="font-bold text-emerald-300">مشتریان راغب (Leads)</span>
              <HelpCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{totalInquiries}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
              <ArrowUpRight className="w-3 h-3" />
              <span>نرخ تبدیل به معرفی: {conversionRate}%</span>
            </div>
          </div>

          {/* KPI 4: Spam Skipped */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between text-slate-300 text-xs">
              <span className="font-bold text-amber-300">ربات‌های اسپم رد شده</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">{totalSpamSkipped}</div>
            <div className="text-[10px] text-amber-400/80 flex items-center gap-1">
              <span>نرخ تبدیل کل چت‌ها: {overallConversionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tabs for Step 7 Analytics Modules */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveAnalyticsSubTab('funnel')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAnalyticsSubTab === 'funnel'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>قیف تبدیل ۸ مرحله‌ای</span>
        </button>
        <button
          onClick={() => setActiveAnalyticsSubTab('leads')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAnalyticsSubTab === 'leads'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>هوش و امتیازدهی لید (Lead Intelligence)</span>
        </button>
        <button
          onClick={() => setActiveAnalyticsSubTab('objections')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAnalyticsSubTab === 'objections'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>تحلیل اعتراضات (Objections)</span>
        </button>
        <button
          onClick={() => setActiveAnalyticsSubTab('promotions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAnalyticsSubTab === 'promotions'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>اثربخشی آفر و CTA</span>
        </button>
        <button
          onClick={() => setActiveAnalyticsSubTab('compare')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeAnalyticsSubTab === 'compare'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>مقایسه راندها ({previousTestRuns.length + 1} دوره)</span>
        </button>
      </div>

      {/* SUBTAB 1: 8-STAGE FUNNEL */}
      {activeAnalyticsSubTab === 'funnel' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>قیف ۸ مرحله‌ای تبدیل (مربوط به {currentSelectedRunMeta.label})</span>
              </h5>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                نرخ تبدیل کلی این راند: {conversionRate}%
              </span>
            </div>

            {resolvedSessions.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-500 text-xs space-y-1">
                <HelpCircle className="w-6 h-6 mx-auto text-slate-600 mb-2" />
                <div>هنوز داده‌ای در این راند ثبت نشده است.</div>
                <div className="text-[11px] text-slate-600">
                  با آغاز چت با مخاطبان، مراحل پیشروی در قیف به صورت بلادرنگ در اینجا ترسیم می‌شوند.
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {funnel.stages.map((stage) => {
                  const percentageOfTotal =
                    funnel.totalSessions > 0
                      ? ((stage.count / funnel.totalSessions) * 100).toFixed(1)
                      : '0';

                  return (
                    <div key={stage.stageNumber} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold font-mono">
                            {stage.stageNumber}
                          </span>
                          <span className="font-medium">{stage.stageName}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-white font-bold">{stage.count} مورد</span>
                          <span className="text-slate-400">({percentageOfTotal}%)</span>
                          <span className="text-emerald-400">تبدیل: {stage.conversionRateFromPrevious}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Number(percentageOfTotal))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-1">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>خلاصه بازدهی این راند</span>
            </h5>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">نقطه بیشترین ریزش (Drop-off):</div>
                <div className="font-bold text-amber-300 font-mono text-xs">{funnel.biggestDropOffStage || 'نامشخص'}</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">میانگین نوبت تا تبدیل:</div>
                <div className="font-bold text-emerald-300 font-mono text-xs">{funnel.avgTurnsToConversion || 0} نوبت گفتگو</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400">تعداد معرفی‌های ارسالی:</div>
                <div className="font-bold text-fuchsia-300 font-mono text-xs">{totalPitches} مورد</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LEAD INTELLIGENCE */}
      {activeAnalyticsSubTab === 'leads' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-1">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <span>توزیع لیدها در این راند</span>
            </h5>
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-300 font-bold">لیدهای داغ (Hot Leads: 56-100)</span>
                  <span className="font-mono font-bold text-white">{leadInsights.distribution.hot}</span>
                </div>
                <p className="text-[10px] text-rose-400/80">آماده خرید، استعلام قیمت یا تست</p>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold">لیدهای گرم (Warm Leads: 26-55)</span>
                  <span className="font-mono font-bold text-white">{leadInsights.distribution.warm}</span>
                </div>
                <p className="text-[10px] text-amber-400/80">علاقه‌مند به محصول یا دارای نیاز</p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-bold">لیدهای سرد (Cold Leads: 0-25)</span>
                  <span className="font-mono font-bold text-white">{leadInsights.distribution.cold}</span>
                </div>
                <p className="text-[10px] text-slate-500">گفتگوی عمومی یا کوتاه</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>قصد‌های با بالاترین نرخ تبدیل (Top Converting Intents)</span>
            </h5>
            <div className="space-y-2 pt-2">
              {leadInsights.highestConvertingIntents.length === 0 ? (
                <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                  هنوز اطلاعات تبدیل کافی در این راند ثبت نشده است.
                </div>
              ) : (
                leadInsights.highestConvertingIntents.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-mono font-bold text-white">{item.intent}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">{item.conversions} تبدیل از {item.total} مورد</span>
                      <span className="text-emerald-400 font-bold">نرخ تبدیل: {item.conversionRate}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: OBJECTION INTELLIGENCE */}
      {activeAnalyticsSubTab === 'objections' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-1">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>شاخص‌های بازیابی اعتراضات</span>
            </h5>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">تعداد کل اعتراضات این راند:</div>
                <div className="font-bold text-white font-mono text-sm">{objectionReport.totalObjections}</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">نرخ بازیابی موفق (Recovery):</div>
                <div className="font-bold text-emerald-300 font-mono text-sm">{objectionReport.recoverySuccessRate}%</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">تبدیل به خرید پس از اعتراض:</div>
                <div className="font-bold text-sky-300 font-mono text-sm">{objectionReport.objectionToPurchaseConversionRate}%</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-400" />
              <span>تفکیک دسته‌بندی اعتراضات (این راند)</span>
            </h5>
            <div className="space-y-2 pt-2">
              {objectionReport.categoryBreakdown.length === 0 ? (
                <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                  هیچ اعتراضی در مکالمات این راند شناسایی نشد.
                </div>
              ) : (
                objectionReport.categoryBreakdown.map((cat) => (
                  <div
                    key={cat.category}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-violet-300 font-bold">
                        {cat.category}
                      </span>
                      <span className="text-slate-300 font-bold">{cat.count} مورد</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-emerald-400">بازیابی: {cat.recoveryRate}%</span>
                      <span className="text-sky-400">خرید: {cat.conversionRate}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: PROMOTION & CTA PERFORMANCE */}
      {activeAnalyticsSubTab === 'promotions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-1">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-fuchsia-400" />
              <span>اثربخشی CTA در این راند</span>
            </h5>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">کل CTA های ارائه شده:</div>
                <div className="font-bold text-white font-mono text-sm">{promoReport.ctaEffectiveness.shownCount}</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">نرخ پذیرش و پاسخ به CTA:</div>
                <div className="font-bold text-emerald-300 font-mono text-sm">{promoReport.ctaEffectiveness.acceptanceRate}%</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">رعایت گاردریل‌های ایمنی:</div>
                <div className="font-bold text-emerald-400 font-mono text-sm">{promoReport.guardrailSafetyComplianceRate}%</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>انواع CTA بر اساس بهترین بازدهی (این راند)</span>
            </h5>
            <div className="space-y-2 pt-2">
              {promoReport.bestPerformingCTATypes.length === 0 ? (
                <div className="p-6 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
                  هنوز آمار کافی از ارسال CTA در این راند موجود نیست.
                </div>
              ) : (
                promoReport.bestPerformingCTATypes.map((cta, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-400" />
                      <span className="font-mono font-bold text-white">{cta.ctaType}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-400">{cta.acceptedCount} پذیرش از {cta.shownCount} نمایش</span>
                      <span className="text-emerald-400 font-bold">نرخ تبدیل: {cta.conversionRate}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: MULTI-RUN ITERATION COMPARISON TABLE */}
      {activeAnalyticsSubTab === 'compare' && (
        <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-violet-400" />
                <span>جدول مقایسه تحلیلی عملکرد راندها (Prompt Performance Iterations)</span>
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                مقایسه تغییرات نرخ تبدیل و تعامل هم‌صحبت با اعمال هر پرامپت و سناریو
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="p-3">شماره راند</th>
                  <th className="p-3">زمان شروع</th>
                  <th className="p-3">ربات هدف</th>
                  <th className="p-3">تعداد چت</th>
                  <th className="p-3">معرفی ارسالی</th>
                  <th className="p-3">لید موفق (Inquiry)</th>
                  <th className="p-3 text-left">نرخ تبدیل</th>
                  <th className="p-3 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allRunsList.map((run) => {
                  const isSelected = selectedRunId === run.id;
                  return (
                    <tr
                      key={run.id}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        isSelected ? 'bg-violet-950/30' : ''
                      }`}
                    >
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        {run.isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                        <span>راند #{run.runIndex}</span>
                        {run.isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            جاری
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">
                        {new Date(run.startedAt).toLocaleTimeString('fa-IR')}
                      </td>
                      <td className="p-3 text-slate-300">{run.botName}</td>
                      <td className="p-3 font-mono font-bold text-white">{run.sessionsCount}</td>
                      <td className="p-3 font-mono text-fuchsia-300">
                        {run.rawRun?.analyticsSummary?.totalPromoSent ??
                          (run.isCurrent ? totalPitches : 0)}
                      </td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">
                        {run.rawRun?.analyticsSummary?.totalInquiriesAfterPromo ??
                          (run.isCurrent ? totalInquiries : 0)}
                      </td>
                      <td className="p-3 text-left font-mono font-bold text-emerald-300">
                        {run.conversionRate}%
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedRunId(run.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            isSelected
                              ? 'bg-violet-600 text-white border-violet-500'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          {isSelected ? 'در حال مشاهده' : 'مشاهده آمار'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. RECENT INQUIRIES & LEADS FOR SELECTED RUN */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h5 className="text-xs font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>سوالات و ابراز علاقه‌های ثبت‌شده در {currentSelectedRunMeta.label}</span>
          </h5>
          <span className="text-[10px] text-slate-400">
            {inquiriesList.length} مورد لید شناسایی‌شده
          </span>
        </div>

        {inquiriesList.length === 0 ? (
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-500 space-y-1">
            <HelpCircle className="w-6 h-6 mx-auto text-slate-600 mb-2" />
            <div>هنوز سوال یا ابراز علاقه‌ای در این راند ثبت نشده است.</div>
            <div className="text-[11px] text-slate-600">
              به محض اینکه مخاطب درباره قیمت، تست رایگان، سرعت یا روش خرید سوال بپرسد، متن و زمان آن در اینجا ثبت می‌شود.
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
            {inquiriesList.map((inquiry, idx) => (
              <div
                key={inquiry.id || idx}
                className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">{inquiry.partnerSummary}</span>
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-mono font-bold">
                      امتیاز لید: {inquiry.leadScore}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px] font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(inquiry.timestamp).toLocaleTimeString('fa-IR')}</span>
                  </div>
                </div>
                <p className="text-xs text-emerald-200 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/40 font-sans leading-relaxed">
                  «{inquiry.questionSnippet}»
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
