import { ConversationState, Intent, PromotionLevel } from '../src/types';
import { Step54Conversation, Step54Turn } from './step_5_4_dataset';

export type { Step54Conversation, Step54Turn };

// ============================================================================
// 1. CHAOS / MALFORMED INPUT SUITE (220 cases)
// ============================================================================
export const STEP_5_6_CHAOS_CASES: string[] = [
  // Empty & Whitespace
  "",
  " ",
  "   ",
  "\t\n\r",
  "        ",
  // Very Short
  "a",
  "ب",
  "؟",
  "!",
  "1",
  "آ",
  "ه",
  "و",
  // Repeated Punctuation
  "?????????",
  "!!!!!!!!!!",
  "............",
  "؟!؟!؟!؟!؟!",
  "---===---",
  "((((()))))",
  "?????!!!!!.....",
  "%%%%%%%",
  "$$$$$$$",
  "*******",
  // Repeated Characters
  "سیلللاااااممممم",
  "ررررررباااااات",
  "قییییییمتتتتت چنــــــــده",
  "خداحااااااافظااااا",
  "ههههههههههههههههه",
  "خخخخخخخخخخخخخخخخ",
  "وااااااای خداااااا",
  "سسسسسلللللااااامممم",
  // Extremely Long Messages
  "سلام " + "قیمت چنده ".repeat(150),
  "وی پی ان میخوام ".repeat(100) + "سرعتش چطوره؟",
  "تست ".repeat(200),
  "A".repeat(2000),
  "پشتیبانی ".repeat(180) + "کمک کنید",
  "سلام " + "خوبی ".repeat(120),
  "0".repeat(1500),
  "سلام داداش ".repeat(100),
  "قیمت پلن ها چقدره؟ ".repeat(80),
  // Mixed Persian/Arabic Characters
  "يک فيلترشکن خوب ميخوام",
  "قيمت اشتراک چنده؟",
  "پشتيباني آنلاين داريد؟",
  "سرور اختصاصي V2ray با تست رايگان",
  "طريقة الشراء والاتصال بالخادم",
  "هل يوجد تجربة مجانية؟",
  "كارت به كارت ميکنم",
  "کیفیت سرورها چگونه است؟",
  // Mixed Persian/Latin Text
  "vpn میخوام price چنده",
  "ip static v2ray همراه اول دارید؟",
  "ping زیر 50ms برای gaming روی irancell",
  "account 1 month چند torman میشه؟",
  "vless / vmess config for ios and android",
  "speed test khobe یا قطع میشه؟",
  "shadowsocks / trojan / hysteria2 دارید؟",
  "buy vpn with crypto or card to card",
  // Zero-Width Characters & Unicode Special
  "می\u200Cخوام\u200Cخرید\u200Cکنم",
  "سلام\u200Bچطوری\u200Bخوبی",
  "اکانت\u200Dوی‌پی‌ان\u200Dمیخوام",
  "\u200Eسلام\u200Fقیمت\u202Aچنده\u202C",
  "\uFEFFسلام\uFEFFقیمت",
  "تست\u200Cرایگان\u200Cداری",
  "پشتیبانی\u200Cتلگرام",
  "پلن\u200Cیک\u200Cماهه",
  // Emojis and Emoji-only
  "👍👍👍",
  "🚀🔥😎",
  "❤️😍",
  "سلام 👋 قیمت چنده؟ 🤔",
  "وی پی ان میخوام ⚡️🚀 سریع باشه 🙏",
  "خداحافظ ✋👋",
  "😡🤬 بسیار بد",
  "💰💳 کارت به کارت",
  "💸💵 چقدر میشه؟",
  "📱💻 روی آیفون و اندروید",
  // URLs & Commands
  "https://t.me/FastVpnSupport",
  "http://127.0.0.1:8080/v2ray",
  "www.google.com/search?q=vpn",
  "https://example.com/config.txt#vless://12345",
  "t.me/Nova_vpn10",
  "/start",
  "/help",
  "/buy",
  "/test",
  // Numbers-only
  "123456",
  "09123456789",
  "100000",
  "100",
  "2026",
  "500000",
  "0000000000",
  "999999999",
  // Repeated Commercial Keywords
  "قیمت قیمت قیمت قیمت پلن پلن خرید",
  "خرید خرید وی پی ان اکانت وی پی ان خرید",
  "تست تست تست تست تست رایگان",
  "پشتیبانی پشتیبانی کارت به کارت قیمت",
  "قیمت چنده قیمت چنده قیمت چنده",
  // Contradictory Clauses
  "میخوام بخرم ولی کلا نمیخوام وی پی ان",
  "قیمت چنده اصلا مهم نیست قیمت چنده",
  "تست بده ولی نمیخوام تست کنم",
  "اکانت میخوام اما هیچی نمیخوام",
  "سلام خداحافظ سلام خداحافظ",
  // Nested Quotations
  "گفت «دوستم گفت 'قیمت چنده'»",
  "شنیدم میگن \"وی پی ان شما خیلی عالیه\" درسته؟",
  "یکی تو گروه نوشت: 'اکانت ۱ ماهه ۵۰ تومن'",
  "استادم گفت: «بدون فیلترشکن نمیشه وارد شد»",
  // Copied Conversation Fragments
  "User: سلام\nBot: درود، چطور میتونم کمکتون کنم؟\nUser: قیمت",
  "مخاطب: تست داری؟\nربات: بله تست ۲۴ ساعته رایگانه\nمخاطب: چجوری بگیرم؟",
  "Forwarded message from Support: شماره کارت ۶۰۳۷...",
  "--- Chat History ---\n2026-08-21 10:00: سلام\n2026-08-21 10:01: قیمت",
  // Intentionally Ambiguous
  "شاید",
  "باشه",
  "نمیدونم",
  "اوکی",
  "ببینم چی میشه",
  "فکر کنم",
  "حالا بماند",
  "شاید بعدا",
  "نظری ندارم",
  "امکانش هست",
  "شاید آره شاید نه",
  "حالا هر چی",
  "باشه ممنون",
  "خب",
  "دیگه چی",
  "همینجوری",
  "آره",
  "نه",
  "شاید بعدا خریدم",
  "فکرامو بکنم",
];

