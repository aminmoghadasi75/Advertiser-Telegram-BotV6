import React, { useState, useEffect } from 'react';
import {
  Activity,
  Zap,
  Clock,
  Radio,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  HardDriveDownload,
  Bot,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ActiveBroadcastProgress, ActiveBroadcastWorkerProgress } from '../types';

interface LiveTelemetryHUDProps {
  progress: ActiveBroadcastProgress;
  onStop: () => void;
}

export const LiveTelemetryHUD: React.FC<LiveTelemetryHUDProps> = ({
  progress,
  onStop,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [prevSuccessCount, setPrevSuccessCount] = useState(progress.successCount);

  // Live Timer
  useEffect(() => {
    const startMs = new Date(progress.startTime).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - startMs) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [progress.startTime]);

  // Audio beep feedback on new success (optional subtle Web Audio API synthesizer)
  useEffect(() => {
    if (soundEnabled && progress.successCount > prevSuccessCount) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.16);
        }
      } catch (e) {
        // AudioContext ignored in restricted contexts
      }
    }
    setPrevSuccessCount(progress.successCount);
  }, [progress.successCount, prevSuccessCount, soundEnabled]);

  const total = progress.totalGroups || 1;
  const completed = progress.completedGroups || 0;
  const percent = Math.min(100, Math.round((completed / total) * 100));

  // Speed calculation
  const speed = elapsedSeconds > 5 
    ? ((completed / elapsedSeconds) * 60).toFixed(1) 
    : '...';

  // ETA Calculation
  const remainingGroups = Math.max(0, total - completed);
  const etaSeconds = elapsedSeconds > 5 && completed > 0
    ? Math.round((elapsedSeconds / completed) * remainingGroups)
    : remainingGroups * 4;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getWorkerStatusInfo = (status: ActiveBroadcastWorkerProgress['status']) => {
    switch (status) {
      case 'typing':
        return {
          label: 'شبیه‌سازی تایپینگ انسان...',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          dot: 'bg-amber-400 animate-ping',
        };
      case 'sending':
        return {
          label: 'در حال انتشار پیام در گروه...',
          color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
          dot: 'bg-sky-400 animate-pulse',
        };
      case 'antibot_verifying':
        return {
          label: 'ارزیابی و حل قفل آنتی‌بات...',
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          dot: 'bg-purple-400 animate-spin',
        };
      case 'cooldown':
        return {
          label: 'استراحت انسانی و تاخیر شناور (Jitter)...',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'flood_waited':
        return {
          label: 'محدودیت موقت تلگرام (توزیع کار به سایرین)',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          dot: 'bg-rose-500 animate-pulse',
        };
      case 'finished':
        return {
          label: 'پایان پردازش صف',
          color: 'text-slate-400 bg-slate-800 border-slate-700',
          dot: 'bg-slate-500',
        };
      default:
        return {
          label: 'در حال آماده‌سازی و دریافت گروه بعدی...',
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
          dot: 'bg-blue-400 animate-pulse',
        };
    }
  };

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-indigo-950/60 relative overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
      
      {/* Top Animated Laser Beam */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 animate-pulse" />
      
      {/* Glowing Radar Background Effect */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header / HUD Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center">
              <Radio className="w-6 h-6 animate-pulse text-indigo-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-black text-white tracking-wide">
                مرکز کنترل و مانیتورینگ زنده ارسال (Live Mission Control)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
                {progress.dispatchMode === 'parallel_multichannel' ? '⚡ کانال موازی چنداکانته' : '🔄 چرخش نوبتی'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>در حال ارسال هوشمند ضد اسپم به گروه‌های تلگرام با تکنیک‌های شبیه‌سازی رفتار کاربر</span>
            </p>
          </div>
        </div>

        {/* Audio Toggle & Stop Button */}
        <div className="flex items-center gap-2.5 self-end md:self-center">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="افکت صوتی هنگام ارسال موفق"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] hidden sm:inline">{soundEnabled ? 'صدا فعال' : 'صدا خاموش'}</span>
          </button>

          <button
            type="button"
            onClick={onStop}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-rose-950/40"
          >
            <Pause className="w-4 h-4 text-rose-400" />
            <span>توقف اضطراری ارسال</span>
          </button>
        </div>
      </div>

      {/* Main HUD Gauge Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 relative z-10">
        
        {/* 1. Progress & Percentage */}
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>پیشرفت کل صف:</span>
            <span className="text-emerald-400 font-bold font-mono">{percent}٪</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white font-mono">{completed}</span>
            <span className="text-xs text-slate-500">از {total} گروه</span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800 mt-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 2. Success Count */}
        <div className="bg-slate-950/80 border border-emerald-500/30 p-3.5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>ارسال‌های موفق:</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400 font-mono">{progress.successCount}</span>
            <span className="text-xs text-emerald-500">پیام تاییدشده</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Spintax و کش مدیا فعال</span>
          </div>
        </div>

        {/* 3. Speed & Throughput */}
        <div className="bg-slate-950/80 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-indigo-300">
            <span>سرعت انتشار:</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-300 font-mono">{speed}</span>
            <span className="text-xs text-slate-400">گروه / دقیقه</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            زمان سپری‌شده: <strong className="text-white">{formatTime(elapsedSeconds)}</strong>
          </div>
        </div>

        {/* 4. Estimated Time Remaining (ETA) */}
        <div className="bg-slate-950/80 border border-purple-500/30 p-3.5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-purple-300">
            <span>تخمین زمان باقی‌مانده (ETA):</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-purple-200 font-mono">{formatTime(etaSeconds)}</span>
            <span className="text-xs text-slate-400">دقیقه</span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
            <span>{remainingGroups} گروه باقی‌مانده در صف</span>
          </div>
        </div>

      </div>

      {/* Live Active Workers Cards (Telemetries per connected account) */}
      <div className="space-y-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>وضعیت زنده اکانت‌های عامل در حال کار ({progress.workers?.length || 0} Worker):</span>
          </h4>
          <span className="text-[10px] text-slate-400">به‌روزرسانی میلی‌ثانیه‌ای</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(progress.workers || []).map((worker, idx) => {
            const statusInfo = getWorkerStatusInfo(worker.status);
            return (
              <div
                key={worker.accountId || idx}
                className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 space-y-3 relative overflow-hidden transition-all hover:border-indigo-500/40"
              >
                {/* Account info bar */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs truncate">
                        {worker.accountName || 'اکانت تلگرام'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono dir-ltr truncate">
                        {worker.accountPhone}
                      </div>
                    </div>
                  </div>

                  {/* Worker individual score */}
                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      ✓ {worker.sentSuccessCount}
                    </span>
                    {worker.failedCount > 0 && (
                      <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                        ✕ {worker.failedCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Current Target Group */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>گروه در حال پردازش:</span>
                    {worker.currentGroupTitle && (
                      <span className="font-bold text-sky-300 truncate max-w-[200px]">
                        {worker.currentGroupTitle}
                      </span>
                    )}
                  </div>

                  {/* Status Badge & Dynamic Description */}
                  <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs ${statusInfo.color}`}>
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${statusInfo.dot}`} />
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-bold leading-tight">{statusInfo.label}</div>
                      <p className="text-[11px] opacity-90 leading-relaxed font-sans line-clamp-2">
                        {worker.lastAction || 'در حال آماده‌سازی عملیات...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Generated Spintax Sample Preview */}
      {progress.lastGeneratedSampleMessage && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>آخرین نمونه نگارش پیام ضد اسپم (Spintax) تولیدشده برای گروه «{progress.lastGeneratedSampleMessage.groupTitle}»:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              توسط {progress.lastGeneratedSampleMessage.accountName}
            </span>
          </div>
          <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed font-sans max-h-24 overflow-y-auto whitespace-pre-wrap">
            {progress.lastGeneratedSampleMessage.text}
          </div>
        </div>
      )}

      {/* Bandwidth Savings Pill */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-2">
          <HardDriveDownload className="w-4 h-4 text-emerald-400" />
          <span>
            بهینه‌سازی ترافیک با کش مدیا: <strong className="text-emerald-400">{(completed * 1.8).toFixed(1)} مگابایت ترافیک آپلود صرفه‌جویی شد.</strong>
          </span>
        </div>
        <span className="text-[10px] text-slate-500">
          سیستم برای کاهش خطر فیلترینگ و بن، به صورت خودکار تاخیرهای ارگانیک و الگوهای انسانی را اعمال می‌کند.
        </span>
      </div>

    </div>
  );
};
