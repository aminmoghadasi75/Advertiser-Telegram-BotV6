import React, { useState, useEffect } from 'react';
import { AnonymousBotProfile, AnonymousBotButtonStep, BotButtonLocation } from '../types';
import {
  X,
  Bot,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Layers,
  Clock,
  LogOut,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Flame,
} from 'lucide-react';

interface AddAnonymousBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bot: AnonymousBotProfile) => void;
  editingBot?: AnonymousBotProfile | null;
}

const PRESET_BOTS: Partial<AnonymousBotProfile>[] = [
  {
    name: 'ربات هایپر گپ (@HyperGap)',
    botUsername: '@HyperGap',
    startCommand: '/start',
    autoDismissPopups: true,
    fuzzyButtonMatching: true,
    popupOkKeywords: ['OK', 'ok', 'تایید', 'بله', 'قبول', 'باشه', 'فهمیدم'],
    entrySteps: [
      {
        id: 'step_hg_1',
        label: 'به یه ناشناس وصلم کن!',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.0,
      },
      {
        id: 'step_hg_2',
        label: '🎲 جستجوی شانسی 🎲',
        buttonLocation: 'inline_button',
        delaySeconds: 1.0,
      },
    ],
    connectionKeywords: [
      '👀 پیدا کردم وصلتون کردم، به مخاطبت سلام کن 🗣',
      'پیدا کردم وصلتون کردم',
      'به مخاطب وصل شدی',
      'یک هم‌صحبت پیدا شد',
      'یک همصحبت پیدا شد',
      'وصل شدی',
      'متصل شدید',
      'مخاطب پیدا شد',
      'هم‌اکنون در حال گفتگو هستید',
      'وصلتون کردم',
      'شروع مکالمه',
    ],
    exitSteps: [
      {
        id: 'exit_hg_1',
        label: '❌ پایان مکالمه',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 0.8,
      },
      {
        id: 'exit_hg_2',
        label: '❌ اتمام چت',
        buttonLocation: 'inline_button',
        delaySeconds: 1.0,
      },
    ],
    partnerDisconnectedKeywords: [
      '🎌 چت شما با',
      'توسط مخاطب شما قطع شد',
      'توسط شما قطع شد',
      'توسط مخاطب قطع شد',
      'مخاطب گفتگو را بست',
      'مخاطب مکالمه را بست',
      'مخاطب چت را ترک کرد',
      'مخاطب چت را بست',
      'هم‌صحبت شما گفتگو را بست',
      'هم‌صحبت شما چت را بست',
      'کاربر مقابل از چت خارج شد',
      'مکالمه پایان یافت',
      'چت بسته شد',
      'قطع شد',
    ],
    notInChatKeywords: [
      'متوجه نشدم',
      'خب ، حالا چه کاری برات انجام بدم؟',
      'از منوی پایین انتخاب کن',
      'دستور نامعتبر',
      'از منوی زیر استفاده',
      'برای شروع از دکمه',
      'منوی اصلی',
      'پیام شما متوجه نشدم',
    ],
    alreadyInChatKeywords: [
      'هم اکنون شما در حال چت هستید',
      'خطا : هم اکنون شما در حال چت هستید',
      'ابتدا باید مکالمه رو قطع کنی',
      'ابتدا چت فعلی را قطع کنید',
      'در حال حاضر در حال چت هستید',
    ],
    delayBetweenButtonsMs: 1000,
    notes: 'ربات هایپرگپ با ترتیب کلیک دکمه‌های ورود «به یه ناشناس وصلم کن!» و «🎲 جستجوی شانسی 🎲» و خروج «❌ پایان مکالمه» و «❌ اتمام چت»',
  },
  {
    name: 'ربات بای چت (@BiChatBot)',
    botUsername: '@BiChatBot',
    startCommand: '/start',
    autoDismissPopups: true,
    fuzzyButtonMatching: true,
    entrySteps: [
      {
        id: 'step_bc_1',
        label: 'چت با ناشناس 🎭',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.2,
      },
      {
        id: 'step_bc_2',
        label: 'همسن و همشهری',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.0,
      },
      {
        id: 'step_bc_3',
        label: 'شروع جستجو 🔍',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.2,
      },
    ],
    connectionKeywords: [
      'وصل شدی',
      'متصل شدید',
      'مخاطب پیدا شد',
      'یک همصحبت پیدا شد',
      'سلام کن',
    ],
    exitSteps: [
      {
        id: 'exit_bc_1',
        label: '❌ پایان چت',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.0,
      },
      {
        id: 'exit_bc_2',
        label: 'بله، مطمئنم',
        buttonLocation: 'inline_button',
        delaySeconds: 1.0,
      },
    ],
    partnerDisconnectedKeywords: ['مخاطب گفتگو را بست', 'چت را ترک کرد', 'قطع شد', 'مکالمه پایان یافت'],
    notInChatKeywords: ['متوجه نشدم', 'دستور نامعتبر', 'از منوی زیر استفاده', 'منوی اصلی'],
    alreadyInChatKeywords: ['هم اکنون در حال چت هستید', 'ابتدا چت فعلی را قطع کنید'],
    delayBetweenButtonsMs: 1500,
    notes: 'ربات محبوب بای‌چت با منوی کیبورد و خروج مستقیم',
  },
  {
    name: 'ربات چت‌گرام (@ChatGramBot)',
    botUsername: '@ChatGramBot',
    startCommand: '/start',
    autoDismissPopups: true,
    fuzzyButtonMatching: true,
    entrySteps: [
      {
        id: 'step_cg_1',
        label: '🎭 چت ناشناس',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.2,
      },
      {
        id: 'step_cg_2',
        label: '🔍 جستجوی هم‌صحبت',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.0,
      },
      {
        id: 'step_cg_3',
        label: '👥 فرقی ندارد',
        buttonLocation: 'inline_button',
        delaySeconds: 1.2,
      },
    ],
    connectionKeywords: [
      'وصل شدید',
      'هم‌صحبت پیدا شد',
      'متصل شدید',
      'مکالمه آغاز شد',
    ],
    exitSteps: [
      {
        id: 'exit_cg_1',
        label: '❌ پایان گفتگو',
        buttonLocation: 'reply_keyboard',
        delaySeconds: 1.0,
      },
    ],
    partnerDisconnectedKeywords: ['کاربر از چت خارج شد', 'مکالمه پایان یافت', 'چت قطع شد'],
    notInChatKeywords: ['متوجه نشدم', 'دستور نامعتبر', 'منوی اصلی'],
    alreadyInChatKeywords: ['هم اکنون در حال گفتگو هستید', 'ابتدا چت قبلی را ببندید'],
    delayBetweenButtonsMs: 1500,
    notes: 'ربات چت‌گرام با گزینه‌های سریع جستجوی هم‌صحبت',
  },
];