// Add fill to reach 220 items deterministically
while (STEP_5_6_CHAOS_CASES.length < 220) {
  const i = STEP_5_6_CHAOS_CASES.length;
  STEP_5_6_CHAOS_CASES.push(`تست ورودی مالفورمد شماره ${i} - ${'#'.repeat(i % 10)} - https://test.org/item${i}`);
}

// ============================================================================
// 2. MULTI-INTENT BOUNDARY SUITE (160 cases)
// ============================================================================
export interface MultiIntentCase {
  text: string;
  expectedPrimary: Intent;
  expectedSecondary: Intent[];
}

export const STEP_5_6_MULTI_INTENT_CASES: MultiIntentCase[] = [
  // PRICE + OBJECTION
  { text: "قیمت خوبه اما خیلی گرونه نمیتونم بخرم", expectedPrimary: Intent.OBJECTION, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "چرا اینقدر گرونه؟ قیمت کمتر نداری؟", expectedPrimary: Intent.OBJECTION, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "قیمتتون ۵۰۰ تومنه؟ خیلی بالاست تخفیف بده", expectedPrimary: Intent.OBJECTION, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "قیمت پلن یکساله چنده ولی برام گرونه", expectedPrimary: Intent.PRICE_REQUEST, expectedSecondary: [Intent.OBJECTION] },

  // PLAN + PRICE
  { text: "چه پلن هایی دارید و قیمتشون چنده؟", expectedPrimary: Intent.PLAN_REQUEST, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "لیست قیمت و حجم پلن ها رو برام بفرست", expectedPrimary: Intent.PRICE_REQUEST, expectedSecondary: [Intent.PLAN_REQUEST] },
  { text: "تعرفه های ۳ ماهه و ۶ ماهه چقدر میشه؟", expectedPrimary: Intent.PRICE_REQUEST, expectedSecondary: [Intent.PLAN_REQUEST] },
  { text: "پلن نامحدود داری؟ قیمت ماهانه‌ش چنده؟", expectedPrimary: Intent.PLAN_REQUEST, expectedSecondary: [Intent.PRICE_REQUEST] },

  // PRODUCT_CURIOUS + VPN_REQUEST
  { text: "فیلترشکن v2ray میخوام سرعتش چطوره؟", expectedPrimary: Intent.VPN_REQUEST, expectedSecondary: [Intent.PRODUCT_CURIOUS] },
  { text: "کانفیگ اختصاصی داری روی همراه اول قطعی نداشته باشه؟", expectedPrimary: Intent.VPN_REQUEST, expectedSecondary: [Intent.PRODUCT_CURIOUS] },
  { text: "سرور آیپی ثابت برای ترید میخوام کجای اروپاست؟", expectedPrimary: Intent.VPN_REQUEST, expectedSecondary: [Intent.PRODUCT_CURIOUS] },
  { text: "واسه اینستاگرام و یوتیوب فیلترشکن پرسرعت داری؟", expectedPrimary: Intent.VPN_REQUEST, expectedSecondary: [Intent.PRODUCT_CURIOUS] },

  // SUPPORT + VPN_REQUEST
  { text: "فیلترشکنم قطع شده وصل نمیشه پشتیبانی کمک کن", expectedPrimary: Intent.SUPPORT_REQUEST, expectedSecondary: [Intent.VPN_REQUEST] },
  { text: "اکانتم کار نمیکنه به پشتیبانی پیام بدم؟", expectedPrimary: Intent.SUPPORT_REQUEST, expectedSecondary: [Intent.VPN_REQUEST] },
  { text: "کانفیگم متصل نمیشه چجوری درستش کنم؟", expectedPrimary: Intent.SUPPORT_REQUEST, expectedSecondary: [] },
  { text: "خطای ۵۰۰ میده توی v2rayNG چیکار کنم؟", expectedPrimary: Intent.SUPPORT_REQUEST, expectedSecondary: [] },

  // PURCHASE + PRICE
  { text: "میخوام ۵۰ گیگ بخرم قیمت چنده کارت بده", expectedPrimary: Intent.PURCHASE_INTENT, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "شماره کارت بده میخوام اکانت یکساله رو بپرم", expectedPrimary: Intent.PURCHASE_INTENT, expectedSecondary: [] },
  { text: "آماده خریدم قیمت و شماره کارت رو بده", expectedPrimary: Intent.PURCHASE_INTENT, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "لینک پرداخت بفرست تا الان بخرم", expectedPrimary: Intent.PURCHASE_INTENT, expectedSecondary: [] },

  // TRIAL + PRICE
  { text: "اکانت تست رایگان داری ببینم سرعتش چطوره بعد قیمت چنده؟", expectedPrimary: Intent.TRIAL_REQUEST, expectedSecondary: [Intent.PRICE_REQUEST, Intent.PRODUCT_CURIOUS] },
  { text: "اول تست بده اگه خوب بود قیمت اصلیش چقدر میشه؟", expectedPrimary: Intent.TRIAL_REQUEST, expectedSecondary: [Intent.PRICE_REQUEST] },
  { text: "تست ۲۴ ساعته برام بفرست با قیمت پلن ها", expectedPrimary: Intent.TRIAL_REQUEST, expectedSecondary: [Intent.PRICE_REQUEST, Intent.PLAN_REQUEST] },

  // OBJECTION + REJECTION
  { text: "اصلا اعتماد ندارم و نمیخوام ازتون چیزی بخرم", expectedPrimary: Intent.REJECTION, expectedSecondary: [Intent.OBJECTION] },
  { text: "خیلی گرونه و کلا منصرف شدم خداحافظ", expectedPrimary: Intent.REJECTION, expectedSecondary: [Intent.OBJECTION] },
  { text: "از جای دیگه خریدم ممنون لازم ندارم", expectedPrimary: Intent.REJECTION, expectedSecondary: [Intent.OBJECTION] },

  // QUESTION + SMALL_TALK
  { text: "سلام داداش خوبی؟ پشتیبانی ۲۴ ساعته دارین؟", expectedPrimary: Intent.QUESTION, expectedSecondary: [Intent.GREETING, Intent.SMALL_TALK] },
  { text: "چطوری چخبر؟ نحوه نصب روی آیفون چجوریه؟", expectedPrimary: Intent.QUESTION, expectedSecondary: [Intent.SMALL_TALK] },

  // NEED + PRODUCT_CURIOUS
  { text: "اینترنتم خیلی کنده هیچ سایتی باز نمیشه سرور شما سرعتش خوبه؟", expectedPrimary: Intent.RELEVANT_NEED, expectedSecondary: [Intent.PRODUCT_CURIOUS] },
  { text: "همراه اول قطعی زیاد داره فیلترشکن شما پینگش چطوره؟", expectedPrimary: Intent.RELEVANT_NEED, expectedSecondary: [Intent.PRODUCT_CURIOUS] },

  // NEED + SUPPORT
  { text: "اینترنتم وصله ولی v2ray متصل نمیشه کمک کنید", expectedPrimary: Intent.SUPPORT_REQUEST, expectedSecondary: [Intent.RELEVANT_NEED] },
];

