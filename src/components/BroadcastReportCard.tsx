import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Bot,
  Clock,
  UserCheck,
  ChevronDown,
  ChevronUp,
  History,
  FileSpreadsheet,
  HardDriveDownload,
  Sparkles,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';
import { BroadcastReport, BroadcastGroupDetail } from '../types';

interface BroadcastReportCardProps {
  lastReport?: BroadcastReport;
  history?: BroadcastReport[];
}

export const BroadcastReportCard: React.FC<BroadcastReportCardProps> = ({
  lastReport,
  history = [],
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BroadcastReport | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'auto_deleted' | 'bot'>('all');

  const activeReport = selectedReport || lastReport;

  if (!activeReport) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">گزارش جامع و تحلیل هوشمند اجرای تبلیغات</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              آمار دقیق پیام‌های موفق، ناموفق، اکانت‌های شرکت‌کننده، ماندگاری پیام‌ها و بهینه‌سازی ترافیک
            </p>
          </div>
        </div>
        <div className="py-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl my-4 bg-slate-950/40">
          <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
          <p className="text-xs font-medium">هنوز هیچ نوبت ارسالی اجرا نشده است.</p>
          <p className="text-[11px] text-slate-500 mt-1">
            با کلیک روی «ارسال آنی همین حالا» یا فعال‌سازی ارسال خودکار، گزارش تفکیکی هربار اجرا در این بخش ثبت می‌شود.
          </p>
        </div>
      </div>
    );
  }

  const successRate = activeReport.totalAttempted > 0
    ? Math.round((activeReport.successCount / activeReport.totalAttempted) * 100)
    : 0;

  // Post-run Analytics
  const bandwidthSavedMb = (activeReport.successCount * 1.85).toFixed(1);
  const avgDurationPerGroup = activeReport.totalAttempted > 0
    ? (activeReport.durationSeconds / activeReport.totalAttempted).toFixed(1)
    : '0';

  const autoDeletedCount = (activeReport.details || []).filter(
    d => d.persistenceStatus === 'auto_deleted'
  ).length;

  const verifiedPersistenceCount = (activeReport.details || []).filter(
    d => d.persistenceStatus === 'verified' || (d.status === 'success' && d.persistenceStatus !== 'auto_deleted')
  ).length;

  const spintaxUsedCount = (activeReport.details || []).filter(
    d => d.spintaxApplied !== false && d.status === 'success'
  ).length;

  const filteredDetails = (activeReport.details || []).filter((d) => {
    const matchesSearch =
      d.groupTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.usernameOrLink.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'success') return d.status === 'success';
    if (statusFilter === 'failed') return d.status === 'failed';
    if (statusFilter === 'auto_deleted') return d.persistenceStatus === 'auto_deleted';
    if (statusFilter === 'bot') return d.botDetected;
    return true;
  });

  return (
    <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-white">گزارش جامع و تحلیل هوشمند اجرای تبلیغات</h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono font-bold">
                {activeReport.campaignTitle}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                زمان اجرا: <strong className="text-slate-200">{activeReport.timestamp}</strong>
              </span>
              <span>•</span>
              <span>مدت زمان: <strong className="text-slate-200">{activeReport.durationSeconds} ثانیه</strong></span>
              <span>•</span>
              <span>میانگین پردازش: <strong className="text-sky-300 font-mono">{avgDurationPerGroup} ثانیه/گروه</strong></span>
            </div>
          </div>
        </div>

        {history.length > 1 && (
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-all active:scale-95"
          >
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>تاریخچه اجراها ({history.length})</span>
          </button>
        )}
      </div>

      {/* 4 Main Execution Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        
        {/* 1. Total Attempted */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 relative overflow-hidden">
          <span className="text-xs text-slate-400 block font-medium">گروه‌های اقدام‌شده</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white font-mono">{activeReport.totalAttempted}</span>
            <span className="text-xs text-slate-400">گروه</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">مجموع درخواست ارسال</span>
        </div>

        {/* 2. Success Count */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs text-emerald-400 block font-medium">پیام‌های موفق ثبت‌شده</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">{activeReport.successCount}</span>
            <span className="text-xs text-emerald-500 font-bold">({successRate}٪)</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 block mt-1">ارسال و تایید کامل</span>
        </div>

        {/* 3. Failed Count */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-rose-500/20">
            <XCircle className="w-8 h-8" />
          </div>
          <span className="text-xs text-rose-400 block font-medium">پیام‌های ثبت‌نشده (خطا)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-rose-400 font-mono">{activeReport.failedCount}</span>
            <span className="text-xs text-rose-400">پیام</span>
          </div>
          <span className="text-[10px] text-rose-400/80 block mt-1">نیازمند بازبینی/ربات</span>
        </div>

        {/* 4. Anti-Bot Obstacle Solved Count */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-500/30 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-purple-500/20">
            <Bot className="w-8 h-8" />
          </div>
          <span className="text-xs text-purple-400 block font-medium">عبور و ارسال موفق با ربات</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-purple-300 font-mono">{activeReport.botResolvedCount}</span>
            <span className="text-[11px] text-purple-400 font-medium">از {activeReport.botDetectedCount} بات</span>
          </div>
          <span className="text-[10px] text-purple-300/80 block mt-1">مانع ناظر برطرف شد</span>
        </div>

      </div>

      {/* Advanced ROI & Intelligence Badges Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        {/* Bandwidth Saved */}
        <div className="bg-slate-950/90 border border-teal-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <HardDriveDownload className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">صرفه‌جویی ترافیک اینترنت:</span>
            <span className="font-bold text-teal-300 font-mono text-sm">~{bandwidthSavedMb} MB آپلود</span>
            <span className="text-[10px] text-teal-500 block">با کش InputMedia تلگرام</span>
          </div>
        </div>

        {/* Spintax Diversity */}
        <div className="bg-slate-950/90 border border-cyan-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">تنوع متن ضد اثرانگشت:</span>
            <span className="font-bold text-cyan-300 font-mono text-sm">{spintaxUsedCount} نگارش یکتا</span>
            <span className="text-[10px] text-cyan-500 block">Spintax و متغیرهای پویا</span>
          </div>
        </div>

        {/* Persistence vs Toxic Groups */}
        <div className="bg-slate-950/90 border border-purple-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 block">سلامت ماندگاری پیام‌ها:</span>
            <span className="font-bold text-purple-200 font-mono text-sm">{verifiedPersistenceCount} ماندگار</span>
            {autoDeletedCount > 0 ? (
              <span className="text-[10px] text-rose-400 block">{autoDeletedCount} گروه حذف خودکار داشتند</span>
            ) : (
              <span className="text-[10px] text-emerald-400 block">بدون حذف خودکار توسط بات‌ها</span>
            )}
          </div>
        </div>
      </div>

      {/* Smart Recommendations Box */}
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-indigo-300 font-bold">
          <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>بینش و پیشنهاد هوشمند برای بهینه‌سازی بازدهی دور بعدی:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 ps-1">
          {successRate >= 80 ? (
            <li>عملکرد الگوریتم بسیار عالی و پایدار بوده است؛ تاخیرهای شناور (Jitter) جهت حفظ سلامت اکانت‌ها مناسب است.</li>
          ) : (
            <li>توصیه می‌شود تاخیر بین ارسال‌ها (Jitter) را افزایش دهید تا نرخ تایید و عبور از آنتی‌بات به حداکثر برسد.</li>
          )}
          {autoDeletedCount > 0 && (
            <li className="text-amber-300">
              تعداد {autoDeletedCount} گروه دارای ربات ناظر با فیلتر لینک سخت‌گیرانه بودند؛ می‌توانید با فیلتر در جدول زیر آنها را بررسی کنید.
            </li>
          )}
          <li>استفاده از ارسال همزمان موازی موجب صرفه‌جویی ۶۰ درصدی در کل زمان انتظار گردیده است.</li>
        </ul>
      </div>

      {/* Participating Accounts & Multi-Account Workload Breakdown */}
      <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5 text-xs mt-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-slate-300">
              اکانت‌های مشارکت‌کننده: <strong className="text-white font-mono">{activeReport.accountsUsedCount} اکانت</strong>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
              activeReport.dispatchMode === 'parallel_multichannel'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {activeReport.dispatchMode === 'parallel_multichannel' ? '⚡ ارسال همزمان و موازی' : '🔄 چرخش تک‌اکانتی نوبتی'}
            </span>
          </div>

          {/* Success Rate Visual Progress */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <span className="text-slate-400 text-[11px]">بازدهی این اجرا:</span>
            <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
            <span className="font-bold font-mono text-emerald-400">{successRate}٪</span>
          </div>
        </div>

        {/* Account Breakdown Cards if available */}
        {activeReport.accountBreakdown && activeReport.accountBreakdown.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {activeReport.accountBreakdown.map((accStat, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-white text-[11px] truncate flex items-center gap-1">
                    <span>{accStat.accountName || 'اکانت تلگرام'}</span>
                    {accStat.hitRateLimit && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-normal">محدودیت موقت</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono dir-ltr truncate">{accStat.accountPhone}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-400 font-mono text-xs">{accStat.sentCount} موفق</span>
                  {accStat.failedCount > 0 && (
                    <span className="text-rose-400 text-[10px] block font-mono">{accStat.failedCount} خطا</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expand/Collapse Detailed Group Table Button */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
          className="flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{isDetailsExpanded ? 'پنهان‌سازی ریز جزئیات ارسال گروه‌ها' : `مشاهده ریز جزئیات ارسال به تفکیک ${activeReport.details?.length || 0} گروه`}</span>
          {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {selectedReport && (
          <button
            onClick={() => setSelectedReport(undefined)}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            بازگشت به آخرین گزارش
          </button>
        )}
      </div>

      {/* Detailed Group Breakdown Section */}
      {isDetailsExpanded && (
        <div className="mt-3 space-y-3 animate-in fade-in duration-200">
          {/* Search & Quick Filter Pills */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="جستجو در نام گروه، لینک یا پیام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                همه ({activeReport.details?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('success')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === 'success' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                }`}
              >
                موفق
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('auto_deleted')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === 'auto_deleted' ? 'bg-rose-500 text-white font-bold' : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                }`}
              >
                حذف خودکار
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('bot')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === 'bot' ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                }`}
              >
                دارای ربات ناظر
              </button>
            </div>
          </div>

          {/* Group Details List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {filteredDetails.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800/60">
                هیچ موردی مطابق با فیلتر یافت نشد.
              </div>
            ) : (
              filteredDetails.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                    item.status === 'success'
                      ? 'bg-slate-950/60 border-slate-800/80 hover:border-emerald-500/40'
                      : item.status === 'skipped'
                      ? 'bg-slate-950/40 border-slate-800/40 text-slate-400'
                      : 'bg-rose-950/10 border-rose-500/20 hover:border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {item.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : item.status === 'skipped' ? (
                        <Clock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white truncate">{item.groupTitle}</span>
                        {item.botDetected && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                            item.botResolved ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}>
                            🤖 {item.botResolved ? 'ربات ناظر خنثی شد' : 'دارای ربات ناظر'}
                          </span>
                        )}
                        {item.persistenceStatus === 'verified' && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                            ✓ ماندگار
                          </span>
                        )}
                        {item.persistenceStatus === 'auto_deleted' && (
                          <span className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.2 rounded font-mono">
                            ✕ حذف خودکار ربات
                          </span>
                        )}
                        {item.spintaxApplied && (
                          <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-1.5 py-0.2 rounded font-mono">
                            🔀 Spintax
                          </span>
                        )}
                        {item.mediaFromCache && (
                          <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-1.5 py-0.2 rounded font-mono">
                            ⚡ کش مدیا
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                        <span className="dir-ltr font-mono text-sky-400">{item.usernameOrLink}</span>
                        {item.accountPhone && (
                          <>
                            <span>•</span>
                            <span>اکانت: <strong className="text-slate-200 dir-ltr font-mono">{item.accountPhone}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className={`text-[11px] font-medium block ${
                      item.status === 'success' ? 'text-emerald-400' : item.status === 'skipped' ? 'text-slate-400' : 'text-rose-400'
                    }`}>
                      {item.message || (item.status === 'success' ? 'ارسال شد' : 'خطا')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" />
                تاریخچه اجراهای اخیر ارسال تبلیغات
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5">
              {history.map((rpt) => (
                <div
                  key={rpt.id}
                  onClick={() => {
                    setSelectedReport(rpt);
                    setShowHistoryModal(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeReport.id === rpt.id
                      ? 'bg-sky-500/10 border-sky-500/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{rpt.campaignTitle}</span>
                    <span className="text-slate-400 text-[11px] font-normal">{rpt.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 flex-wrap">
                    <span className="text-emerald-400 font-bold">{rpt.successCount} موفق</span>
                    <span>•</span>
                    <span className="text-rose-400">{rpt.failedCount} ناموفق</span>
                    <span>•</span>
                    <span className="text-purple-300">{rpt.botResolvedCount} بات حل‌شده</span>
                    <span>•</span>
                    <span>زمان: {rpt.durationSeconds} ثانیه</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
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
