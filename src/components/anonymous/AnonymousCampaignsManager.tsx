import React, { useState, useRef } from 'react';
import {
  ProductConfig,
  ProductPlan,
  ProductFaqItem,
  DEFAULT_PRODUCT_CONFIG,
} from '../../config/productConfig';
import {
  ShoppingBag,
  Plus,
  Check,
  CheckCircle2,
  Trash2,
  Copy,
  Edit3,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Tag,
  FileText,
  HelpCircle,
  Layers,
  DollarSign,
  BookOpen,
} from 'lucide-react';

interface AnonymousCampaignsManagerProps {
  products: ProductConfig[];
  activeProductId: string;
  onSelectActiveProduct: (productId: string) => void;
  onUpdateProducts: (products: ProductConfig[]) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  savedSuccess?: boolean;
}

export const AnonymousCampaignsManager: React.FC<AnonymousCampaignsManagerProps> = ({
  products = [],
  activeProductId,
  onSelectActiveProduct,
  onUpdateProducts,
  onSave,
  isSaving = false,
  savedSuccess = false,
}) => {
  const effectiveProducts: ProductConfig[] = Array.isArray(products) ? products : [];

  const currentActiveId =
    activeProductId ||
    effectiveProducts.find((p) => p.isActive)?.productId ||
    effectiveProducts[0]?.productId ||
    '';

  const [selectedEditId, setSelectedEditId] = useState<string>(currentActiveId);
  const [activeTab, setActiveTab] = useState<'basic' | 'plans' | 'faq' | 'knowledge'>('basic');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Get currently selected product for editing
  const editingProduct =
    effectiveProducts.find((p) => p.productId === selectedEditId) ||
    effectiveProducts.find((p) => p.productId === currentActiveId) ||
    effectiveProducts[0] ||
    null;

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // 1-Click Activate Campaign
  const handleActivateCampaign = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = effectiveProducts.map((p) => ({
      ...p,
      isActive: p.productId === productId,
    }));
    onSelectActiveProduct(productId);
    setSelectedEditId(productId);
    const prod = effectiveProducts.find((p) => p.productId === productId);
    showFeedback(`کمپین فعال به «${prod?.productName || 'محصول انتخابی'}» تغییر یافت ⚡`);
  };

  // Update specific fields of the current editing product
  const handleUpdateCurrentProduct = <K extends keyof ProductConfig>(
    field: K,
    value: ProductConfig[K]
  ) => {
    if (!editingProduct) return;
    const updated = effectiveProducts.map((p) => {
      if (p.productId === editingProduct.productId) {
        return {
          ...p,
          [field]: value,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Update nested support info
  const handleUpdateSupport = (handle: string) => {
    if (!editingProduct) return;
    const clean = handle.replace(/^@/, '').trim();
    handleUpdateCurrentProduct('support', {
      handle: clean,
      link: clean ? `https://t.me/${clean}` : '',
      operatingHours: editingProduct.support?.operatingHours || '۲۴ ساعته',
    });
  };

  // Add new empty campaign
  const handleAddNewCampaign = () => {
    const newId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const isFirst = effectiveProducts.length === 0;
    const newProduct: ProductConfig = {
      productId: newId,
      productName: `کمپین ${effectiveProducts.length + 1}`,
      tagline: '',
      category: 'other',
      productDescription: '',
      features: [],
      plans: [],
      freeTrial: {
        available: false,
        durationHours: 24,
        description: '',
      },
      refundPolicy: {
        available: false,
        guaranteeHours: 48,
        description: '',
      },
      support: {
        handle: '',
        link: '',
        operatingHours: '۲۴ ساعته',
      },
      bannerImageUrl: '',
      knowledgeBaseText: '',
      faqItems: [],
      isActive: isFirst,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...effectiveProducts, newProduct];
    onUpdateProducts(updated);
    setSelectedEditId(newId);
    showFeedback('کمپین جدید ایجاد شد. اکنون مشخصات محصول خود را وارد نمایید.');
  };

  // Duplicate an existing campaign
  const handleDuplicateCampaign = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const source = effectiveProducts.find((p) => p.productId === productId);
    if (!source) return;

    const newId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const copy: ProductConfig = {
      ...JSON.parse(JSON.stringify(source)),
      productId: newId,
      productName: `${source.productName} (کپی)`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...effectiveProducts, copy];
    onUpdateProducts(updated);
    setSelectedEditId(newId);
    showFeedback(`از کمپین «${source.productName}» یک نسخه کپی ایجاد گردید.`);
  };

  // Delete a campaign
  const handleDeleteCampaign = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prodToDelete = effectiveProducts.find((p) => p.productId === productId);
    const isConfirmed = window.confirm(
      `آیا از حذف کمپین «${prodToDelete?.productName || 'این محصول'}» اطمینان دارید؟`
    );
    if (!isConfirmed) return;

    const remaining = effectiveProducts.filter((p) => p.productId !== productId);

    if (productId === currentActiveId || prodToDelete?.isActive) {
      if (remaining.length > 0) {
        remaining[0].isActive = true;
        onSelectActiveProduct(remaining[0].productId);
        setSelectedEditId(remaining[0].productId);
      } else {
        onSelectActiveProduct('');
        setSelectedEditId('');
      }
    } else if (productId === selectedEditId) {
      setSelectedEditId(remaining[0]?.productId || '');
    }

    onUpdateProducts(remaining);
    showFeedback('کمپین با موفقیت حذف گردید.');
  };

  // Handle local image file upload with compression and server-side persistence
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('حجم عکس نباید بیشتر از ۱۵ مگابایت باشد.');
      return;
    }

    showFeedback('در حال فشرده‌سازی و بارگذاری تصویر روی سرور...');

    const reader = new FileReader();
    reader.onload = () => {
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

            // Upload directly to server endpoint
            const res = await fetch('/api/upload-banner', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: compressed,
                target: 'anonymous',
                productId: editingProduct?.productId,
              }),
            });

            const data = await res.json();
            if (data.success && data.url) {
              handleUpdateCurrentProduct('bannerImageUrl', data.url);
              showFeedback('عکس بنر با موفقیت روی سرور Google AI Studio و در فایل پشتیبان JSON ذخیره شد ✓');
            } else {
              // Fallback to compressed base64 if server upload fails
              handleUpdateCurrentProduct('bannerImageUrl', compressed);
              showFeedback('عکس بنر در تنظیمات قرار گرفت و در حال ذخیره‌سازی است...');
            }

            if (onSave) {
              await onSave();
            }
          }
        } catch (err) {
          console.error('Error uploading banner to server:', err);
          handleUpdateCurrentProduct('bannerImageUrl', reader.result as string);
          showFeedback('عکس بنر بارگذاری شد.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Plan management
  const handleAddPlan = () => {
    if (!editingProduct) return;
    const newPlan: ProductPlan = {
      id: `plan_${Date.now()}`,
      name: 'پلن جدید',
      price: '۱۰۰ هزار تومان',
      duration: 'یک ماهه',
      traffic: 'نامحدود',
      deviceLimit: '۱ کاربر',
    };
    handleUpdateCurrentProduct('plans', [...(editingProduct.plans || []), newPlan]);
  };

  const handleUpdatePlan = (index: number, updatedField: Partial<ProductPlan>) => {
    if (!editingProduct) return;
    const currentPlans = [...(editingProduct.plans || [])];
    currentPlans[index] = { ...currentPlans[index], ...updatedField };
    handleUpdateCurrentProduct('plans', currentPlans);
  };

  const handleDeletePlan = (index: number) => {
    if (!editingProduct) return;
    const currentPlans = [...(editingProduct.plans || [])];
    currentPlans.splice(index, 1);
    handleUpdateCurrentProduct('plans', currentPlans);
  };

  // FAQ management
  const handleAddFaq = () => {
    if (!editingProduct) return;
    const newFaq: ProductFaqItem = {
      id: `faq_${Date.now()}`,
      question: '',
      answer: '',
      keywords: [],
    };
    handleUpdateCurrentProduct('faqItems', [...(editingProduct.faqItems || []), newFaq]);
  };

  const handleUpdateFaq = (index: number, updatedField: Partial<ProductFaqItem>) => {
    if (!editingProduct) return;
    const currentFaq = [...(editingProduct.faqItems || [])];
    currentFaq[index] = { ...currentFaq[index], ...updatedField };
    handleUpdateCurrentProduct('faqItems', currentFaq);
  };

  const handleDeleteFaq = (index: number) => {
    if (!editingProduct) return;
    const currentFaq = [...(editingProduct.faqItems || [])];
    currentFaq.splice(index, 1);
    handleUpdateCurrentProduct('faqItems', currentFaq);
  };

  return (
    <div className="bg-gradient-to-br from-violet-950/40 via-slate-950/90 to-fuchsia-950/30 p-5 rounded-2xl border border-violet-800/40 shadow-2xl space-y-6">
      {/* Header with Title & Quick Switch Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-violet-500/20 to-purple-600/20 border border-fuchsia-500/30 text-fuchsia-300 flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-white">مدیریت کمپین‌ها و محصولات تبلیغاتی چت ناشناس</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 font-mono font-bold">
                سوئیچ ۱ کلیکه ⚡
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              محصولات مختلف را تعریف کنید و در هر زمان با یک کلیک، محصول فعال برای تبلیغ توسط هوش مصنوعی را جابه‌جا نمایید.
            </p>
          </div>
        </div>

        {/* Global Add Campaign Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAddNewCampaign}
            className="px-3.5 py-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ کمپین جدید</span>
          </button>
        </div>
      </div>

      {/* Floating Feedback Alert */}
      {feedbackMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CAMPAIGN CAROUSEL / SELECTOR (ONE-CLICK SWITCHER) */}
      {/* ========================================================================= */}
      {effectiveProducts.length === 0 ? (
        <div className="bg-slate-950/70 p-6 rounded-2xl border border-dashed border-violet-800/50 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-white">هنوز هیچ کمپینی تعریف نکرده‌اید</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              فقط مواردی که خودتان اضافه و ذخیره می‌کنید در سیستم ثبت می‌شوند. برای ثبت اولین محصول، خدمات یا تبلیغ خود دکمهٔ زیر را بزنید:
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNewCampaign}
            className="px-5 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ ایجاد اولین کمپین</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-violet-400" />
              لیست کمپین‌ها ({effectiveProducts.length} مورد) — کمپین دارای تیک سبز توسط هوش مصنوعی تبلیغ می‌شود:
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              کلیک روی کارت = ویرایش | دکمه تیک = فعال‌سازی
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {effectiveProducts.map((prod) => {
              const isCurrentActive = prod.productId === currentActiveId || prod.isActive;
              const isCurrentlyEditing = prod.productId === (editingProduct?.productId || selectedEditId);

              return (
                <div
                  key={prod.productId}
                  onClick={() => setSelectedEditId(prod.productId)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isCurrentlyEditing
                      ? 'ring-2 ring-violet-500 border-violet-400 bg-slate-900/90 shadow-xl'
                      : isCurrentActive
                      ? 'border-emerald-500/60 bg-emerald-950/20 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  {/* Active Indicator & Quick Switch Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isCurrentActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {prod.bannerImageUrl ? (
                          <img
                            src={prod.bannerImageUrl}
                            alt={prod.productName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{prod.productName}</h4>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {prod.support?.handle ? `@${prod.support.handle}` : 'بدون آیدی'}
                        </p>
                      </div>
                    </div>

                    {/* 1-Click Activate Button */}
                    <button
                      type="button"
                      onClick={(e) => handleActivateCampaign(prod.productId, e)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all flex-shrink-0 ${
                        isCurrentActive
                          ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300'
                      }`}
                      title={isCurrentActive ? 'این کمپین هم‌اکنون فعال است' : 'فعال‌سازی این کمپین با یک کلیک'}
                    >
                      {isCurrentActive ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>فعال ⚡</span>
                        </>
                      ) : (
                        <span>فعال‌سازی</span>
                      )}
                    </button>
                  </div>

                  {/* Brief description & stats */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.productDescription || prod.tagline || 'بدون توضیحات اولیه...'}
                  </p>

                  {/* Actions row: Edit, Duplicate, Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[10px] text-violet-400 font-medium">
                      {isCurrentlyEditing ? 'در حال ویرایش ✎' : 'جهت ویرایش کلیک کنید'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleDuplicateCampaign(prod.productId, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="ایجاد کپی از این کمپین"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCampaign(prod.productId, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                        title="حذف این کمپین"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CAMPAIGN EDITOR PANEL (FOR SELECTED PRODUCT) */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-violet-700/40 space-y-5 shadow-inner">
          {/* Header of editing campaign */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-fuchsia-400" />
              <div>
                <h4 className="font-bold text-sm text-white">
                  ویرایش اطلاعات کمپین: <span className="text-fuchsia-300">{editingProduct.productName}</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">شناسه: {editingProduct.productId}</span>
              </div>
            </div>

            {/* Editing Sub-Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'basic'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>مشخصات اصلی و عکس</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('plans')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'plans'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>پلن‌ها و قیمت‌ها ({editingProduct.plans?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('faq')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'faq'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>سوالات متداول FAQ ({editingProduct.faqItems?.length || 0})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('knowledge')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'knowledge'
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>پایگاه دانش تکمیلی</span>
              </button>
            </div>
          </div>

          {/* TAB 1: BASIC INFO & IMAGE */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Product Photo Box */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {/* Image Preview */}
                <div className="lg:col-span-1 flex flex-col items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-800 relative group min-h-[160px]">
                  {editingProduct.bannerImageUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <img
                        src={editingProduct.bannerImageUrl}
                        alt="عکس بنر محصول"
                        referrerPolicy="no-referrer"
                        className="max-h-36 max-w-full rounded-lg object-contain border border-slate-800 shadow"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateCurrentProduct('bannerImageUrl', '');
                          showFeedback('عکس بنر با موفقیت حذف و تنظیمات ذخیره شد ✓');
                        }}
                        className="absolute top-1 left-1 p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/50 shadow transition-all"
                        title="حذف عکس"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center">
                        <span className="text-[10px] text-emerald-400 font-medium">✓ عکس تنظیم شد</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {editingProduct.bannerImageUrl.startsWith('/uploads/') ? '💾 ذخیره در سرور دیسک' : '🌐 لینک اینترنتی'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-center p-4 space-y-2 text-slate-500 cursor-pointer hover:text-violet-400 transition-colors"
                    >
                      <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                      <p className="text-xs font-semibold text-slate-300">عکسی انتخاب نشده است</p>
                      <p className="text-[10px] text-slate-500">برای انتخاب و آپلود مستقیم کلیک کنید</p>
                    </div>
                  )}
                </div>

                {/* Image URL & File Upload */}
                <div className="lg:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                      آدرس اینترنتی تصویر بنر (Image URL):
                    </label>
                    <input
                      type="url"
                      value={editingProduct.bannerImageUrl || ''}
                      onChange={(e) => handleUpdateCurrentProduct('bannerImageUrl', e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900 border border-violet-700/50 text-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>آپلود تصویر از حافظه دستگاه</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      (فرمت‌های JPG, PNG و WebP تا سقف ۵ مگابایت)
                    </span>
                  </div>
                </div>
              </div>

              {/* Title, Category & Support Handle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-fuchsia-400" />
                    نام / عنوان محصول یا سرویس:
                  </label>
                  <input
                    type="text"
                    value={editingProduct.productName}
                    onChange={(e) => handleUpdateCurrentProduct('productName', e.target.value)}
                    placeholder="مثال: فیلترشکن اختصاصی پرسرعت V2Ray یا کتونی نایک..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-fuchsia-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
                      آیدی تلگرام پشتیبانی / فروش (بدون کاراکتر @):
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                      ارسال پس از ۲ دقیقه
                    </span>
                  </label>
                  <input
                    type="text"
                    value={editingProduct.support?.handle || ''}
                    onChange={(e) => handleUpdateSupport(e.target.value)}
                    placeholder="nova_vpn10"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none font-mono text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Pitch / Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    متن توضیحات و آفر اولیه محصول برای کاربر ناشناس (کپشن تبلیغاتی):
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.productDescription || ''}
                  onChange={(e) => handleUpdateCurrentProduct('productDescription', e.target.value)}
                  placeholder="راستی یه سرویس فوق‌العاده دارم با سرعت عالی بدون قطعی، تست رایگان هم داره 🚀"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none leading-relaxed font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PLANS & PRICING */}
          {activeTab === 'plans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  پلن‌ها و تعرفه‌های قیمت ({editingProduct.plans?.length || 0} پلن):
                </span>
                <button
                  type="button"
                  onClick={handleAddPlan}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ افزودن پلن قیمت جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(editingProduct.plans || []).map((plan, pIdx) => (
                  <div
                    key={plan.id || pIdx}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-bold">
                        پلن شماره {pIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(pIdx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="حذف این پلن"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">نام پلن:</label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) => handleUpdatePlan(pIdx, { name: e.target.value })}
                          placeholder="مثال: یک ماهه نامحدود"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">قیمت / تعرفه:</label>
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) => handleUpdatePlan(pIdx, { price: e.target.value })}
                          placeholder="مثال: ۱۲۰ هزار تومان"
                          className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">مدت اعتبار:</label>
                          <input
                            type="text"
                            value={plan.duration || ''}
                            onChange={(e) => handleUpdatePlan(pIdx, { duration: e.target.value })}
                            placeholder="یک ماهه"
                            className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-400 block mb-1">حجم / سایز:</label>
                          <input
                            type="text"
                            value={plan.traffic || ''}
                            onChange={(e) => handleUpdatePlan(pIdx, { traffic: e.target.value })}
                            placeholder="نامحدود"
                            className="w-full bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  پرسش‌ها و پاسخ‌های متداول هوشمند FAQ ({editingProduct.faqItems?.length || 0} مورد):
                </span>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ افزودن پرسش و پاسخ جدید</span>
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {(editingProduct.faqItems || []).map((faq, fIdx) => (
                  <div
                    key={faq.id || fIdx}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-fuchsia-400 font-bold w-6 text-center font-mono">
                        Q{fIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleUpdateFaq(fIdx, { question: e.target.value })}
                        placeholder="سوال احتمالی مخاطب (مثلاً: تست رایگان داری؟ یا قیمتش چنده؟)"
                        className="flex-1 bg-slate-900 border border-slate-800 focus:border-fuchsia-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(fIdx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="حذف این پرسش"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-xs text-emerald-400 font-bold w-6 text-center font-mono mt-1.5">
                        A{fIdx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => handleUpdateFaq(fIdx, { answer: e.target.value })}
                        placeholder="پاسخ خودمانی هوش مصنوعی به مخاطب..."
                        className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KNOWLEDGE BASE */}
          {activeTab === 'knowledge' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  متن پایگاه دانش تکمیلی محصول (Free-form Knowledge Base):
                </label>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  اطلاعات فنی، نحوه اتصال، جزئیات بسته‌ها، لوکیشن سرورها یا شرایط ارسال و گارانتی را اینجا بنویسید تا هوش مصنوعی در صورت سوال مخاطب از آن استفاده کند.
                </p>
              </div>

              <textarea
                rows={5}
                value={editingProduct.knowledgeBaseText || ''}
                onChange={(e) => handleUpdateCurrentProduct('knowledgeBaseText', e.target.value)}
                placeholder="سرورها در لوکیشن‌های آلمان و هلند مستقر هستند و روی تمام اپراتورها بدون قطعی وصل می‌شوند..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
              />
            </div>
          )}

          {/* Save Action Banner for Product Manager */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] text-slate-300">
                تغییرات کمپین‌ها در حافظه ثبت شده و در فایل پشتیبان (Backup) ذخیره می‌گردند.
              </span>
            </div>

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  savedSuccess
                    ? 'bg-emerald-600'
                    : 'bg-violet-600 hover:bg-violet-500 shadow-violet-950/50'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>کمپین‌ها ذخیره شدند ✓</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره دائمی تنظیمات'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