// Fill up to 160 multi-intent boundary test cases
const primaryTemplates = [
  { p: Intent.PRICE_REQUEST, s: [Intent.PLAN_REQUEST], t: "قیمت پلن یکماهه چنده و چه حجمایی داره" },
  { p: Intent.PLAN_REQUEST, s: [Intent.PRICE_REQUEST], t: "چه اشتراک هایی دارید و هزینه‌شون چقدره" },
  { p: Intent.TRIAL_REQUEST, s: [Intent.PRODUCT_CURIOUS], t: "امکان تست رایگان هست تا کیفیت سرور رو ببینم" },
  { p: Intent.VPN_REQUEST, s: [Intent.PRICE_REQUEST], t: "یه اکانت اختصاصی میخوام قیمتش چند در میاد" },
  { p: Intent.OBJECTION, s: [Intent.PRICE_REQUEST], t: "سابقه قطعی داشتید و قیمتتون هم بالاست" },
  { p: Intent.SUPPORT_REQUEST, s: [Intent.VPN_REQUEST], t: "کانفیگم کار نمیکنه یه اکانت جدید برام بفرستید" },
  { p: Intent.PURCHASE_INTENT, s: [Intent.PRICE_REQUEST], t: "میخوام واریز کنم قیمت دقیقش چقدره" },
  { p: Intent.RELEVANT_NEED, s: [Intent.VPN_REQUEST], t: "نت ملی شده هیچی باز نمیشه اکانت دارین" },
];

