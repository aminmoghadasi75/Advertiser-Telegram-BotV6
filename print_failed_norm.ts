import { Intent } from './src/types';
import { detectIntent } from './src/conversation/intentEngine';
import { normalizePersianText } from './src/conversation/normalizer';

const normBaseCases = [
    { base: 'قیمت فیلترشکن ماهانه چنده؟', expectedIntent: Intent.PRICE_REQUEST },
    { base: 'اکانت تست رایگان v2ray میدید؟', expectedIntent: Intent.TRIAL_REQUEST },
    { base: 'شماره کارت بدید واریز کنم میخوام بخرم', expectedIntent: Intent.PURCHASE_INTENT },
    { base: 'نه ممنون اصلا نیازی به vpn ندارم', expectedIntent: Intent.REJECTION },
    { base: 'سلام وقتتون بخیر خسته نباشید', expectedIntent: Intent.GREETING },
    { base: 'نت ملی شد چطوری دور بزنم', expectedIntent: Intent.PRODUCT_CURIOUS },
    { base: 'پشتیبانی جواب نمیده', expectedIntent: Intent.UNKNOWN },
    { base: 'پلن سه ماهه هم دارید؟', expectedIntent: Intent.PLAN_REQUEST },
    { base: 'کانکشن شما پینگ رو پایین میاره؟', expectedIntent: Intent.QUESTION },
    { base: 'دروغ میگی رباتی', expectedIntent: Intent.SUSPICION_BOT },
    { base: 'گمشو بابا کلاهبردار', expectedIntent: Intent.INAPPROPRIATE },
    { base: 'به ربات سکسی تلگرام پیام بده', expectedIntent: Intent.UNKNOWN },
    { base: 'اینستاگرامم باز نمیشه چیکار کنم', expectedIntent: Intent.RELEVANT_NEED },
    { base: 'من دانشجو هستم کارم اینترنتیه', expectedIntent: Intent.UNKNOWN },
    { base: 'گرونه آقا ارزون تر بده', expectedIntent: Intent.OBJECTION },
    { base: 'خداحافظ تا فردا', expectedIntent: Intent.GOODBYE },
    { base: 'هزینه سرور المان رو میگید', expectedIntent: Intent.PRICE_REQUEST },
    { base: 'واسه دور زدن فیلترینگ چکار کنم', expectedIntent: Intent.RELEVANT_NEED },
    { base: 'یوزر پسورد تستی ندارید', expectedIntent: Intent.UNKNOWN },
    { base: 'شماره شبا بده', expectedIntent: Intent.PURCHASE_INTENT },
  ];

  const normVariants = [];
  for (const b of normBaseCases) {
    // 1. Arabic character variation (ي -> ی, ك -> ک, ة -> ه)
    normVariants.push({
      original: b.base,
      variant: b.base.replace(/ی/g, 'ي').replace(/ک/g, 'ك'),
      transform: 'ARABIC_CHAR_SUBSTITUTION',
      expectedIntent: b.expectedIntent,
    });

    // 2. Nim-faseleh removal / space substitution
    normVariants.push({
      original: b.base,
      variant: b.base.replace(/\u200c/g, ' '),
      transform: 'NIM_FASELEH_TO_SPACE',
      expectedIntent: b.expectedIntent,
    });

    // 3. Repeated punctuation & emojis
    normVariants.push({
      original: b.base,
      variant: `🌸✨ ${b.base} !!! ??? 🚀`,
      transform: 'EMOJIS_AND_REPEATED_PUNCTUATION',
      expectedIntent: b.expectedIntent,
    });

    // 4. Persian / Latin numerals & casing
    normVariants.push({
      original: b.base,
      variant: b.base.replace(/ماهانه/g, '۱ ماهه').toUpperCase(),
      transform: 'PERSIAN_NUMERALS_AND_UPPERCASE',
      expectedIntent: b.expectedIntent,
    });

    // 5. Extra whitespaces & zero-width noise
    normVariants.push({
      original: b.base,
      variant: `   ${b.base.replace(/ /g, '  ')} \u200C  \u200B `,
      transform: 'WHITESPACE_AND_ZERO_WIDTH',
      expectedIntent: b.expectedIntent,
    });
  }

  for (const nv of normVariants) {
    const res = detectIntent(nv.variant, []);
    if (res.primaryIntent !== nv.expectedIntent) {
      console.log(`Failed! Original: ${nv.original}, Variant: ${nv.variant}, Expected: ${nv.expectedIntent}, Got: ${res.primaryIntent}`);
    }
  }
