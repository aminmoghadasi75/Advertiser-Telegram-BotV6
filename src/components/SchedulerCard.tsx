import React, { useState } from 'react';
import { Clock, ShieldCheck, Moon, RefreshCw, Zap, Sliders, CheckCircle2, AlertTriangle, Send, Filter, ShieldAlert, Layers, Cpu, FastForward, Square, StopCircle } from 'lucide-react';
import { SchedulerConfig } from '../types';

interface SchedulerCardProps {
  scheduler: SchedulerConfig;
  onUpdateScheduler: (config: Partial<SchedulerConfig>) => Promise<void>;
  onSendNow: () => Promise<void>;
  onStopBroadcast?: () => Promise<void>;
  isSendingNow: boolean;
}

export const SchedulerCard: React.FC<SchedulerCardProps> = ({
  scheduler,
  onUpdateScheduler,
  onSendNow,
  onStopBroadcast,
  isSendingNow,
}) => {
  const [intervalMinutes, setIntervalMinutes] = useState(scheduler.intervalMinutes || 10);
  const [jitterSeconds, setJitterSeconds] = useState(scheduler.jitterSeconds || 45);
  const [dailyLimit, setDailyLimit] = useState(scheduler.dailyLimit || 35);
  const [nightModePause, setNightModePause] = useState(scheduler.nightModePause ?? true);
  const [onlyPromotionalGroups, setOnlyPromotionalGroups] = useState(Boolean(scheduler.onlyPromotionalGroups));
  const [multiAccountDispatchMode, setMultiAccountDispatchMode] = useState<'parallel_multichannel' | 'sequential_rotation'>(
    scheduler.multiAccountDispatchMode || 'parallel_multichannel'
  );
  const [loading, setLoading] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const presetIntervals = [
    { label: '۱۰ دقیقه (پیشنهادی)', value: 10, recommended: true },
    { label: '۱۵ دقیقه (امن‌ترین)', value: 15, recommended: true },
    { label: '۳۰ دقیقه', value: 30 },
    { label: '۱ ساعت', value: 60 },
  ];

  const handleSaveScheduler = async (overrides?: Partial<SchedulerConfig>) => {
    setLoading(true);
    try {
      await onUpdateScheduler({
        intervalMinutes,
        jitterSeconds,
        dailyLimit,
        nightModePause,
        onlyPromotionalGroups,
        multiAccountDispatchMode,
        ...overrides,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchModeChange = (mode: 'parallel_multichannel' | 'sequential_rotation') => {
    setMultiAccountDispatchMode(mode);
    handleSaveScheduler({ multiAccountDispatchMode: mode });
  };

  const dailySent = scheduler.dailySentCount || 0;
  const limitPercent = Math.min(100, Math.round((dailySent / dailyLimit) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">تنظیمات آنتی‌بات و زمان‌بندی هوشمند (Anti-Spam & Scheduler)</h2>
            <p className="text-xs text-slate-400">تنظیم فواصل زمانی، شبیه‌سازی رفتار انسان و مدیریت نحوه ارسال همزمان بین چند اکانت</p>
          </div>
        </div>

        {/* Status Pill */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
          scheduler.isAutoRunActive
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${scheduler.isAutoRunActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
          <span>{scheduler.isAutoRunActive ? 'ارسال خودکار فعال است' : 'متوقف است'}</span>
        </div>
      </div>

      {/* Multi-Account Execution Strategy Switcher */}
      <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-indigo-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>نحوه تقسیم کار بین اکانت‌های متصل (Multi-Account Dispatch Strategy):</span>
          </label>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
            هوشمند و بدون تداخل
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Mode 1: Parallel Multichannel */}
          <button
            type="button"
            onClick={() => handleDispatchModeChange('parallel_multichannel')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
              multiAccountDispatchMode === 'parallel_multichannel'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${multiAccountDispatchMode === 'parallel_multichannel' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <FastForward className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-xs flex items-center gap-1.5 text-slate-100">
                <span>ارسال همزمان و موازی چند اکانته</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">پیشنهادی</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تمام اکانت‌های متصل به صورت همزمان فعال شده و صف گروه‌ها بین آن‌ها تقسیم می‌شود. در صورت محدودیت یکی از اکانت‌ها، کارها خودکار به بقیه منتقل می‌شود.
              </p>
            </div>
          </button>

          {/* Mode 2: Sequential Rotation */}
          <button
            type="button"
            onClick={() => handleDispatchModeChange('sequential_rotation')}
            className={`p-3 rounded-xl border text-right transition-all flex items-start gap-2.5 ${
              multiAccountDispatchMode === 'sequential_rotation'
                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${multiAccountDispatchMode === 'sequential_rotation' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-slate-100">ارسال چرخشی تک‌اکانتی (نوبتی)</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                در هر لحظه فقط یک اکانت فعال است و گروه‌ها تک به تک ارسال می‌شوند. مناسب برای سناریوهای آزمایشی با تعداد گروه کم.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Interval Selector Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>بازه زمانی ارسال بین گروه‌ها (Interval):</span>
          <span className="text-sky-400 font-bold">هر {intervalMinutes} دقیقه</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presetIntervals.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                setIntervalMinutes(preset.value);
                handleSaveScheduler({ intervalMinutes: preset.value });
              }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                intervalMinutes === preset.value
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Limit Usage Progress */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">سقف ارسال روزانه (Daily Limit):</span>
          <span className="text-emerald-400 font-bold font-mono">
            {dailySent.toLocaleString('fa-IR')} از {dailyLimit.toLocaleString('fa-IR')} پیام امروز
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              limitPercent >= 100 ? 'bg-rose-500' : limitPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${limitPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Advanced Safeguards Grid */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
        <div className="text-xs font-bold text-sky-400 flex items-center justify-between border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>تنظیمات پیشرفته الگوریتم ضد ریپورت (Anti-Report & Jitter):</span>
          </div>
          <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded">
            الگوی رفتار انسانی
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          {/* Random Jitter Delay */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>تاخیر تصادفی (Jitter Delay):</span>
              <span className="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded font-mono">
                پیشنهادی: ۴۰ الی ۶۰ ثانیه
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={0}
                max={300}
                value={jitterSeconds}
                onChange={(e) => setJitterSeconds(parseInt(e.target.value, 10) || 0)}
                onBlur={() => handleSaveScheduler()}
                className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white text-center focus:outline-none focus:border-sky-500 dir-ltr font-mono"
              />
              <span className="text-slate-400 text-[11px]">ثانیه تاخیر شناور متغیر</span>
            </div>
          </div>

          {/* Daily Limit Input */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>سقف مجاز روزانه:</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">
                پیشنهادی: ۳۰ الی ۵۰ پیام
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={5}
                max={500}
                value={dailyLimit}
                onChange={(e) => setDailyLimit(parseInt(e.target.value, 10) || 30)}
                onBlur={() => handleSaveScheduler()}
                className="w-24 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white text-center focus:outline-none focus:border-sky-500 dir-ltr font-mono"
              />
              <span className="text-slate-400 text-[11px]">پیام در ۲۴ ساعت</span>
            </div>
          </div>

          {/* Night Mode Sleep */}
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">حالت خواب شبانه (Night Mode)</div>
                <div className="text-[10px] text-slate-400">توقف اتوماتیک ارسال در ساعات ۰۱:۰۰ تا ۰۷:۰۰ صبح</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={nightModePause}
              onChange={(e) => {
                setNightModePause(e.target.checked);
                onUpdateScheduler({ nightModePause: e.target.checked });
              }}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-sky-500 accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Promotional Groups Only Filter */}
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Filter className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">ارسال فقط به گروه‌های تبلیغاتی/تبادلی</div>
                <div className="text-[10px] text-slate-400">رد کردن گروه‌های چت عمومی جهت جلوگیری از ریپورت</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={onlyPromotionalGroups}
              onChange={(e) => {
                setOnlyPromotionalGroups(e.target.checked);
                onUpdateScheduler({ onlyPromotionalGroups: e.target.checked });
              }}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-teal-500 accent-teal-500 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Save Settings Status Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تنظیمات فواصل و محافظت هوشمند آماده اعمال در ارسال‌ها است.</span>
        </div>

        <button
          onClick={() => handleSaveScheduler()}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ذخیره تنظیمات زمان‌بندی</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};