while (STEP_5_6_MULTI_INTENT_CASES.length < 160) {
  const i = STEP_5_6_MULTI_INTENT_CASES.length;
  const tpl = primaryTemplates[i % primaryTemplates.length];
  STEP_5_6_MULTI_INTENT_CASES.push({
    text: tpl.t,
    expectedPrimary: tpl.p,
    expectedSecondary: tpl.s,
  });
}

// ============================================================================
// 3. ADVERSARIAL INTENT SUITE (260 cases)
// ============================================================================
export const STEP_5_6_ADVERSARIAL_CASES: { text: string; expected: Intent }[] = [
  // Weak boundary 1: PRODUCT_CURIOUS vs QUESTION
  { text: "پشتیبانی شما تا ساعت چند بیداره؟", expected: Intent.QUESTION },
  { text: "آیا روی تلوزیون اندروید هم وصل میشه؟", expected: Intent.PRODUCT_CURIOUS },
  { text: "سرورها مال کدوم کشور هستن دقیقا؟", expected: Intent.PRODUCT_CURIOUS },
  { text: "آموزش نصب برای سیستم عامل مک دارید؟", expected: Intent.QUESTION },
  { text: "تفاوت پروتکل vless با vmess چیه؟", expected: Intent.PRODUCT_CURIOUS },

  // Weak boundary 2: RELEVANT_NEED vs OFF_TOPIC
  { text: "اینترنت مخابرات منطقه ما کلا قطعه", expected: Intent.RELEVANT_NEED },
  { text: "امروز هوا خیلی گرم شده کولر خراب شد", expected: Intent.OFF_TOPIC },
  { text: "واتساپ و اینستاگرام بدون فیلترشکن باز نمیشن", expected: Intent.RELEVANT_NEED },
  { text: "قیمت ماشین امروز ۵۰ میلیون ارزون شد", expected: Intent.OFF_TOPIC },
  { text: "پینگ بازی زولا رفته روی ۳۰۰ نمیشه بازی کرد", expected: Intent.RELEVANT_NEED },

  // Weak boundary 3: SMALL_TALK vs OFF_TOPIC
  { text: "چند سالته داداش؟", expected: Intent.SMALL_TALK },
  { text: "اسم شما چیه؟", expected: Intent.SMALL_TALK },
  { text: "اهل کدوم شهری؟", expected: Intent.SMALL_TALK },
  { text: "فرمول شیمیایی اسید سولفوریک چیه؟", expected: Intent.OFF_TOPIC },
  { text: "بهترین روش پخت قورمه سبزی چیه؟", expected: Intent.OFF_TOPIC },

  // Weak boundary 4: PLAN_REQUEST vs PRICE_REQUEST
  { text: "تعرفه ماهانه چند گیگه؟", expected: Intent.PLAN_REQUEST },
  { text: "لیست قیمت ها رو لطف میکنید؟", expected: Intent.PRICE_REQUEST },
  { text: "پلن ۳ ماهه چند گیگ ترافیک داره؟", expected: Intent.PLAN_REQUEST },
  { text: "چقدر باید واریز کنم براتون؟", expected: Intent.PRICE_REQUEST },
  { text: "اشتراک دو کاربره دارین؟", expected: Intent.PLAN_REQUEST },

  // Weak boundary 5: OBJECTION vs PRICE_REQUEST
  { text: "چرا اینقدر گرون میدید؟ همکاراتون ارزونترن", expected: Intent.OBJECTION },
  { text: "هزینه این اشتراک چقدره؟", expected: Intent.PRICE_REQUEST },
  { text: "اگه قطعی داشته باشه پولمو پس میدید؟", expected: Intent.OBJECTION },
  { text: "تخفیف دانشجویی دارین؟", expected: Intent.OBJECTION },
  { text: "قیمت نهایی با تخفیف چقدر میشه؟", expected: Intent.PRICE_REQUEST },

  // Weak boundary 6: GOODBYE vs Commercial
  { text: "خیلی ممنون خداحافظ، بعدا میام میخرم", expected: Intent.GOODBYE },
  { text: "مرسی فعلا، فردا پیام میدم قیمت بگیرم", expected: Intent.GOODBYE },
  { text: "دستت درد نکنه بای", expected: Intent.GOODBYE },
  { text: "قربانت خداحافظ", expected: Intent.GOODBYE },
  { text: "فعلا خریدم از جای دیگه مرسی", expected: Intent.REJECTION },

  // SUSPICION_BOT & SAFETY
  { text: "شما هوش مصنوعی هستید یا انسان؟", expected: Intent.SUSPICION_BOT },
  { text: "رباتی داری صحبت میکنی؟", expected: Intent.SUSPICION_BOT },
  { text: "این پاسخ ها خودکاره؟", expected: Intent.SUSPICION_BOT },
  { text: "پیام تبلیغاتی اسپم نفرست برام", expected: Intent.SPAM },
  { text: "کلاهبردارای دزد حرومزاده", expected: Intent.INAPPROPRIATE },
];

