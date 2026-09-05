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
  Cpu,
  Hash,
  ShieldAlert,
  Shield,
  CheckCircle2,
  Gauge,
  Lock,
} from 'lucide-react';
import { AntiBotSettings } from '../types';

interface AntiBotSettingsCardProps {
  settings?: AntiBotSettings;
  onSaveAntiBotSettings: (settings: AntiBotSettings) => Promise<void>;
}

type CategoryTab = 'all' | 'safety' | 'bypass' | 'performance';

export const AntiBotSettingsCard: React.FC<AntiBotSettingsCardProps> = ({
  settings,
  onSaveAntiBotSettings,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  const [autoClickCaptcha, setAutoClickCaptcha] = useState(settings?.autoClickCaptcha ?? true);
  const [autoForceJoinChannels, setAutoForceJoinChannels] = useState(settings?.autoForceJoinChannels ?? true);
  const [autoInviteContacts, setAutoInviteContacts] = useState(settings?.autoInviteContacts ?? false);
  const [contactsToInviteCount, setContactsToInviteCount] = useState(settings?.contactsToInviteCount ?? 3);
  const [safeContactShield, setSafeContactShield] = useState(settings?.safeContactShield ?? true);
  const [sendGreetingFirst, setSendGreetingFirst] = useState(settings?.sendGreetingFirst ?? false);
  const [greetingMode, setGreetingMode] = useState<string>(settings?.greetingMode ?? 'stealth_silent');
  const [greetingMessage, setGreetingMessage] = useState(settings?.greetingMessage ?? 'سلام بچه ها');
  const [autoSolveMathCaptcha, setAutoSolveMathCaptcha] = useState(settings?.autoSolveMathCaptcha ?? true);
  const [safeMembershipRetention, setSafeMembershipRetention] = useState(settings?.safeMembershipRetention ?? true);
  const [supportForumTopics, setSupportForumTopics] = useState(settings?.supportForumTopics ?? true);

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
        safeContactShield,
        sendGreetingFirst,
        greetingMode: (greetingMode as any) || 'stealth_silent',
        greetingMessage,
        autoSolveMathCaptcha,
        safeMembershipRetention,
        supportForumTopics,
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

  // Quick Presets
  const applyPreset = (preset: 'maximum_safety' | 'high_speed' | 'bypass_all') => {
    if (preset === 'maximum_safety') {
      const updates = {
        safeContactShield: true,
        safeMembershipRetention: true,
        simulateTyping: true,
        typingDurationSeconds: 2.5,
        enableSpintax: true,
        autoSolveMathCaptcha: true,
        autoClickCaptcha: true,
        supportForumTopics: true,
        cacheMediaInput: true,
        sendGreetingFirst: false,
        greetingMode: 'stealth_silent' as const,
        autoInviteContacts: false,
      };
      setSafeContactShield(true);
      setSafeMembershipRetention(true);
      setSimulateTyping(true);
      setTypingDurationSeconds(2.5);
      setEnableSpintax(true);
      setAutoSolveMathCaptcha(true);
      setAutoClickCaptcha(true);
      setSupportForumTopics(true);
      setCacheMediaInput(true);
      setSendGreetingFirst(false);
      setGreetingMode('stealth_silent');
      setAutoInviteContacts(false);
      triggerAutoSave(updates);
    } else if (preset === 'high_speed') {
      const updates = {
        cacheMediaInput: true,
        simulateTyping: true,
        typingDurationSeconds: 1,
        enableSpintax: true,
        autoClickCaptcha: true,
        supportForumTopics: true,
        autoSolveMathCaptcha: true,
        verifyMessagePersistence: false,
        safeContactShield: true,
        safeMembershipRetention: true,
      };
      setCacheMediaInput(true);
      setSimulateTyping(true);
      setTypingDurationSeconds(1);
      setEnableSpintax(true);
      setAutoClickCaptcha(true);
      setSupportForumTopics(true);
      setAutoSolveMathCaptcha(true);
      setVerifyMessagePersistence(false);
      triggerAutoSave(updates);
    } else if (preset === 'bypass_all') {
      const updates = {
        autoClickCaptcha: true,
        autoSolveMathCaptcha: true,
        autoForceJoinChannels: true,
        supportForumTopics: true,
        simulateTyping: true,
        typingDurationSeconds: 2,
        safeMembershipRetention: true,
      };
      setAutoClickCaptcha(true);
      setAutoSolveMathCaptcha(true);
      setAutoForceJoinChannels(true);
      setSupportForumTopics(true);
      setSimulateTyping(true);
      setTypingDurationSeconds(2);
      setSafeMembershipRetention(true);
      triggerAutoSave(updates);
    }
  };

  // Reusable Switch Component
  const ToggleSwitch = ({
    checked,
    onChange,
    disabled = false,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-indigo-600' : 'bg-slate-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? '-translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              سیستم هوشمند ضد اسپم و عبور از موانع گروه‌ها
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                Anti-Spam Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              شبیه‌سازی الگوی انسانی، خنثی‌سازی ربات‌های ناظر، کش مدیا و پایش سلامت اکانت‌ها
            </p>
          </div>
        </div>

        {/* Action / Save Status */}
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" /> ذخیره شد
            </span>
          )}
          <button
            type="button"
            disabled={isSaving}
            onClick={() => triggerAutoSave()}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isSaving ? 'در حال ذخیره...' : 'ثبت تنظیمات'}</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Profile Presets */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>پروفایل‌های پیشنهادی سریع (Quick Presets):</span>
          </span>
          <span className="text-[11px] text-slate-500">تنظیم تمامی گزینه‌ها تنها با یک کلیک</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('maximum_safety')}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-right transition-all group flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>حداکثر امنیت و ضد بن</span>
              </div>
              <div className="text-[10px] text-slate-400">رفتار ۱۰۰٪ انسانی و ایمن</div>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              پیشنهادی
            </span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('high_speed')}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-cyan-500/60 text-right transition-all group flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>حداکثر سرعت و نرخ ارسال</span>
              </div>
              <div className="text-[10px] text-slate-400">کش فایل + ارسال ۱۰ برابری</div>
            </div>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
              10x Speed
            </span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('bypass_all')}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 text-right transition-all group flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-indigo-300 group-hover:text-indigo-200 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>خنثی‌سازی کامل موانع</span>
              </div>
              <div className="text-[10px] text-slate-400">حل کپچا و هوش مصنوعی</div>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              AI Solver
            </span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>همه گزینه‌ها (۱۰)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('safety')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'safety'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>امنیت و ضد بن اکانت</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bypass')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'bypass'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>عبور از موانع و ربات‌ها</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('performance')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'performance'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>شتاب ارسال و ماندگاری</span>
        </button>
      </div>

      {/* Grid of Settings Items */}
      <div className="space-y-3">
        {/* ========================================================= */}
        {/* CATEGORY 1: ACCOUNT SAFETY & ANTI-BAN                     */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'safety') && (
          <div className="space-y-3">
            {activeTab === 'all' && (
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>تنظیمات امنیت اکانت و رفتار ارگانیک:</span>
              </div>
            )}

            {/* 1. Safe Contact Shield */}
            <div className="p-3.5 bg-slate-950/90 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>سپر محافظت از ریپورت ناشی از مخاطبین (Safe Contact Shield)</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                      ضد بن
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    جلوگیری از اد کردن اجباری مخاطبین حقیقی به گروه‌های ناشناس؛ پیشگیری قطعی از اسپم‌ریپورت تلگرام.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={safeContactShield}
                onChange={(checked) => {
                  setSafeContactShield(checked);
                  triggerAutoSave({ safeContactShield: checked });
                }}
              />
            </div>

            {/* 2. Safe Membership Retention */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>حفظ پایدار عضویت در گروه (Safe Membership Retention)</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                      پایداری
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    عدم خروج ناگهانی از گروه‌ها در صورت خطای موقت؛ چرخه سریع ورود/خروج عامل مهم حساسیت تلگرام است.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={safeMembershipRetention}
                onChange={(checked) => {
                  setSafeMembershipRetention(checked);
                  triggerAutoSave({ safeMembershipRetention: checked });
                }}
              />
            </div>

            {/* 3. Human Typing Simulation */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
                    <Keyboard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <span>شبیه‌سازی تایپینگ واقعی انسان (Human Mimicry)</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                        SetTyping
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ارسال وضعیت «در حال نوشتن...» قبل از انتشار پیام در گروه با مکث طبیعی کاربر واقعی.
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={simulateTyping}
                  onChange={(checked) => {
                    setSimulateTyping(checked);
                    triggerAutoSave({ simulateTyping: checked });
                  }}
                />
              </div>

              {simulateTyping && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
                  <label className="text-xs text-slate-300">
                    مدت شبیه‌سازی تایپینگ قبل از انتشار:
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
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400">ثانیه</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Spintax & Dynamic Masking */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 mt-0.5">
                  <Shuffle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>تنوع‌بخشی به متن با Spintax و متغیرهای پویا</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                      Anti-Fingerprint
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    تغییر خودکار کلمات (مانند {'{سلام|درود}'})، درج نام گروه، ساعت و کد پیگیری یکتا در هر پیام.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={enableSpintax}
                onChange={(checked) => {
                  setEnableSpintax(checked);
                  triggerAutoSave({ enableSpintax: checked });
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CATEGORY 2: BYPASS GUARDIAN BOTS & CAPTCHAS               */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'bypass') && (
          <div className="space-y-3">
            {activeTab === 'all' && (
              <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 pt-2">
                <Cpu className="w-4 h-4" />
                <span>خنثی‌سازی ربات‌های ناظر و عبور از قفل‌ها:</span>
              </div>
            )}

            {/* 5. AI Math & Text Solver */}
            <div className="p-3.5 bg-slate-950/90 border border-indigo-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>حل خودکار چالش‌های ریاضی و متنی هوش مصنوعی</span>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                      AI Solver
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    محاسبه فوری سوالات ریاضی (مانند ۵ + ۳ یا ضرب و تفریق) و پاسخ به آزمون‌های ورودی بات‌های ناظر.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={autoSolveMathCaptcha}
                onChange={(checked) => {
                  setAutoSolveMathCaptcha(checked);
                  triggerAutoSave({ autoSolveMathCaptcha: checked });
                }}
              />
            </div>

            {/* 6. Click Captcha Inline Buttons */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>کلیک خودکار دکمه‌های شیشه‌ای «من ربات نیستم»</span>
                    <span className="text-[9px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono">
                      Inline Captcha
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    شناسایی و فشردن دکمه تایید ربات‌های مدیریت گروه (Rose, GroupHelp, Shield...).
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={autoClickCaptcha}
                onChange={(checked) => {
                  setAutoClickCaptcha(checked);
                  triggerAutoSave({ autoClickCaptcha: checked });
                }}
              />
            </div>

            {/* 7. Forum Topics Detection */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 mt-0.5">
                  <Hash className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>پشتیبانی از سوپرگروه‌های فروم و تاپیک‌های تلگرام</span>
                    <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-mono">
                      Forum Topics
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    شناسایی خودکار تاپیک تبلیغات/عمومی در گروه‌های فروم و انتشار دقیق پیام در همان بخش مجاز.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={supportForumTopics}
                onChange={(checked) => {
                  setSupportForumTopics(checked);
                  triggerAutoSave({ supportForumTopics: checked });
                }}
              />
            </div>

            {/* 8. Force Join Channels */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                  <Link className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>عضویت خودکار در کانال‌های اجباری قفل گروه</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                      Force Channel
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    عضویت اتوماتیک در کانال‌های اسپانسر گروه و فشردن دکمه تایید جهت باز شدن قفل چت.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={autoForceJoinChannels}
                onChange={(checked) => {
                  setAutoForceJoinChannels(checked);
                  triggerAutoSave({ autoForceJoinChannels: checked });
                }}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CATEGORY 3: ACCELERATION, CACHING & PERSISTENCE           */}
        {/* ========================================================= */}
        {(activeTab === 'all' || activeTab === 'performance') && (
          <div className="space-y-3">
            {activeTab === 'all' && (
              <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 pt-2">
                <Zap className="w-4 h-4" />
                <span>شتاب ارسال، کش رسانه و پایش پیام:</span>
              </div>
            )}

            {/* 9. Media Cache (File ID) */}
            <div className="p-3.5 bg-slate-950/90 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <span>کش کردن مدیا (File ID Cache) و سرعت ۱۰ برابری</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                      ۹۹٪ صرفه‌جویی ترافیک
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    تصویر بنر فقط یک‌بار در سرور تلگرام آپلود شده و برای تمام گروه‌ها در کسری از ثانیه ارسال می‌شود.
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={cacheMediaInput}
                onChange={(checked) => {
                  setCacheMediaInput(checked);
                  triggerAutoSave({ cacheMediaInput: checked });
                }}
              />
            </div>

            {/* 10. Message Persistence Check */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 mt-0.5">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <span>پایش ماندگاری پیام (تشخیص ربات‌های حذف خودکار)</span>
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono">
                        Audit
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      بررسی وضعیت پیام چند ثانیه پس از ارسال جهت اطمینان از پاک نشدن آن توسط ادمین یا ربات ناظر.
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={verifyMessagePersistence}
                  onChange={(checked) => {
                    setVerifyMessagePersistence(checked);
                    triggerAutoSave({ verifyMessagePersistence: checked });
                  }}
                />
              </div>

              {verifyMessagePersistence && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
                  <label className="text-xs text-slate-300">
                    تاخیر بررسی ماندگاری پیام:
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
                      className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                    <span className="text-xs text-slate-400">ثانیه پس از ارسال</span>
                  </div>
                </div>
              )}
            </div>

            {/* 11. Greeting / Stealth Mode */}
            <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-2">
                      <span>ارسال پیام احوالپرسی اولیه قبل از تبلیغ اصلی</span>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono">
                        تست واکنش
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      ارسال یک احوالپرسی ساده و شنود پاسخ ربات‌های گروه قبل از انتشار آگهی.
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={sendGreetingFirst}
                  onChange={(checked) => {
                    setSendGreetingFirst(checked);
                    triggerAutoSave({ sendGreetingFirst: checked });
                  }}
                />
              </div>

              {sendGreetingFirst && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 pr-9">
                  <label className="text-xs text-slate-300">
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
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تمامی فرآیندها به‌صورت هوشمند و شبیه‌سازی رفتار انسان در بستر MTProto اجرا می‌گردند.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400">حفاظت چندلایه اکانت فعال است</span>
        </div>
      </div>
    </div>
  );
};
