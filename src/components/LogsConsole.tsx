import React, { useState } from 'react';
import { Terminal, Trash2, CheckCircle2, AlertTriangle, Info, XCircle, Filter, ShieldCheck, RefreshCw } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsConsoleProps {
  logs: LogEntry[];
  onClearLogs: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const LogsConsole: React.FC<LogsConsoleProps> = ({
  logs,
  onClearLogs,
  onRefresh,
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'success' | 'warning' | 'error' | 'info'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLogs = logs.filter(log => {
    if (filterLevel === 'all') return true;
    return log.level === filterLevel;
  });

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const levelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'success':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            موفق
          </span>
        );
      case 'error':
        return (
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            خطا
          </span>
        );
      case 'warning':
        return (
          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            هشدار
          </span>
        );
      default:
        return (
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
            <Info className="w-3 h-3" />
            اطلاع
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-3">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-950 text-sky-400 border border-slate-800 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              گزارش‌ها و لاگ‌های زنده ربات (Live Logs)
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                {logs.length} رویداد
              </span>
            </h2>
            <p className="text-xs text-slate-400">گزارش لحظه‌ای وضعیت ارسال پیام به گروه‌ها</p>
          </div>
        </div>

        {/* Filter and Clear */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshClick}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="به‌روزرسانی"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterLevel('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterLevel === 'all' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-white'}`}
            >
              همه
            </button>
            <button
              onClick={() => setFilterLevel('success')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterLevel === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'}`}
            >
              موفق
            </button>
            <button
              onClick={() => setFilterLevel('error')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterLevel === 'error' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-white'}`}
            >
              خطا
            </button>
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/30"
            title="پاکسازی تاریخچه لاگ‌ها"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal View Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs max-h-[300px] overflow-y-auto space-y-2">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-slate-600 py-8">
            هیچ لاگی ثبت نشده است.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                {levelBadge(log.level)}
                
                <div className="text-slate-200 leading-normal">
                  <span>{log.message}</span>
                  {log.groupTitle && (
                    <span className="text-sky-400 font-bold mr-1">[{log.groupTitle}]</span>
                  )}
                  {log.campaignTitle && (
                    <span className="text-amber-400 mr-1">({log.campaignTitle})</span>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 self-end sm:self-auto font-sans flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString('fa-IR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