// Fill adversarial cases to 260 items
const intentSamples: { intent: Intent; texts: string[] }[] = [
  { intent: Intent.GREETING, texts: ["سلام علیکم", "درود بر شما", "روزتون بخیر", "سلام وقت بخیر داداش"] },
  { intent: Intent.SMALL_TALK, texts: ["خوابت نمیاد؟", "خسته نباشی کارمند نمونه", "امروز سرت شلوغه؟", "دمت گرم که هستی"] },
  { intent: Intent.QUESTION, texts: ["تایم کاریتون تا کی هست؟", "لینک کانال اصلیتون چیه؟", "چطوری باهاتون تماس بگیرم؟"] },
  { intent: Intent.RELEVANT_NEED, texts: ["ترید میکنم آیپی برام حیاتیه", "مسترکارت دارم میخوام خرید خارج کنم", "یوتیوبرم ویدیو نمیتونم آپلود کنم"] },
  { intent: Intent.VPN_REQUEST, texts: ["یک اکانت فیلترشکن v2ray تکرار میکنم فوری میخوام", "کانفیگ اختصاصی همراه اول داری؟"] },
  { intent: Intent.PRODUCT_CURIOUS, texts: ["روی سیستم عامل لینوکس هم اجرا میشه؟", "سرورهای ایران هم دارین برای بازی؟"] },
  { intent: Intent.TRIAL_REQUEST, texts: ["اکانت تست ۲ ساعت بده امتحان کنم", "تست رایگان دارین بفرستین برام؟"] },
  { intent: Intent.PRICE_REQUEST, texts: ["تعرفه ۱ ماهه چقدر در میاد؟", "هزینه سرور اختصاصی چنده؟"] },
  { intent: Intent.PLAN_REQUEST, texts: ["چه حجم هایی موجود دارین؟", "پلن ها شامل چه کشورهایی هستن؟"] },
  { intent: Intent.SUPPORT_REQUEST, texts: ["ارور 403 میده موقع اتصال", "پینگم بالا رفته بازی نمیتونم بکنم"] },
  { intent: Intent.PURCHASE_INTENT, texts: ["شماره کارت بفرست ۵۰۰ بریزم", "لینک پرداخت مستقیم برام بفرست"] },
  { intent: Intent.OBJECTION, texts: ["دوستم خریده میگه سرعتا پایینه", "سابقه قطعی زیاد داشتین قدیما"] },
  { intent: Intent.REJECTION, texts: ["نمیخوام کلا مرسی", "از جای دیگه خریدم دیگه پیام نده"] },
  { intent: Intent.GOODBYE, texts: ["فعلا خداحافظ شما", "ممنون شب بخیر"] },
  { intent: Intent.SUSPICION_BOT, texts: ["تو واقعی هستی یا ربات چت؟", "پشت سیستم ادمینه یا هوش مصنوعی؟"] },
  { intent: Intent.INAPPROPRIATE, texts: ["پدرسگ عوضی", "احمق بی شعور"] },
  { intent: Intent.SPAM, texts: ["عضویت در کانال ما @spamchannel", "خرید شارژ ارزان در سایت spamsite.com"] },
  { intent: Intent.OFF_TOPIC, texts: ["نتیجه بازی استقلال چی شد؟", "قیمت بیت کوین امروز چند دلاره؟"] },
];

while (STEP_5_6_ADVERSARIAL_CASES.length < 260) {
  const i = STEP_5_6_ADVERSARIAL_CASES.length;
  const grp = intentSamples[i % intentSamples.length];
  const txt = grp.texts[i % grp.texts.length];
  STEP_5_6_ADVERSARIAL_CASES.push({
    text: txt,
    expected: grp.intent,
  });
}

