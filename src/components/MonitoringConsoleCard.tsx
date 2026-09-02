import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, RefreshCw, Trash2, Bot, AlertTriangle, MessageSquare, Send, CheckCheck, ExternalLink, Filter } from 'lucide-react';
import { GroupMonitoringReport } from '../types';

interface MonitoringConsoleCardProps {
  reports: GroupMonitoringReport[];
  onRefresh: () => void;
  onClear: () => void;
  onMarkReviewed: (groupId: string) => void;
  onRecheckAndSend?: (groupId: string) => void;
}

export const MonitoringConsoleCard: React.FC<MonitoringConsoleCardProps> = ({
  reports,
  onRefresh,
  onClear,
  onMarkReviewed,
  onRecheckAndSend,
}) => {
  const [filter, setFilter] = useState<'all' | 'manual' | 'sent' | 'bot'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      onRefresh();
    }, 4000);
    return () => clearInterval(timer);
  }, [autoRefresh, onRefresh]);

  const manualCount = reports.filter(r => r.requiresManualCheck).length;
  const sentCount = reports.filter(r => r.step === 'CAMPAIGN_SENT').length;
  // Active/Pending anti-bot count: bot detected BUT campaign not yet sent
  const botPendingCount = reports.filter(r => r.botDetected && r.step !== 'CAMPAIGN_SENT').length;
  // Resolved anti-bot count: bot detected AND campaign successfully sent
  const botResolvedCount = reports.filter(r => r.botDetected && r.step === 'CAMPAIGN_SENT').length;

  const filteredReports = reports.filter(r => {
    if (filter === 'manual') return r.requiresManualCheck;
    if (filter === 'sent') return r.step === 'CAMPAIGN_SENT';
    if (filter === 'bot') return r.botDetected;
    return true;
  });

  const getStepBadge = (step: GroupMonitoringReport['step']) => {
    switch (step) {
      case 'JOINING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">۱. ورود به گروه</span>;
      case 'GREETING_SENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">۲. ارسال پیام سلام اولیه</span>;
      case 'ANTI_BOT_VERIFYING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">۳. عبور از قفل ربات</span>;
      case 'RE_TESTING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">۴. راستی‌آزمایی با پیام سلام</span>;
      case 'CAMPAIGN_SENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">۵. پیام تبلیغ منتشر شد</span>;
      case 'MANUAL_REVIEW_NEEDED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">⚠️ نیازمند بررسی دستی</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">خطا / مسدود</span>;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 relative">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">مانیتورینگ زنده و گزارش لحظه‌ای گروه‌ها</h3>
              {manualCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce">
                  {manualCount} نیازمند بررسی دستی
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              پایش خط‌به‌خط فرآیند ارسال سلام اولیه، واکنش ربات ناظر، رفع قفل و انتشار نهایی پیام تبلیغاتی
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="به‌روزرسانی خودکار هر ۴ ثانیه"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'پایش زنده فعال' : 'پایش متوقف'}
          </button>

          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="به‌روزرسانی دستی"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {reports.length > 0 && (
            <button
              onClick={onClear}
              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
              title="پاکسازی گزارش‌ها"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block">کل پایش‌شده‌ها</span>
          <span className="text-lg font-bold text-white mt-0.5 block">{reports.length} گروه</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20">
          <span className="text-[11px] text-emerald-400 block">ارسال شده و تاییدشده</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg font-bold text-emerald-300">{sentCount}</span>
            {botResolvedCount > 0 && (
              <span className="text-[10px] text-emerald-400/90 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ({botResolvedCount} بات حل‌شده)
              </span>
            )}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/20">
          <span className="text-[11px] text-purple-400 block">دارای ربات ناظر (در انتظار)</span>
          <span className="text-lg font-bold text-purple-300 mt-0.5 block">{botPendingCount}</span>
        </div>
        <div className={`p-3 rounded-xl bg-slate-950 border ${manualCount > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-slate-800/80'}`}>
          <span className="text-[11px] text-amber-400 block">نیازمند بررسی شما</span>
          <span className="text-lg font-bold text-amber-300 mt-0.5 block">{manualCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 pb-3 overflow-x-auto text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          همه ({reports.length})
        </button>
        <button
          onClick={() => setFilter('manual')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'manual'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'bg-slate-950 text-slate-400 hover:text-amber-400 border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          نیازمند بررسی دستی ({manualCount})
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'sent'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-950 text-slate-400 hover:text-emerald-400 border border-slate-800'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          ارسال موفق ({sentCount})
        </button>
        <button
          onClick={() => setFilter('bot')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            filter === 'bot'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-slate-950 text-slate-400 hover:text-indigo-400 border border-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          کل شناسایی‌شده با ربات ({botPendingCount + botResolvedCount})
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/50 my-2">
          <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">هیچ گزارش مانیتورینگی با این فیلتر ثبت نشده است.</p>
          <p className="text-[11px] text-slate-500 mt-1">
            هنگام اجرای کمپین خودکار یا ارسال تست مستقیم، تمام مراحل تکنیکی در این بخش ذخیره می‌گردند.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded-xl border transition-all ${
                report.requiresManualCheck
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/10'
                  : report.step === 'CAMPAIGN_SENT'
                  ? 'bg-slate-950/80 border-emerald-500/30'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              {/* Group Title & Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    report.requiresManualCheck ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {report.groupTitle.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{report.groupTitle}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{report.usernameOrLink}</span>
                      <span>•</span>
                      <span>زمان: {report.lastCheckedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStepBadge(report.step)}
                  {report.usernameOrLink.startsWith('@') || report.usernameOrLink.includes('t.me') ? (
                    <a
                      href={`https://t.me/${report.usernameOrLink.replace('@', '').replace('https://t.me/', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                      title="مشاهده در تلگرام"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Status Message & Bot Tags */}
              <div className="mt-3 p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300 font-medium">{report.statusMessage}</span>
                  {report.botDetected && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                      🤖 {report.botTypeOrName || 'ربات ناظر'}
                    </span>
                  )}
                </div>

                {/* Sub-actions execution flags */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1 text-indigo-300">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    ارسال سلام اولیه ("سلام بچه ها")
                  </span>

                  {report.captchaClicked && (
                    <span className="flex items-center gap-1 text-purple-300 font-medium">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                      کلیک دکمه احراز هویت
                    </span>
                  )}

                  {report.channelJoined && (
                    <span className="flex items-center gap-1 text-blue-300 font-medium">
                      <CheckCircle className="w-3 h-3 text-blue-400" />
                      عضویت در کانال‌های اجباری
                    </span>
                  )}

                  {report.contactsInvited && report.contactsInvited > 0 ? (
                    <span className="flex items-center gap-1 text-emerald-300 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      {report.contactsInvited} مخاطب اضافه شد
                    </span>
                  ) : null}

                  {report.step === 'CAMPAIGN_SENT' && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold ml-auto">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      پیام اصلی کمپین تحویل داده شد
                    </span>
                  )}
                </div>
              </div>

              {/* Manual Review Alert Bar */}
              {report.requiresManualCheck && (
                <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 animate-bounce" />
                    <span>
                      این گروه ممکن است دارای چالش خاص باشد. پس از انجام اقدام (حل کاپچا / عضویت / دعوت)، روی «بررسی مجدد و ارسال کمپین» کلیک کنید.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    {onRecheckAndSend && (
                      <button
                        onClick={() => onRecheckAndSend(report.groupId)}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        بررسی مجدد و ارسال کمپین
                      </button>
                    )}
                    <button
                      onClick={() => onMarkReviewed(report.groupId)}
                      className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                    >
                      تایید بدون ارسال
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
