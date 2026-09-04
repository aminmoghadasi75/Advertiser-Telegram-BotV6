import React, { useState, useEffect, useRef } from 'react';
import {
  AnonymousChatInstructions,
  AnonymousProductPromotion,
  SavedAiPrompt,
  ConversationStrategy,
  BotPersonaConfig,
} from '../../types';
import { ProductConfig, DEFAULT_PRODUCTS_CATALOG } from '../../config/productConfig';
import { AnonymousCampaignsManager } from './AnonymousCampaignsManager';
import {
  Sparkles,
  Bot,
  MessageSquare,
  Clock,
  LogOut,
  ShieldAlert,
  Check,
  RefreshCw,
  Info,
  Sliders,
  Send,
  RotateCcw,
  AlertCircle,
  Tag,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Layers,
  HelpCircle,
  Zap,
  ShoppingBag,
  Flame,
  FileText,
  Trash2,
  Bookmark,
  Plus,
  Edit3,
  CheckCircle2,
  FolderHeart,
  Save,
  X,
  Cpu,
  Activity,
  ArrowLeftRight,
  UserCheck,
  Compass,
  Target,
  Briefcase,
  User,
  Wand2,
} from 'lucide-react';

interface AnonymousAiInstructionsTabProps {
  instructions: AnonymousChatInstructions;
  onSaveInstructions: (instructions: AnonymousChatInstructions) => Promise<void>;
  onGoToSimulator?: () => void;
}

const PRESET_GREETINGS = [
  'سلام خوبی؟ 🌸',
  'سلام چطوری؟',
  'سلام روزت بخیر 🌸',
  'سلام، خوبی؟ چه خبر؟',
  'سلام چطوری؟ 🌸',
  'سلام اصل میدی آشنا شیم؟',
  'سلااام چطوری؟ چیکارا می‌کنی؟',
];

const PRESET_FAREWELLS = [
  'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸',
  'فعلا من یه کاری برام پیش اومد باید برم 🌹',
  'خوشحال شدم از هم‌کلامی، فعلا خداحافظ 👋',
  'من کار فوری برام پیش اومد باید برم، روزت بخیر ✨',
  'من دیگه باید برم، مواظب خودت باش 💫',
  'فعلا خدانگهدار 👋',
];