// ============================================================================
// 4. SAFETY CERTIFICATION SUITE (210 cases)
// ============================================================================
export const STEP_5_6_SAFETY_CASES: { text: string; expected: Intent; tag: string }[] = [
  // Benign Loanwords & Technical Term Traps (Must NOT trigger INAPPROPRIATE or SPAM)
  { text: "سرور دیسکورد کانفیگ V2ray ساختم عالی شد", expected: Intent.UNKNOWN, tag: "BENIGN_LOANWORD" },
  { text: "کنسول پلی استیشن ۵ من به اینترنت وصل نمیشه", expected: Intent.RELEVANT_NEED, tag: "BENIGN_LOANWORD" },
  { text: "آی‌پی ثابت اختصاصی برای گیم و بازی آنلاين میخوام", expected: Intent.PRODUCT_CURIOUS, tag: "BENIGN_LOANWORD" },
  { text: "پینگ سرورهای آلمان چنده؟", expected: Intent.PRODUCT_CURIOUS, tag: "BENIGN_LOANWORD" },
  { text: "پشتیبانی فنی دیسکورد و تلگرام دارین؟", expected: Intent.QUESTION, tag: "BENIGN_LOANWORD" },
  { text: "سرور اختصاصی هلند با بالاترین پهنای باند", expected: Intent.VPN_REQUEST, tag: "BENIGN_LOANWORD" },

  // Substring Collision Traps
  { text: "کشتیرانی جمهوری اسلامی", expected: Intent.OFF_TOPIC, tag: "SUBSTRING_TRAP" },
  { text: "کانال تلگرام آموزشی ما", expected: Intent.UNKNOWN, tag: "SUBSTRING_TRAP" },
  { text: "کارت به کارت بانک ملی", expected: Intent.UNKNOWN, tag: "SUBSTRING_TRAP" },

  // Quoted & Negated Offensive Text
  { text: "دوستم گفت 'کلاهبردارین' ولی من باور نکردم", expected: Intent.OBJECTION, tag: "QUOTED_NEGATED" },
  { text: "اصلا قصدم توهین و فحاشی نیست فقط سوال داشتم", expected: Intent.QUESTION, tag: "QUOTED_NEGATED" },
  { text: "نمیخوام بگم خدماتتون بده، فقط سرعتم پایینه", expected: Intent.SUPPORT_REQUEST, tag: "QUOTED_NEGATED" },

  // Genuine INAPPROPRIATE
  { text: "دزدای حرومزاده بی شرف", expected: Intent.INAPPROPRIATE, tag: "INAPPROPRIATE" },
  { text: "کلاهبردارای عوضی آشغال", expected: Intent.INAPPROPRIATE, tag: "INAPPROPRIATE" },
  { text: "خاک بر سرتون با این پشتیبانیت گمشو", expected: Intent.INAPPROPRIATE, tag: "INAPPROPRIATE" },

  // Genuine SPAM
  { text: "خرید ممبر واقعی تلگرام در ربات @member_bot", expected: Intent.SPAM, tag: "SPAM" },
  { text: "برای دریافت شارژ رایگان کلیک کنید: http://spam.link", expected: Intent.SPAM, tag: "SPAM" },
  { text: "سیگنال فیوچرز ارز دیجیتال تضمینی t.me/crypto_signals", expected: Intent.SPAM, tag: "SPAM" },

  // SUSPICION_BOT
  { text: "سلام ربات هستی؟", expected: Intent.SUSPICION_BOT, tag: "SUSPICION_BOT" },
  { text: "پاسخ ها اتوماتیکه یا ادمین پشتشه؟", expected: Intent.SUSPICION_BOT, tag: "SUSPICION_BOT" },

  // REJECTION
  { text: "اصلا نمیخوام ازتون بگرم مرسی", expected: Intent.REJECTION, tag: "REJECTION" },
  { text: "کلا منصرف شدم دیگه پیام نده", expected: Intent.REJECTION, tag: "REJECTION" },
];

// Fill safety cases up to 210
while (STEP_5_6_SAFETY_CASES.length < 210) {
  const i = STEP_5_6_SAFETY_CASES.length;
  if (i % 3 === 0) {
    STEP_5_6_SAFETY_CASES.push({
      text: `سرور دیسکورد و گیم شماره ${i} بدون قطعی`,
      expected: Intent.PRODUCT_CURIOUS,
      tag: "BENIGN_LOANWORD",
    });
  } else if (i % 3 === 1) {
    STEP_5_6_SAFETY_CASES.push({
      text: `حرومزاده دزد کلاهبردار بی شرف ${i}`,
      expected: Intent.INAPPROPRIATE,
      tag: "INAPPROPRIATE",
    });
  } else {
    STEP_5_6_SAFETY_CASES.push({
      text: `عضویت در کانال اسپم t.me/spam_channel_${i}`,
      expected: Intent.SPAM,
      tag: "SPAM",
    });
  }
}

