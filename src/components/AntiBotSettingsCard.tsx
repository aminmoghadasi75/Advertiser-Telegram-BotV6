import React, { useState } from 'react';
import {
  ShieldCheck,
  Bot,
  UserPlus,
  Link,
  Check,
  Sparkles,
  Sliders,
  MessageSquare,
  Zap,
  Shuffle,
  Keyboard,
  Eye,
} from 'lucide-react';
import { AntiBotSettings } from '../types';

interface AntiBotSettingsCardProps {
  settings?: AntiBotSettings;
  onSaveAntiBotSettings: (settings: AntiBotSettings) => Promise<void>;
}

export const AntiBotSettingsCard: React.FC<AntiBotSettingsCardProps> = ({
  settings,
  onSaveAntiBotSettings,
}) => {
  const [autoClickCaptcha, setAutoClickCaptcha] = useState(settings?.autoClickCaptcha ?? true);
  const [autoForceJoinChannels, setAutoForceJoinChannels] = useState(settings?.autoForceJoinChannels ?? true);
  const [autoInviteContacts, setAutoInviteContacts] = useState(settings?.autoInviteContacts ?? true);
  const [contactsToInviteCount, setContactsToInviteCount] = useState(settings?.contactsToInviteCount ?? 3);
  const [sendGreetingFirst, setSendGreetingFirst] = useState(settings?.sendGreetingFirst ?? true);
  const [greetingMessage, setGreetingMessage] = useState(settings?.greetingMessage ?? 'سلام بچه ها');
  
  // 4 Core Upgrade Capabilities
  const [simulateTyping, setSimulateTyping] = useState(settings?.simulateTyping ?? true);
  const [typingDurationSeconds, setTypingDurationSeconds] = useState(settings?.typingDurationSeconds ?? 2);
  const [enableSpintax, setEnableSpintax] = useState(settings?.enableSpintax ?? true);
  const [cacheMediaInput, setCacheMediaInput] = useState(settings?.cacheMediaInput ?? true);
  const [verifyMessagePersistence, setVerifyMessagePersistence] = useState(settings?.verifyMessagePersistence ?? true);
  const [persistenceCheckDelaySeconds, setPersistenceCheckDelaySeconds] = useState(settings?.persistenceCheckDelaySeconds ?? 15);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-save whenever settings change
  const triggerAutoSave = async (overrides?: Partial<AntiBotSettings>) => {
    setIsSaving(true);
    try {
      await onSaveAntiBotSettings({
        autoClickCaptcha,
        autoForceJoinChannels,
        autoInviteContacts,
        contactsToInviteCount,
        sendGreetingFirst,
        greetingMessage,
        simulateTyping,
        typingDurationSeconds,
        enableSpintax,
        cacheMediaInput,
        verifyMessagePersistence,
        persistenceCheckDelaySeconds,
        ...overrides,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerAutoSave();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              سیستم هوشمند ضد اسپم، شبیه‌سازی انسانی و عبور از موانع گروه‌ها
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Anti-Spam V2
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              کش مدیا، Spintax متن، شبیه‌سازی تایپینگ انسانی، پایش ماندگاری پیام و عبور خودکار از قفل‌های بات‌های ناظر
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Feature 1: Media Cache (InputMedia File ID) */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white flex items-center gap-2">
                کش کردن مدیا (File ID Caching) جهت سرعت فوق‌العاده و صرفه‌جویی ۹۹٪ ترافیک
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                  سرعت 10x
                </span>
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                تصویر کمپین فقط یک‌بار روی تلگرام آپلود شده و برای تمام گروه‌ها با استفاده از File ID در کسری از ثانیه و بدون مصرف حجم مجدد ارسال می‌شود.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={cacheMediaInput}
            onChange={(e) => {
              const checked = e.target.checked;
              setCacheMediaInput(checked);
              triggerAutoSave({ cacheMediaInput: checked });
            }}
            className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 accent-cyan-500 cursor-pointer flex-shrink-0"
          />
        </div>

        {/* Feature 2: Spintax & Dynamic Text Variables */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white flex items-center gap-2">
                قابلیت Spintax و متغیرهای متنی پویا (Dynamic Text & Fingerprint Masking)
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                  ضد اسپم تلگرام
                </span>
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                پشتیبانی از دستورات سینتکس چندگانه مانند {'{سلام|درود}'} و برچسب‌های خودکار نام گروه، ساعت ارسال، اموجی تصادفی و کد پیگیری جهت جلوگیری از شناسایی به عنوان ربات.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enableSpintax}
            onChange={(e) => {
              const checked = e.target.checked;
              setEnableSpintax(checked);
              triggerAutoSave({ enableSpintax: checked });
            }}
            className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer flex-shrink-0"
          />
        </div>

        {/* Feature 3: Human Typing Simulation (SetTyping Action) */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  شبیه‌سازی اکشن تایپینگ انسانی واقعی (SetTyping Human Mimicry)
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">
                    طبیعی و ارگانیک
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  قبل از انتشار پیام، اکشن «is typing...» به تلگرام ارسال می‌شود و با تاخیر شناور و طبیعی مانند یک کاربر واقعی پیام منتشر می‌شود.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={simulateTyping}
              onChange={(e) => {
                const checked = e.target.checked;
                setSimulateTyping(checked);
                triggerAutoSave({ simulateTyping: checked });
              }}
              className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer flex-shrink-0"
            />
          </div>

          {simulateTyping && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
              <label className="text-xs text-slate-300 font-medium">
                مدت زمان شبیه‌سازی تایپینگ قبل از ارسال:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={8}
                  step={0.5}
                  value={typingDurationSeconds}
                  onChange={(e) => setTypingDurationSeconds(parseFloat(e.target.value) || 2)}
                  onBlur={() => triggerAutoSave()}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-slate-400">ثانیه (با نوسان رندوم)</span>
              </div>
            </div>
          )}
        </div>

        {/* Feature 4: Post-Broadcast Persistence Check */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white flex items-center gap-2">
                  تست و پایش ماندگاری پیام پس از ارسال (Post-Broadcast Persistence Check)
                  <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono">
                    کشف ربات‌های حذف خودکار
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  پس از ارسال موفق، سیستم پس از مدت مشخصی بررسی می‌کند که آیا پیام در گروه باقی مانده یا توسط ربات ادمین حذف شده است و وضعیت گروه را علامت‌گذاری می‌کند.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={verifyMessagePersistence}
              onChange={(e) => {
                const checked = e.target.checked;
                setVerifyMessagePersistence(checked);
                triggerAutoSave({ verifyMessagePersistence: checked });
              }}
              className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer flex-shrink-0"
            />
          </div>

          {verifyMessagePersistence && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
              <label className="text-xs text-slate-300 font-medium">
                زمان شکیبایی جهت بررسی ماندگاری پیام:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={60}
                  step={5}
                  value={persistenceCheckDelaySeconds}
                  onChange={(e) => setPersistenceCheckDelaySeconds(parseInt(e.target.value, 10) || 15)}
                  onBlur={() => triggerAutoSave()}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-rose-500"
                />
                <span className="text-xs text-slate-400">ثانیه پس از ارسال</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Toggle: Send Initial Test Greeting */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">
                  ارسال پیام احوالپرسی اولیه جهت تحریک و تست واکنش ربات نگهبان
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  ارسال یک پیام ساده انسانی (مانند «سلام بچه ها») و شکیبایی جهت دریافت واکنش یا کاپچای ربات ناظر قبل از ارسال تبلیغ اصلی.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sendGreetingFirst}
              onChange={(e) => {
                const checked = e.target.checked;
                setSendGreetingFirst(checked);
                triggerAutoSave({ sendGreetingFirst: checked });
              }}
              className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-purple-500 accent-purple-500 cursor-pointer flex-shrink-0"
            />
          </div>

          {sendGreetingFirst && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
              <label className="text-xs text-slate-300 font-medium">
                متن پیام تست اولیه:
              </label>
              <input
                type="text"
                value={greetingMessage}
                onChange={(e) => setGreetingMessage(e.target.value)}
                onBlur={() => triggerAutoSave()}
                placeholder="سلام بچه ها"
                className="w-48 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-right text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>

        {/* Toggle: Auto Click Inline Buttons / Captcha */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">
                کلیک خودکار روی دکمه‌های شیشه‌ای «من ربات نیستم» / تایید کاپچا
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                ربات پس از ورود به گروه، دکمه‌های شیشه‌ای ربات‌های نگهبان (RoseBot, GroupHelp, Shield...) را شناسایی و به صورت خودکار تایید می‌کند.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoClickCaptcha}
            onChange={(e) => {
              const checked = e.target.checked;
              setAutoClickCaptcha(checked);
              triggerAutoSave({ autoClickCaptcha: checked });
            }}
            className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-purple-500 accent-purple-500 cursor-pointer flex-shrink-0"
          />
        </div>

        {/* Toggle: Auto Force Join Channels */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">
                عضویت هوشمند در کانال‌های اجباری قفل گروه
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                اگر گروه ارسال پیام را مشروط به عضویت در یک کانال کرده باشد، ربات خودکار در آن کانال عضو شده و دکمه بررسی را فشار می‌دهد.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={autoForceJoinChannels}
            onChange={(e) => {
              const checked = e.target.checked;
              setAutoForceJoinChannels(checked);
              triggerAutoSave({ autoForceJoinChannels: checked });
            }}
            className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-purple-500 accent-purple-500 cursor-pointer flex-shrink-0"
          />
        </div>

        {/* Toggle: Auto Invite Contacts */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">
                  افزودن هوشمند مخاطبین تلگرام جهت آزاد شدن قفل ارسال (Force Add Members)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  چنانچه ربات گروه درخواست اضافه کردن ۳ یا ۵ نفر کند، سیستم به صورت رندوم مخاطبین اکانت شما را به گروه اضافه می‌نماید.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoInviteContacts}
              onChange={(e) => {
                const checked = e.target.checked;
                setAutoInviteContacts(checked);
                triggerAutoSave({ autoInviteContacts: checked });
              }}
              className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-purple-500 accent-purple-500 cursor-pointer flex-shrink-0"
            />
          </div>

          {autoInviteContacts && (
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
              <label className="text-xs text-slate-300 font-medium">
                تعداد مخاطبین جهت اد کردن در هر گروه:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={contactsToInviteCount}
                  onChange={(e) => setContactsToInviteCount(parseInt(e.target.value) || 3)}
                  onBlur={() => triggerAutoSave()}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <span className="text-xs text-slate-400">نفر</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          {savedSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <Check className="w-4 h-4" /> تنظیمات هوشمند ضد اسپم و عبور از قفل‌ها ذخیره شد.
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              ⚡ تمامی فرآیندها کاملاً ناتیو، بهینه‌سازی‌شده و شبیه‌سازی‌شده مانند رفتار کاربر واقعی انجام می‌شوند.
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sliders className="w-4 h-4" />
            <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات پیشرفته'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
