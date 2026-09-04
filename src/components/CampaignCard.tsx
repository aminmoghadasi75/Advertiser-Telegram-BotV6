import React, { useState, useEffect, useRef } from 'react';
import { Package, Upload, Image as ImageIcon, Sparkles, Hash, DollarSign, MessageSquare, Tag, Eye, Plus, Check, Edit2, Trash2, Send, ListOrdered, AlertCircle } from 'lucide-react';
import { ProductCampaign } from '../types';
import { TelegramPostPreview } from './TelegramPostPreview';

interface CampaignCardProps {
  campaigns: ProductCampaign[];
  onSaveCampaign: (campaign: Partial<ProductCampaign>) => Promise<void>;
  onDeleteCampaign: (id: string) => Promise<void>;
  onToggleCampaign: (id: string, isActive: boolean) => Promise<void>;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaigns,
  onSaveCampaign,
  onDeleteCampaign,
  onToggleCampaign,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'list' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const loadedCampaignIdRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  const activeCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0] || null;

  const [currentId, setCurrentId] = useState(activeCampaign?.id || '');
  const [title, setTitle] = useState(activeCampaign?.title || '');
  const [price, setPrice] = useState(activeCampaign?.price || '');
  const [description, setDescription] = useState(activeCampaign?.description || '');
  const [imageUrl, setImageUrl] = useState(activeCampaign?.imageUrl || '');
  const [contactHandle, setContactHandle] = useState(activeCampaign?.contactHandle || '');
  const [hashtagInput, setHashtagInput] = useState(
    activeCampaign && Array.isArray(activeCampaign.hashtags) ? activeCampaign.hashtags.join(' ') : ''
  );

  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync form ONLY when active selected campaign ID changes or on initial load
  // Do NOT re-sync on every background polling update to avoid erasing user typing or quick-inserted tags!
  useEffect(() => {
    const isFirstRun = !hasInitializedRef.current;
    const isSelectionChanged = loadedCampaignIdRef.current !== selectedCampaignId;

    if (isFirstRun || isSelectionChanged) {
      if (activeCampaign && (isFirstRun || selectedCampaignId !== null)) {
        setCurrentId(activeCampaign.id || '');
        setTitle(activeCampaign.title || '');
        setPrice(activeCampaign.price || '');
        setDescription(activeCampaign.description || '');
        setImageUrl(activeCampaign.imageUrl || '');
        setContactHandle(activeCampaign.contactHandle || '');
        setHashtagInput(Array.isArray(activeCampaign.hashtags) ? activeCampaign.hashtags.join(' ') : '');
        loadedCampaignIdRef.current = activeCampaign.id;
        hasInitializedRef.current = true;
      } else if (selectedCampaignId === null && !isFirstRun) {
        setCurrentId('');
        setTitle('');
        setPrice('');
        setDescription('');
        setImageUrl('');
        setContactHandle('');
        setHashtagInput('');
        loadedCampaignIdRef.current = null;
      }
    }
  }, [selectedCampaignId, campaigns.length]);

  const handleStartNew = () => {
    setSelectedCampaignId(null);
    loadedCampaignIdRef.current = null;
    setCurrentId('');
    setTitle('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setContactHandle('');
    setHashtagInput('');
    setActiveTab('edit');
    setErrorMessage(null);
  };

  const handleSelectCampaignForEdit = (camp: ProductCampaign) => {
    setSelectedCampaignId(camp.id);
    loadedCampaignIdRef.current = camp.id;
    setCurrentId(camp.id);
    setTitle(camp.title);
    setPrice(camp.price);
    setDescription(camp.description);
    setImageUrl(camp.imageUrl);
    setContactHandle(camp.contactHandle);
    setHashtagInput(Array.isArray(camp.hashtags) ? camp.hashtags.join(' ') : '');
    setActiveTab('edit');
    setErrorMessage(null);
  };

  // Cursor-Aware / Insertion Helper for Quick Spintax & Variables
  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDescription((prev) => (prev ? prev + ' ' + tag : tag));
      return;
    }

    const start = textarea.selectionStart ?? description.length;
    const end = textarea.selectionEnd ?? description.length;
    const before = description.substring(0, start);
    const after = description.substring(end);

    const needsLeadingSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith('\n');
    const needsTrailingSpace = after.length > 0 && !after.startsWith(' ') && !after.startsWith('\n');

    const insertText = `${needsLeadingSpace ? ' ' : ''}${tag}${needsTrailingSpace ? ' ' : ''}`;
    const newText = before + insertText + after;
    setDescription(newText);

    setTimeout(() => {
      textarea.focus();
      const newPos = start + insertText.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 10);
  };

  // Client-Side Image Compression using HTML Canvas to prevent huge payloads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
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

          // Upload to server
          fetch('/api/upload-banner', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: compressed,
              target: 'campaign',
              campaignId: currentId || activeCampaign?.id,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.url) {
                setImageUrl(data.url);
              } else {
                setImageUrl(compressed);
              }
            })
            .catch(() => {
              setImageUrl(compressed);
            });
        }
      };
      img.onerror = () => {
        setErrorMessage('خطا در خواندن فایل تصویر. لطفاً تصویر دیگری انتخاب کنید.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('عنوان و توضیحات محصول الزامی است.');
      return;
    }

    setLoading(true);
    setSavedSuccess(false);
    setErrorMessage(null);

    try {
      const parsedTags = hashtagInput
        .split(' ')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await onSaveCampaign({
        id: currentId || undefined,
        title: title.trim(),
        price: price.trim() || 'توافقی',
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        contactHandle: contactHandle.trim() || '@Admin',
        hashtags: parsedTags,
        isActive: true,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving campaign:', err);
      setErrorMessage(err.message || 'خطا در ذخیره‌سازی کمپین. لطفاً مجدداً تلاش نمایید.');
    } finally {
      setLoading(false);
    }
  };

  const currentPreviewCampaign: ProductCampaign = {
    id: currentId || 'preview',
    title: title || 'عنوان محصول شما',
    price: price || 'توافقی',
    description: description || 'توضیحات کامل محصول...',
    imageUrl: imageUrl,
    contactHandle: contactHandle || '@StoreAdmin',
    hashtags: hashtagInput.split(' ').filter(Boolean),
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-100 shadow-xl space-y-4">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">مدیریت محصول و کمپین‌های تبلیغاتی</h2>
            <p className="text-xs text-slate-400">تنظیم تصویر، متن، قیمت و انتخاب سریع کمپین‌ها جهت انتشار</p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'edit'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>ویرایش / ثبت</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>کمپین‌های قبلی ({campaigns.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>پیش‌نمایش</span>
          </button>
        </div>
      </div>

      {/* Error Alert Message */}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Edit & Create Form */}
      {activeTab === 'edit' && (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Quick Header Bar for Form */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              {currentId ? 'در حال ویرایش کمپین ذخیره‌شده' : 'در حال ایجاد کمپین تبلیغاتی جدید'}
            </span>

            <button
              type="button"
              onClick={handleStartNew}
              className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[11px] font-bold border border-sky-500/30 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ایجاد کمپین جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Right Column: Title, Price, Description, Contact */}
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sky-400" />
                  عنوان محصول یا خدمت:
                </label>
                <input
                  type="text"
                  placeholder="عنوان محصول خود را وارد کنید..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  قیمت محصول (تومان / توافقی):
                </label>
                <input
                  type="text"
                  placeholder="مثال: ۱,۲۵۰,۰۰۰ تومان"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    توضیحات کامل محصول (پشتیبانی از Spintax و متغیرها):
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Spintax {`{A|B}`}
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={5}
                  placeholder="توضیحات کامل، ویژگی‌ها، نحوه خرید و تحویل... (مثال: {سلام|درود} دوستان {اموجی} سفارش {نام_گروه})"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
                />
                
                {/* Spintax Quick Variable Inserters */}
                <div className="mt-1.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold flex items-center gap-1 text-slate-300">
                      ⚡ درج سریع متغیرهای ضد اسپم در متن:
                    </span>
                    <span className="text-slate-500">کلیک برای افزودن به محل مکان‌نما</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { tag: '{greeting}', label: '👋 احوالپرسی تصادفی' },
                      { tag: '{group_title}', label: '👥 نام گروه' },
                      { tag: '{random_emoji}', label: '✨ اموجی رندوم' },
                      { tag: '{time}', label: '⏰ ساعت ارسال' },
                      { tag: '{cta_text}', label: '📢 اقدام به خرید' },
                      { tag: '{random_id}', label: '🔢 کد پیگیری' },
                      { tag: '{تخفیف ویژه|فرصت محدود|قیمت استثنایی}', label: '🔀 اسپینتکس نمونه' },
                    ].map((item) => (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => handleInsertTag(item.tag)}
                        className="px-2 py-1 text-[10px] rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white border border-slate-700/60 transition-all font-mono"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    آیدی پشتیبانی / ثبت سفارش:
                  </label>
                  <input
                    type="text"
                    placeholder="@StoreAdmin"
                    value={contactHandle}
                    onChange={(e) => setContactHandle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500 dir-ltr text-left"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5 text-sky-400" />
                    هشتگ‌ها (با فاصله):
                  </label>
                  <input
                    type="text"
                    placeholder="فروش_ویژه تخفیف"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

            </div>

            {/* Left Column: Image Upload & Preview */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                تصویر اختصاصی محصول (آپلود عکس یا لینک):
              </label>

              {/* Upload Box */}
              <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center group">
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="کاور محصول" className="w-full h-full object-contain bg-slate-950 p-1" />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-sky-400 flex items-center gap-1 shadow-lg">
                        <Upload className="w-3.5 h-3.5" />
                        تغییر عکس
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-1.5 rounded-lg bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 flex items-center gap-1 shadow-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        حذف عکس
                      </button>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 cursor-pointer text-slate-400 hover:text-white w-full h-full text-center">
                    <Upload className="w-9 h-9 text-sky-400 mb-2 animate-bounce" />
                    <span className="text-xs font-bold text-slate-200">جهت آپلود عکس محصول اینجا کلیک کنید</span>
                    <span className="text-[10px] text-slate-500 mt-1">فرمت‌های PNG, JPG, WEBP (فشرده‌سازی خودکار کیفیت)</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Direct Image URL input */}
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">یا لینک تصویر (URL):</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 dir-ltr text-left"
                />
              </div>

            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
              savedSuccess
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/20'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>کمپین با موفقیت ذخیره و جهت ارسال آماده شد</span>
              </>
            ) : (
              <>
                <span>{loading ? 'در حال ذخیره‌سازی کمپین...' : 'ذخیره کمپین و فعال‌سازی جهت انتشار'}</span>
              </>
            )}
          </button>

        </form>
      )}

      {/* Tab 2: Quick Selection List of Saved Campaigns */}
      {activeTab === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-sky-400" />
              لیست کمپین‌های ذخیره‌شده ({campaigns.length})
            </h3>
            <button
              onClick={handleStartNew}
              className="px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ساخت کمپین جدید</span>
            </button>
          </div>

          {campaigns.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
              هیچ کمپینی تا کنون ثبت نشده است. روی دکمه «ساخت کمپین جدید» کلیک کنید.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {campaigns.map((camp) => {
                const isSelected = camp.id === currentId || (camp.isActive && !selectedCampaignId);

                return (
                  <div
                    key={camp.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex gap-3">
                      {camp.imageUrl ? (
                        <img
                          src={camp.imageUrl}
                          alt={camp.title}
                          className="w-16 h-16 rounded-lg object-cover bg-slate-900 border border-slate-800 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs text-white truncate">{camp.title}</h4>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-md bg-sky-500 text-slate-950 text-[10px] font-bold flex-shrink-0">
                              کمپین فعال
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-emerald-400 font-medium">{camp.price}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{camp.description}</p>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                      <button
                        type="button"
                        onClick={() => handleSelectCampaignForEdit(camp)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3 h-3 text-sky-400" />
                        <span>ویرایش</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          handleSelectCampaignForEdit(camp);
                          await onToggleCampaign(camp.id, true);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>انتخاب و فعال‌سازی فوری</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteCampaign(camp.id)}
                        className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                        title="حذف کمپین"
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
      )}

      {/* Tab 3: Telegram Live Preview */}
      {activeTab === 'preview' && (
        <div className="py-2">
          <TelegramPostPreview campaign={currentPreviewCampaign} />
        </div>
      )}

    </div>
  );
};