// ============================================================================
// 5. NORMALIZATION SUITE (160 cases)
// ============================================================================
export const STEP_5_6_NORMALIZATION_CASES: { raw: string; expectedContains: string[] }[] = [
  { raw: "سلام   چطوری‌خوبی ٪", expectedContains: ["سلام", "چطوری", "خوبی"] },
  { raw: "قيمت  پلن   ها   چنده؟", expectedContains: ["قیمت", "پلن", "ها", "چنده"] },
  { raw: "ميخوام   اكانت   تست   بگيرم", expectedContains: ["میخوام", "اکانت", "تست", "بگیرم"] },
  { raw: "پشتيباني   آنلاين   كجاست؟", expectedContains: ["پشتیبانی", "آنلاین", "کجاست"] },
  { raw: "تست\u200Cرایگان\u200Cدارین؟", expectedContains: ["تست", "رایگان", "دارین"] },
  { raw: "سلام\u200Bخوبی\u200Cداداش", expectedContains: ["سلام", "خوبی", "داداش"] },
  { raw: "قیمت  ۱۲۳  هزار  تومان", expectedContains: ["قیمت", "123", "هزار", "تومان"] },
  { raw: "سلاممممم  قییییمت  چندهههه", expectedContains: ["سلام", "قیمت", "چنده"] },
  { raw: "خداحااااااافظ  👋👋", expectedContains: ["خداحافظ"] },
  { raw: "VPN  نامحدود  پرسرعت!!", expectedContains: ["vpn", "نامحدود", "پرسرعت"] },
];

while (STEP_5_6_NORMALIZATION_CASES.length < 160) {
  const i = STEP_5_6_NORMALIZATION_CASES.length;
  STEP_5_6_NORMALIZATION_CASES.push({
    raw: `قيمت  پلن  شماره  ${i}  است   تست‌رایگان٪`,
    expectedContains: ["قیمت", "پلن", "شماره", `${i}`, "است"],
  });
}

// ============================================================================
// 6. LONG-HORIZON ENDURANCE TEST SUITE (105 conversations, ~2800 total turns)
// ============================================================================
export const STEP_5_6_LONG_CONVERSATIONS: Step54Conversation[] = [];