export const AddAnonymousBotModal: React.FC<AddAnonymousBotModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingBot,
}) => {
  const [name, setName] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [startCommand, setStartCommand] = useState('/start');
  const [entrySteps, setEntrySteps] = useState<AnonymousBotButtonStep[]>([]);
  const [connectionKeywordsText, setConnectionKeywordsText] = useState('');
  const [exitSteps, setExitSteps] = useState<AnonymousBotButtonStep[]>([]);
  const [disconnectedKeywordsText, setDisconnectedKeywordsText] = useState('');
  const [notInChatKeywordsText, setNotInChatKeywordsText] = useState('');
  const [alreadyInChatKeywordsText, setAlreadyInChatKeywordsText] = useState('');
  const [delayBetweenButtonsMs, setDelayBetweenButtonsMs] = useState(1200);
  const [autoDismissPopups, setAutoDismissPopups] = useState(true);
  const [fuzzyButtonMatching, setFuzzyButtonMatching] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingBot) {
      setName(editingBot.name || '');
      setBotUsername(editingBot.botUsername || '');
      setStartCommand(editingBot.startCommand || '/start');
      setEntrySteps(editingBot.entrySteps || []);
      setConnectionKeywordsText((editingBot.connectionKeywords || []).join('\n'));
      setExitSteps(editingBot.exitSteps || []);
      setDisconnectedKeywordsText((editingBot.partnerDisconnectedKeywords || []).join('\n'));
      setNotInChatKeywordsText((editingBot.notInChatKeywords || ['متوجه نشدم', 'دستور نامعتبر', 'از منوی زیر استفاده']).join('\n'));
      setAlreadyInChatKeywordsText((editingBot.alreadyInChatKeywords || ['هم اکنون شما در حال چت هستید', 'خطا : هم اکنون شما در حال چت هستید', 'ابتدا چت فعلی را قطع کنید']).join('\n'));
      setDelayBetweenButtonsMs(editingBot.delayBetweenButtonsMs || 1200);
      setAutoDismissPopups(editingBot.autoDismissPopups ?? true);
      setFuzzyButtonMatching(editingBot.fuzzyButtonMatching ?? true);
      setNotes(editingBot.notes || '');
    } else {
      // Default to HyperGap Preset
      applyPreset(PRESET_BOTS[0]);
    }
  }, [editingBot, isOpen]);

  const applyPreset = (preset: Partial<AnonymousBotProfile>) => {
    setName(preset.name || '');
    setBotUsername(preset.botUsername || '');
    setStartCommand(preset.startCommand || '/start');
    setEntrySteps(preset.entrySteps ? JSON.parse(JSON.stringify(preset.entrySteps)) : []);
    setConnectionKeywordsText((preset.connectionKeywords || []).join('\n'));
    setExitSteps(preset.exitSteps ? JSON.parse(JSON.stringify(preset.exitSteps)) : []);
    setDisconnectedKeywordsText((preset.partnerDisconnectedKeywords || []).join('\n'));
    setNotInChatKeywordsText((preset.notInChatKeywords || ['متوجه نشدم', 'دستور نامعتبر', 'از منوی زیر استفاده']).join('\n'));
    setAlreadyInChatKeywordsText((preset.alreadyInChatKeywords || ['هم اکنون شما در حال چت هستید', 'خطا : هم اکنون شما در حال چت هستید', 'ابتدا چت فعلی را قطع کنید']).join('\n'));
    setDelayBetweenButtonsMs(preset.delayBetweenButtonsMs || 1200);
    setAutoDismissPopups(preset.autoDismissPopups ?? true);
    setFuzzyButtonMatching(preset.fuzzyButtonMatching ?? true);
    setNotes(preset.notes || '');
  };

  // Helper for adding entry step
  const handleAddEntryStep = () => {
    const newStep: AnonymousBotButtonStep = {
      id: 'step_' + Date.now(),
      label: 'دکمه یا دستور جدید',
      buttonLocation: 'reply_keyboard',
      delaySeconds: 1.2,
    };
    setEntrySteps([...entrySteps, newStep]);
  };

  const handleUpdateEntryStep = (index: number, updates: Partial<AnonymousBotButtonStep>) => {
    const updated = [...entrySteps];
    updated[index] = { ...updated[index], ...updates };
    setEntrySteps(updated);
  };

  const handleRemoveEntryStep = (index: number) => {
    setEntrySteps(entrySteps.filter((_, i) => i !== index));
  };

  const handleMoveEntryStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === entrySteps.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...entrySteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setEntrySteps(updated);
  };

  // Helper for adding exit step
  const handleAddExitStep = () => {
    const newStep: AnonymousBotButtonStep = {
      id: 'exit_' + Date.now(),
      label: '❌ پایان چت',
      buttonLocation: 'reply_keyboard',
      delaySeconds: 1.0,
    };
    setExitSteps([...exitSteps, newStep]);
  };

  const handleUpdateExitStep = (index: number, updates: Partial<AnonymousBotButtonStep>) => {
    const updated = [...exitSteps];
    updated[index] = { ...updated[index], ...updates };
    setExitSteps(updated);
  };

  const handleRemoveExitStep = (index: number) => {
    setExitSteps(exitSteps.filter((_, i) => i !== index));
  };

  const handleMoveExitStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exitSteps.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...exitSteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setExitSteps(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !botUsername.trim()) return;

    const connectionKeywords = connectionKeywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const partnerDisconnectedKeywords = disconnectedKeywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const notInChatKeywords = notInChatKeywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const alreadyInChatKeywords = alreadyInChatKeywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter(Boolean);

    const botProfile: AnonymousBotProfile = {
      id: editingBot?.id || 'anon_bot_' + Date.now(),
      name: name.trim(),
      botUsername: botUsername.trim().startsWith('@') ? botUsername.trim() : '@' + botUsername.trim(),
      startCommand: startCommand.trim() || '/start',
      entrySteps: entrySteps.length > 0 ? entrySteps : [
        {
          id: 'step_default',
          label: 'به یه ناشناس وصلم کن!',
          buttonLocation: 'reply_keyboard',
          delaySeconds: 1.2,
        },
      ],
      connectionKeywords: connectionKeywords.length > 0 ? connectionKeywords : ['وصل شدی', 'مخاطب پیدا شد'],
      exitSteps: exitSteps.length > 0 ? exitSteps : [
        {
          id: 'exit_default',
          label: '❌ پایان چت',
          buttonLocation: 'reply_keyboard',
          delaySeconds: 1.0,
        },
      ],
      partnerDisconnectedKeywords: partnerDisconnectedKeywords.length > 0 ? partnerDisconnectedKeywords : ['مخاطب گفتگو را بست', 'چت را ترک کرد'],
      notInChatKeywords: notInChatKeywords.length > 0 ? notInChatKeywords : ['متوجه نشدم', 'دستور نامعتبر', 'از منوی زیر استفاده'],
      alreadyInChatKeywords: alreadyInChatKeywords.length > 0 ? alreadyInChatKeywords : ['هم اکنون شما در حال چت هستید', 'خطا : هم اکنون شما در حال چت هستید', 'ابتدا چت فعلی را قطع کنید'],
      delayBetweenButtonsMs,
      autoDismissPopups,
      fuzzyButtonMatching,
      enabled: true,
      notes: notes.trim(),
    };

    onSave(botProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">
                {editingBot ? 'ویرایش ربات و ترتیب کلیک‌ها' : 'افزودن ربات چت ناشناس جدید'}
              </h2>
              <p className="text-[11px] text-slate-400">
                تعیین دقیق کلیک‌های ورود، جمله اتصال به ناشناس و کلیک‌های خروج به ترتیب
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Quick Presets */}
          {!editingBot && (
            <div className="p-3 bg-violet-950/20 border border-violet-800/40 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-violet-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>بارگذاری تنظیمات آماده ربات‌های معروف (۱ کلیک):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_BOTS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-violet-900/40 border border-slate-800 hover:border-violet-600 text-slate-200 hover:text-white font-medium text-[11px] transition-all flex items-center gap-1.5"
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                نام نمایشی ربات:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: ربات هایپرگپ"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                آیدی تلگرام ربات (یوزرنیم):
              </label>
              <input
                type="text"
                value={botUsername}
                onChange={(e) => setBotUsername(e.target.value)}
                placeholder="@HyperGapBot"
                required
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                دستور شروع (Start Command):
              </label>
              <input
                type="text"
                value={startCommand}
                onChange={(e) => setStartCommand(e.target.value)}
                placeholder="/start"
                dir="ltr"
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                تاخیر پیش‌فرض بین کلیک‌ها (میلی‌ثانیه):
              </label>
              <input
                type="number"
                value={delayBetweenButtonsMs}
                onChange={(e) => setDelayBetweenButtonsMs(Number(e.target.value))}
                min={500}
                max={5000}
                step={100}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* 1. ORDERED ENTRY STEPS */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-[10px]">
                  ۱
                </span>
                <span className="font-bold text-sm text-white">
                  مراحل کلیک و ورود به چت (به ترتیب ۱، ۲، ۳...)
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddEntryStep}
                className="px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن مرحله جدید</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              ربات به ترتیب این دکمه‌ها را می‌زند تا وارد صفحه چت یا جستجوی ناشناس شود.
            </p>

            <div className="space-y-2.5 pt-1">
              {entrySteps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="px-2 py-1 bg-violet-950/80 text-violet-300 font-bold rounded text-[11px] border border-violet-800/60">
                      گام {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step.label}
                      onChange={(e) => handleUpdateEntryStep(idx, { label: e.target.value })}
                      placeholder="متن روی دکمه (مثلاً: به یه ناشناس وصلم کن!)"
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={step.buttonLocation}
                      onChange={(e) => handleUpdateEntryStep(idx, { buttonLocation: e.target.value as BotButtonLocation })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none"
                    >
                      <option value="reply_keyboard">منوی پایین (Reply Keyboard)</option>
                      <option value="inline_button">دکمه شیشه‌ای (Inline)</option>
                      <option value="text_command">دستور متنی</option>
                      <option value="popup_ok">تایید Alert / OK</option>
                    </select>

                    <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        value={step.delaySeconds}
                        onChange={(e) => handleUpdateEntryStep(idx, { delaySeconds: Number(e.target.value) })}
                        min={0.5}
                        max={10}
                        step={0.5}
                        className="w-10 bg-transparent text-white text-[11px] text-center focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">ثانیه</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveEntryStep(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveEntryStep(idx, 'down')}
                        disabled={idx === entrySteps.length - 1}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveEntryStep(idx)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-400"
                        title="حذف گام"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. KEY CONNECTION PHRASE (CRITICAL USER REQUIREMENT) */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                ۲
              </span>
              <span className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>جمله کلیدی اتصال به ناشناس (شروع چت)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              جمله‌ای که بعد از وصل شدن به یک ناشناس ظاهر خواهد شد. بعد از ظاهر شدن این جمله، یعنی وارد یک چت ناشناس شدیم و ربات شروع به صحبت با هوش مصنوعی طبق دستورالعمل شما خواهد کرد:
            </p>

            <textarea
              rows={3}
              value={connectionKeywordsText}
              onChange={(e) => setConnectionKeywordsText(e.target.value)}
              placeholder="هر جمله در یک سطر (مثلاً: به مخاطب وصل شدی&#10;یک هم‌صحبت پیدا شد&#10;وصل شدی)"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* 3. ORDERED EXIT STEPS */}
          <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">
                  ۳
                </span>
                <span className="font-bold text-sm text-rose-300 flex items-center gap-1.5">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>مراحل کلیک و خروج از چت (به ترتیب ۱، ۲، ۳...)</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddExitStep}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن مرحله خروج</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-300">
              بعد از اتمام تعداد پیام‌های مجاز، بات این دکمه‌ها را به ترتیب می‌زند تا از چت خارج شده و مجدد با نفر بعدی صحبت کند:
            </p>

            <div className="space-y-2.5 pt-1">
              {exitSteps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2 justify-between"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="px-2 py-1 bg-rose-950/80 text-rose-300 font-bold rounded text-[11px] border border-rose-800/60">
                      خروج {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={step.label}
                      onChange={(e) => handleUpdateExitStep(idx, { label: e.target.value })}
                      placeholder="متن دکمه خروج (مثلاً: ❌ پایان چت یا تایید)"
                      className="flex-1 bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={step.buttonLocation}
                      onChange={(e) => handleUpdateExitStep(idx, { buttonLocation: e.target.value as BotButtonLocation })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 focus:outline-none"
                    >
                      <option value="reply_keyboard">منوی پایین (Reply Keyboard)</option>
                      <option value="inline_button">دکمه شیشه‌ای (Inline)</option>
                      <option value="text_command">دستور متنی</option>
                      <option value="popup_ok">تایید Alert / OK</option>
                    </select>

                    <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        value={step.delaySeconds}
                        onChange={(e) => handleUpdateExitStep(idx, { delaySeconds: Number(e.target.value) })}
                        min={0.5}
                        max={10}
                        step={0.5}
                        className="w-10 bg-transparent text-white text-[11px] text-center focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">ثانیه</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveExitStep(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveExitStep(idx, 'down')}
                        disabled={idx === exitSteps.length - 1}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveExitStep(idx)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-rose-400"
                        title="حذف گام"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Partner Disconnected Keywords */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              پیام‌های نشان‌دهنده خروج یا قطع شدن مخاطب:
            </label>
            <textarea
              rows={2}
              value={disconnectedKeywordsText}
              onChange={(e) => setDisconnectedKeywordsText(e.target.value)}
              placeholder="هر جمله در یک سطر (مثلاً: مخاطب چت را ترک کرد&#10;قطع شد)"
              className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs"
            />
          </div>

          {/* 5. Out of Chat / Re-Entry Recovery Keywords */}
          <div className="p-4 bg-sky-950/20 border border-sky-800/40 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[10px]">
                ۴
              </span>
              <span className="font-bold text-sm text-sky-300">
                پیام‌های نشان‌دهنده خارج از چت بودن (شروع مجدد فرایند ورود)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              اگر بات در حین کار پیام‌هایی مثل «متوجه نشدم 🤔» یا «دستور نامعتبر» دریافت کند، متوجه می‌شود که هنوز به هیچ ناشناسی وصل نشده و بلافاصله فرایند ورود به چت را از ابتدا اجرا می‌کند:
            </p>
            <textarea
              rows={2}
              value={notInChatKeywordsText}
              onChange={(e) => setNotInChatKeywordsText(e.target.value)}
              placeholder="هر جمله در یک سطر (مثلاً: متوجه نشدم&#10;دستور نامعتبر&#10;از منوی زیر استفاده کنید)"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* 6. Already In Chat / Stuck Previous Chat Recovery Keywords */}
          <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
                ۵
              </span>
              <span className="font-bold text-sm text-amber-300">
                پیام‌های خطای چت فعال قبلی (اجرای فوری فرایند خروج)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              اگر بات هنگام تلاش برای شروع چت جدید، پیامی مبنی بر باز بودن مکالمه قبلی (مثل «⚠️ خطا : هم اکنون شما در حال چت هستید !» یا «ابتدا چت فعلی را قطع کنید») دریافت کرد، بلافاصله فرایند خروج را اجرا می‌کند تا مکالمه قبلی بسته شده و راه برای چت جدید باز شود:
            </p>
            <textarea
              rows={2}
              value={alreadyInChatKeywordsText}
              onChange={(e) => setAlreadyInChatKeywordsText(e.target.value)}
              placeholder="هر جمله در یک سطر (مثلاً: هم اکنون شما در حال چت هستید&#10;خطا : هم اکنون شما در حال چت هستید&#10;ابتدا چت فعلی را قطع کنید)"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-white placeholder:text-slate-600 focus:outline-none font-mono text-xs leading-relaxed"
            />
          </div>

          {/* 7. Smart Matching & Popup Options */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200 text-xs">تنظیمات هوشمند تطابق دکمه‌ها و پنجره‌ها</span>
            </div>

            {/* Fuzzy Matching Toggle */}
            <div className="flex items-start justify-between gap-4 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">تطابق هوشمند و فازی دکمه‌ها (Fuzzy Matching)</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800/60 text-[10px] font-bold">
                    پیشنهادی
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  حذف خودکار ایموجی‌ها (مانند ❌، 🎭، 🔍)، نیم‌فاصله‌ها و علائم نگارشی تلگرام تا کلیک حتی در صورت تفاوت جزئی متن (مثلاً «اتمام چت» به جای «❌ اتمام چت») با موفقیت انجام شود.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={fuzzyButtonMatching}
                  onChange={(e) => setFuzzyButtonMatching(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>

            {/* Auto Dismiss Popups */}
            <div className="flex items-start justify-between gap-4 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">تایید خودکار پنجره‌های هشدار و پاپ‌آپ (Alert / OK)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  بستن و تایید فوری پنجره‌های بازشونده موقت ربات تلگرام قبل یا بعد از کلیک روی دکمه‌ها.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={autoDismissPopups}
                  onChange={(e) => setAutoDismissPopups(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              یادداشت یا توضیحات:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیحات اختیاری در مورد این ربات..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-950/50 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره تنظیمات ربات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
