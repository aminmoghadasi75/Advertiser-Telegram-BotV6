import React, { useState, useEffect } from 'react';
import { UserPlus, Phone, Key, Lock, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApiId?: string;
  defaultApiHash?: string;
  targetAccount?: { id: string; phoneNumber: string; apiId?: string; apiHash?: string } | null;
  onAccountAdded: () => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  defaultApiId = '2040',
  defaultApiHash = 'b18441a1ff607e10a989891a5462e627',
  targetAccount,
  onAccountAdded,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiId, setApiId] = useState(defaultApiId);
  const [apiHash, setApiHash] = useState(defaultApiHash);
  const [sessionId, setSessionId] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [twoFaPassword, setTwoFaPassword] = useState('');

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isRenewalMode = Boolean(targetAccount);

  useEffect(() => {
    if (isOpen) {
      if (targetAccount) {
        setPhoneNumber(targetAccount.phoneNumber || '');
        setApiId(targetAccount.apiId || defaultApiId || '2040');
        setApiHash(targetAccount.apiHash || defaultApiHash || 'b18441a1ff607e10a989891a5462e627');
      } else {
        setPhoneNumber('');
        setApiId(defaultApiId || '2040');
        setApiHash(defaultApiHash || 'b18441a1ff607e10a989891a5462e627');
      }
      setSessionId('');
      setPhoneCode('');
      setTwoFaPassword('');
      setStep('phone');
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, targetAccount, defaultApiId, defaultApiHash]);

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMessage('لطفاً شماره تلفن اکانت تلگرام را وارد نمایید.');
      return;
    }
    if (!apiId.trim() || !apiHash.trim()) {
      setErrorMessage('لطفاً API ID و API Hash را وارد کنید.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const endpoint = isRenewalMode ? '/api/accounts/renew-start' : '/api/accounts/add-start';
      const bodyPayload = isRenewalMode
        ? { accountId: targetAccount?.id, phoneNumber: phoneNumber.trim(), apiId: apiId.trim(), apiHash: apiHash.trim() }
        : { phoneNumber: phoneNumber.trim(), apiId: apiId.trim(), apiHash: apiHash.trim() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'خطا در ارسال کد تایید به شماره وارد شده');
      }

      setSessionId(data.sessionId);
      setStep('code');
      setSuccessMessage('کد تایید ۵ رقمی تلگرام به شماره شما ارسال گردید.');
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور تلگرام');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneCode.trim()) {
      setErrorMessage('لطفاً کد تایید ارسالی را وارد فرمایید.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/accounts/add-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          phoneCode: phoneCode.trim(),
          password: twoFaPassword.trim() || undefined,
          targetAccountId: targetAccount?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.requiresPassword) {
          throw new Error('حساب شما دارای رمز تایید دو مرحله‌ای (2FA) است. لطفاً رمز را وارد کنید.');
        }
        throw new Error(data.error || 'کد ورود نادرست است یا منقضی شده است.');
      }

      setSuccessMessage(isRenewalMode ? 'نشست اکانت با موفقیت تمدید و فعال گردید.' : 'اکانت جدید با موفقیت اضافه و تایید شد.');
      setTimeout(() => {
        onAccountAdded();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در تایید کد ورود');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      dir="rtl"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg text-slate-100 shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">افزودن اکانت جدید تلگرام</h2>
              <p className="text-[11px] text-slate-400">ذخیره دائم اکانت جهت سوییچ سریع و استفاده در چت ناشناس و ارسال گروهی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendCode} className="space-y-3.5">
              {/* Presets */}
              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  کلیدهای API رسمی تلگرام:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setApiId('2040');
                      setApiHash('b18441a1ff607e10a989891a5462e627');
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-right transition-all flex flex-col ${
                      apiId === '2040'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold text-[10px] text-white">🖥️ تلگرام دسکتاپ (2040)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApiId('6');
                      setApiHash('eb06d4abfb49dc3eeb1aeb98ae0f581e');
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-right transition-all flex flex-col ${
                      apiId === '6'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-bold text-[10px] text-white">📱 تلگرام اندروید (6)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
                    <Key className="w-3 h-3 text-indigo-400" />
                    API ID:
                  </label>
                  <input
                    type="text"
                    value={apiId}
                    onChange={(e) => setApiId(e.target.value)}
                    placeholder="2040"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors dir-ltr font-mono text-left"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
                    <Lock className="w-3 h-3 text-indigo-400" />
                    API Hash:
                  </label>
                  <input
                    type="text"
                    value={apiHash}
                    onChange={(e) => setApiHash(e.target.value)}
                    placeholder="b18441..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors dir-ltr font-mono text-left"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  شماره تلفن اکانت جدید (همراه با کد کشور):
                </label>
                <input
                  type="text"
                  placeholder="مثال: +989123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors dir-ltr text-left font-mono"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'در حال ارسال کد به تلگرام...' : 'دریافت کد تایید تلگرام'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-3.5">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300">
                کد تایید ۵ رقمی به تلگرام شماره{' '}
                <span className="font-bold dir-ltr inline-block font-mono">{phoneNumber}</span> ارسال شد.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  کد تایید ۵ رقمی تلگرام:
                </label>
                <input
                  type="text"
                  placeholder="12345"
                  maxLength={6}
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-center text-lg tracking-[0.4em] font-bold text-indigo-400 focus:outline-none transition-colors dir-ltr font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1 block">
                  رمز تایید دو مرحله‌ای ۲FA (در صورت فعال بودن روی اکانت):
                </label>
                <input
                  type="password"
                  placeholder="رمز عبور دو مرحله‌ای (اختیاری)"
                  value={twoFaPassword}
                  onChange={(e) => setTwoFaPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  ویرایش شماره
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'در حال ثبت نهایی اکانت...' : 'تایید و ثبت اکانت'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