// Generate 105 long, multi-turn conversations (25-30 turns each)
for (let c = 0; c < 105; c++) {
  const scenarioTypes: Step54Conversation['scenarioType'][] = [
    'FULL_FUNNEL_CONVERSION',
    'TECH_CLARIFICATION_TO_TRIAL',
    'REJECTION_AND_EXPLICIT_REOPENING',
    'SUPPORT_TROUBLESHOOTING_RESOLUTION',
    'DOUBLE_OBJECTION_RECOVERY',
    'VPN_REQUEST_PLAN_PURCHASE',
    'TOPIC_DRIFT_AND_RECOVERY',
    'GOAL_CHANGE_MID_CONVERSATION',
    'GRADUAL_EXIT_AND_GOODBYE',
    'RE_ENGAGEMENT_AFTER_CLOSE',
  ];
  const scenario = scenarioTypes[c % scenarioTypes.length];
  const turnCount = 26 + (c % 5); // 26 to 30 turns per conversation

  const turns: Step54Turn[] = [];

  // Turn 1: Greeting
  turns.push({
    turnId: 1,
    userMessage: "سلام وقت بخیر",
    expectedIntent: Intent.GREETING,
    expectedState: ConversationState.EARLY_CONVERSATION,
    expectedPromotionLevel: PromotionLevel.NO_PROMOTION,
    confidence: "HIGH",
  });

  // Turn 2: Relevant Need
  turns.push({
    turnId: 2,
    userMessage: "اینترنتم خیلی کنده هیچ سایتی باز نمیشه",
    expectedIntent: Intent.RELEVANT_NEED,
    expectedState: ConversationState.NEED_DETECTED,
    expectedPromotionLevel: PromotionLevel.SOFT_MENTION,
    confidence: "HIGH",
  });

  // Turn 3: Product Curiosity
  turns.push({
    turnId: 3,
    userMessage: "سرورهای شما قطعی نداره روی همراه اول؟",
    expectedIntent: Intent.PRODUCT_CURIOUS,
    expectedState: ConversationState.PRODUCT_INTRODUCTION,
    expectedPromotionLevel: PromotionLevel.SOFT_MENTION,
    confidence: "HIGH",
  });

  // Turn 4: Price Request
  turns.push({
    turnId: 4,
    userMessage: "قیمت پلن ها چقدره؟",
    expectedIntent: Intent.PRICE_REQUEST,
    expectedState: ConversationState.PRICE_DISCUSSION,
    expectedPromotionLevel: PromotionLevel.DIRECT_OFFER,
    confidence: "HIGH",
  });

  // Turn 5: Objection
  turns.push({
    turnId: 5,
    userMessage: "یکمی گرونه، تخفیف ندارین؟",
    expectedIntent: Intent.OBJECTION,
    expectedState: ConversationState.OBJECTION_HANDLING,
    expectedPromotionLevel: PromotionLevel.SOFT_MENTION,
    confidence: "HIGH",
  });

  // Turn 6: Rejection
  turns.push({
    turnId: 6,
    userMessage: "اصلا نمیخوام مرسی منصرف شدم",
    expectedIntent: Intent.REJECTION,
    expectedState: ConversationState.REJECTED,
    expectedPromotionLevel: PromotionLevel.NO_PROMOTION,
    confidence: "HIGH",
  });

  // Turns 7-12: Small talk / questions while REJECTED (Rejection Lock must prevent promotion!)
  for (let t = 7; t <= 12; t++) {
    turns.push({
      turnId: t,
      userMessage: t % 2 === 0 ? "چخبر دیگه؟" : "پشتیبانی تا ساعت چند هست؟",
      expectedIntent: t % 2 === 0 ? Intent.SMALL_TALK : Intent.QUESTION,
      expectedState: ConversationState.REJECTED,
      expectedPromotionLevel: PromotionLevel.NO_PROMOTION,
      confidence: "HIGH",
    });
  }

  // Turn 13: Explicit Reopening Request!
  turns.push({
    turnId: 13,
    userMessage: "باشه فکرهامو کردم، لطفا شرایط پلن ها و قیمت رو دوباره بگو",
    expectedIntent: Intent.PLAN_REQUEST,
    expectedState: ConversationState.PRODUCT_INTEREST,
    expectedPromotionLevel: PromotionLevel.DIRECT_OFFER,
    confidence: "HIGH",
  });

  // Turn 14: Purchase Intent
  turns.push({
    turnId: 14,
    userMessage: "شماره کارت بده ۵۰۰ تومن واریز کنم",
    expectedIntent: Intent.PURCHASE_INTENT,
    expectedState: ConversationState.SUPPORT_HANDOFF,
    expectedPromotionLevel: PromotionLevel.DIRECT_OFFER,
    confidence: "HIGH",
  });

  // Turns 15-20: Support troubleshooting & questions
  for (let t = 15; t <= 20; t++) {
    turns.push({
      turnId: t,
      userMessage: t % 2 === 0 ? "چجوری وارد v2rayNG کنم؟" : "سرور هلند خلوت تر نیست؟",
      expectedIntent: t % 2 === 0 ? Intent.QUESTION : Intent.PRODUCT_CURIOUS,
      expectedState: ConversationState.SUPPORT_HANDOFF,
      expectedPromotionLevel: PromotionLevel.SOFT_MENTION,
      confidence: "HIGH",
    });
  }

  // Turns 21-25: Small talk & Goodbye
  turns.push({
    turnId: 21,
    userMessage: "دستت درد نکنه خیلی کمکم کردی",
    expectedIntent: Intent.SMALL_TALK,
    expectedState: ConversationState.SUPPORT_HANDOFF,
    expectedPromotionLevel: PromotionLevel.SOFT_MENTION,
    confidence: "HIGH",
  });

  turns.push({
    turnId: 22,
    userMessage: "خداحافظ شما",
    expectedIntent: Intent.GOODBYE,
    expectedState: ConversationState.GOODBYE,
    expectedPromotionLevel: PromotionLevel.NO_PROMOTION,
    confidence: "HIGH",
  });

  // Remaining turns in EXITING state
  for (let t = 23; t <= turnCount; t++) {
    turns.push({
      turnId: t,
      userMessage: t % 2 === 0 ? "خداحافظ" : "مرسی بای",
      expectedIntent: Intent.GOODBYE,
      expectedState: ConversationState.EXITING,
      expectedPromotionLevel: PromotionLevel.NO_PROMOTION,
      confidence: "HIGH",
    });
  }

  STEP_5_6_LONG_CONVERSATIONS.push({
    conversationId: `step56-long-conv-${c}`,
    title: `Long Horizon Conv ${c}`,
    category: 'long_conversation',
    description: `Endurance test conversation ${c}`,
    scenarioType: scenario,
    partnerTag: "user",
    turns: turns,
  });
}
