import React, { useState } from 'react';
import {
  AnonymousBotProfile,
  AnonymousChatAutomatorConfig,
} from '../../types';
import {
  Bot,
  Plus,
  Edit2,
  Trash2,
  Check,
  Layers,
  PhoneOff,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Repeat,
} from 'lucide-react';
import { AddAnonymousBotModal } from '../AddAnonymousBotModal';

interface AnonymousBotsListTabProps {
  config?: AnonymousChatAutomatorConfig;
  onUpdateConfig: (config: Partial<AnonymousChatAutomatorConfig>) => Promise<void>;
  onSaveBot: (bot: AnonymousBotProfile) => Promise<void>;
  onDeleteBot: (botId: string) => Promise<void>;
}

export const AnonymousBotsListTab: React.FC<AnonymousBotsListTabProps> = ({
  config,
  onUpdateConfig,
  onSaveBot,
  onDeleteBot,
}) => {
  const [isAddBotModalOpen, setIsAddBotModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AnonymousBotProfile | null>(null);

  return (
    <div className="p-5 space-y-5" dir="rtl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-400" />
            <span>ربات‌های چت ناشناس تعریف‌شده و ترتیب کلیک‌ها</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            ربات مورد نظر را انتخاب یا ویرایش کنید. کلیک‌های ورود، جمله اتصال به ناشناس و کلیک‌های خروج به ترتیب اجرا می‌شوند.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingBot(null);
            setIsAddBotModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-md shadow-violet-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن ربات جدید یا ویرایش ترتیب</span>
        </button>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(config?.bots || []).map((bot) => {
          const isSelected = config?.selectedBotId === bot.id;
          return (
            <div
              key={bot.id}
              onClick={() => onUpdateConfig({ selectedBotId: bot.id })}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-violet-950/30 border-violet-500 shadow-lg shadow-violet-950/40 ring-1 ring-violet-500/50'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected
                          ? 'border-violet-400 bg-violet-500 text-white'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="font-bold text-sm text-white">{bot.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBot(bot);
                        setIsAddBotModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="ویرایش ترتیب کلیک‌ها و جملات"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {config?.bots && config.bots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteBot(bot.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-red-400 transition-colors"
                        title="حذف این ربات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-1 text-xs font-mono text-violet-300" dir="ltr">
                  {bot.botUsername}
                </div>

                {bot.notes && <p className="text-[11px] text-slate-400 mt-1">{bot.notes}</p>}

                {/* 1. Entry Steps Flow */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[11px] text-violet-300 flex items-center gap-1 font-semibold">
                    <Layers className="w-3.5 h-3.5 text-violet-400" />
                    <span>۱. کلیک‌های ورود به چت:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {bot.startCommand || '/start'}
                    </span>
                    {(bot.entrySteps || []).map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="text-slate-600">➔</span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] flex items-center gap-1 ${
                            step.buttonLocation === 'inline_button'
                              ? 'bg-sky-950/40 border-sky-800/60 text-sky-200'
                              : step.buttonLocation === 'popup_ok'
                              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                              : 'bg-violet-900/40 border-violet-800/60 text-violet-200'
                          }`}
                        >
                          <span>{step.label}</span>
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* 2. Key Connection Phrase */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-start gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">جمله اتصال به ناشناس: </span>
                    <strong className="text-emerald-300 font-medium">
                      {(bot.connectionKeywords || ['وصل شدی'])[0]}
                    </strong>
                    {bot.connectionKeywords && bot.connectionKeywords.length > 1 && (
                      <span className="text-slate-500 text-[10px] mr-1">
                        (+{bot.connectionKeywords.length - 1} مورد دیگر)
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Exit Steps Flow */}
                {bot.exitSteps && bot.exitSteps.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 space-y-1">
                    <div className="text-[11px] text-rose-300 flex items-center gap-1 font-semibold">
                      <PhoneOff className="w-3.5 h-3.5 text-rose-400" />
                      <span>۳. کلیک‌های خروج از چت:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      {bot.exitSteps.map((es, eIdx) => (
                        <React.Fragment key={eIdx}>
                          {eIdx > 0 && <span className="text-slate-600">➔</span>}
                          <span className="px-1.5 py-0.5 rounded bg-rose-950/40 text-rose-200 border border-rose-800/60">
                            {es.label}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Info */}
              <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/60">
                <span className="text-slate-400">
                  تاخیر پیش‌فرض: <strong className="text-slate-200">{bot.delayBetweenButtonsMs || 1200}ms</strong>
                </span>
                <span className="text-violet-400 font-medium">
                  {isSelected ? '✓ ربات انتخاب‌شده فعلی' : 'کلیک برای انتخاب'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loop & Cycle settings */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">
              تکرار مداوم چرخه (چرخش خودکار به نفر بعدی پس از خروج):
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config?.loopForever !== false}
              onChange={(e) => onUpdateConfig({ loopForever: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-300">
            زمان استراحت (Cooldown) قبل از شروع جستجوی نفر بعدی:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <input
              type="number"
              value={config?.cooldownBetweenChatsSeconds || 4}
              onChange={(e) => onUpdateConfig({ cooldownBetweenChatsSeconds: Number(e.target.value) })}
              min={1}
              max={60}
              className="w-12 bg-transparent text-white text-center font-bold focus:outline-none"
            />
            <span className="text-[11px] text-slate-400">ثانیه</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isAddBotModalOpen && (
        <AddAnonymousBotModal
          isOpen={isAddBotModalOpen}
          onClose={() => {
            setIsAddBotModalOpen(false);
            setEditingBot(null);
          }}
          onSave={onSaveBot}
          editingBot={editingBot}
        />
      )}
    </div>
  );
};
