import React, { useState, useRef } from 'react';
import {
  Send,
  Power,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Radio,
  LogOut,
  Save,
  Check,
  HardDrive,
  Download,
  Upload,
  Bot,
  Megaphone,
  Users,
  Terminal,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { TelegramCredentials, SchedulerConfig, TelegramAccount, AnonymousChatAutomatorConfig } from '../types';

interface HeaderProps {
  credentials: TelegramCredentials;
  accounts?: TelegramAccount[];
  activeAccountId?: string;
  scheduler: SchedulerConfig;
  anonymousConfig?: AnonymousChatAutomatorConfig;
  activeNavTab: 'anonymous_bot' | 'group_broadcast' | 'accounts' | 'logs';
  onNavTabChange: (tab: 'anonymous_bot' | 'group_broadcast' | 'accounts' | 'logs') => void;
  onOpenAuth: () => void;
  onOpenAddAccount?: () => void;
  onLogout: () => Promise<void>;
  onSaveAll?: () => Promise<void>;
  isSavingAll?: boolean;
  lastSavedTime?: string | null;
  onRestoreState?: (newState: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  credentials,
  accounts = [],
  activeAccountId,
  scheduler,
  anonymousConfig,
  activeNavTab,
  onNavTabChange,
  onOpenAuth,
  onOpenAddAccount,
  onLogout,
  onSaveAll,
  isSavingAll,
  lastSavedTime,
  onRestoreState,
}) => {
  const [internalSaving, setInternalSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualSave = async () => {
    if (internalSaving || isSavingAll) return;
    setInternalSaving(true);
    try {
      if (onSaveAll) {
        await onSaveAll();
      } else {
        await fetch('/api/save-all', { method: 'POST' });
      }
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert('خطا در ذخیره‌سازی اطلاعات. لطفاً اتصال سرور را بررسی کنید.');
    } finally {
      setInternalSaving(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch('/api/download-backup');
      if (!res.ok) throw new Error('Failed to download backup');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `telegram_promoter_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Backup download error:', err);
      alert('خطا در دانلود فایل پشتیبان');
    }
    setShowBackupMenu(false);
  };

  const handleFileRestoreUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch('/api/restore-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state && onRestoreState) {
          onRestoreState(data.state);
        }
        alert('✅ تمام اطلاعات، تنظیمات، ربات‌های چت و کمپین‌ها با موفقیت بازیابی شدند!');
        window.location.reload();
      } else {
        const errData = await res.json();
        alert('خطا در بازیابی پشتیبان: ' + (errData.error || 'خطای ناشناخته'));
      }
    } catch (err: any) {
      console.error('Restore error:', err);
      alert('فایل پشتیبان نامعتبر است یا ساختار JSON صحیح نیست.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowBackupMenu(false);
    }
  };

  const isSaving = isSavingAll || internalSaving;
  const connectedAccountsCount = accounts.length || (credentials.isConnected ? 1 : 0);

  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 sticky top-0 z-40 shadow-xl" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tier: Branding, Account Status & Backup Controls */}
        <div className="py-3 flex items-center justify-between gap-4 border-b border-slate-800/80">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20 flex-shrink-0">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg leading-tight text-white">
                  تلگرام اتومیشن پرو
                </h1>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  v2.5 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                سامانه هوشمند تبلیغات در گروه‌ها و اتوماسیون چت در ربات‌های ناشناس
              </p>
            </div>
          </div>

          {/* Global Utility Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Save All Data Button */}
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 border ${
                justSaved
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                  : isSaving
                  ? 'bg-slate-800 text-indigo-300 border-indigo-700/60'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
              title="ذخیره ۱۰۰٪ تنظیمات، دستورالعمل‌ها، ربات‌های چت و گروه‌ها در سرور"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                  <span className="hidden sm:inline">در حال ذخیره...</span>
                </>
              ) : justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ذخیره شد ✓</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">ذخیره تنظیمات</span>
                </>
              )}
            </button>

            {/* Backup Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setShowBackupMenu(!showBackupMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
                title="دانلود یا بازیابی فایل پشتیبان JSON"
              >
                <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">پشتیبان‌گیری</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showBackupMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95">
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors text-right"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>دانلود فایل پشتیبان (JSON)</span>
                  </button>

                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 transition-colors text-right cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>بازیابی از فایل (JSON)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleFileRestoreUpload}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Telegram Account Status Pill */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                credentials.isConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
              }`}
            >
              {credentials.isConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">
                    {credentials.userProfile?.firstName || credentials.phoneNumber || 'اکانت متصل'}
                  </span>
                  {connectedAccountsCount > 1 && (
                    <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                      +{connectedAccountsCount - 1}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold">ورود به تلگرام</span>
                </>
              )}
            </button>

            {/* Logout button if connected */}
            {credentials.isConnected && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 text-slate-400 transition-colors"
                title="خروج از حساب تلگرام"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        {/* Bottom Tier: Primary Module Navigation Tabs */}
        <div className="py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          
          <nav className="flex items-center gap-1 sm:gap-2">
            
            {/* Tab 1: Anonymous Bot Automation */}
            <button
              onClick={() => onNavTabChange('anonymous_bot')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeNavTab === 'anonymous_bot'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Bot className="w-4 h-4 text-fuchsia-300" />
              <span>اتوماسیون چت در ربات‌های ناشناس</span>
              {anonymousConfig?.isActive ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-900/60 text-violet-300 border border-violet-700/40">
                  هوش مصنوعی
                </span>
              )}
            </button>

            {/* Tab 2: Group Promoter */}
            <button
              onClick={() => onNavTabChange('group_broadcast')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeNavTab === 'group_broadcast'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Megaphone className="w-4 h-4 text-sky-300" />
              <span>ارسال تبلیغات به گروه‌ها</span>
              {scheduler.isAutoRunActive ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-900/60 text-sky-300 border border-sky-700/40">
                  آنتی‌بلاک
                </span>
              )}
            </button>

            {/* Tab 3: Account Management */}
            <button
              onClick={() => onNavTabChange('accounts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeNavTab === 'accounts'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-300" />
              <span>مدیریت اکانت‌ها</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {connectedAccountsCount}
              </span>
            </button>

            {/* Tab 4: Logs & Monitoring */}
            <button
              onClick={() => onNavTabChange('logs')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeNavTab === 'logs'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>کنسول و لاگ‌های زنده</span>
            </button>

          </nav>

          {/* Quick status text */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
            {scheduler.isAutoRunActive && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ارسال خودکار گروه‌ها فعال
              </span>
            )}
            {anonymousConfig?.isActive && (
              <span className="flex items-center gap-1.5 text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded-full border border-fuchsia-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                چت ناشناس فعال
              </span>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
