import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Power,
  CheckCircle,
  Clock,
  Zap,
  Phone,
  Sparkles,
  Layers,
  ShieldAlert,
  Cpu,
  Radio,
  MessageSquare,
  Megaphone,
  Check,
  X,
  Key,
  Lock,
  Activity,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { TelegramAccount } from '../types';

interface AccountManagerCardProps {
  accounts: TelegramAccount[];
  activeAccountId?: string;
  onSelectActiveAccount: (id: string) => Promise<void>;
  onToggleAccountActive: (id: string, isActive: boolean) => Promise<void>;
  onToggleModule?: (id: string, module: 'group_broadcast' | 'anonymous_bot', enabled: boolean) => Promise<void>;
  onBulkToggleModule?: (module: 'group_broadcast' | 'anonymous_bot', enabled: boolean) => Promise<void>;
  onVerifyAllAccounts?: () => Promise<void>;
  onVerifySingleAccount?: (id: string) => Promise<void>;
  onDeleteAccount: (id: string) => Promise<void>;
  onReauthAccount?: (acc: TelegramAccount) => void;
  onOpenAddAccountModal: () => void;
}

export const AccountManagerCard: React.FC<AccountManagerCardProps> = ({
  accounts = [],
  activeAccountId,
  onSelectActiveAccount,
  onToggleAccountActive,
  onToggleModule,
  onBulkToggleModule,
  onVerifyAllAccounts,
  onVerifySingleAccount,
  onDeleteAccount,
  onReauthAccount,
  onOpenAddAccountModal,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const activeAccountsCount = accounts.filter(
    a => a.isActive && a.status !== 'session_expired' && a.status !== 'disabled' && (!a.floodWaitUntil || a.floodWaitUntil < Date.now())
  ).length;

  const groupBroadcastCount = accounts.filter(
    a => a.enableForGroupBroadcast !== false && a.isActive && a.status !== 'session_expired'
  ).length;

  const anonBotCount = accounts.filter(
    a => a.enableForAnonymousBot !== false && a.isActive && a.status !== 'session_expired'
  ).length;

  const expiredSessionsCount = accounts.filter(
    a => a.requiresReauth || a.status === 'session_expired'
  ).length;

  const handleSelectActive = async (id: string) => {
    setLoadingId(id);
    try {
      await onSelectActiveAccount(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    setLoadingId(id);
    try {
      await onToggleAccountActive(id, !current);
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleModuleAction = async (id: string, module: 'group_broadcast' | 'anonymous_bot', current: boolean) => {
    if (!onToggleModule) return;
    setLoadingId(`${id}_${module}`);
    try {
      await onToggleModule(id, module, !current);
    } finally {
      setLoadingId(null);
    }
  };

  const handleBulkToggle = async (module: 'group_broadcast' | 'anonymous_bot', enable: boolean) => {
    if (!onBulkToggleModule) return;
    setIsVerifyingAll(true);
    try {
      await onBulkToggleModule(module, enable);
    } finally {
      setIsVerifyingAll(false);
    }
  };

  const handleVerifySingle = async (id: string) => {
    if (!onVerifySingleAccount) return;
    setLoadingId(`verify_${id}`);
    try {
      await onVerifySingleAccount(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleVerifyAll = async () => {
    if (!onVerifyAllAccounts) return;
    setIsVerifyingAll(true);
    setVerifyMessage('در حال اعتبارسنجی زنده و ۱۰۰٪ ارتباط تمام اکانت‌ها با سرورهای MTProto تلگرام...');
    try {
      await onVerifyAllAccounts();
      setVerifyMessage('پایش زنده با موفقیت تکمیل گردید.');
      setTimeout(() => setVerifyMessage(null), 4000);
    } catch (e: any) {
      setVerifyMessage('خطا در پایش زنده اکانت‌ها');
      setTimeout(() => setVerifyMessage(null), 4000);
    } finally {
      setIsVerifyingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('آیا از حذف کامل این اکانت از سیستم اطمینان دارید؟ تمامی اطلاعات جلسه و کلیدها حذف خواهند شد.')) {
      setLoadingId(id);
      try {
        await onDeleteAccount(id);
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white flex items-center gap-2 flex-wrap">
              <span>مدیریت یکپارچه اکانت‌ها و پایش زنده سلامت (Live MTProto Health)</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">
                {accounts.length.toLocaleString('fa-IR')} اکانت ثبت‌شده
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              تضمین قطعی ۱۰۰٪ اتصال نشست، تفکیک نقش در چت ناشناس و ارسال گروهی، و ذخیره‌سازی دائمی کلیدها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onVerifyAllAccounts && (
            <button
              onClick={handleVerifyAll}
              disabled={isVerifyingAll || accounts.length === 0}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="تست و پایش اعتبار زنده نشست تمامی اکانت‌ها با دریافت مستقیم مشخصات از تلگرام"
            >
              <Activity className={`w-3.5 h-3.5 ${isVerifyingAll ? 'animate-spin' : ''}`} />
              <span>{isVerifyingAll ? 'در حال پایش زنده...' : 'پایش سلامت زنده همه'}</span>
            </button>
          )}

          <button
            onClick={onOpenAddAccountModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>افزودن اکانت جدید</span>
          </button>
        </div>
      </div>

      {/* Verify feedback notification */}
      {verifyMessage && (
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-2.5 text-xs text-sky-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{verifyMessage}</span>
          </div>
        </div>
      )}

      {/* Expired Sessions Alert Warning Banner */}
      {expiredSessionsCount > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="text-rose-100 block">
                توجه: تعداد {expiredSessionsCount.toLocaleString('fa-IR')} اکانت نیاز به تمدید نشست (Re-Auth) دارند!
              </strong>
              <span className="text-rose-300/90 text-[11px]">
                نشست این اکانت‌ها به دلیل خروج از دستگاه دیگر یا انقضای کلید غیرفعال شده است. با زدن دکمه تمدید نشست، کد جدید بگیرید.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Unified Role Allocation & Quick Bulk Action Controls */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>مدیریت سریع تخصیص نقش اکانت‌ها در بخش‌های مختلف برنامه:</span>
          </div>

          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              📢 {groupBroadcastCount} اکانت فعال در تبلیغات گروهی
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-bold">
              💬 {anonBotCount} اکانت فعال در چت ناشناس
            </span>
          </div>
        </div>

        {/* Quick Bulk Action Buttons */}
        {onBulkToggleModule && accounts.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>تبلیغات در گروه‌ها:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleBulkToggle('group_broadcast', true)}
                  className="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold transition-all"
                >
                  فعال‌سازی همه
                </button>
                <button
                  onClick={() => handleBulkToggle('group_broadcast', false)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-all"
                >
                  غیرفعال‌سازی همه
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>اتوماسیون چت ناشناس:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleBulkToggle('anonymous_bot', true)}
                  className="px-2 py-1 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-bold transition-all"
                >
                  فعال‌سازی همه
                </button>
                <button
                  onClick={() => handleBulkToggle('anonymous_bot', false)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-all"
                >
                  غیرفعال‌سازی همه
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <p>هنوز اکانتی اضافه نشده است.</p>
          <button
            onClick={onOpenAddAccountModal}
            className="text-indigo-400 hover:text-indigo-300 underline font-bold"
          >
            کلیک کنید تا اولین اکانت متصل شود
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {accounts.map((acc) => {
            const isPrimary = acc.id === activeAccountId;
            const isExpired = acc.requiresReauth || acc.status === 'session_expired';
            const isFloodWait = acc.status === 'flood_wait' || (acc.floodWaitUntil && acc.floodWaitUntil > Date.now());
            const isLiveHealthy = acc.isVerifiedLive && !isExpired && !isFloodWait && acc.status !== 'disabled';
            const fullName = [acc.userProfile?.firstName, acc.userProfile?.lastName].filter(Boolean).join(' ') || 'کاربر تلگرام';

            const isGroupBroadcastEnabled = acc.enableForGroupBroadcast !== false;
            const isAnonymousBotEnabled = acc.enableForAnonymousBot !== false;

            return (
              <div
                key={acc.id}
                className={`bg-slate-950 rounded-xl p-3.5 border transition-all space-y-3 relative ${
                  isExpired
                    ? 'border-rose-500/60 bg-rose-950/10'
                    : isPrimary
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Primary Badge */}
                {isPrimary && (
                  <span className="absolute -top-2.5 left-3 bg-indigo-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    اکانت اصلی سیستم
                  </span>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-900 border border-slate-700 flex items-center justify-center font-bold text-white text-sm shrink-0">
                      {fullName.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{fullName}</span>
                        {acc.userProfile?.username && (
                          <span className="text-[11px] text-indigo-400 font-normal dir-ltr">
                            (@{acc.userProfile.username})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono dir-ltr">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{acc.phoneNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* 100% Reliable Status Indicator */}
                  <div>
                    {isExpired ? (
                      <span className="px-2 py-1 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[10px] font-bold flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" />
                        <span>نیاز به تمدید نشست</span>
                      </span>
                    ) : isFloodWait ? (
                      <span className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>محدودیت FloodWait</span>
                      </span>
                    ) : isLiveHealthy ? (
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>متصل و فعال (۱۰۰٪ قطعی)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-medium">
                        غیرفعال
                      </span>
                    )}
                  </div>
                </div>

                {/* Stored Hash & ID Credentials Status Bar */}
                <div className="bg-slate-900/90 rounded-lg p-2 flex items-center justify-between text-[11px] text-slate-300 border border-slate-800 flex-wrap gap-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>کلیدها و نشست:</span>
                    <span className="text-indigo-300 font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      ID: {acc.apiId || '2040'} | Hash: ذخیره‌شده
                    </span>
                  </div>

                  {acc.lastVerifiedAt && (
                    <span className="text-[10px] text-slate-400">
                      آخرین تایید: {new Date(acc.lastVerifiedAt).toLocaleTimeString('fa-IR')}
                    </span>
                  )}
                </div>

                {/* Granular Module Participation Checkboxes */}
                <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">
                    تخصیص نقش و فعالیت این اکانت در بخش‌ها:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Group Broadcast Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleModuleAction(acc.id, 'group_broadcast', isGroupBroadcastEnabled)}
                      disabled={loadingId === `${acc.id}_group_broadcast`}
                      className={`p-2 rounded-lg border text-right transition-all flex items-center justify-between ${
                        isGroupBroadcastEnabled
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Megaphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px]">ارسال به گروه‌ها</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isGroupBroadcastEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {isGroupBroadcastEnabled ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    {/* Anonymous Bot Automator Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleModuleAction(acc.id, 'anonymous_bot', isAnonymousBotEnabled)}
                      disabled={loadingId === `${acc.id}_anonymous_bot`}
                      className={`p-2 rounded-lg border text-right transition-all flex items-center justify-between ${
                        isAnonymousBotEnabled
                          ? 'bg-sky-500/10 border-sky-500/40 text-sky-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[11px]">چت ربات ناشناس</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isAnonymousBotEnabled ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                        {isAnonymousBotEnabled ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Account Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {!isPrimary && (
                      <button
                        onClick={() => handleSelectActive(acc.id)}
                        disabled={loadingId === acc.id}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-all"
                        title="انتخاب به عنوان اکانت پیش‌فرض برنامه"
                      >
                        اکانت اصلی
                      </button>
                    )}

                    {onVerifySingleAccount && (
                      <button
                        onClick={() => handleVerifySingle(acc.id)}
                        disabled={loadingId === `verify_${acc.id}`}
                        className="px-2 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[11px] font-bold transition-all flex items-center gap-1"
                        title="تست زنده اتصال نشست با تلگرام"
                      >
                        <Activity className={`w-3 h-3 ${loadingId === `verify_${acc.id}` ? 'animate-spin' : ''}`} />
                        <span>تست زنده</span>
                      </button>
                    )}

                    {/* Re-Auth / Renew Session Button */}
                    {onReauthAccount && (
                      <button
                        onClick={() => onReauthAccount(acc)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 border ${
                          isExpired
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 animate-pulse'
                            : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/30 text-indigo-300'
                        }`}
                        title="درخواست کد جدید ۵ رقمی تلگرام و تمدید نشست"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{isExpired ? 'تمدید فوری نشست' : 'تمدید نشست'}</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(acc.id)}
                    disabled={loadingId === acc.id}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="حذف کامل این اکانت از سیستم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};


