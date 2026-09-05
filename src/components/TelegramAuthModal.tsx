import React, { useState, useEffect, useRef } from 'react';
import {
  Key,
  Phone,
  Shield,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Sparkles,
  HelpCircle,
  LogOut,
  RefreshCw,
  Users,
  Check,
  UserCheck,
  PlusCircle,
} from 'lucide-react';
import { TelegramCredentials, TelegramAccount } from '../types';

interface TelegramAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: TelegramCredentials;
  accounts?: TelegramAccount[];
  activeAccountId?: string;
  onSelectActiveAccount?: (accountId: string) => Promise<void>;
  onDeleteAccount?: (accountId: string) => Promise<void>;
  onSaveCredentials: (apiId: string, apiHash: string, phoneNumber: string, botToken?: string) => Promise<void>;
  onSendCode: (phoneNumber: string) => Promise<void>;
  onVerifyCode: (phoneCode: string, password?: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export const TelegramAuthModal: React.FC<TelegramAuthModalProps> = ({
  isOpen,
  onClose,
  credentials,
  accounts = [],
  activeAccountId,
  onSelectActiveAccount,
  onDeleteAccount,
  onSaveCredentials,
  onSendCode,
  onVerifyCode,
  onLogout,
}) => {
  const [apiId, setApiId] = useState(credentials.apiId || '2040');
  const [apiHash, setApiHash] = useState(credentials.apiHash || 'b18441a1ff607e10a989891a5462e627');
  const [phoneNumber, setPhoneNumber] = useState(credentials.phoneNumber || '');
  const [botToken, setBotToken] = useState(credentials.botToken || '');
  const [phoneCode, setPhoneCode] = useState('');
  const [twoFaPassword, setTwoFaPassword] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'saved_accounts' | 'new_login'>(
    accounts.length > 0 ? 'saved_accounts' : 'new_login'
  );

  const [step, setStep] = useState<'credentials' | 'code' | 'connected'>(
    credentials.isConnected ? 'connected' : credentials.phoneCodeHash ? 'code' : 'credentials'
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [botTestTarget, setBotTestTarget] = useState('');
  const [botTesting, setBotTesting] = useState(false);

  // Initialize form values ONLY when modal opens to prevent clobbering user typing during background polling
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setApiId(credentials.apiId || '2040');
      setApiHash(credentials.apiHash || 'b18441a1ff607e10a989891a5462e627');
      setPhoneNumber(credentials.phoneNumber || '');
      setBotToken(credentials.botToken || '');
      setPhoneCode('');
      setTwoFaPassword('');
      setErrorMessage('');
      setSuccessMessage('');
      setStep(credentials.isConnected ? 'connected' : credentials.phoneCodeHash ? 'code' : 'credentials');
      setActiveSubTab(accounts.length > 0 ? 'saved_accounts' : 'new_login');
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, credentials.isConnected, credentials.phoneCodeHash, accounts.length]);

  if (!isOpen) return null;

  const normalizeClientToken = (val: string) => {
    let clean = val.trim();
    if (/^[a-zA-Z0-9_-]+:\d+$/.test(clean)) {
      const parts = clean.split(':');
      clean = `${parts[1]}:${parts[0]}`;
    }
    return clean;
  };

  const handleSaveAndSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiId.trim() || !apiHash.trim()) {
      setErrorMessage('لطفاً API ID و API Hash را به طور کامل وارد کنید.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('لطفاً شماره تلفن همراه اکانت تلگرام خود را وارد کنید.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await onSaveCredentials(apiId.trim(), apiHash.trim(), phoneNumber.trim(), normalizeClientToken(botToken));
      await onSendCode(phoneNumber.trim());
      setStep('code');
      setSuccessMessage('کد تایید ۵ رقمی تلگرام با موفقیت ارسال شد. لطفاً کد دریافتی را وارد کنید.');
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ثبت و ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleReauthAccount = async (acc: TelegramAccount) => {
    const accApiId = acc.apiId || '2040';
    const accApiHash = acc.apiHash || 'b18441a1ff607e10a989891a5462e627';
    const accPhone = acc.phoneNumber;

    setApiId(accApiId);
    setApiHash(accApiHash);
    setPhoneNumber(accPhone);
    setPhoneCode('');
    setTwoFaPassword('');
    setActiveSubTab('new_login');
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await onSaveCredentials(accApiId, accApiHash, accPhone, normalizeClientToken(botToken));
      await onSendCode(accPhone);
      setStep('code');
      setSuccessMessage(`کد تایید ۵ رقمی جدید به تلگرام شماره ${accPhone} ارسال گردید. لطفاً کد را وارد فرمایید.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارسال کد تایید جهت تمدید نشست');
      setStep('credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleExplicitLogout = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await onLogout();
      setStep('credentials');
      setActiveSubTab('new_login');
      setPhoneCode('');
      setTwoFaPassword('');
      setSuccessMessage('نشست قبلی با موفقیت قطع و باطل شد. اکنون می‌توانید با کلیک روی «ذخیره و دریافت کد»، نشست جدید با کد ۵ رقمی دریافت نمایید.');
    } catch (e: any) {
      setErrorMessage(e.message || 'خطا در خروج از حساب');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSavedAccount = async (accId: string, accName: string) => {
    if (!onDeleteAccount) return;
    if (confirm(`آیا از حذف اکانت (${accName}) و پاکسازی نشست آن از سیستم اطمینان دارید؟`)) {
      setLoading(true);
      setErrorMessage('');
      try {
        await onDeleteAccount(accId);
        setSuccessMessage(`اکانت (${accName}) با موفقیت حذف شد.`);
      } catch (e: any) {
        setErrorMessage(e.message || 'خطا در حذف اکانت');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveBotTokenOnly = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    const cleanTok = normalizeClientToken(botToken);
    setBotToken(cleanTok);

    try {
      await onSaveCredentials(
        apiId || credentials.apiId,
        apiHash || credentials.apiHash,
        phoneNumber || credentials.phoneNumber,
        cleanTok
      );
      setSuccessMessage('توکن ربات واسط (Bot API) با موفقیت در سیستم ذخیره گردید.');
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ذخیره توکن ربات');
    } finally {
      setLoading(false);
    }
  };

  const handleTestBotApi = async () => {
    const cleanTok = normalizeClientToken(botToken);
    if (!cleanTok) {
      setErrorMessage('لطفاً ابتدا توکن ربات واسط را وارد کنید.');
      return;
    }
    if (!botTestTarget.trim()) {
      setErrorMessage('لطفاً آیدی گروه/چت هدف جهت تست ارسال ربات را وارد کنید.');
      return;
    }

    setBotTesting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/send-direct-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: botTestTarget.trim(),
          botToken: cleanTok,
          useBotOnly: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`✅ ${data.message || 'پیام تست با موفقیت توسط ربات واسط ارسال گردید.'}`);
      } else {
        setErrorMessage(data.error || 'خطا در ارسال تست با ربات واسط');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'خطا در شبکه هنگام تست ربات واسط');
    } finally {
      setBotTesting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneCode.trim()) {
      setErrorMessage('لطفاً کد تایید ۵ رقمی تلگرام را وارد کنید.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await onVerifyCode(phoneCode.trim(), twoFaPassword.trim() || undefined);
      setStep('connected');
      setSuccessMessage('ورود به تلگرام با موفقیت انجام شد و اکانت در حافظه ذخیره گردید.');
    } catch (err: any) {
      setErrorMessage(err.message || 'کد تایید اشتباه است یا منقضی شده است.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (accId: string) => {
    if (!onSelectActiveAccount) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await onSelectActiveAccount(accId);
      setSuccessMessage('اکانت فعال با موفقیت تغییر یافت و کلاینت تلگرام آماده به کار است.');
    } catch (e: any) {
      setErrorMessage(e.message || 'خطا در تغییر اکانت فعال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      dir="rtl"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl text-slate-100 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">مدیریت حساب‌ها و اتصال به تلگرام</h2>
              <p className="text-xs text-slate-400">انتخاب سریع با یک کلیک یا ورود با API اختصاصی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (Saved Accounts vs New Login) */}
        {accounts.length > 0 && (
          <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('saved_accounts');
                setErrorMessage('');
              }}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeSubTab === 'saved_accounts'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>حساب‌های ذخیره‌شده ({accounts.length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('new_login');
                setErrorMessage('');
              }}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeSubTab === 'new_login'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>ورود به حساب جدید با API / شماره</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Messages */}
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SAVED ACCOUNTS 1-CLICK SELECTOR */}
          {activeSubTab === 'saved_accounts' && accounts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  حساب‌های متصل قبلی (سوییچ سریع یا تمدید سشن):
                </span>
                <span className="text-[11px] text-slate-400">
                  اگر نشستی منقضی شده است، روی «تمدید نشست» کلیک کنید
                </span>
              </div>

              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isCurrentActive =
                    acc.id === activeAccountId ||
                    (acc.phoneNumber && acc.phoneNumber === credentials.phoneNumber && credentials.isConnected);
                  const fullName = [acc.userProfile?.firstName, acc.userProfile?.lastName].filter(Boolean).join(' ') || 'کاربر تلگرام';

                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrentActive
                          ? 'bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isCurrentActive
                              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {fullName[0] || 'T'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-white">
                              {fullName}
                            </span>
                            {isCurrentActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                اکانت فعال فعلی
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="font-mono dir-ltr">{acc.phoneNumber}</span>
                            {acc.userProfile?.username && <span>@{acc.userProfile.username}</span>}
                            <span className="text-[10px] text-slate-500">
                              (API: {acc.apiId || '2040'})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                        {!isCurrentActive ? (
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleQuickSwitch(acc.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            انتخاب با ۱ کلیک
                          </button>
                        ) : (
                          <div className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-xs font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>متصل</span>
                          </div>
                        )}

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleReauthAccount(acc)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                          title="تمدید سشن و ارسال مجدد کد ۵ رقمی برای این شماره در صورت انقضای نشست"
                        >
                          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                          <span>تمدید نشست (کد ۵ رقمی)</span>
                        </button>

                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleDeleteSavedAccount(acc.id, fullName)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="حذف و ابطال سشن این اکانت"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('new_login')}
                  className="text-xs text-sky-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  افزودن و لاگین با یک اکانت تلگرام جدید
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: NEW LOGIN / EDIT API CREDENTIALS */}
          {(activeSubTab === 'new_login' || accounts.length === 0) && (
            <>
              {/* Status Banner */}
              {credentials.isConnected ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-400">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-sm">حساب تلگرام شما با موفقیت متصل است</div>
                      <div className="text-xs text-emerald-300/80">
                        {credentials.userProfile?.firstName}{' '}
                        {credentials.userProfile?.username ? `(@${credentials.userProfile.username})` : ''} (
                        {credentials.phoneNumber})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleReauthAccount({
                        id: 'curr',
                        phoneNumber: credentials.phoneNumber,
                        apiId: credentials.apiId,
                        apiHash: credentials.apiHash,
                        userProfile: credentials.userProfile,
                        sessionString: credentials.sessionString || '',
                        dailySentCount: 0,
                        status: 'active',
                        isActive: true,
                      })}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      title="درخواست کد ۵ رقمی جدید برای همین شماره و تمدید سشن"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>تمدید نشست با کد ۵ رقمی</span>
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleExplicitLogout}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>خروج از حساب</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3 text-amber-300 text-xs">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
                  <div>
                    برای اتصال اکانت تلگرام جدید یا ورود مجدد به اکانت قبلی، شناسه{' '}
                    <span className="font-bold">api_id</span> و <span className="font-bold">api_hash</span> و شماره تلفن را وارد کنید و روی «ذخیره و دریافت کد» کلیک نمایید.
                  </div>
                </div>
              )}

              {/* STEP 1: Enter API ID & API Hash & Phone Number */}
              {step === 'credentials' && (
                <form onSubmit={handleSaveAndSendCode} className="space-y-4">
                  {/* Quick API Key Presets */}
                  <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span className="font-semibold flex items-center gap-1.5 text-sky-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        انتخاب سریع کلیدهای رسمی تلگرام:
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setApiId('2040');
                          setApiHash('b18441a1ff607e10a989891a5462e627');
                          setErrorMessage('');
                        }}
                        className={`py-2 px-3 rounded-lg border text-right transition-all flex flex-col gap-0.5 ${
                          apiId === '2040'
                            ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="font-bold text-[11px] text-white">🖥️ تلگرام دسکتاپ رسمی</span>
                        <span className="text-[10px] text-slate-400">api_id: 2040 (پیشنهادی)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setApiId('6');
                          setApiHash('eb06d4abfb49dc3eeb1aeb98ae0f581e');
                          setErrorMessage('');
                        }}
                        className={`py-2 px-3 rounded-lg border text-right transition-all flex flex-col gap-0.5 ${
                          apiId === '6'
                            ? 'bg-sky-500/20 border-sky-500/50 text-sky-200'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="font-bold text-[11px] text-white">📱 تلگرام اندروید رسمی</span>
                        <span className="text-[10px] text-slate-400">api_id: 6</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-sky-400" />
                      کلید API ID (شناسه عددی - قابل ویرایش):
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelp(!showHelp)}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      راهنمای دریافت api_id اختصاصی
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="مثال: 2040 یا کلید عددی اختصاصی"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors dir-ltr text-left font-mono"
                  />

                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <Lock className="w-3.5 h-3.5 text-sky-400" />
                      کلید API Hash (کد ۳۲ کاراکتری - قابل ویرایش):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: b18441a1ff607e10a989891a5462e627"
                      value={apiHash}
                      onChange={(e) => setApiHash(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors dir-ltr text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      شماره تلفن اکانت تلگرام (همراه با کد کشور):
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: +989123456789"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors dir-ltr text-left font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'در حال ارسال کد به تلگرام...' : 'ذخیره کلیدها و دریافت کد تایید تلگرام'}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter Telegram OTP Code */}
              {step === 'code' && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3.5 text-xs text-sky-300">
                    کد تایید ۵ رقمی به تلگرام شماره{' '}
                    <span className="font-bold dir-ltr inline-block font-mono">{phoneNumber}</span> ارسال شد. لطفاً
                    پیام‌های تلگرام خود را چک کرده و کد را وارد کنید.
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                      کد تایید ۵ رقمی تلگرام:
                    </label>
                    <input
                      type="text"
                      placeholder="12345"
                      maxLength={6}
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-bold text-sky-400 focus:outline-none transition-colors dir-ltr font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      رمز تایید دو مرحله‌ای ۲FA (در صورت وجود):
                    </label>
                    <input
                      type="password"
                      placeholder="رمز دو مرحله‌ای تلگرام (اختیاری)"
                      value={twoFaPassword}
                      onChange={(e) => setTwoFaPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                    >
                      ویرایش شماره و API
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'در حال تایید و ذخیره اکانت...' : 'تایید کد و ورود به تلگرام'}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Connected Summary */}
              {step === 'connected' && credentials.isConnected && (
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-slate-400">شناسه API ID:</span>
                      <span className="font-mono text-sky-400">{credentials.apiId}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-slate-400">شناسه API Hash:</span>
                      <span className="font-mono text-slate-300">
                        {credentials.apiHash ? credentials.apiHash.slice(0, 8) + '••••••••' : '---'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">شماره حساب فعال:</span>
                      <span className="dir-ltr text-slate-200 font-mono">{credentials.phoneNumber || '---'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep('credentials')}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors text-center"
                    >
                      افزودن / اتصال حسابی دیگر
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors text-center shadow-lg shadow-sky-600/20"
                    >
                      تایید و بستن
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* BOT API HELPER SECTION */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-sky-500/20 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-xs text-white">ربات واسط رسمی تلگرام (Bot API Helper)</span>
              </div>
              <span className="text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded-full font-mono">
                راهکار ضد محدودیت اکانت
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              💡 <strong className="text-sky-300">راهکار جایگزین:</strong> هنگام محدودیت موقت اکانت، ارسال پیام‌ها
              توسط ربات واسط به صورت اتوماتیک انجام خواهد شد.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>توکن ربات تلگرام (Bot API Token):</span>
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  ساخت ربات در BotFather@
                </a>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="مثال: 712345678:AAFg9xXyz..."
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveBotTokenOnly}
                  disabled={loading}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1 flex-shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  ذخیره توکن
                </button>
              </div>
            </div>

            {/* Test Sending via Bot API */}
            {botToken && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <label className="text-[11px] font-medium text-slate-300 block">
                  تست فوری ارسال پیام کمپین با ربات واسط:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="آیدی گروه/کانال یا آیدی عددی (مثال: @my_group)"
                    value={botTestTarget}
                    onChange={(e) => setBotTestTarget(e.target.value)}
                    style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}
                    className="flex-1 bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestBotApi}
                    disabled={botTesting}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1 flex-shrink-0"
                  >
                    {botTesting ? 'در حال تست...' : 'تست ارسال'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP-BY-STEP HELP GUIDE FOR API ID & API HASH */}
          {(showHelp || !credentials.isConnected) && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  چگونه API ID و API Hash تلگرام دریافت کنیم؟
                </span>
                <a
                  href="https://my.telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-sky-500/30 transition-colors"
                >
                  ورود به سایت my.telegram.org
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                <li>
                  به وب‌سایت رسمی تلگرام <strong className="text-sky-300">my.telegram.org</strong> مراجعه کنید.
                </li>
                <li>شماره تلفن همراه اکانت تلگرام خود را وارد کرده و کد تایید ارسالی به تلگرام را بزنید.</li>
                <li>
                  روی گزینه <strong className="text-sky-300">API development tools</strong> کلیک کنید.
                </li>
                <li>فرم ساخت اپلیکیشن را با دو کلمه دلخواه انگلیسی پر کنید.</li>
                <li>
                  کد <strong className="text-emerald-400">App api_id</strong> و{' '}
                  <strong className="text-emerald-400">App api_hash</strong> را کپی کرده و در کادرهای بالا وارد کنید.
                </li>
              </ol>
            </div>
          )}

          {/* RESET / LOGOUT ACTION BOX */}
          {(credentials.isConnected || credentials.sessionString) && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">نیاز به خروج از حساب فعال فعلی دارید؟</span>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await onLogout();
                  setLoading(false);
                  setStep('credentials');
                  setErrorMessage('');
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج از حساب فعال</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