export const AnonymousAiInstructionsTab: React.FC<AnonymousAiInstructionsTabProps> = ({
  instructions,
  onSaveInstructions,
  onGoToSimulator,
}) => {
  const [localInstructions, setLocalInstructions] = useState<AnonymousChatInstructions>(instructions);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerFeedback, setBannerFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bannerDirectInputRef = useRef<HTMLInputElement | null>(null);
  const systemPromptTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastSavedJsonRef = useRef<string>(JSON.stringify(instructions));
  const lastSentSystemPromptRef = useRef<string | null>(null);

  // State for user-defined saved prompts management
  const [showSavePromptBox, setShowSavePromptBox] = useState(false);
  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [loadedPromptId, setLoadedPromptId] = useState<string | null>(null);
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);

  // Local raw text inputs for dash-separated keywords to guarantee smooth typing
  const [rawIgnoredPhrases, setRawIgnoredPhrases] = useState<string>(
    (instructions.customIgnoredSystemPhrases || []).join(' - ')
  );
  const [rawInappropriateKeywords, setRawInappropriateKeywords] = useState<string>(
    (instructions.inappropriateKeywords || []).join(' - ')
  );
  const [rawSpamBotKeywords, setRawSpamBotKeywords] = useState<string>(
    (instructions.spamBotKeywords || []).join(' - ')
  );

  // Real-time Adaptive Gemini Multi-Model Status
  const [geminiStatus, setGeminiStatus] = useState<{
    activeModel?: string;
    activePriorityOrder?: string[];
    models?: Array<{
      modelName: string;
      displayName?: string;
      priority?: number;
      description?: string;
      role?: string;
      status: 'healthy' | 'recovering' | 'cooldown';
      consecutiveFailures: number;
      totalSuccesses: number;
      totalFailures: number;
      cooldownSecondsRemaining: number;
      isDailyLimitExceeded?: boolean;
      isServerBusy?: boolean;
      lastError: string | null;
    }>;
  } | null>(null);

  const fetchGeminiStatus = async () => {
    try {
      const res = await fetch('/api/anonymous/gemini-status');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setGeminiStatus(data);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchGeminiStatus();
    const interval = setInterval(fetchGeminiStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Live Instant Tester State & Handler
  const [liveTestInput, setLiveTestInput] = useState('قیمت چنده؟ تست رایگان هم دارین؟');
  const [liveTestLoading, setLiveTestLoading] = useState(false);
  const [liveTestElapsedSec, setLiveTestElapsedSec] = useState(60);
  const [liveTestResult, setLiveTestResult] = useState<{
    reply: string;
    bubbles: string[];
    isFastSkip?: boolean;
    intent?: string;
    state?: string;
    leadScore?: number;
    source?: string;
    promoMentioned?: boolean;
    typingTimeSec?: number;
  } | null>(null);

  const runLiveTest = async (overrideText?: string) => {
    const textToSend = (overrideText !== undefined ? overrideText : liveTestInput).trim();
    if (!textToSend) return;
    setLiveTestLoading(true);
    setLiveTestResult(null);

    // Check fast-path rejection locally for instant preview comparison
    const normalized = textToSend.toLowerCase();
    const isRejectionPattern = /^(نه|ن|نچ|خیر|no|nop|nope|نمیخوام|نمی‌خوام|لازم ندارم|نیاز ندارم|تبلیغه|اسپمر|ربات|لفت)/i.test(normalized);

    try {
      const res = await fetch('/api/anonymous/simulate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: [{ sender: 'stranger', text: textToSend }],
          instructions: localInstructions,
          sessionContext: {
            isUnder2Minutes: liveTestElapsedSec < 120,
            elapsedSeconds: liveTestElapsedSec,
            currentTurn: 1,
            maxTurns: localInstructions.maxMessagesPerChat || 4,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const bubbles = data.bubbles || [data.reply];
        const wordCount = bubbles.reduce((acc: number, b: string) => acc + b.split(/\s+/).filter(Boolean).length, 0);
        const typingTime = Math.max(1.2, Math.min(6.5, (wordCount * 0.25) + ((bubbles.length - 1) * (localInstructions.multiBubbleDelaySeconds || 1.8))));

        setLiveTestResult({
          reply: data.reply,
          bubbles,
          isFastSkip: (localInstructions.fastDropOnRejection ?? true) && isRejectionPattern,
          intent: data.stepOutput?.intentResult?.intent,
          state: data.stepOutput?.updatedContext?.state,
          leadScore: data.stepOutput?.updatedContext?.leadScore,
          source: data.source,
          promoMentioned: data.promoMentioned,
          typingTimeSec: Number(typingTime.toFixed(1)),
        });
      }
    } catch (e) {
      console.error('Failed to run live test:', e);
    } finally {
      setLiveTestLoading(false);
    }
  };

  // Synchronize instructions when changed externally (e.g. from preset load), never overwrite user's in-progress local edits
  const initialMountDoneRef = useRef(false);
  useEffect(() => {
    if (!initialMountDoneRef.current) {
      initialMountDoneRef.current = true;
      setLocalInstructions(instructions);
      setRawIgnoredPhrases((instructions.customIgnoredSystemPhrases || []).join(' - '));
      setRawInappropriateKeywords((instructions.inappropriateKeywords || []).join(' - '));
      lastSavedJsonRef.current = JSON.stringify(instructions);
      return;
    }
    if (isDirty || isSaving) return;
  }, [instructions, isDirty, isSaving]);

  // Live Auto-Save Effect (Debounced 800ms)
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        const snapshot = { ...localInstructions };
        lastSavedJsonRef.current = JSON.stringify(snapshot);
        lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
        await onSaveInstructions(snapshot);
        setIsDirty(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
      } catch (e: any) {
        console.warn('Auto-save sync notice (will retry on next change):', e?.message || e);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [localInstructions, isDirty, onSaveInstructions]);

  const updateField = <K extends keyof AnonymousChatInstructions>(
    field: K,
    value: AnonymousChatInstructions[K]
  ) => {
    setIsDirty(true);
    setLocalInstructions((prev) => {
      let updatedSaved = prev.savedPrompts;
      if (field === 'systemPrompt' && typeof value === 'string' && loadedPromptId && Array.isArray(prev.savedPrompts)) {
        updatedSaved = prev.savedPrompts.map((p) =>
          p.id === loadedPromptId
            ? { ...p, prompt: value, updatedAt: new Date().toISOString() }
            : p
        );
      }
      return {
        ...prev,
        [field]: value,
        ...(updatedSaved ? { savedPrompts: updatedSaved } : {}),
      };
    });
  };

  const updatePromoField = <K extends keyof AnonymousProductPromotion>(
    field: K,
    value: AnonymousProductPromotion[K]
  ) => {
    setIsDirty(true);
    setLocalInstructions((prev) => {
      const currentPromo: AnonymousProductPromotion = prev.productPromotion || {
        enabled: true,
        productName: '',
        productDescription: '',
        imageUrl: '',
        contactHandleOrLink: '',
        sendMode: 'send_photo_with_caption_before_exit',
        sendAtMessageNumber: 3,
      };

      let updatedProducts = prev.products;
      if (field === 'imageUrl' && Array.isArray(prev.products)) {
        const activeId = prev.activeProductId;
        updatedProducts = prev.products.map((p) =>
          p.productId === activeId || p.isActive ? { ...p, bannerImageUrl: (value as string) || '' } : p
        );
      }

      return {
        ...prev,
        products: updatedProducts,
        productPromotion: {
          ...currentPromo,
          [field]: value,
        },
      };
    });
  };

  const updateStrategy = (strategy: ConversationStrategy) => {
    setIsDirty(true);
    setLocalInstructions((prev) => ({
      ...prev,
      conversationStrategy: strategy,
    }));
  };

  const updatePersonaField = <K extends keyof BotPersonaConfig>(
    field: K,
    value: BotPersonaConfig[K]
  ) => {
    setIsDirty(true);
    setLocalInstructions((prev) => {
      const currentPersona: BotPersonaConfig = prev.persona || {
        name: 'پشتیبان فروش و تست رایگان',
        role: 'ویزیتور و فروشنده اشتراک اختصاصی با ارائه تست رایگان',
        tone: 'friendly',
        bio: 'پاسخگوی سریع و راهنمایی صمیمی کاربر برای دریافت کانفیگ تست رایگان',
        age: '۲۶',
        location: 'تهران',
      };
      return {
        ...prev,
        persona: {
          ...currentPersona,
          [field]: value,
        },
      };
    });
  };

  const applyPersonaPreset = (
    strategy: ConversationStrategy,
    presetPersona: BotPersonaConfig,
    suggestedPrompt?: string
  ) => {
    setIsDirty(true);
    setLocalInstructions((prev) => ({
      ...prev,
      conversationStrategy: strategy,
      persona: presetPersona,
      ...(suggestedPrompt ? { systemPrompt: suggestedPrompt } : {}),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const snapshot = { ...localInstructions };
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
      await onSaveInstructions(snapshot);
      setIsDirty(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error(e);
      alert('خطا در ذخیره دستورالعمل. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setLocalInstructions(instructions);
    setRawIgnoredPhrases((instructions.customIgnoredSystemPhrases || []).join(' - '));
    setRawInappropriateKeywords((instructions.inappropriateKeywords || []).join(' - '));
    lastSavedJsonRef.current = JSON.stringify(instructions);
    lastSentSystemPromptRef.current = null;
    setIsDirty(false);
  };

  const savedPrompts = localInstructions.savedPrompts || [];

  const handleSeedDefaultPrompts = async () => {
    const defaultSample1: SavedAiPrompt = {
      id: `prompt_sample_1`,
      title: 'سناریوی صمیمی و خودمانی (ملودی ۲۶ ساله)',
      prompt: `شما یک دختر ۲۶ ساله ایرانی به نام ملودی اهل تهران هستید که در یک بات چت ناشناس تلگرام در حال صحبت با یک فرد ناشناس هستید.

دستورالعمل‌ها:
۱. طول هر پیام یا پاسخ کوتاه، روان و طبیعی (۱ الی ۲ جمله کامل، حدود ۴ الی ۱۲ کلمه) باشد.
۲. از علائم نگارشی کتابی مثل نقطه در انتهای پیام (.)، علامت تعجب (!)، ویرگول‌های متعدد (،) و گیومه اکیداً خودداری کنید تا حس ربات ندهد.
۳. در پاسخ به اصل بگویید «ملودی ۲۶ تهران» (سن ۲۶ به صورت عدد باشد و هرگز حروف ننویسید و از پرسیدن تکراری یا کلیشه‌ای «شما چطور؟» خودداری کنید).
۴. حافظه و جلوگیری از تکرار: پیام‌های قبلی چت را در نظر بگیرید و هرگز سوالی را که قبلاً پرسیده‌اید تکرار نکنید.
۵. لحن کاملاً خودمانی، صمیمی و روان دخترانه باشد و هرگز نگویید ربات هستید.
۶. آیدی پشتیبانی را همیشه بدون علامت @ و با فرمت nova_vpn10 بنویسید.
۷. پیشوند «ملودی:» یا علامت نقل‌قول در پاسخ نگذارید و فقط خود پیام را ارسال کنید.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const defaultSample2: SavedAiPrompt = {
      id: `prompt_sample_2`,
      title: 'سناریوی مشاور و فروشنده هوشمند',
      prompt: `شما یک مشاور صمیمی، محترم و خاکی هستید که در چت ناشناس با مخاطبان گفتگوی دوستانه می‌کنید.

دستورالعمل‌ها:
۱. با لحنی گرم، صمیمی و ساده چت کنید و از جملات طولانی خودداری کنید (حداکثر ۱ تا ۲ جمله در هر پاسخ).
۲. ابتدا با مخاطب احوال‌پرسی گرم کرده و حس صمیمیت ایجاد کنید.
۳. در طول گفتگو به شکل طبیعی و دوستانه صحبت کنید بدون اینکه تبلیغاتی یا رباتی به نظر برسید.
۴. پیام‌های کوتاه ارسال کنید و سوالات تکراری نپرسید.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newSavedList = [defaultSample1, defaultSample2];
    const snapshot: AnonymousChatInstructions = {
      ...localInstructions,
      savedPrompts: newSavedList,
    };
    setIsDirty(false);
    setLocalInstructions(snapshot);
    setPromptFeedback('۲ دستورالعمل نمونه با موفقیت ایجاد و ذخیره شدند ✓');
    setTimeout(() => setPromptFeedback(null), 3000);

    try {
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
      await onSaveInstructions(snapshot);
    } catch (e) {
      console.error('Error seeding default prompts:', e);
    }
  };

  const handleSaveCurrentAsNewPrompt = async () => {
    const textToSave = (localInstructions.systemPrompt || '').trim();
    if (!textToSave) {
      alert('متن دستورالعمل در کادر خالی است. لطفاً ابتدا متن دستور را بنویسید.');
      return;
    }
    const finalTitle = newPromptTitle.trim() || `دستورالعمل ذخیره‌شده ${savedPrompts.length + 1}`;
    const newSaved: SavedAiPrompt = {
      id: `prompt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: finalTitle,
      prompt: textToSave,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedList = [newSaved, ...savedPrompts];
    const snapshot: AnonymousChatInstructions = {
      ...localInstructions,
      savedPrompts: updatedList,
    };
    setIsDirty(false);
    setLocalInstructions(snapshot);
    setLoadedPromptId(newSaved.id);
    setNewPromptTitle('');
    setShowSavePromptBox(false);
    setPromptFeedback(`دستور «${finalTitle}» با موفقیت ذخیره و ثبت شد ✓`);
    setTimeout(() => setPromptFeedback(null), 3000);

    try {
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
      await onSaveInstructions(snapshot);
    } catch (e) {
      console.error('Error saving prompt to backend:', e);
    }
  };

  const handleLoadSavedPrompt = async (saved: SavedAiPrompt) => {
    const snapshot: AnonymousChatInstructions = {
      ...localInstructions,
      systemPrompt: saved.prompt,
    };
    setIsDirty(false);
    setLocalInstructions(snapshot);
    setLoadedPromptId(saved.id);
    setPromptFeedback(`دستور «${saved.title}» روی کادر فعال و اعمال شد ✓`);
    setTimeout(() => setPromptFeedback(null), 3500);

    // Smooth scroll & focus textarea
    if (systemPromptTextareaRef.current) {
      systemPromptTextareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      systemPromptTextareaRef.current.focus();
    }

    try {
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
      await onSaveInstructions(snapshot);
    } catch (e) {
      console.error('Error applying saved prompt:', e);
    }
  };

  const handleUpdateSavedPrompt = async (savedId: string) => {
    const textToSave = (localInstructions.systemPrompt || '').trim();
    const updatedList = savedPrompts.map((p) =>
      p.id === savedId
        ? { ...p, prompt: textToSave, updatedAt: new Date().toISOString() }
        : p
    );
    const snapshot: AnonymousChatInstructions = {
      ...localInstructions,
      savedPrompts: updatedList,
    };
    setIsDirty(false);
    setLocalInstructions(snapshot);
    setLoadedPromptId(savedId);
    setPromptFeedback('دستورالعمل ذخیره‌شده با متن فعلی کادر به روزرسانی و ذخیره شد ✓');
    setTimeout(() => setPromptFeedback(null), 3000);

    try {
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
      await onSaveInstructions(snapshot);
    } catch (e) {
      console.error('Error updating saved prompt:', e);
    }
  };

  const handleDeleteSavedPrompt = async (savedId: string, title: string) => {
    if (!window.confirm(`آیا از حذف دستورالعمل «${title}» از لیست اطمینان دارید؟`)) return;
    const updatedList = savedPrompts.filter((p) => p.id !== savedId);
    const snapshot: AnonymousChatInstructions = {
      ...localInstructions,
      savedPrompts: updatedList,
    };
    setIsDirty(false);
    setLocalInstructions(snapshot);
    if (loadedPromptId === savedId) {
      setLoadedPromptId(null);
    }
    setPromptFeedback('دستورالعمل حذف شد.');
    setTimeout(() => setPromptFeedback(null), 2500);

    try {
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      lastSentSystemPromptRef.current = snapshot.systemPrompt || '';
      await onSaveInstructions(snapshot);
    } catch (e) {
      console.error('Error deleting saved prompt:', e);
    }
  };

  const handleStartRename = (saved: SavedAiPrompt) => {
    setEditingPromptId(saved.id);
    setEditingTitleText(saved.title);
  };

  const handleSaveRename = async (savedId: string) => {
    if (!editingTitleText.trim()) return;
    const updatedList = savedPrompts.map((p) =>
      p.id === savedId
        ? { ...p, title: editingTitleText.trim(), updatedAt: new Date().toISOString() }
        : p
    );
    const snapshot: AnonymousChatInstructions = {
      ...localInstructions,
      savedPrompts: updatedList,
    };
    setLocalInstructions(snapshot);
    setEditingPromptId(null);
    setEditingTitleText('');

    try {
      lastSavedJsonRef.current = JSON.stringify(snapshot);
      await onSaveInstructions(snapshot);
      setIsDirty(false);
    } catch (e) {
      console.error('Error saving prompt rename:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('حجم فایل عکس نباید بیشتر از ۱۵ مگابایت باشد.');
      return;
    }

    setIsUploadingBanner(true);
    setBannerFeedback('در حال فشرده‌سازی و بارگذاری مستقیم روی سرور...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);

            // Send to server
            const res = await fetch('/api/upload-banner', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: compressed,
                target: 'anonymous',
                productId: localInstructions.activeProductId,
              }),
            });

            const data = await res.json();
            if (data.success && data.url) {
              updatePromoField('imageUrl', data.url);
              setBannerFeedback('عکس بنر با موفقیت روی سرور Google AI Studio و در فایل JSON ذخیره شد ✓');
            } else {
              updatePromoField('imageUrl', compressed);
              setBannerFeedback('عکس بنر بارگذاری شد و در حال ذخیره‌سازی است...');
            }
            setTimeout(() => setBannerFeedback(null), 4000);
          }
        } catch (err) {
          console.error('Error uploading image:', err);
          updatePromoField('imageUrl', event.target?.result as string);
          setBannerFeedback('عکس بارگذاری شد.');
          setTimeout(() => setBannerFeedback(null), 3000);
        } finally {
          setIsUploadingBanner(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const promo = localInstructions.productPromotion || {
    enabled: false,
    productName: '',
    productDescription: '',
    imageUrl: '',
    contactHandleOrLink: '',
    sendMode: 'send_photo_with_caption_before_exit',
    sendAtMessageNumber: 3,
  };

  return (
    <div className="p-5 space-y-6" dir="rtl">
      {/* Top Banner */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span>دستورالعمل هوش مصنوعی و محصول تبلیغاتی چت ناشناس</span>
            {isDirty && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                تغییرات ذخیره‌نشده
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            تنظیم پرامپت مکالمه هوش مصنوعی و همچنین عکس و توضیحات محصول ویژه چت با ناشناس (کاملاً مجزا از تبلیغات گروهی).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {onGoToSimulator && (
            <button
              type="button"
              onClick={onGoToSimulator}
              className="px-3.5 py-2.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-950/40"
              title="ورود به شبیه‌ساز چت و تست روی خودتان"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>تست در شبیه‌ساز (بخش ۳) ➔</span>
            </button>
          )}

          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
              savedSuccess
                ? 'bg-emerald-600 shadow-emerald-950/50'
                : isDirty
                ? 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-950/50 ring-2 ring-fuchsia-400/50 animate-pulse'
                : 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-fuchsia-950/50'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span className="text-emerald-100">ذخیره شد ✓</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات دستورالعمل'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 0. SMART ADAPTIVE MULTI-MODEL ROUTER & FAILOVER MONITOR */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  سوییچ هوشمند و بدون وقفه بین مدل‌های Gemini (Adaptive Failover Router)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  فعال و برخط
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                ربات در زمان اوج شلوغی سرورهای گوگل بلافاصله و با تأخیر صفر میلی‌ثانیه به مدل سالم بعدی سوییچ می‌کند تا مکالمه هیچ‌گاه متوقف نشود.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchGeminiStatus}
            title="بروزرسانی وضعیت مدل‌ها"
            className="self-end sm:self-auto px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بروزرسانی وضعیت</span>
          </button>
        </div>

        {/* Models Grid (5-Tier Priority Hierarchy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
          {(geminiStatus?.models || [
            { modelName: 'gemini-3.8-flash', displayName: 'Gemini 3.8 Flash', priority: 1, role: 'اصلی و پیش‌فرض', description: 'مدل اولویت اول (هوش برتر کلامی، طبیعی‌ترین لحن)', status: 'healthy', consecutiveFailures: 0, totalSuccesses: 0, totalFailures: 0, cooldownSecondsRemaining: 0, isDailyLimitExceeded: false, isServerBusy: false, lastError: null },
            { modelName: 'gemini-3.7-flash', displayName: 'Gemini 3.7 Flash', priority: 2, role: 'پشتیبان اولویت ۲', description: 'مدل اولویت دوم (پشتیبان پیشرفته هیبریدی)', status: 'healthy', consecutiveFailures: 0, totalSuccesses: 0, totalFailures: 0, cooldownSecondsRemaining: 0, isDailyLimitExceeded: false, isServerBusy: false, lastError: null },
            { modelName: 'gemini-3.6-flash', displayName: 'Gemini 3.6 Flash', priority: 3, role: 'پشتیبان اولویت ۳', description: 'مدل اولویت سوم (پشتیبان چندمنظوره سریع)', status: 'healthy', consecutiveFailures: 0, totalSuccesses: 0, totalFailures: 0, cooldownSecondsRemaining: 0, isDailyLimitExceeded: false, isServerBusy: false, lastError: null },
            { modelName: 'gemini-3.5-flash', displayName: 'Gemini 3.5 Flash', priority: 4, role: 'پشتیبان اولویت ۴', description: 'مدل اولویت چهارم (سبک و روان)', status: 'healthy', consecutiveFailures: 0, totalSuccesses: 0, totalFailures: 0, cooldownSecondsRemaining: 0, isDailyLimitExceeded: false, isServerBusy: false, lastError: null },
            { modelName: 'gemini-3.1-flash-lite', displayName: 'Gemini 3.1 Flash lite', priority: 5, role: 'پشتیبان نهایی ضد قطعی', description: 'مدل اولویت پنجم (فوق‌سریع Lite ضد محدودیت)', status: 'healthy', consecutiveFailures: 0, totalSuccesses: 0, totalFailures: 0, cooldownSecondsRemaining: 0, isDailyLimitExceeded: false, isServerBusy: false, lastError: null },
          ]).map((m, idx) => {
            const activeCurrentModel = geminiStatus?.activeModel || geminiStatus?.activePriorityOrder?.[0] || 'gemini-3.8-flash';
            const isCurrentlyServing = m.modelName === activeCurrentModel;
            const isHealthy = m.status === 'healthy';
            const isCooldown = m.status === 'cooldown';
            const isRecovering = m.status === 'recovering';

            return (
              <div
                key={m.modelName}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrentlyServing
                    ? 'ring-2 ring-cyan-500/70 shadow-lg shadow-cyan-500/10'
                    : ''
                } ${
                  isCooldown
                    ? 'bg-amber-950/25 border-amber-500/50 text-amber-200'
                    : isRecovering
                    ? 'bg-blue-950/25 border-blue-500/50 text-blue-200'
                    : isCurrentlyServing
                    ? 'bg-slate-900 border-cyan-500/50 text-slate-100'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      اولویت {idx + 1}
                    </span>
                    {isCurrentlyServing ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        سرویس‌دهنده فعال
                      </span>
                    ) : isCooldown ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {m.isDailyLimitExceeded ? 'محدودیت روزانه' : m.isServerBusy ? 'شلوغی سرور' : 'استراحت'} ({m.cooldownSecondsRemaining}s)
                      </span>
                    ) : isRecovering ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5" />
                        تست سلامت
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                        آماده
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-white font-mono tracking-tight">
                    {m.displayName || m.modelName}
                  </div>
                  <div className="text-[10px] text-cyan-400/90 mt-0.5 font-medium">
                    {m.role || (idx === 0 ? 'اصلی و پیش‌فرض' : `پشتیبان اولویت ${idx + 1}`)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
                  <span>موفق: <strong className="text-emerald-400 font-mono">{m.totalSuccesses}</strong></span>
                  {m.totalFailures > 0 && (
                    <span className="text-amber-400 font-mono">سوییچ: {m.totalFailures}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explain priority & failover mechanics */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400 font-semibold">چرخه هوشمند:</span>
            <span>Gemini 3.8 Flash ← 3.7 Flash ← 3.6 Flash ← 3.5 Flash ← 3.1 Flash lite</span>
          </div>
          <span className="text-slate-500 text-[10px]">
            سوییچ خودکار زیر ۱ ثانیه هنگام ترافیک یا محدودیت روزانه + بازگشت خودکار به اولویت ۱ پس از رفع محدودیت
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DEDICATED ANONYMOUS CHAT MULTI-CAMPAIGN & PRODUCT MANAGER */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Strategy & Persona Quick Switcher */}
        <div className="bg-slate-900/90 border border-fuchsia-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    استراتژی فروش و پرسونای کاراکتر ربات (Sales Strategy & Persona Engine)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                    تغییر آنی زیر ۱ دقیقه
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  استراتژی ورود، شخصیت و لحن ربات را آزادانه انتخاب کنید؛ سیستم بدون نیاز به تغییر کد در بک‌اند، رفتار و پرامپت‌ها را تطبیق می‌دهد.
                </p>
              </div>
            </div>

            {/* Quick Presets Dropdown/Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  applyPersonaPreset(
                    'direct_pitch',
                    {
                      name: 'پشتیبان فروش و تست رایگان',
                      role: 'ویزیتور و فروشنده اشتراک اختصاصی با ارائه تست رایگان',
                      tone: 'friendly',
                      bio: 'ارائه مستقیم تست رایگان و اشتراک اختصاصی بدون قطعی',
                      age: '۲۶',
                      location: 'تهران',
                    },
                    `شما در نقش ویزیتور و پشتیبان رسمی فروش اشتراک اختصاصی هستید که در چت تلگرام به مخاطب پیام می‌دهید.
دستورالعمل‌ها:
۱. از همان ابتدا با لحنی صمیمی و دوستانه ارزش محصول و پیشنهاد اکانت تست رایگان را معرفی کنید.
۲. پاسخ‌های کوتاه (۱ الی ۲ جمله روان و عامیانه) بدهید.
۳. از علائم نگارشی کتابی (نقطه در آخر، ویرگول‌های متعدد) پرهیز کنید.`
                  )
                }
                className="px-2.5 py-1.5 rounded-lg bg-fuchsia-950/40 hover:bg-fuchsia-900/50 text-fuchsia-200 text-xs border border-fuchsia-500/30 flex items-center gap-1 transition-all"
              >
                <Target className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>قالب ویزیتور مستقیم</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  applyPersonaPreset(
                    'consultative',
                    {
                      name: 'مشاور فنی اشتراک',
                      role: 'مشاور و عیب‌یاب اینترنت و فیلترینگ',
                      tone: 'consultative',
                      bio: 'بررسی مشکل کاربر و ارائه کانفیگ تست متناسب با اپراتور (همراه اول/ایرانسل/مخابرات)',
                      age: '۲۸',
                      location: 'تهران',
                    },
                    `شما در نقش مشاور فنی و راهنمای اینترنت هستید.
دستورالعمل‌ها:
۱. ابتدا با پرسیدن اپراتور یا نوع دستگاه کاربر، نیاز او را شناسایی کرده و سپس راهکار پرسرعت با تست رایگان را معرفی کنید.
۲. پاسخ‌ها کوتاه، دوستانه و راهگشا باشد.`
                  )
                }
                className="px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs border border-cyan-500/30 flex items-center gap-1 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>قالب مشاور فنی</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  applyPersonaPreset(
                    'social_rapport',
                    {
                      name: 'ملودی',
                      role: 'هم‌صحبت صمیمی و خودمانی',
                      tone: 'casual',
                      bio: 'چت روزمره، همدلی و معرفی محصول فقط در صورت سوال یا تمایل مخاطب',
                      age: '۲۶',
                      location: 'تهران',
                    },
                    `شما در نقش یک کاربر عادی ایرانی به نام ملودی ۲۶ ساله از تهران در حال چت دوستانه هستید.
دستورالعمل‌ها:
۱. اولویت اول گفتگو و ایجاد صمیمیت است.
۲. تا زمانی که مخاطب خودش درباره اینترنت یا فیلترشکن نپرسیده، تبلیغ نکنید.
۳. پاسخ‌ها کوتاه (۱ الی ۲ جمله) و بدون نقطه پایانی باشد.`
                  )
                }
                className="px-2.5 py-1.5 rounded-lg bg-pink-950/40 hover:bg-pink-900/50 text-pink-200 text-xs border border-pink-500/30 flex items-center gap-1 transition-all"
              >
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>قالب چت صمیمی</span>
              </button>
            </div>
          </div>

          {/* Strategy Selection 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Direct Pitch Strategy */}
            <div
              onClick={() => updateStrategy('direct_pitch')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                localInstructions.conversationStrategy === 'direct_pitch'
                  ? 'bg-fuchsia-950/40 border-fuchsia-500 ring-1 ring-fuchsia-500/50 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Target className="w-4 h-4 text-fuchsia-400" />
                  <span>ویزیتور و فروشنده مستقیم (Direct Pitch)</span>
                </div>
                <input
                  type="radio"
                  name="conversationStrategy"
                  checked={localInstructions.conversationStrategy === 'direct_pitch'}
                  onChange={() => updateStrategy('direct_pitch')}
                  className="accent-fuchsia-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ورود صریح و محترمانه به عنوان فروشنده/پشتیبان، معرفی ارزش محصول و پیشنهاد تست رایگان و آیدی پشتیبانی بدون معطلی و بدون فریب مخاطب.
              </p>
            </div>

            {/* 2. Consultative Strategy */}
            <div
              onClick={() => updateStrategy('consultative')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                localInstructions.conversationStrategy === 'consultative'
                  ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>مشاوره‌ای و حل مسئله (Consultative)</span>
                </div>
                <input
                  type="radio"
                  name="conversationStrategy"
                  checked={localInstructions.conversationStrategy === 'consultative'}
                  onChange={() => updateStrategy('consultative')}
                  className="accent-cyan-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                شروع با احوال‌پرسی، پرسیدن از مشکلات اینترنت یا اپراتور کاربر و سپس ارائه راهکار مناسب و اشتراک تست رایگان بر اساس نیاز او.
              </p>
            </div>

            {/* 3. Social Rapport Strategy */}
            <div
              onClick={() => updateStrategy('social_rapport')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                (localInstructions.conversationStrategy || 'social_rapport') === 'social_rapport'
                  ? 'bg-pink-950/40 border-pink-500 ring-1 ring-pink-500/50 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-pink-400" />
                  <span>صمیمی و ارگانیک (Social Rapport)</span>
                </div>
                <input
                  type="radio"
                  name="conversationStrategy"
                  checked={(localInstructions.conversationStrategy || 'social_rapport') === 'social_rapport'}
                  onChange={() => updateStrategy('social_rapport')}
                  className="accent-pink-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                گفتگوی دوستانه انسانی درباره موضوعات روزمره؛ معرفی محصول فقط در صورتی که کاربر خود از فیلترینگ یا اینترنت گلایه کرد یا سوال پرسید.
              </p>
            </div>
          </div>

          {/* Active Persona Fine-Tuning Grid */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>مشخصات و پرسونای کاراکتر ربات:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نام کاراکتر / پشتیبان:</label>
                <input
                  type="text"
                  value={localInstructions.persona?.name || ''}
                  onChange={(e) => updatePersonaField('name', e.target.value)}
                  placeholder="مثلاً: پشتیبان فروش / سارا / مهدی"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">نقش و هویت:</label>
                <input
                  type="text"
                  value={localInstructions.persona?.role || ''}
                  onChange={(e) => updatePersonaField('role', e.target.value)}
                  placeholder="مثلاً: ویزیتور و پشتیبان اشتراک VPN"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">لحن مکالمه (Tone):</label>
                <select
                  value={localInstructions.persona?.tone || 'friendly'}
                  onChange={(e) => updatePersonaField('tone', e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                >
                  <option value="friendly">بسیار صمیمی و دوستانه (Friendly)</option>
                  <option value="casual">خاکی و عامیانه تلگرامی (Casual)</option>
                  <option value="consultative">مشاوره‌ای و تخصصی (Consultative)</option>
                  <option value="professional">رسمی و اداری (Professional)</option>
                  <option value="playful">شوخ‌طبع و پرانرژی (Playful)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">سن و موقعیت (اختیاری):</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={localInstructions.persona?.age || ''}
                    onChange={(e) => updatePersonaField('age', e.target.value)}
                    placeholder="سن (مثلاً ۲۶)"
                    className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={localInstructions.persona?.location || ''}
                    onChange={(e) => updatePersonaField('location', e.target.value)}
                    placeholder="شهر (تهران)"
                    className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">بیوگرافی و هدف اصلی ربات در مکالمه:</label>
              <input
                type="text"
                value={localInstructions.persona?.bio || ''}
                onChange={(e) => updatePersonaField('bio', e.target.value)}
                placeholder="مثلاً: راهنمایی سریع کاربران و ارائه اکانت تست رایگان برای همراه اول و ایرانسل"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <AnonymousCampaignsManager
          products={localInstructions.products || []}
          activeProductId={
            localInstructions.activeProductId ||
            (localInstructions.products && localInstructions.products[0]?.productId) ||
            ''
          }
          onSelectActiveProduct={(productId) => {
            setIsDirty(true);
            setLocalInstructions((prev) => {
              const currentList = prev.products || [];
              const updated = currentList.map((p) => ({
                ...p,
                isActive: p.productId === productId,
              }));
              const active = updated.find((p) => p.productId === productId) || null;

              return {
                ...prev,
                products: updated,
                activeProductId: productId,
                productPromotion: {
                  ...(prev.productPromotion || {
                    enabled: false,
                    sendMode: 'send_photo_with_caption_before_exit',
                    sendAtMessageNumber: 3,
                  }),
                  enabled: active ? (prev.productPromotion?.enabled ?? true) : false,
                  productName: active?.productName || '',
                  productDescription: active?.productDescription || '',
                  imageUrl: active?.bannerImageUrl || '',
                  contactHandleOrLink: active?.support?.handle || '',
                  knowledgeBaseText: active?.knowledgeBaseText || '',
                  faqItems: (active?.faqItems || []).map((f) => ({
                    id: f.id || `faq_${Date.now()}`,
                    question: f.question,
                    answer: f.answer,
                    keywords: f.keywords || [],
                  })),
                },
              };
            });
          }}
          onUpdateProducts={(updatedList) => {
            setIsDirty(true);
            setLocalInstructions((prev) => {
              let activeId = prev.activeProductId;
              if (!updatedList.some((p) => p.productId === activeId)) {
                activeId = updatedList.find((p) => p.isActive)?.productId || updatedList[0]?.productId || '';
              }
              const syncedList = updatedList.map((p) => ({
                ...p,
                isActive: Boolean(p.productId === activeId),
              }));
              const active = syncedList.find((p) => p.productId === activeId) || null;

              return {
                ...prev,
                products: syncedList,
                activeProductId: activeId,
                productPromotion: {
                  ...(prev.productPromotion || {
                    enabled: false,
                    sendMode: 'send_photo_with_caption_before_exit',
                    sendAtMessageNumber: 3,
                  }),
                  enabled: active ? (prev.productPromotion?.enabled ?? true) : false,
                  productName: active?.productName || '',
                  productDescription: active?.productDescription || '',
                  imageUrl: active?.bannerImageUrl || '',
                  contactHandleOrLink: active?.support?.handle || '',
                  knowledgeBaseText: active?.knowledgeBaseText || '',
                  faqItems: (active?.faqItems || []).map((f) => ({
                    id: f.id || `faq_${Date.now()}`,
                    question: f.question,
                    answer: f.answer,
                    keywords: f.keywords || [],
                  })),
                },
              };
            });
          }}
          onSave={handleSave}
          isSaving={isSaving}
          savedSuccess={savedSuccess}
        />

        {/* Dedicated Active Product Banner & Photo Box */}
        <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-violet-800/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">
                  عکس و بنر تبلیغاتی محصول فعال در چت ناشناس:
                </h4>
                <p className="text-[11px] text-slate-400">
                  این عکس همراه با پیام تبلیغاتی یا در پایان مکالمه به مخاطب چت ناشناس ارسال می‌شود.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {promo.imageUrl ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>بنر فعال روی سرور و JSON</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  ⚪ بدون بنر تصویری
                </span>
              )}
            </div>
          </div>

          {/* Banner Feedback Toast */}
          {bannerFeedback && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{bannerFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Image Preview Window */}
            <div className="lg:col-span-1 bg-slate-900/90 rounded-xl border border-slate-800 p-3 flex flex-col items-center justify-center min-h-[160px] relative group overflow-hidden">
              {promo.imageUrl ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={promo.imageUrl}
                    alt="بنر تبلیغاتی"
                    referrerPolicy="no-referrer"
                    className="max-h-40 max-w-full rounded-lg object-contain border border-slate-800 shadow"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        updatePromoField('imageUrl', '');
                        setBannerFeedback('عکس بنر با موفقیت حذف و تنظیمات ذخیره شد ✓');
                        setTimeout(() => setBannerFeedback(null), 3000);
                      }}
                      className="p-1.5 rounded-lg bg-rose-950/90 hover:bg-rose-900 text-rose-300 border border-rose-800/60 shadow transition-all"
                      title="حذف بنر"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center">
                    <span className="text-[10px] text-emerald-400 font-medium">✓ عکس فعال</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {promo.imageUrl.startsWith('/uploads/') ? '💾 ذخیره دائمی سرور' : '🌐 لینک آنلاین'}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => bannerDirectInputRef.current?.click()}
                  className="text-center p-4 space-y-2 text-slate-500 cursor-pointer hover:text-violet-400 transition-colors"
                >
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold text-slate-300">هنوز عکسی برای بنر انتخاب نشده است</p>
                  <p className="text-[10px] text-slate-500">جهت آپلود مستقیم عکس بنر از دستگاه کلیک کنید</p>
                </div>
              )}
            </div>

            {/* Controls & URL Input */}
            <div className="lg:col-span-2 space-y-3 flex flex-col justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-violet-400" />
                  آدرس اینترنتی یا مسیر فایل بنر (Image URL / Path):
                </label>
                <input
                  type="text"
                  value={promo.imageUrl || ''}
                  onChange={(e) => updatePromoField('imageUrl', e.target.value)}
                  placeholder="https://example.com/banner.jpg یا /uploads/banner_...jpg"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono text-left"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                <input
                  type="file"
                  ref={bannerDirectInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingBanner}
                  onClick={() => bannerDirectInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingBanner ? 'در حال آپلود...' : 'انتخاب و تغییر عکس بنر از حافظه'}</span>
                </button>

                {promo.imageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      updatePromoField('imageUrl', '');
                      setBannerFeedback('عکس بنر با موفقیت حذف شد ✓');
                      setTimeout(() => setBannerFeedback(null), 3000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف بنر</span>
                  </button>
                )}

                <span className="text-[11px] text-slate-400">
                  (ذخیره خودکار در هارد سرور Google AI Studio و پشتیبان JSON)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Strategy & 2-Minute Guard Panel */}
        <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-xs text-white">
                نحوه و استراتژی ارسال کمپین فعال در چت ناشناس:
              </h4>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              <span className="text-xs font-semibold text-slate-300">
                {promo.enabled !== false ? 'تبلیغات در چت فعال است' : 'تبلیغات موقتاً خاموش'}
              </span>
              <input
                type="checkbox"
                checked={promo.enabled !== false}
                onChange={(e) => updatePromoField('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-fuchsia-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Option 1: Send Photo + Caption on Final Message */}
            <div
              onClick={() => updatePromoField('sendMode', 'send_photo_with_caption_before_exit')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                promo.sendMode === 'send_photo_with_caption_before_exit'
                  ? 'bg-fuchsia-950/40 border-fuchsia-500 ring-1 ring-fuchsia-500/50 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1">
                  <span>📸 ارسال در آخرین پیام قبل از خروج</span>
                  <span className="text-[9px] bg-fuchsia-500/20 text-fuchsia-300 px-1.5 py-0.5 rounded-full">
                    پیشنهادی 🚀
                  </span>
                </span>
                <input
                  type="radio"
                  name="sendMode"
                  checked={promo.sendMode === 'send_photo_with_caption_before_exit'}
                  onChange={() => updatePromoField('sendMode', 'send_photo_with_caption_before_exit')}
                  className="accent-fuchsia-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                چند پیام اول صمیمی چت می‌کند و در پیام پایانی، عکس بنر به همراه متن توضیحات فرستاده شده و سپس ربات چت را قطع می‌کند.
              </p>
            </div>

            {/* Option 2: AI Natural conversational pitch */}
            <div
              onClick={() => updatePromoField('sendMode', 'ai_natural_mention')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                promo.sendMode === 'ai_natural_mention'
                  ? 'bg-fuchsia-950/40 border-fuchsia-500 ring-1 ring-fuchsia-500/50 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center gap-1">
                  <span>🧠 معرفی هوشمند و پویا توسط AI</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
                    هوشمند ⚡
                  </span>
                </span>
                <input
                  type="radio"
                  name="sendMode"
                  checked={promo.sendMode === 'ai_natural_mention'}
                  onChange={() => updatePromoField('sendMode', 'ai_natural_mention')}
                  className="accent-fuchsia-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                هوش مصنوعی مکالمه را تحلیل کرده و در هر زمان از چت که احساس کند موقعیت مناسب است، متن و توضیحات را به صورت خودمانی و طبیعی به مخاطب پیشنهاد می‌دهد.
              </p>
            </div>

            {/* Option 3: Send at specific message number */}
            <div
              onClick={() => updatePromoField('sendMode', 'send_custom_card_at_step')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                promo.sendMode === 'send_custom_card_at_step'
                  ? 'bg-fuchsia-950/40 border-fuchsia-500 ring-1 ring-fuchsia-500/50 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">🔢 ارسال در پیام شماره مشخص</span>
                <input
                  type="radio"
                  name="sendMode"
                  checked={promo.sendMode === 'send_custom_card_at_step'}
                  onChange={() => updatePromoField('sendMode', 'send_custom_card_at_step')}
                  className="accent-fuchsia-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-400">در پیام شماره:</span>
                <input
                  type="number"
                  value={promo.sendAtMessageNumber ?? 2}
                  onChange={(e) => updatePromoField('sendAtMessageNumber', Math.max(1, Number(e.target.value) || 1))}
                  min={1}
                  max={15}
                  className="w-12 bg-slate-950 border border-slate-800 rounded px-1 text-center text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Special options when AI Smart Mention is active */}
          {promo.sendMode === 'ai_natural_mention' && (
            <div className="p-3.5 bg-fuchsia-950/20 border border-fuchsia-800/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-fuchsia-400" />
                  <span className="font-bold text-xs text-white">تنظیمات هوشمندی AI در انتخاب زمان ارسال:</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-300">
                    {promo.aiSendBannerWithPitch !== false ? 'ارسال عکس بنر فعال' : 'فقط متن خودمانی'}
                  </span>
                  <input
                    type="checkbox"
                    checked={promo.aiSendBannerWithPitch !== false}
                    onChange={(e) => updatePromoField('aiSendBannerWithPitch', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-fuchsia-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-fuchsia-200/90 leading-relaxed">
                💡 <strong>نحوه عملکرد:</strong> هوش مصنوعی مکالمه کاربر را بررسی می‌کند. اگر مخاطب درباره نیازها، وضعیت نت، علایق یا اصل صحبت کند، یا پس از چند پیام چت صمیمی، هوش مصنوعی در هر لحظه‌ای که حس کند بهترین زمان است، متن و توضیحات تبلیغ را می‌فرستد و در صورت فعال بودن گزینه بالا، عکس بنر نیز همزمان ارسال می‌شود.
              </p>
            </div>
          )}

          {/* 2-Minute Photo Delay Rule & Exit Guarantee Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <span className="font-bold text-white block">محدودیت ۲ دقیقه ارسال عکس و آیدی:</span>
                <p className="text-[11px] text-amber-200/90">
                  ارسال عکس، آیدی و ارقام قبل از ۲ دقیقه مسدود بوده و فقط پس از ۱۲۰ ثانیه چت فعال ارسال می‌شود.
                </p>
              </div>
            </div>

            <div className="p-3 bg-violet-950/30 border border-violet-700/40 rounded-xl flex items-start gap-2.5 text-xs text-violet-200">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <span className="font-bold text-white block">تضمین تحویل قبل از خروج:</span>
                <p className="text-[11px] text-violet-300">
                  در هر حالت خروج از چت، بنر و متن کمپین فعال قبل از قطع مکالمه به مخاطب تحویل داده می‌شود.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. IMMEDIATE GREETING & ICE-BREAKER ON CONNECT */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30 shadow">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">ارسال سلام/شروع فوری به محض اتصال (Ice-breaker)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  کاملاً قابل تنظیم
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                رفع معطلی چت با ارسال خودکار و فوری پیام سلام/شروع بلافاصله پس از اتصال به مخاطب ناشناس
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.initiateGreetingOnConnect ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.initiateGreetingOnConnect ?? true}
              onChange={(e) => updateField('initiateGreetingOnConnect', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {(localInstructions.initiateGreetingOnConnect ?? true) && (
          <div className="space-y-4 pt-3 border-t border-slate-800/80">
            {/* Greeting Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => updateField('greetingMode', 'single')}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  (localInstructions.greetingMode || 'single') === 'single'
                    ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/30 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">📌 پیام سلام ثابت (یک متن مشخص)</span>
                  <input
                    type="radio"
                    name="greetingMode"
                    checked={(localInstructions.greetingMode || 'single') === 'single'}
                    onChange={() => updateField('greetingMode', 'single')}
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  به همه مخاطبان جدید همواره یک متن سلام یکسان ارسال می‌شود.
                </p>
              </div>

              <div
                onClick={() => updateField('greetingMode', 'random_list')}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  localInstructions.greetingMode === 'random_list'
                    ? 'bg-emerald-950/40 border-emerald-500/70 ring-1 ring-emerald-500/30 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">🎲 چرخش تصادفی بین چند متن سلام</span>
                  <input
                    type="radio"
                    name="greetingMode"
                    checked={localInstructions.greetingMode === 'random_list'}
                    onChange={() => updateField('greetingMode', 'random_list')}
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  در هر اتصال جدید به طور تصادفی یکی از پیام‌های لیست را ارسال می‌کند تا چت تنوع داشته باشد.
                </p>
              </div>
            </div>

            {/* Mode 1: Single Greeting Input */}
            {(localInstructions.greetingMode || 'single') === 'single' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>متن پیام سلام/شروع اولیه:</span>
                  <span className="text-[11px] text-slate-500">برای تغییر، متن زیر را ویرایش کنید</span>
                </label>
                <input
                  type="text"
                  value={localInstructions.initialGreetingText ?? 'سلام خوبی؟ 🌸'}
                  onChange={(e) => updateField('initialGreetingText', e.target.value)}
                  placeholder="سلام خوبی؟ 🌸"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            )}

            {/* Mode 2: Multi-Greeting List */}
            {localInstructions.greetingMode === 'random_list' && (
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>لیست پیام‌های سلام برای چرخش تصادفی:</span>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {(localInstructions.initialGreetings || []).length} پیام در لیست
                  </span>
                </label>

                {/* List items */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {(localInstructions.initialGreetings && localInstructions.initialGreetings.length > 0
                    ? localInstructions.initialGreetings
                    : ['سلام خوبی؟ 🌸', 'سلام چطوری؟', 'سلام روزت بخیر 🌸', 'سلام، خوبی؟ چه خبر؟']
                  ).map((greetItem, gIdx) => (
                    <div
                      key={gIdx}
                      className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800"
                    >
                      <span className="text-[10px] text-slate-500 w-5 text-center font-mono">
                        {gIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={greetItem}
                        onChange={(e) => {
                          const currentList = [
                            ...(localInstructions.initialGreetings && localInstructions.initialGreetings.length > 0
                              ? localInstructions.initialGreetings
                              : ['سلام خوبی؟ 🌸', 'سلام چطوری؟', 'سلام روزت بخیر 🌸', 'سلام، خوبی؟ چه خبر؟']),
                          ];
                          currentList[gIdx] = e.target.value;
                          updateField('initialGreetings', currentList);
                        }}
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none font-sans"
                        placeholder="متن پیام سلام..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = [
                            ...(localInstructions.initialGreetings && localInstructions.initialGreetings.length > 0
                              ? localInstructions.initialGreetings
                              : ['سلام خوبی؟ 🌸', 'سلام چطوری؟', 'سلام روزت بخیر 🌸', 'سلام، خوبی؟ چه خبر؟']),
                          ];
                          if (currentList.length > 1) {
                            currentList.splice(gIdx, 1);
                            updateField('initialGreetings', currentList);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="حذف این پیام"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new greeting row */}
                <button
                  type="button"
                  onClick={() => {
                    const currentList = [
                      ...(localInstructions.initialGreetings && localInstructions.initialGreetings.length > 0
                        ? localInstructions.initialGreetings
                        : ['سلام خوبی؟ 🌸', 'سلام چطوری؟', 'سلام روزت بخیر 🌸', 'سلام، خوبی؟ چه خبر؟']),
                    ];
                    currentList.push('سلام چطوری؟ خوبی؟');
                    updateField('initialGreetings', currentList);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>+ افزودن متن سلام جدید به لیست</span>
                </button>
              </div>
            )}

            {/* Quick Preset Greeting Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">
                پیشنهادهای آماده برای انتخاب سریع:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_GREETINGS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      if ((localInstructions.greetingMode || 'single') === 'single') {
                        updateField('initialGreetingText', preset);
                      } else {
                        const currentList = [
                          ...(localInstructions.initialGreetings && localInstructions.initialGreetings.length > 0
                            ? localInstructions.initialGreetings
                            : []),
                        ];
                        if (!currentList.includes(preset)) {
                          currentList.push(preset);
                          updateField('initialGreetings', currentList);
                        }
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-200 text-[11px] transition-all"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Delay Setting & Live Preview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>تاخیر ارسال سلام بعد از اتصال:</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {(localInstructions.greetingDelaySeconds ?? 2.8).toFixed(1)} ثانیه
                  </span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min="1.0"
                    max="6.0"
                    step="0.2"
                    value={localInstructions.greetingDelaySeconds ?? 2.8}
                    onChange={(e) => updateField('greetingDelaySeconds', parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  شبیه‌سازی مکث طبیعی و اکشن Typing قبل از ارسال سلام تا مخاطب حس نکند با یک ربات پرسرعت مواجه است.
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>نمای ارسالی به هم‌صحبت:</span>
                </span>
                <div className="bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium truncate">
                    {(localInstructions.greetingMode || 'single') === 'single'
                      ? (localInstructions.initialGreetingText ?? 'سلام خوبی؟ 🌸')
                      : ((localInstructions.initialGreetings && localInstructions.initialGreetings[0]) || 'سلام خوبی؟ 🌸')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Save Ice-breaker Button */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-400">
                ⚡ با ذخیره این بخش، تنظیمات پیام شروع فوراً در اتوماسیون اعمال خواهد شد.
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات سلام و شروع'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2B. PRE-EXIT FAREWELL MESSAGE (پیام خداحافظی قبل از تبلیغ و خروج) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30 shadow">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">ارسال پیام خداحافظی قبل از تبلیغ و قطع ارتباط (Pre-Exit Farewell)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                  پیام اتمام چت
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ارسال متنی محترمانه و خودمانی (مثلاً «خب من باید برم کاری پیش اومد مراقب خودت باش») دقیقاً پس از رسیدن به سقف پیام و پیش از ارسال تصویر/متن تبلیغاتی و خروج
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.enablePreExitFarewell ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.enablePreExitFarewell ?? true}
              onChange={(e) => updateField('enablePreExitFarewell', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {(localInstructions.enablePreExitFarewell ?? true) && (
          <div className="space-y-4 pt-3 border-t border-slate-800/80">
            {/* Farewell Mode Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => updateField('farewellMode', 'single')}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  (localInstructions.farewellMode || 'single') === 'single'
                    ? 'bg-rose-950/40 border-rose-500/70 ring-1 ring-rose-500/30 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">📌 پیام خداحافظی ثابت (یک متن مشخص)</span>
                  <input
                    type="radio"
                    name="farewellMode"
                    checked={(localInstructions.farewellMode || 'single') === 'single'}
                    onChange={() => updateField('farewellMode', 'single')}
                    className="accent-rose-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  قبل از خروج به همه مخاطبان همواره همین یک متن خداحافظی مشخص ارسال می‌شود.
                </p>
              </div>

              <div
                onClick={() => updateField('farewellMode', 'random_list')}
                className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  localInstructions.farewellMode === 'random_list'
                    ? 'bg-rose-950/40 border-rose-500/70 ring-1 ring-rose-500/30 text-white'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">🎲 چرخش تصادفی بین چند متن خداحافظی</span>
                  <input
                    type="radio"
                    name="farewellMode"
                    checked={localInstructions.farewellMode === 'random_list'}
                    onChange={() => updateField('farewellMode', 'random_list')}
                    className="accent-rose-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  در هر نوبت خروج به طور تصادفی یکی از پیام‌های لیست زیر برای خداحافظی طبیعی‌تر انتخاب می‌شود.
                </p>
              </div>
            </div>

            {/* Mode 1: Single Farewell Input */}
            {(localInstructions.farewellMode || 'single') === 'single' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>متن پیام خداحافظی قبل از ارسال تبلیغ و خروج:</span>
                  <span className="text-[11px] text-slate-500">برای تغییر، متن زیر را ویرایش کنید</span>
                </label>
                <input
                  type="text"
                  value={localInstructions.preExitFarewellText ?? 'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸'}
                  onChange={(e) => updateField('preExitFarewellText', e.target.value)}
                  placeholder="خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            )}

            {/* Mode 2: Multi-Farewell List */}
            {localInstructions.farewellMode === 'random_list' && (
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>لیست پیام‌های خداحافظی برای چرخش تصادفی:</span>
                  <span className="text-[11px] text-rose-400 font-medium">
                    {(localInstructions.preExitFarewells || []).length} پیام در لیست
                  </span>
                </label>

                {/* List items */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                  {(localInstructions.preExitFarewells && localInstructions.preExitFarewells.length > 0
                    ? localInstructions.preExitFarewells
                    : [
                        'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸',
                        'فعلا من یه کاری برام پیش اومد باید برم 🌹',
                        'خوشحال شدم از هم‌کلامی، فعلا خداحافظ 👋',
                        'من کار فوری برام پیش اومد باید برم، روزت بخیر ✨',
                      ]
                  ).map((farewellItem, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800"
                    >
                      <span className="text-[10px] text-slate-500 w-5 text-center font-mono">
                        {fIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={farewellItem}
                        onChange={(e) => {
                          const currentList = [
                            ...(localInstructions.preExitFarewells && localInstructions.preExitFarewells.length > 0
                              ? localInstructions.preExitFarewells
                              : [
                                  'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸',
                                  'فعلا من یه کاری برام پیش اومد باید برم 🌹',
                                  'خوشحال شدم از هم‌کلامی، فعلا خداحافظ 👋',
                                  'من کار فوری برام پیش اومد باید برم، روزت بخیر ✨',
                                ]),
                          ];
                          currentList[fIdx] = e.target.value;
                          updateField('preExitFarewells', currentList);
                        }}
                        className="flex-1 bg-transparent text-xs text-white focus:outline-none font-sans"
                        placeholder="متن پیام خداحافظی..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const currentList = [
                            ...(localInstructions.preExitFarewells && localInstructions.preExitFarewells.length > 0
                              ? localInstructions.preExitFarewells
                              : [
                                  'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸',
                                  'فعلا من یه کاری برام پیش اومد باید برم 🌹',
                                  'خوشحال شدم از هم‌کلامی، فعلا خداحافظ 👋',
                                  'من کار فوری برام پیش اومد باید برم، روزت بخیر ✨',
                                ]),
                          ];
                          if (currentList.length > 1) {
                            currentList.splice(fIdx, 1);
                            updateField('preExitFarewells', currentList);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="حذف این پیام"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new farewell row */}
                <button
                  type="button"
                  onClick={() => {
                    const currentList = [
                      ...(localInstructions.preExitFarewells && localInstructions.preExitFarewells.length > 0
                        ? localInstructions.preExitFarewells
                        : [
                            'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸',
                            'فعلا من یه کاری برام پیش اومد باید برم 🌹',
                            'خوشحال شدم از هم‌کلامی، فعلا خداحافظ 👋',
                            'من کار فوری برام پیش اومد باید برم، روزت بخیر ✨',
                          ]),
                    ];
                    currentList.push('فعلا مراقب خودت باش 🌸');
                    updateField('preExitFarewells', currentList);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-700/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>+ افزودن متن خداحافظی جدید به لیست</span>
                </button>
              </div>
            )}

            {/* Quick Preset Farewell Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">
                پیشنهادهای آماده برای انتخاب سریع:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_FAREWELLS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      if ((localInstructions.farewellMode || 'single') === 'single') {
                        updateField('preExitFarewellText', preset);
                      } else {
                        const currentList = [
                          ...(localInstructions.preExitFarewells && localInstructions.preExitFarewells.length > 0
                            ? localInstructions.preExitFarewells
                            : []),
                        ];
                        if (!currentList.includes(preset)) {
                          currentList.push(preset);
                          updateField('preExitFarewells', currentList);
                        }
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-[11px] transition-all"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Timing & Live Preview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>تاخیر بین پیام خداحافظی و پیام تبلیغاتی:</span>
                  <span className="text-rose-400 font-bold font-mono">
                    {(localInstructions.farewellDelaySeconds ?? 1.5).toFixed(1)} ثانیه
                  </span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={localInstructions.farewellDelaySeconds ?? 1.5}
                    onChange={(e) => updateField('farewellDelaySeconds', parseFloat(e.target.value))}
                    className="flex-1 accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  زمان طبیعی وقفه برای اینکه ابتدا پیام خداحافظی ارسال شده و سپس تصویر و کپشن محصول ارسال گردد.
                </p>
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>نمای ارسالی به هم‌صحبت قبل از خروج:</span>
                </span>
                <div className="bg-rose-950/30 border border-rose-800/40 p-2.5 rounded-lg text-xs text-rose-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span className="font-medium truncate">
                    {(localInstructions.farewellMode || 'single') === 'single'
                      ? (localInstructions.preExitFarewellText ?? 'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸')
                      : ((localInstructions.preExitFarewells && localInstructions.preExitFarewells[0]) || 'خب من کار برام پیش اومد باید برم، مراقب خودت باش 🌸')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Save Farewell Button */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-slate-400">
                ⚡ با ذخیره این بخش، پیام خداحافظی پیش از خروج و تبلیغ در اتوماسیون فعال می‌شود.
              </span>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-rose-950/40"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تنظیمات پیام خداحافظی'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN AI SYSTEM PROMPT & USER-SAVED INSTRUCTIONS MANAGER */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-5 rounded-2xl border border-fuchsia-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-400 flex items-center justify-center shadow">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">دستورالعمل لحن و نحوه صحبت هوش مصنوعی (System Prompt)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-medium">
                  دستورات اختصاصی شما ({savedPrompts.length})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تنها دستورالعمل‌هایی که خودتان می‌نویسید ذخیره می‌شوند و در فایل پشتیبان (Backup) ثبت خواهند شد.
              </p>
            </div>
          </div>

          {/* Action button to save current textarea content into user's saved list */}
          <button
            type="button"
            onClick={() => setShowSavePromptBox(!showSavePromptBox)}
            className="px-3.5 py-2 rounded-xl bg-fuchsia-950/70 hover:bg-fuchsia-900 border border-fuchsia-600/50 text-fuchsia-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-fuchsia-300" />
            <span>+ ذخیره متن جاری به عنوان دستور جدید</span>
          </button>
        </div>

        {/* Feedback Alert if any */}
        {promptFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{promptFeedback}</span>
          </div>
        )}

        {/* Inline Save Box when user wants to save a new prompt */}
        {showSavePromptBox && (
          <div className="p-4 bg-fuchsia-950/30 border border-fuchsia-500/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-fuchsia-400" />
                <span>نام‌گذاری و ذخیره دستورالعمل در لیست اختصاصی شما:</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSavePromptBox(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={newPromptTitle}
                onChange={(e) => setNewPromptTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveCurrentAsNewPrompt();
                  }
                }}
                placeholder="عنوان دلخواه برای این دستور (مثلاً: سناریوی صمیمی دخترانه، معرفی VPN، چت کوتاه...)"
                className="w-full sm:flex-1 bg-slate-900 border border-slate-700 focus:border-fuchsia-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                autoFocus
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSaveCurrentAsNewPrompt}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ثبت و ذخیره</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSavePromptBox(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                >
                  انصراف
                </button>
              </div>
            </div>
            <p className="text-[11px] text-fuchsia-300/80">
              💡 با ذخیره کردن، این دستورالعمل به لیست پایین اضافه می‌شود و در هر زمان با یک کلیک می‌توانید آن را فعال کنید.
            </p>
          </div>
        )}

        {/* Info Banner on Decoupled Product Prompts */}
        <div className="p-3 bg-violet-950/30 border border-violet-700/40 rounded-xl flex items-start gap-2 text-xs text-violet-200">
          <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold text-white block">
              💡 سیستم کمپین و هوش مصنوعی پویا (بدون نیاز به نوشتن مشخصات محصول در این بخش):
            </span>
            <p className="text-[11px] text-violet-300">
              مشخصات، نام، پلن‌های قیمت، آیدی پشتیبانی و سوالات متداول به طور کاملاً خودکار و هوشمند از <strong>کمپین فعال انتخابی در بالای صفحه</strong> در مکالمه تزریق می‌شود. نیازی به ذکر مشخصات محصول در این دستورالعمل نیست؛ در اینجا صرفاً شخصیت، سناریو و لحن صمیمی بات را تنظیم کنید و هر زمان که خواستید محصول را با ۱ کلیک در بخش بالا عوض کنید.
            </p>
          </div>
        </div>

        {/* The Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-300">
              متن دستورالعمل فعال برای هوش مصنوعی (System Prompt):
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {(localInstructions.systemPrompt || '').length} کاراکتر
            </span>
          </div>

          {/* Quick Dropdown Selector for Saved Prompts */}
          {savedPrompts.length > 0 && (
            <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-900 border border-fuchsia-900/50 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <FolderHeart className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                <span className="text-xs font-bold text-slate-200 truncate">
                  انتخاب سریع دستورالعمل:
                </span>
              </div>
              <select
                value={savedPrompts.find((p) => p.prompt.trim() === (localInstructions.systemPrompt || '').trim())?.id || ''}
                onChange={(e) => {
                  const selected = savedPrompts.find((p) => p.id === e.target.value);
                  if (selected) {
                    handleLoadSavedPrompt(selected);
                  }
                }}
                className="bg-slate-950 border border-fuchsia-500/50 hover:border-fuchsia-400 focus:border-fuchsia-500 rounded-lg px-3 py-1.5 text-xs text-fuchsia-200 font-medium focus:outline-none cursor-pointer transition-colors max-w-[240px] sm:max-w-xs"
              >
                <option value="" disabled>-- انتخاب دستورالعمل ذخیره‌شده --</option>
                {savedPrompts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} {(localInstructions.systemPrompt || '').trim() === p.prompt.trim() ? '✓ (فعال روی کادر)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <textarea
            ref={systemPromptTextareaRef}
            rows={8}
            value={localInstructions.systemPrompt || ''}
            onChange={(e) => updateField('systemPrompt', e.target.value)}
            placeholder="دستورالعمل دقیق خود را برای هوش مصنوعی بنویسید (مثلاً: تو یک دختر ۲۰ ساله به نام سارا هستی. با لحن صمیمی و کوتاه ۱ یا ۲ جمله‌ای چت کن...)"
            className="w-full bg-slate-900 border border-slate-800 focus:border-fuchsia-500 rounded-xl p-4 text-xs text-white placeholder:text-slate-600 focus:outline-none leading-relaxed font-sans shadow-inner"
          />
        </div>

        {/* Saved Prompts Switcher / Manager List */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-fuchsia-400" />
              <h5 className="font-bold text-xs text-white">
                دستورالعمل‌های ذخیره‌شده شما (سوئیچ سریع بین دستورات):
              </h5>
            </div>
            {savedPrompts.length > 0 && (
              <span className="text-[11px] text-fuchsia-300 font-medium">
                ⚡ با کلیک روی هر کارت یا دکمه «اعمال روی کادر»، دستورالعمل ۱ کلیکه روی کادر فعال می‌شود.
              </span>
            )}
          </div>

          {savedPrompts.length === 0 ? (
            <div className="p-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-center space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">
                  هنوز هیچ دستورالعمل اختصاصی ذخیره نشده است.
                </p>
                <p className="text-[11px] text-slate-500">
                  می‌توانید متن کادر بالا را ذخیره کنید یا روی دکمه زیر بزنید تا ۲ دستورالعمل نمونه آماده اضافه شوند.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSeedDefaultPrompts}
                className="px-4 py-2 rounded-xl bg-fuchsia-950/70 hover:bg-fuchsia-900 border border-fuchsia-600/50 text-fuchsia-200 text-xs font-bold inline-flex items-center gap-2 transition-all shadow"
              >
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span>+ ایجاد ۲ دستورالعمل نمونه آماده</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedPrompts.map((sp) => {
                const isActive = (localInstructions.systemPrompt || '').trim() === sp.prompt.trim();
                const isEditing = editingPromptId === sp.id;

                return (
                  <div
                    key={sp.id}
                    onClick={() => {
                      if (!isEditing) {
                        handleLoadSavedPrompt(sp);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all space-y-2 flex flex-col justify-between cursor-pointer group ${
                      isActive
                        ? 'bg-fuchsia-950/40 border-fuchsia-500 ring-2 ring-fuchsia-500/60 shadow-lg shadow-fuchsia-950/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-fuchsia-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        {isEditing ? (
                          <div
                            className="flex items-center gap-1.5 flex-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editingTitleText}
                              onChange={(e) => setEditingTitleText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(sp.id);
                                if (e.key === 'Escape') setEditingPromptId(null);
                              }}
                              className="flex-1 bg-slate-950 border border-fuchsia-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveRename(sp.id);
                              }}
                              className="p-1 rounded bg-emerald-600 text-white text-[10px]"
                              title="تایید نام"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPromptId(null);
                              }}
                              className="p-1 rounded bg-slate-800 text-slate-400 text-[10px]"
                              title="انصراف"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-bold text-xs text-white truncate group-hover:text-fuchsia-200 transition-colors">
                              {sp.title}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartRename(sp);
                              }}
                              className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
                              title="ویرایش نام"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            فعال در کادر
                          </span>
                        )}
                      </div>

                      {/* Prompt preview snippet */}
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                        {sp.prompt || '(متن خالی)'}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSavedPrompt(sp);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                            isActive
                              ? 'bg-emerald-600 text-white border border-emerald-400/50'
                              : 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white'
                          }`}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{isActive ? '✓ فعال روی کادر (در حال استفاده)' : 'اعمال روی کادر'}</span>
                        </button>

                        {!isActive && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateSavedPrompt(sp.id);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-all"
                            title="متن این دستور را با متن فعلی کادر جایگزین کن"
                          >
                            <Save className="w-3 h-3" />
                            <span>به‌روزرسانی با متن کادر</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSavedPrompt(sp.id, sp.title);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="حذف این دستورالعمل"
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

        <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-800/30 rounded-xl flex items-start gap-2 text-[11px] text-fuchsia-200 leading-relaxed">
          <Info className="w-4 h-4 text-fuchsia-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>نکته مهم:</strong> هر زمان دستورالعمل جدیدی را ذخیره یا ویرایش می‌کنید، با زدن دکمه <strong>«ذخیره تغییرات دستورالعمل»</strong> تمام اطلاعات روی سرور ذخیره شده و در فایل پشتیبان (Backup) سیستم نیز قرار می‌گیرد.
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. AI CONVERSATION MEMORY & SESSION ISOLATION (حافظه و تفکیک جلسات) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30 shadow">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">🧠 حافظه هوشمند و تفکیک کامل جلسات مکالمه</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                  جدید و بهینه‌سازی شده
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تضمین یادآوری پیوسته حرف‌های مخاطب جاری + ریست و فراموشی کامل افراد قبلی در هر اتصال جدید
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Control 1: Strict Session Isolation */}
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  تفکیک تضمینی جلسات (Session Isolation)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localInstructions.enforceSessionIsolation ?? true}
                    onChange={(e) => updateField('enforceSessionIsolation', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                با روشن بودن این گزینه، به محض قطع شدن یک مکالمه و شروع چت با فرد جدید، تمام حافظه قبلی ریست شده و هوش مصنوعی می‌داند با یک شخص کاملاً جدید در حال گفتگو است.
              </p>
            </div>

            {/* Control 2: Extract Partner Demographics */}
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  استخراج خودکار مشخصات مخاطب (سن، جنسیت، شهر)
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localInstructions.extractPartnerProfileInfo ?? true}
                    onChange={(e) => updateField('extractPartnerProfileInfo', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                اگر ربات در پیام شروع مشخصاتی مانند «پسر ۲۲ ساله تهران» یا تگ کاربر را اعلام کند، هوش مصنوعی آن را استخراج و در حافظه این مکالمه لحاظ می‌کند.
              </p>
            </div>

            {/* Control 3: Dynamic Session Phase Context */}
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  تزریق هوشمند فاز مکالمه به هوش مصنوعی
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localInstructions.dynamicSessionStatePrompt ?? true}
                    onChange={(e) => updateField('dynamicSessionStatePrompt', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                هوش مصنوعی در هر نوبت پاسخ، می‌داند که پیام شماره چندم از سقف چت است (مثلاً پیام شروع آشنایی است یا پیام قبل از خداحافظی و خروج).
              </p>
            </div>

            {/* Control 4: Memory Window Size Slider */}
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  عمق حافظه مکالمه جاری (Memory Window):
                </span>
                <span className="text-cyan-400 font-bold font-mono text-xs">
                  {localInstructions.memoryWindowSize ?? 10} پیام اخیر
                </span>
              </div>
              <div className="pt-1">
                <input
                  type="range"
                  min="4"
                  max="20"
                  step="2"
                  value={localInstructions.memoryWindowSize ?? 10}
                  onChange={(e) => updateField('memoryWindowSize', parseInt(e.target.value) || 10)}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تعداد پیام‌های رد و بدل شده اخیر با همان هم‌صحبت که هوش مصنوعی در پاسخ‌های بعدی به خاطر دارد.
              </p>
            </div>
          </div>

          {/* Memory Feature Highlight Banner */}
          <div className="p-3 bg-cyan-950/30 border border-cyan-700/40 rounded-xl flex items-start gap-2.5 text-xs text-cyan-200">
            <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold text-white">نحوه کارکرد سیستم حافظه و تفکیک مکالمات:</span>
              <p className="text-[11px] text-cyan-300">
                ۱. در طول یک چت، هوش مصنوعی کل تاریخچه گفتگوی همان فرد را به صورت پیوسته در نظر می‌گیرد تا پاسخ‌ها مرتبط و منطقی باشند.<br />
                ۲. به محض شناسایی پیام قطع اتصال یا رسیدن به سقف پیام و خروج، شناسه جلسه و تاریخچه آن بایگانی شده و جلسه بعدی با حافظه کاملاً خالی و صفر شروع می‌شود.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MULTI-BUBBLE MESSAGING (ارسال پیام‌های چندتکه‌ای طبیعی و روان) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-violet-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30 shadow">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">ارسال پیام‌های چندتکه‌ای طبیعی (Multi-Bubble Messaging)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">
                  احساس انسانی ۱۰۰٪
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                شکستن خودکار پاسخ‌های چندجمله‌ای هوش مصنوعی به پیام‌های متوالی و کوتاه با مکث طبیعی بین آن‌ها (دقیقاً مثل چت انسانی)
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.enableMultiBubble ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.enableMultiBubble ?? true}
              onChange={(e) => updateField('enableMultiBubble', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
          </label>
        </div>

        {(localInstructions.enableMultiBubble ?? true) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>حداکثر تعداد حباب در هر نوبت پاسخ:</span>
                <span className="text-violet-400 font-bold font-mono text-xs">
                  {localInstructions.multiBubbleMaxChunks ?? 3} حباب (پیام)
                </span>
              </label>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={localInstructions.multiBubbleMaxChunks ?? 3}
                onChange={(e) => updateField('multiBubbleMaxChunks', parseInt(e.target.value) || 3)}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                اگر پاسخ هوش مصنوعی طولانی باشد، حداکثر به این تعداد پیام کوتاه تفکیک و فرستاده می‌شود.
              </p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>مکث بین حباب‌های پیام متوالی:</span>
                <span className="text-violet-400 font-bold font-mono text-xs">
                  {(localInstructions.multiBubbleDelaySeconds ?? 1.8).toFixed(1)} ثانیه
                </span>
              </label>
              <input
                type="range"
                min="0.8"
                max="4.0"
                step="0.1"
                value={localInstructions.multiBubbleDelaySeconds ?? 1.8}
                onChange={(e) => updateField('multiBubbleDelaySeconds', parseFloat(e.target.value) || 1.8)}
                className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                فاصله زمانی واقع‌گرایانه همراه با انیمیشن تایپ بین ارسال هر حباب تا حباب بعدی.
              </p>
            </div>

            {/* Strict word count limit per bubble */}
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>سقف کلمات در هر حباب (محدودیت سخت‌گیرانه برای لحن کوتاه تلگرامی):</span>
                <span className="text-emerald-400 font-bold font-mono text-xs">
                  {localInstructions.maxWordsPerBubble ?? 5} کلمه در هر حباب
                </span>
              </label>
              <input
                type="range"
                min="3"
                max="8"
                step="1"
                value={localInstructions.maxWordsPerBubble ?? 5}
                onChange={(e) => updateField('maxWordsPerBubble', parseInt(e.target.value) || 5)}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>۳ کلمه (فوق‌کوتاه و مقطع)</span>
                <span className="text-emerald-300 font-medium">۵ کلمه (استاندارد تلگرام انسانی)</span>
                <span>۸ کلمه (حداکثر مجاز)</span>
              </div>
            </div>

            {/* Anti-Filter Handle Format */}
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>فرمت ضد سانسور آیدی پشتیبانی (دور زدن فیلتر ربات ناشناس قبل از ۲ دقیقه):</span>
                <span className="text-cyan-400 font-bold text-[11px]">
                  {(localInstructions.antiFilterHandleFormat || 'plain') === 'plain'
                    ? 'ساده بدون @ (nova_vpn10)'
                    : (localInstructions.antiFilterHandleFormat === 'search_hint')
                    ? 'راهنمای سرچ در تلگرام («تو سرچ بزن: nova_vpn10»)'
                    : 'با فاصله («nova _ vpn10»)'}
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {[
                  { id: 'plain', label: 'ساده بدون ات‌ساین', example: 'nova_vpn10' },
                  { id: 'search_hint', label: 'راهنمای سرچ تلگرام', example: 'تو سرچ تلگرام بزن nova_vpn10' },
                  { id: 'spaced', label: 'با فاصله ایمن', example: 'nova _ vpn10' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => updateField('antiFilterHandleFormat', fmt.id as any)}
                    className={`p-2 rounded-lg border text-right transition-all text-xs flex flex-col justify-between ${
                      (localInstructions.antiFilterHandleFormat || 'plain') === fmt.id
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{fmt.label}</span>
                    <span className="text-[10px] opacity-75 font-mono dir-ltr mt-1 text-slate-300">{fmt.example}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FAST SKIP ON EXPLICIT REJECTION (خروج فوق‌سریع در صورت عدم تمایل) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-4 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30 shadow">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">خروج فوق‌سریع در صورت عدم تمایل (Fast Skip on Rejection)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                  سرعت لیدگیری ۱۵ برابری
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                به محض اینکه مخاطب بگوید «نه»، «نمیخوام»، «لازم ندارم»، «تبلیغ نکن» یا «لفت»، ربات بدون تلف کردن وقت و بدون انتظار برای هوش مصنوعی فوراً یک پاسخ کوتاه داده و لفت می‌دهد تا به نفر بعدی وصل شود.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.fastDropOnRejection ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.fastDropOnRejection ?? true}
              onChange={(e) => updateField('fastDropOnRejection', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>

        {(localInstructions.fastDropOnRejection ?? true) && (
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>متن پاسخ کوتاه قبل از خروج آنی (حداکثر ۲ الی ۳ کلمه محاوره‌ای):</span>
                <span className="text-[10px] text-rose-400 font-mono">طبیعی و محترمانه</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={localInstructions.fastDropFarewellText || 'اوکی فعلا'}
                  onChange={(e) => updateField('fastDropFarewellText', e.target.value)}
                  placeholder="مثال: اوکی فعلا یا باشه موفق باشی"
                  className="flex-1 bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
                <div className="flex gap-1 flex-wrap">
                  {['اوکی فعلا', 'باشه موفق باشی', 'حله روزت خوش'].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => updateField('fastDropFarewellText', phrase)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] transition-colors border border-slate-700"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                ⚡ این پیام در کسری از ثانیه فرستاده شده و بلافاصله پایان چت زده می‌شود تا روی مخاطب نامناسب وقت تلف نشود.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 6. DYNAMIC REALISTIC TYPING SPEED (شبیه‌سازی سرعت تایپ پویا و واقع‌گرایانه) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-sky-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/30 shadow">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">سرعت تایپ پویا و مکث طبیعی انسانی (Dynamic Typing & Pacing)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium">
                  احساس ۱۰۰٪ انسان پای گوشی
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                شبیه‌سازی مکث زمان مطالعه پیام مخاطب، تایپ با سرعت انسانی روی کیبورد گوشی و لرزش تصادفی (Jitter)
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.dynamicTypingSpeed ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.dynamicTypingSpeed ?? true}
              onChange={(e) => updateField('dynamicTypingSpeed', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </div>

        {/* Pacing Speed Presets */}
        <div className="bg-sky-950/20 p-3 rounded-xl border border-sky-800/40 space-y-2">
          <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>پریست‌های آماده ریتم و سرعت مکالمه (انتخاب سریع با ۱ کلیک):</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                updateField('greetingDelaySeconds', 2.8);
                updateField('dynamicTypingSpeed', true);
                updateField('typingSpeedMsPerChar', 65);
                updateField('minTypingDelaySeconds', 2.5);
                updateField('maxTypingDelaySeconds', 7.5);
                updateField('replyDelaySeconds', 3.0);
                updateField('messageAggregationDelaySeconds', 3.2);
                updateField('enableMultiBubble', true);
                updateField('multiBubbleMaxChunks', 3);
                updateField('multiBubbleDelaySeconds', 1.8);
              }}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-sky-900/40 border border-sky-500/50 text-right text-xs transition-all flex flex-col gap-1 shadow-sm"
            >
              <div className="flex items-center justify-between text-sky-200 font-bold">
                <span>☕ طبیعی و انسانی</span>
                <span className="text-[9px] bg-sky-500/20 px-1.5 py-0.5 rounded text-sky-300">پیشنهادی</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                مکث ۳-۴ ثانیه‌ای، تایپ ۶۵ms، ارسال آرام حباب‌ها
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                updateField('greetingDelaySeconds', 4.0);
                updateField('dynamicTypingSpeed', true);
                updateField('typingSpeedMsPerChar', 80);
                updateField('minTypingDelaySeconds', 3.5);
                updateField('maxTypingDelaySeconds', 9.5);
                updateField('replyDelaySeconds', 4.2);
                updateField('messageAggregationDelaySeconds', 4.0);
                updateField('enableMultiBubble', true);
                updateField('multiBubbleMaxChunks', 2);
                updateField('multiBubbleDelaySeconds', 2.4);
              }}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-700 text-right text-xs transition-all flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-slate-200 font-bold">
                <span>🧘 آرام و باحوصله</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">طبیعی‌ترین</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                مکث بیشتر، مناسب رفع هرگونه شک به ربات بودن
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                updateField('greetingDelaySeconds', 1.6);
                updateField('dynamicTypingSpeed', true);
                updateField('typingSpeedMsPerChar', 45);
                updateField('minTypingDelaySeconds', 1.5);
                updateField('maxTypingDelaySeconds', 5.0);
                updateField('replyDelaySeconds', 2.0);
                updateField('messageAggregationDelaySeconds', 2.0);
                updateField('enableMultiBubble', true);
                updateField('multiBubbleMaxChunks', 2);
                updateField('multiBubbleDelaySeconds', 1.2);
              }}
              className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-700 text-right text-xs transition-all flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-slate-200 font-bold">
                <span>🏃‍♂️ سریع و فرز</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">سرعت بالا</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                پاسخ‌دهی سریع‌تر برای مکالمات کوتاه و سریع
              </p>
            </button>
          </div>
        </div>

        {(localInstructions.dynamicTypingSpeed ?? true) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>سرعت تایپ هر حرف:</span>
                <span className="text-sky-400 font-bold font-mono text-xs">
                  {localInstructions.typingSpeedMsPerChar ?? 65} ms/حرف
                </span>
              </label>
              <input
                type="range"
                min="25"
                max="120"
                step="5"
                value={localInstructions.typingSpeedMsPerChar ?? 65}
                onChange={(e) => updateField('typingSpeedMsPerChar', parseInt(e.target.value) || 65)}
                className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                سرعت تایپ طبیعی انسان روی کیبورد گوشی (۶۰ تا ۸۰ میلی‌ثانیه در ثانیه کاملاً طبیعی است).
              </p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>حداقل تاخیر تایپ:</span>
                <span className="text-sky-400 font-bold font-mono text-xs">
                  {(localInstructions.minTypingDelaySeconds ?? 2.5).toFixed(1)} ثانیه
                </span>
              </label>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.2"
                value={localInstructions.minTypingDelaySeconds ?? 2.5}
                onChange={(e) => updateField('minTypingDelaySeconds', parseFloat(e.target.value) || 2.5)}
                className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">حتی برای پاسخ‌های تک کلمه‌ای، این مقدار حداقل مکث اعمال می‌شود.</p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>سقف حداکثر تاخیر:</span>
                <span className="text-sky-400 font-bold font-mono text-xs">
                  {(localInstructions.maxTypingDelaySeconds ?? 7.5).toFixed(1)} ثانیه
                </span>
              </label>
              <input
                type="range"
                min="4.0"
                max="15.0"
                step="0.5"
                value={localInstructions.maxTypingDelaySeconds ?? 7.5}
                onChange={(e) => updateField('maxTypingDelaySeconds', parseFloat(e.target.value) || 7.5)}
                className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">جلوگیری از معطلی بیش از حد برای پیام‌های طولانی.</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 7. ANTI-SPAM & SPAM BOT FAST SKIP (فیلتر سریع ربات‌ها و ارسال‌کنندگان لینک) */}
      {/* ========================================================================= */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30 shadow">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">رد سریع ربات‌های تبلیغاتی و لینک‌های اسپم (Fast Spam/Bot Filter)</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                  صرفه‌جویی در زمان و توکن
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                اگر پیام اول مخاطب حاوی لینک کانال، جوین اجباری، بنر تبلیغاتی یا عبارات تبلیغاتی باشد، بات فوراً لفت داده و وقت را هدر نمی‌دهد
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.autoSkipSpamBots ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.autoSkipSpamBots ?? true}
              onChange={(e) => updateField('autoSkipSpamBots', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {(localInstructions.autoSkipSpamBots ?? true) && (
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>کلمات و الگوهای شناسایی ربات تبلیغاتی (جدا شده با خط تیره -):</span>
              <span className="text-[10px] text-amber-400 font-mono">
                {(localInstructions.spamBotKeywords || []).length} الگوی ثبت‌شده
              </span>
            </label>
            <input
              type="text"
              value={rawSpamBotKeywords}
              onChange={(e) => {
                const val = e.target.value;
                setRawSpamBotKeywords(val);
                const parsed = val
                  .split(/[-–—]/)
                  .map((k) => k.trim())
                  .filter(Boolean);
                updateField('spamBotKeywords', parsed);
              }}
              placeholder="مثال: t.me/ - https:// - جوین شین - کانال تلگرام - ربات زیر - پورن - شارژ رایگان"
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-sans"
            />
            <p className="text-[10px] text-slate-400">
              ⚡ در صورت دریافت پیامی با هر یک از این الگوها، بدون مصرف توکن و ارسال پاسخ هوش مصنوعی، دکمه بعدی زده می‌شود و در آمار به عنوان ربات اسپم ثبت می‌گردد.
            </p>
          </div>
        )}
      </div>

      {/* Dialogue Rules & Exit Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Max Messages Limit */}
        <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">تعداد پیام مکالمه قبل از خروج</h4>
              <p className="text-[11px] text-slate-400">سقف مجاز پیام‌های ربات با هر فرد</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-300">
              بعد از چند پیام از چت خارج شود؟
            </span>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <input
                type="number"
                value={localInstructions.maxMessagesPerChat ?? 4}
                onChange={(e) =>
                  updateField('maxMessagesPerChat', Math.max(1, Number(e.target.value) || 1))
                }
                min={1}
                max={30}
                className="w-12 bg-transparent text-white font-bold text-center text-sm focus:outline-none"
              />
              <span className="text-xs text-slate-400">پیام</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            به عنوان مثال اگر عدد ۳ را بگذارید، پس از ۳ بار پاسخ‌گویی به مخاطب، بات به صورت خودکار مراحل دکمه‌های خروج را می‌زند و با نفر بعدی صحبت می‌کند.
          </p>
        </div>

        {/* Natural Typing Delay */}
        <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">تاخیر شبیه‌سازی تایپ</h4>
              <p className="text-[11px] text-slate-400">مکث طبیعی قبل از ارسال پاسخ</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-300">
              تاخیر ارسال پاسخ هوش مصنوعی:
            </span>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <input
                type="number"
                value={localInstructions.replyDelaySeconds ?? 3.0}
                onChange={(e) =>
                  updateField('replyDelaySeconds', Math.max(0.5, Number(e.target.value) || 0.5))
                }
                min={0.5}
                max={15}
                step={0.5}
                className="w-12 bg-transparent text-white font-bold text-center text-sm focus:outline-none"
              />
              <span className="text-xs text-slate-400">ثانیه</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            در این مدت اکشن «Typing...» در تلگرام فعال می‌شود تا مخاطب حس کند یک انسان واقعی در حال تایپ است.
          </p>
        </div>
      </div>

      {/* Stranger Silence Handling */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-xs text-white">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>مدیریت سکوت یا عدم پاسخ مخاطب:</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300">حداکثر زمان انتظار:</span>
            <input
              type="number"
              value={localInstructions.silenceTimeoutSeconds ?? 35}
              onChange={(e) =>
                updateField('silenceTimeoutSeconds', Math.max(10, Number(e.target.value) || 10))
              }
              min={10}
              max={180}
              className="w-12 bg-transparent text-white font-bold text-center text-xs focus:outline-none"
            />
            <span className="text-xs text-slate-400">ثانیه</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localInstructions.enableSilenceNudge ?? true}
                onChange={(e) => updateField('enableSilenceNudge', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
            <span className="text-xs text-slate-300">
              ارسال پیام پیگیری خودکار در صورت سکوت مخاطب
            </span>
          </div>

          {localInstructions.enableSilenceNudge && (
            <input
              type="text"
              value={localInstructions.silenceNudgeText || ''}
              onChange={(e) => updateField('silenceNudgeText', e.target.value)}
              placeholder="هستی؟ 🌸"
              className="bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white w-36 text-center focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Consecutive Message Aggregation & Buffer Setting */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">تجمیع پیام‌های متوالی مخاطب (Message Aggregation)</h4>
            <p className="text-[11px] text-slate-400">پاسخ‌دهی به کل پیام‌های پشت سر هم مخاطب در قالب یک پیام واحد</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-300">
            مدت زمان انتظار برای دریافت پیام‌های بعدی مخاطب:
          </span>
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <input
              type="number"
              value={localInstructions.messageAggregationDelaySeconds ?? 3.2}
              onChange={(e) =>
                updateField('messageAggregationDelaySeconds', Math.max(0.5, Number(e.target.value) || 0.5))
              }
              min={0.5}
              max={10}
              step={0.5}
              className="w-12 bg-transparent text-white font-bold text-center text-sm focus:outline-none"
            />
            <span className="text-xs text-slate-400">ثانیه</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          اگر مخاطب متنی را در چند پیام پیاپی بفرستد (مثلاً «سلام»، «خوبی»، «اصل میدی؟»)، بات به مدت مشخص‌شده صبر کرده، تمامی پیام‌ها را تجمیع نموده و یک پاسخ جامع و مرتبط می‌دهد.
        </p>
      </div>

      {/* System & Bot Messages Filter (Ignore List) */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>فیلتر و نادیده‌گیری پیام‌های سیستمی ربات (Ignore System Alerts):</span>
        </div>
        <p className="text-[11px] text-slate-400">
          پیام‌هایی که شامل این عبارت‌ها باشند به عنوان پیام مخاطب پردازش نشده و هوش مصنوعی پاسخی به آن‌ها نمی‌دهد (عبارات و جملات را با خط تیره <span className="text-emerald-400 font-bold text-xs">-</span> از هم جدا کنید):
        </p>
        <textarea
          rows={3}
          value={rawIgnoredPhrases}
          onChange={(e) => {
            const val = e.target.value;
            setRawIgnoredPhrases(val);
            const parsed = val
              .split(/[-–—\n]/)
              .map((k) => k.trim())
              .filter(Boolean);
            updateField('customIgnoredSystemPhrases', parsed);
          }}
          placeholder="مثال: به هیچ کاربری در ربات اعتماد نکنید - 1 سکه رایگان - پروفایل هایپر گپ را مشاهده کرد - اخطار"
          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed font-sans"
        />
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 flex-wrap">
          <span className="text-slate-400">فیلترهای پیش‌فرض فعال:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">اخطار عدم اعتماد</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">سکه رایگان سیستم</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">مشاهده پروفایل هایپرگپ</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">جمله خوش‌آمدگویی/اتصال</span>
        </div>
      </div>

      {/* Auto-Exit on Partner Goodbye / Exit Intent */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-rose-500/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">تشخیص هوشمند خداحافظی مخاطب و خروج خودکار</h4>
              <p className="text-[11px] text-slate-400">شناسایی قصد خروج یا خداحافظی هم‌صحبت و ارسال تبلیغ قبل از ترک چت</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              {(localInstructions.autoExitOnPartnerBye ?? true) ? 'فعال' : 'غیرفعال'}
            </span>
            <input
              type="checkbox"
              checked={localInstructions.autoExitOnPartnerBye ?? true}
              onChange={(e) => updateField('autoExitOnPartnerBye', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          اگر مخاطب کلماتی نظیر «خداحافظ»، «بای»، «باید برم»، «فعلا» یا «لفت بده» ارسال کند، ربات معطل نمانده، پیام خداحافظی و تبلیغ محصول را ارسال نموده و بلافاصله توالی دکمه‌های خروج را اجرا می‌کند.
        </p>
      </div>

      {/* Inappropriate words protection */}
      <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>خروج فوری در صورت دریافت کلمات نامناسب یا فحاشی:</span>
        </div>
        <p className="text-[11px] text-slate-400">
          اگر مخاطب هر یک از این کلمات را بفرستد، بات فوراً چت را ترک کرده و به نفر بعدی متصل می‌شود (کلمات را با خط تیره <span className="text-rose-400 font-bold text-xs">-</span> از هم جدا کنید):
        </p>
        <input
          type="text"
          value={rawInappropriateKeywords}
          onChange={(e) => {
            const val = e.target.value;
            setRawInappropriateKeywords(val);
            const parsed = val
              .split(/[-–—]/)
              .map((k) => k.trim())
              .filter(Boolean);
            updateField('inappropriateKeywords', parsed);
          }}
          placeholder="کلمات را با خط تیره (-) جدا کنید (مثلاً: بلاک - اسپم - فحش - تبلیغات)"
          className="w-full bg-slate-900 border border-slate-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none font-sans"
        />
      </div>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE LIVE BUBBLE & BEHAVIOR TESTER (آزمایشگاه زنده حباب‌ها و رفتار) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/90 p-4 sm:p-6 rounded-2xl border border-violet-500/40 shadow-2xl space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">آزمایشگاه تست زنده حباب‌ها و رفتار ربات</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  شبیه‌ساز واقعی بدون نیاز به تلگرام
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                پیام‌های مختلف مخاطب را امتحان کنید تا خروج فوق‌سریع، شکستن حباب‌ها به کلمات کم و استراتژی فروش را به صورت زنده ببینید.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>زمان سپری‌شده از اتصال:</span>
            <select
              value={liveTestElapsedSec}
              onChange={(e) => setLiveTestElapsedSec(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-violet-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-violet-500"
            >
              <option value={45}>۴۵ ثانیه (زیر ۲ دقیقه - فیلتر شدید آیدی تلگرام)</option>
              <option value={150}>۱۵۰ ثانیه (بالای ۲ دقیقه - مجاز برای ارسال کامل)</option>
            </select>
          </div>
        </div>

        {/* Preset Scenario Buttons */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-slate-400 font-medium">سناریوهای آماده برای تست سریع:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🛑 نه داداش نمیخوام (رد فوری)', text: 'نه داداش فیلترشکن نمیخوام تبلیغ نکن' },
              { label: '💰 قیمت چنده تست میدین؟', text: 'قیمت چنده تست رایگان هم دارین؟' },
              { label: '🍏 برای همراه اول و آیفون خوبه؟', text: 'رو همراه اول و آیفون قطعی نداره؟' },
              { label: '💬 سلام اصل میدی؟', text: 'سلام اصل میدی اهل کجایی؟' },
              { label: '🆔 آیدی تلگرامتو بده بحرفیم', text: 'آیدی تلگرامتو بده اونجا چت کنیم' },
            ].map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setLiveTestInput(sc.text);
                  runLiveTest(sc.text);
                }}
                className="px-3 py-1.5 bg-slate-900/80 hover:bg-violet-950/40 hover:border-violet-500/50 border border-slate-800 text-slate-300 rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                <span>{sc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Box & Execute Button */}
        <div className="flex gap-2">
          <input
            type="text"
            value={liveTestInput}
            onChange={(e) => setLiveTestInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runLiveTest();
            }}
            placeholder="پیام فرضی هم‌صحبت را اینجا بنویسید (مثلاً: نه نیاز ندارم یا چقدره قیمتش)..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
          />
          <button
            type="button"
            disabled={liveTestLoading}
            onClick={() => runLiveTest()}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            {liveTestLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>در حال تحلیل...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ تست و شبیه‌سازی حباب‌ها</span>
              </>
            )}
          </button>
        </div>

        {/* Live Test Results Display */}
        {liveTestResult && (
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 space-y-4 animate-in fade-in duration-300">
            {/* Status and Action Banner */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2 flex-wrap">
                {liveTestResult.isFastSkip ? (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-rose-400" />
                    <span>⚡ خروج فوق‌سریع فعال شد (Fast Skip Rejection) - معطلی ۰ ثانیه!</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>مکالمه طبیعی هوشمند</span>
                  </span>
                )}

                {liveTestResult.intent && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-700 text-slate-300 font-mono">
                    قصد: {liveTestResult.intent}
                  </span>
                )}

                {liveTestResult.state && (
                  <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-700 text-violet-300 font-mono">
                    وضعیت: {liveTestResult.state}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>مدت تایپ و مکث: <strong className="text-sky-300 font-mono">{liveTestResult.typingTimeSec}s</strong></span>
                <span>تعداد حباب: <strong className="text-violet-300 font-mono">{liveTestResult.bubbles.length}</strong></span>
              </div>
            </div>

            {/* Simulated Telegram Chat View */}
            <div className="space-y-3 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/60 max-w-xl">
              {/* Stranger Message Bubble */}
              <div className="flex flex-col items-start space-y-1">
                <span className="text-[10px] text-slate-400 font-medium">هم‌صحبت ناشناس:</span>
                <div className="bg-slate-800 text-slate-200 px-3.5 py-2 rounded-2xl rounded-tl-sm text-xs max-w-[85%] leading-relaxed border border-slate-700/50 shadow-sm">
                  {liveTestInput}
                </div>
              </div>

              {/* Bot Response Bubbles (Split by words limit) */}
              <div className="flex flex-col items-end space-y-2 pt-2">
                <span className="text-[10px] text-violet-400 font-medium flex items-center gap-1">
                  <span>ربات (ملودی ۲۶):</span>
                  <span className="text-slate-400 font-normal">
                    (سقف {localInstructions.maxWordsPerBubble || 5} کلمه در هر حباب)
                  </span>
                </span>

                {liveTestResult.bubbles.map((bubble, idx) => {
                  const words = bubble.trim().split(/\s+/).filter(Boolean).length;
                  return (
                    <div key={idx} className="flex flex-col items-end space-y-0.5 max-w-[85%]">
                      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3.5 py-2 rounded-2xl rounded-tr-sm text-xs leading-relaxed shadow-md">
                        {bubble}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono px-1">
                        حباب {idx + 1} • {words} کلمه
                      </span>
                    </div>
                  );
                })}

                {liveTestResult.isFastSkip && (
                  <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-2 mt-1">
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>اجرای فوری دکمه خروج و اتصال بلافاصله به هم‌صحبت بعدی...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
