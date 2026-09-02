import React, { useState, useEffect } from 'react';
import {
  ReplayEvaluationReport,
  ConversationTurnTrace,
  ReplayMode,
  GoldConversation,
} from '../../evaluation/evaluationTypes';
import { runFullEvaluation } from '../../evaluation/replayEngine';
import { runAllEvaluationTests, EvalTestSuiteSummary } from '../../evaluation/evaluationTests';
import { GOLD_DATASET } from '../../evaluation/goldDataset';
import {
  exportTracesToCSV,
  exportReportToJSON,
  triggerFileDownload,
} from '../../evaluation/exportUtils';
import {
  Play,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  FileSpreadsheet,
  FileCode,
  ArrowRight,
  Target,
  BarChart3,
  GitCommit,
  Flame,
  HelpCircle,
  Info,
} from 'lucide-react';

export const AnonymousEvaluationTab: React.FC = () => {
  const [report, setReport] = useState<ReplayEvaluationReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSED' | 'FAILED' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'intent_matrix' | 'states_promotions' | 'regression' | 'trace_inspector' | 'test_runner'
  >('overview');

  const [testSummary, setTestSummary] = useState<EvalTestSuiteSummary | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [replayMode, setReplayMode] = useState<ReplayMode>(ReplayMode.DETERMINISTIC_REPLAY);

  // Auto-run evaluation once on initial load
  useEffect(() => {
    handleRunReplay();
  }, []);

  const handleRunReplay = async () => {
    setIsLoading(true);
    try {
      // Try API first, fallback to client-side deterministic replay engine
      const res = await fetch('/api/evaluation/run-replay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: replayMode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.report) {
          setReport(data.report);
          if (data.report.allTraces?.length > 0) {
            setExpandedConvId(data.report.allTraces[0].conversationId);
          }
          return;
        }
      }
      // Fallback
      const clientReport = await runFullEvaluation(GOLD_DATASET, replayMode);
      setReport(clientReport);
      if (clientReport.allTraces?.length > 0) {
        setExpandedConvId(clientReport.allTraces[0].conversationId);
      }
    } catch (err) {
      console.warn('Backend evaluation failed, running client-side replay:', err);
      const clientReport = await runFullEvaluation(GOLD_DATASET, replayMode);
      setReport(clientReport);
      if (clientReport.allTraces?.length > 0) {
        setExpandedConvId(clientReport.allTraces[0].conversationId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunUnitTests = async () => {
    setIsRunningTests(true);
    try {
      const summary = await runAllEvaluationTests();
      setTestSummary(summary);
    } catch (err) {
      console.error('Failed to run unit tests:', err);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!report) return;
    const csv = exportTracesToCSV(report.allTraces || []);
    triggerFileDownload(
      csv,
      `conversation_replay_traces_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  const handleDownloadJSON = () => {
    if (!report) return;
    const json = exportReportToJSON(report);
    triggerFileDownload(
      json,
      `evaluation_full_report_${new Date().toISOString().slice(0, 10)}.json`,
      'application/json;charset=utf-8;'
    );
  };

  // Filter conversations
  const filteredConversations = GOLD_DATASET.filter((conv) => {
    if (selectedCategory !== 'ALL' && conv.category !== selectedCategory) {
      return false;
    }
    const traces = report?.tracesByConversation[conv.conversationId] || [];
    if (statusFilter === 'FAILED') {
      const hasFailed = traces.some((t) => t.evaluationStatus === 'FAILED');
      if (!hasFailed) return false;
    }
    if (statusFilter === 'CRITICAL') {
      const hasCritical = traces.some((t) => t.criticalErrors.length > 0);
      if (!hasCritical) return false;
    }
    if (statusFilter === 'PASSED') {
      const allPassed = traces.every((t) => t.evaluationStatus === 'PASSED');
      if (!allPassed) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMeta =
        conv.conversationId.toLowerCase().includes(q) ||
        (conv.categoryTitleFa || conv.title || '').toLowerCase().includes(q) ||
        conv.description.toLowerCase().includes(q);
      const matchMsg = conv.turns.some((t) => t.userMessage.toLowerCase().includes(q));
      if (!matchMeta && !matchMsg) return false;
    }
    return true;
  });

  const categories = [
    { key: 'ALL', label: 'همه دسته‌ها' },
    { key: 'SUCCESSFUL_HIGH_INTENT', label: 'خرید قطعی / نیت بالا' },
    { key: 'NEAR_CONVERSION_HESITANT', label: 'نزدیک به تبدیل / مردد' },
    { key: 'SOFT_NEED_DETECTION', label: 'طرح نیاز غیرمستقیم' },
    { key: 'EARLY_EXPLICIT_REJECTION', label: 'رد زودهنگام / صریح' },
    { key: 'LATE_REJECTION', label: 'رد پس از معرفی' },
    { key: 'OBJECTION_PRICE_TRUST', label: 'اعتراض به قیمت و اعتماد' },
    { key: 'BOT_SUSPICION_TEST', label: 'تست شک به ربات' },
    { key: 'SMALL_TALK_NO_NEED', label: 'چت روزمره بدون نیاز' },
    { key: 'INAPPROPRIATE_OR_SPAM', label: 'اسپم و توهین' },
    { key: 'LONG_MULTI_TURN', label: 'مکالمات طولانی' },
    { key: 'SHORT_FAST_EXIT', label: 'مکالمات بسیار کوتاه' },
  ];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Header & Actions Bar */}
      <div className="bg-slate-900/90 border border-violet-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>سامانه ارزیابی و بازپخش مکالمات (Replay & Evaluation Engine)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 font-mono">
                    گام ۵
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ارزیابی آفلاین و ایزوله روی دیتاست طلایی ({GOLD_DATASET.length} مکالمه، {report?.datasetSummary?.totalTurns || 200}+ دور چت)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRunReplay}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <RotateCcw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>{isLoading ? 'در حال بازپخش...' : 'اجرای بازپخش جامع (Replay)'}</span>
            </button>

            <button
              onClick={handleRunUnitTests}
              disabled={isRunningTests}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>اجرای تست‌های اعتبارسنجی (Tests)</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={!report}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
              title="دانلود تریس‌های ردگیری به فرمت CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>خروجی CSV</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              disabled={!report}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
              title="دانلود گزارش کامل به فرمت JSON"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>خروجی JSON</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Bar */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-800">
            {/* Status Card */}
            <div
              className={`p-3 rounded-xl border flex flex-col justify-between ${
                report.summaryStatus.readinessStatus === 'READY_FOR_STEP_6'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="text-[10px] text-slate-400 flex items-center justify-between">
                <span>وضعیت آمادگی گام ۶</span>
                {report.summaryStatus.readinessStatus === 'READY_FOR_STEP_6' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
              </div>
              <div className="text-xs font-black mt-1">
                {report.summaryStatus.readinessStatus === 'READY_FOR_STEP_6'
                  ? 'آماده ورود به گام ۶ ✅'
                  : 'نیازمند اصلاح (Blocked) ⚠️'}
              </div>
              <div className="text-[9px] text-slate-400 truncate mt-0.5">
                {report.summaryStatus.readinessNotes[0] || 'تأیید همه شاخص‌ها'}
              </div>
            </div>

            {/* Intent Accuracy */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400">دقت تشخیص نیت (Intent Acc)</div>
              <div className="text-sm font-black text-white mt-1">
                {(report.intentMetrics.overallAccuracy * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-sky-400">
                Macro F1: {report.summaryStatus.intentF1Macro}
              </div>
            </div>

            {/* State Accuracy */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400">دقت انتقال وضعیت (State Acc)</div>
              <div className="text-sm font-black text-white mt-1">
                {(report.stateMetrics.stateAccuracy * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-emerald-400">
                {report.stateMetrics.invalidTransitionCount} خطای انتقال
              </div>
            </div>

            {/* Promotion Error Rate */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400">خطای تبلیغات (Promo Error)</div>
              <div className="text-sm font-black text-emerald-400 mt-1">
                {(report.promotionMetrics.errorRate * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400">
                بیش‌فروشی: {report.promotionMetrics.oversellingCount}
              </div>
            </div>

            {/* Critical Errors */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400">باگ‌های بحرانی (Critical)</div>
              <div
                className={`text-sm font-black mt-1 ${
                  report.summaryStatus.criticalErrorsCount === 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {report.summaryStatus.criticalErrorsCount} <span className="text-[10px] font-normal text-slate-400">مورد</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {report.summaryStatus.criticalErrorsCount === 0 ? 'هدف صفر باگ محقق شد' : 'نیازمند بررسی'}
              </div>
            </div>

            {/* Quality Score */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
              <div className="text-[10px] text-slate-400">نمره کیفی مکالمات (Quality)</div>
              <div className="text-sm font-black text-amber-400 mt-1">
                {report.summaryStatus.overallQualityScore}/100
              </div>
              <div className="text-[10px] text-slate-400">طبیعی‌بودن لحن انسانی</div>
            </div>
          </div>
        )}
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 pt-2 gap-2 overflow-x-auto no-scrollbar rounded-t-xl">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'border-violet-500 text-violet-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>۱. قیف فروش و شاخص‌های بیزینسی (Funnel)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('intent_matrix')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'intent_matrix'
              ? 'border-sky-500 text-sky-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>۲. ماتریس سردرگمی نیت‌ها (Confusion Matrix)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('states_promotions')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'states_promotions'
              ? 'border-emerald-500 text-emerald-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>۳. سلامت استیت و امنیت تبلیغات</span>
        </button>

        <button
          onClick={() => setActiveSubTab('regression')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'regression'
              ? 'border-amber-500 text-amber-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>۴. تحلیل پس‌رفت (Regression vs Baseline)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trace_inspector')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'trace_inspector'
              ? 'border-fuchsia-500 text-fuchsia-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>۵. بازرس مکالمات دور به دور (Turn Inspector)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('test_runner')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'test_runner'
              ? 'border-pink-500 text-pink-300 bg-slate-900 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>۶. آزمون‌های خودکار (Unit Tests)</span>
        </button>
      </div>

      {/* Sub-Tab 1: Funnel & Business Overview */}
      {activeSubTab === 'overview' && report && (
        <div className="space-y-5">
          {/* Conversion Tracking Gap Notice */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-xs text-amber-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300">محدودیت شفاف در رهگیری تبدیل نهایی (Conversion Tracking Gap)</div>
              <p className="mt-1 text-slate-300 leading-relaxed">
                {report.conversationMetrics.conversionTrackingGapNotes}
              </p>
            </div>
          </div>

          {/* Funnel Progress Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span>قیف ریزش مکالمات چت ناشناس (Anonymous Conversion Funnel)</span>
            </h3>

            <div className="space-y-3">
              {report.conversationMetrics.funnel.map((step, idx) => (
                <div key={step.stage} className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="font-bold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                      <span>{step.stageNameFa}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({step.stage})</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-slate-300 font-mono font-bold">
                        {step.count} مکالمه ({step.percentage}%)
                      </span>
                      {idx > 0 && step.dropOffCount > 0 && (
                        <span className="text-rose-400 font-mono text-[10px] bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                          ریزش: {step.dropOffCount} ({step.dropOffRate}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Conversation Timing Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-center">
              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">میانگین طول مکالمه</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {report.conversationMetrics.averageLengthTurns} <span className="text-[10px] font-normal text-slate-400">دور</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">دور تا کشف نیاز</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {report.conversationMetrics.averageTurnsToNeedDetection} <span className="text-[10px] font-normal text-slate-400">دور</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">دور تا معرفی نرم محصول</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {report.conversationMetrics.averageTurnsToProductIntro} <span className="text-[10px] font-normal text-slate-400">دور</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">دور تا اولین دعوت به اقدام (CTA)</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {report.conversationMetrics.averageTurnsToFirstCTA} <span className="text-[10px] font-normal text-slate-400">دور</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Intent Confusion Matrix & Table */}
      {activeSubTab === 'intent_matrix' && report && (
        <div className="space-y-5">
          {/* Matrix Breakdown */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg overflow-x-auto">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              <span>ماتریس سردرگمی نیت‌ها (Confusion Matrix: Expected vs Predicted)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              سطرها = نیت واقعی مورد انتظار (Gold Expected)، ستون‌ها = نیت تشخیص‌داده‌شده توسط سیستم جدید
            </p>

            <div className="min-w-[700px]">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono text-[10px]">
                    <th className="p-2 text-right border border-slate-800">Expected \ Predicted</th>
                    {report.intentMetrics.confusionMatrix.labels.map((label) => (
                      <th key={label} className="p-2 border border-slate-800 font-normal">
                        {label.slice(0, 7)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.intentMetrics.confusionMatrix.labels.map((rowLabel, rIdx) => (
                    <tr key={rowLabel} className="hover:bg-slate-800/40">
                      <td className="p-2 text-right font-mono font-bold text-slate-300 border border-slate-800 text-[10px]">
                        {rowLabel}
                      </td>
                      {report.intentMetrics.confusionMatrix.matrix[rIdx]?.map((val, cIdx) => {
                        const isDiagonal = rIdx === cIdx;
                        let cellBg = 'bg-slate-950/40 text-slate-600';
                        if (val > 0) {
                          if (isDiagonal) {
                            cellBg = 'bg-emerald-900/40 text-emerald-300 font-bold border-emerald-500/30';
                          } else {
                            cellBg = 'bg-rose-900/40 text-rose-300 font-bold border-rose-500/30';
                          }
                        }
                        return (
                          <td
                            key={`${rIdx}-${cIdx}`}
                            className={`p-2 border border-slate-800/80 font-mono ${cellBg}`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Per-Intent Precision / Recall / F1 Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-400" />
              <span>جدول دقت، بازخوانی و F1-Score به تفکیک نیت</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5">نیت (Intent)</th>
                    <th className="p-2.5 text-center">تعداد (Support)</th>
                    <th className="p-2.5 text-center">True Positives</th>
                    <th className="p-2.5 text-center">False Positives</th>
                    <th className="p-2.5 text-center">False Negatives</th>
                    <th className="p-2.5 text-center">Precision</th>
                    <th className="p-2.5 text-center">Recall</th>
                    <th className="p-2.5 text-center">F1 Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {Object.entries(report.intentMetrics.byIntent).map(([intentName, statsData]) => {
                    const stats = statsData as {
                      support: number;
                      truePositives: number;
                      falsePositives: number;
                      falseNegatives: number;
                      precision: number;
                      recall: number;
                      f1: number;
                    };
                    if (stats.support === 0 && stats.falsePositives === 0) return null;
                    return (
                      <tr key={intentName} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-mono font-bold text-slate-200">{intentName}</td>
                        <td className="p-2.5 text-center font-mono text-slate-400">{stats.support}</td>
                        <td className="p-2.5 text-center font-mono text-emerald-400">{stats.truePositives}</td>
                        <td className="p-2.5 text-center font-mono text-rose-400">{stats.falsePositives}</td>
                        <td className="p-2.5 text-center font-mono text-amber-400">{stats.falseNegatives}</td>
                        <td className="p-2.5 text-center font-mono text-sky-300">
                          {(stats.precision * 100).toFixed(1)}%
                        </td>
                        <td className="p-2.5 text-center font-mono text-indigo-300">
                          {(stats.recall * 100).toFixed(1)}%
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-violet-300">
                          {(stats.f1 * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: States & Promotion Safety */}
      {activeSubTab === 'states_promotions' && report && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Promotion Breakdown */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>دسته‌بندی خطاهای سیاست تبلیغات (Promotion Errors)</span>
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(report.promotionMetrics.errorCategoryCounts).map(([cat, count]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
                  >
                    <span className="font-mono text-slate-300">{cat}</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded ${
                        count === 0
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {count} مورد
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* State Transition Errors */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>خطاهای انتقال وضعیت (State Machine Invariants)</span>
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(report.stateMetrics.errorCategoryCounts).map(([cat, count]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800"
                  >
                    <span className="font-mono text-slate-300">{cat}</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded ${
                        count === 0
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {count} مورد
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Bugs Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>خطاهای بحرانی مسدودکننده (Critical Blocking Invariants)</span>
            </h3>

            {report.promotionMetrics.criticalBugs.length === 0 &&
            report.intentMetrics.criticalErrors.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>هیچ باگ بحرانی یا نقض قفل تبلیغات در کل دیتاست مشاهده نشد. تبریک!</span>
              </div>
            ) : (
              <div className="space-y-2">
                {report.promotionMetrics.criticalBugs.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{b.bugId}: {b.description}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {b.conversationId} - دور {b.turnId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">پیام مخاطب: {b.userMessage}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Regression vs Baseline */}
      {activeSubTab === 'regression' && report && (
        <div className="space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>تحلیل مقایسه‌ای و کشف پس‌رفت (Regression vs Historical Baseline)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              مقایسه خروجی معماری جدید (گام ۴ و ۵) با سیستم سنتی بدون State Machine و قفل تبلیغات
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-3">شاخص کلیدی ارزیابی</th>
                    <th className="p-3 text-center">سیستم قدیمی (Baseline)</th>
                    <th className="p-3 text-center">سیستم جدید (Deterministic Engine)</th>
                    <th className="p-3 text-center">تغییرات (Delta)</th>
                    <th className="p-3 text-center">وضعیت</th>
                    <th className="p-3">توضیحات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {report.regressionAnalysis.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-slate-200">{item.metricName}</td>
                      <td className="p-3 text-center font-mono text-slate-400">{item.baselineOldValue}</td>
                      <td className="p-3 text-center font-mono font-bold text-white">{item.newSystemValue}</td>
                      <td className="p-3 text-center font-mono text-emerald-400">{item.delta}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'IMPROVED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : item.status === 'STABLE'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {item.status === 'IMPROVED'
                            ? 'بهبود چشمگیر 🚀'
                            : item.status === 'STABLE'
                            ? 'پایدار'
                            : 'پس‌رفت ⚠️'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Turn-by-Turn Trace Inspector */}
      {activeSubTab === 'trace_inspector' && report && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                <option value="ALL">همه وضعیت‌ها</option>
                <option value="PASSED">فقط بدون خطا (Passed)</option>
                <option value="FAILED">فقط دارای عدم تطابق (Failed)</option>
                <option value="CRITICAL">فقط باگ‌های بحرانی (Critical)</option>
              </select>
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در پیام، شناسه یا توضیحات..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pl-8 text-xs text-slate-200 placeholder-slate-500 outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Conversations Accordion */}
          <div className="space-y-3">
            {filteredConversations.map((conv) => {
              const traces = report.tracesByConversation[conv.conversationId] || [];
              const isExpanded = expandedConvId === conv.conversationId;
              const hasFailed = traces.some((t) => t.evaluationStatus === 'FAILED');
              const hasCritical = traces.some((t) => t.criticalErrors.length > 0);

              return (
                <div
                  key={conv.conversationId}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div
                    onClick={() => setExpandedConvId(isExpanded ? null : conv.conversationId)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          hasCritical ? 'bg-rose-500' : hasFailed ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{conv.description}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {conv.conversationId}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                          <span>دسته: {conv.categoryTitleFa || conv.title || conv.category}</span>
                          <span>مخاطب: {conv.partnerTag}</span>
                          <span>تعداد دور: {conv.turns.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          hasCritical
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : hasFailed
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {hasCritical ? 'باگ بحرانی' : hasFailed ? 'عدم تطابق' : 'موفق (Passed)'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-4">
                      {traces.map((t) => (
                        <div
                          key={t.turnId}
                          className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                            <div className="font-mono font-bold text-violet-400">
                              دور شماره #{t.turnId}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400">نمره کیفی دور:</span>
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {t.responseScores?.totalScorePercent || 0}%
                              </span>
                            </div>
                          </div>

                          {/* Message Flow */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                              <div className="text-[10px] text-slate-400 mb-1">پیام مخاطب:</div>
                              <div className="font-semibold text-slate-100">{t.userMessage}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-violet-950/20 border border-violet-500/20">
                              <div className="text-[10px] text-violet-400 mb-1">پاسخ سیستم (سارا):</div>
                              <div className="font-semibold text-violet-200">{t.generatedResponse}</div>
                            </div>
                          </div>

                          {/* Trace Invariant Compare */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">نیت (Intent)</div>
                              <div className="font-mono font-bold text-sky-300 mt-0.5">{t.primaryIntent}</div>
                              {t.expected && (
                                <div className="text-[9px] text-slate-500">انتظار: {t.expected.intent}</div>
                              )}
                            </div>

                            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">وضعیت بعد (State)</div>
                              <div className="font-mono font-bold text-indigo-300 mt-0.5">{t.nextState}</div>
                              {t.expected && (
                                <div className="text-[9px] text-slate-500">انتظار: {t.expected.state}</div>
                              )}
                            </div>

                            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">سطح تبلیغ (Promotion)</div>
                              <div className="font-mono font-bold text-emerald-300 mt-0.5">{t.promotionLevel}</div>
                              <div className="text-[9px] text-slate-500">
                                قفل تبلیغ: {t.promotionLock ? '🔒 فعال' : '🔓 باز'}
                              </div>
                            </div>

                            <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
                              <div className="text-[10px] text-slate-400">امتیاز لید (Lead Score)</div>
                              <div className="font-mono font-bold text-amber-300 mt-0.5">
                                {t.leadScoreBefore} ➔ {t.leadScoreAfter}
                              </div>
                            </div>
                          </div>

                          {/* Error Categories & Violations */}
                          {(t.errorCategories.length > 0 || t.criticalErrors.length > 0) && (
                            <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-300 flex items-center gap-2 flex-wrap">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>خطاهای ردگیری‌شده:</span>
                              {t.criticalErrors.map((c, idx) => (
                                <span key={idx} className="bg-rose-900/60 px-2 py-0.5 rounded font-bold">
                                  {c}
                                </span>
                              ))}
                              {t.errorCategories.map((e, idx) => (
                                <span key={idx} className="bg-amber-900/40 px-2 py-0.5 rounded font-mono text-amber-200">
                                  {e}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Unit Test Suite Runner */}
      {activeSubTab === 'test_runner' && (
        <div className="space-y-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-pink-400" />
                  <span>اجرای پکیج تست‌های اعتبارسنجی گام ۵ (Evaluation Unit & Integration Tests)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  شامل ۶ تست جامع برای ماتریس سردرگمی، دقت استیت، کشف باگ‌های بحرانی و پس‌رفت
                </p>
              </div>

              <button
                onClick={handleRunUnitTests}
                disabled={isRunningTests}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isRunningTests ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
                <span>{isRunningTests ? 'در حال اجرای تست‌ها...' : 'اجرای مجدد تست‌ها'}</span>
              </button>
            </div>

            {testSummary ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    مجموع تست‌ها: <b>{testSummary.total}</b> | موفق: <b className="text-emerald-400">{testSummary.passed}</b> | ناموفق: <b className="text-rose-400">{testSummary.failed}</b>
                  </span>
                  <span className="text-slate-400 font-mono">زمان اجرا: {testSummary.durationMs}ms</span>
                </div>

                <div className="space-y-2">
                  {testSummary.results.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                        t.passed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          {t.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400" />
                          )}
                          <span>{t.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          مورد انتظار: {t.expected}
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                          خروجی واقعی: {t.actual}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          t.passed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {t.passed ? 'PASSED ✅' : 'FAILED ❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                جهت مشاهده ریز نتایج تست‌های واحد، روی دکمه «اجرای تست‌های اعتبارسنجی» کلیک کنید.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
