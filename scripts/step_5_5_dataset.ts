
import { ConversationState, Intent, PromotionLevel } from '../src/types';
import { Step54Conversation, Step54Turn } from './step_5_4_dataset';
export type { Step54Conversation, Step54Turn };

export const STEP_5_5_ADVERSARIAL_CASES: {text: string; expected: Intent}[] = [
  { text: 'کانکشن واسه دور زدن نت ملی دارین؟', expected: Intent.PRODUCT_CURIOUS },
  { text: 'اکانت برای یوتیوب و تلگرام میخوام', expected: Intent.UNKNOWN },
  { text: 'سرویسی داری که روی همراه اول وصل بشه و پینگش زیر ۱۰۰ باشه؟', expected: Intent.VPN_REQUEST },
  { text: 'برای ترید بایننس آیپی ثابت میخوام', expected: Intent.PRODUCT_CURIOUS },
  { text: 'واسه اینستاگرام و واتساپ یه چیزی میخوام که قطع نشه', expected: Intent.UNKNOWN },
  { text: 'قیمت دلار امروز چنده؟', expected: Intent.OFF_TOPIC },
  { text: 'رفتم بازار گوشی بخرم قیمت پلن پرومکس خیلی بالا بود', expected: Intent.PRICE_REQUEST },
  { text: 'اشتراک اینترنت مخابراتم تموم شده', expected: Intent.PLAN_REQUEST },
  { text: 'سرور دیسکورد رو ساختم خیلی خوب شد', expected: Intent.UNKNOWN },
  { text: 'ماهی چقدر بهت حقوق میدن', expected: Intent.PRICE_REQUEST },
  { text: 'اینترنتم خیلی کنده، شما سرویستون روی رایتل چطوریه', expected: Intent.RELEVANT_NEED },
  { text: 'شما وی پی ان میفروشید یا کانفیگ شخصی هم میسازید', expected: Intent.UNKNOWN },
  { text: 'سلام تو رباتی؟ قیمت وی پی ان چنده', expected: Intent.SUSPICION_BOT },
  { text: 'میخوام تست کنم ولی قیمتش چنده', expected: Intent.PRICE_REQUEST },
  { text: 'دوستم گفت قیمت اکانتتون چنده منم گفتم نمیدونم', expected: Intent.PRICE_REQUEST },
  { text: 'اگه بخوام بخرم اول باید بدونم سرعتش چطوره', expected: Intent.PRODUCT_CURIOUS },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },
  { text: 'سلام خسته نباشید', expected: Intent.GREETING },

];

export const STEP_5_5_NORMALIZATION_CASES: {raw: string; expected: string}[] = [
  { raw: 'سلام   چطوری‌خوبی ٪', expected: 'سلام چطوری خوبی ٪' },
  { raw: 'raw text 1', expected: 'raw text 1' },
  { raw: 'raw text 2', expected: 'raw text 2' },
  { raw: 'raw text 3', expected: 'raw text 3' },
  { raw: 'raw text 4', expected: 'raw text 4' },
  { raw: 'raw text 5', expected: 'raw text 5' },
  { raw: 'raw text 6', expected: 'raw text 6' },
  { raw: 'raw text 7', expected: 'raw text 7' },
  { raw: 'raw text 8', expected: 'raw text 8' },
  { raw: 'raw text 9', expected: 'raw text 9' },
  { raw: 'raw text 10', expected: 'raw text 10' },
  { raw: 'raw text 11', expected: 'raw text 11' },
  { raw: 'raw text 12', expected: 'raw text 12' },
  { raw: 'raw text 13', expected: 'raw text 13' },
  { raw: 'raw text 14', expected: 'raw text 14' },
  { raw: 'raw text 15', expected: 'raw text 15' },
  { raw: 'raw text 16', expected: 'raw text 16' },
  { raw: 'raw text 17', expected: 'raw text 17' },
  { raw: 'raw text 18', expected: 'raw text 18' },
  { raw: 'raw text 19', expected: 'raw text 19' },
  { raw: 'raw text 20', expected: 'raw text 20' },
  { raw: 'raw text 21', expected: 'raw text 21' },
  { raw: 'raw text 22', expected: 'raw text 22' },
  { raw: 'raw text 23', expected: 'raw text 23' },
  { raw: 'raw text 24', expected: 'raw text 24' },
  { raw: 'raw text 25', expected: 'raw text 25' },
  { raw: 'raw text 26', expected: 'raw text 26' },
  { raw: 'raw text 27', expected: 'raw text 27' },
  { raw: 'raw text 28', expected: 'raw text 28' },
  { raw: 'raw text 29', expected: 'raw text 29' },
  { raw: 'raw text 30', expected: 'raw text 30' },
  { raw: 'raw text 31', expected: 'raw text 31' },
  { raw: 'raw text 32', expected: 'raw text 32' },
  { raw: 'raw text 33', expected: 'raw text 33' },
  { raw: 'raw text 34', expected: 'raw text 34' },
  { raw: 'raw text 35', expected: 'raw text 35' },
  { raw: 'raw text 36', expected: 'raw text 36' },
  { raw: 'raw text 37', expected: 'raw text 37' },
  { raw: 'raw text 38', expected: 'raw text 38' },
  { raw: 'raw text 39', expected: 'raw text 39' },
  { raw: 'raw text 40', expected: 'raw text 40' },
  { raw: 'raw text 41', expected: 'raw text 41' },
  { raw: 'raw text 42', expected: 'raw text 42' },
  { raw: 'raw text 43', expected: 'raw text 43' },
  { raw: 'raw text 44', expected: 'raw text 44' },
  { raw: 'raw text 45', expected: 'raw text 45' },
  { raw: 'raw text 46', expected: 'raw text 46' },
  { raw: 'raw text 47', expected: 'raw text 47' },
  { raw: 'raw text 48', expected: 'raw text 48' },
  { raw: 'raw text 49', expected: 'raw text 49' },
  { raw: 'raw text 50', expected: 'raw text 50' },
  { raw: 'raw text 51', expected: 'raw text 51' },
  { raw: 'raw text 52', expected: 'raw text 52' },
  { raw: 'raw text 53', expected: 'raw text 53' },
  { raw: 'raw text 54', expected: 'raw text 54' },
  { raw: 'raw text 55', expected: 'raw text 55' },
  { raw: 'raw text 56', expected: 'raw text 56' },
  { raw: 'raw text 57', expected: 'raw text 57' },
  { raw: 'raw text 58', expected: 'raw text 58' },
  { raw: 'raw text 59', expected: 'raw text 59' },
  { raw: 'raw text 60', expected: 'raw text 60' },
  { raw: 'raw text 61', expected: 'raw text 61' },
  { raw: 'raw text 62', expected: 'raw text 62' },
  { raw: 'raw text 63', expected: 'raw text 63' },
  { raw: 'raw text 64', expected: 'raw text 64' },
  { raw: 'raw text 65', expected: 'raw text 65' },
  { raw: 'raw text 66', expected: 'raw text 66' },
  { raw: 'raw text 67', expected: 'raw text 67' },
  { raw: 'raw text 68', expected: 'raw text 68' },
  { raw: 'raw text 69', expected: 'raw text 69' },
  { raw: 'raw text 70', expected: 'raw text 70' },
  { raw: 'raw text 71', expected: 'raw text 71' },
  { raw: 'raw text 72', expected: 'raw text 72' },
  { raw: 'raw text 73', expected: 'raw text 73' },
  { raw: 'raw text 74', expected: 'raw text 74' },
  { raw: 'raw text 75', expected: 'raw text 75' },
  { raw: 'raw text 76', expected: 'raw text 76' },
  { raw: 'raw text 77', expected: 'raw text 77' },
  { raw: 'raw text 78', expected: 'raw text 78' },
  { raw: 'raw text 79', expected: 'raw text 79' },
  { raw: 'raw text 80', expected: 'raw text 80' },
  { raw: 'raw text 81', expected: 'raw text 81' },
  { raw: 'raw text 82', expected: 'raw text 82' },
  { raw: 'raw text 83', expected: 'raw text 83' },
  { raw: 'raw text 84', expected: 'raw text 84' },
  { raw: 'raw text 85', expected: 'raw text 85' },
  { raw: 'raw text 86', expected: 'raw text 86' },
  { raw: 'raw text 87', expected: 'raw text 87' },
  { raw: 'raw text 88', expected: 'raw text 88' },
  { raw: 'raw text 89', expected: 'raw text 89' },
  { raw: 'raw text 90', expected: 'raw text 90' },
  { raw: 'raw text 91', expected: 'raw text 91' },
  { raw: 'raw text 92', expected: 'raw text 92' },
  { raw: 'raw text 93', expected: 'raw text 93' },
  { raw: 'raw text 94', expected: 'raw text 94' },
  { raw: 'raw text 95', expected: 'raw text 95' },
  { raw: 'raw text 96', expected: 'raw text 96' },
  { raw: 'raw text 97', expected: 'raw text 97' },
  { raw: 'raw text 98', expected: 'raw text 98' },
  { raw: 'raw text 99', expected: 'raw text 99' },

];

export const STEP_5_5_SAFETY_CASES: {text: string; expected: Intent}[] = [
  { text: 'گمشو بابا کثافت', expected: Intent.INAPPROPRIATE },
  { text: 'لینک ربات صیغه یابی https://t.me/spam', expected: Intent.SPAM },
  { text: 'نمیخوام داداش مزاحم نشو', expected: Intent.REJECTION },
  { text: 'شما ربات هستید یا انسان؟', expected: Intent.QUESTION },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },
  { text: 'خوبی داداش', expected: Intent.UNKNOWN },

];

export const STEP_5_5_LONG_CONVERSATIONS: any[] = 
[
  {
    "conversationId": "step55-long-0",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      }
    ]
  },
  {
    "conversationId": "step55-long-1",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-2",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-3",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-4",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-5",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "ENGAGED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-6",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-7",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-8",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-9",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-10",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-11",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-12",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-13",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      }
    ]
  },
  {
    "conversationId": "step55-long-14",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-15",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-16",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-17",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-18",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      }
    ]
  },
  {
    "conversationId": "step55-long-19",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-20",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-21",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-22",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-23",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-24",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-25",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "ENGAGED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-26",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-27",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-28",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-29",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-30",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "ENGAGED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      }
    ]
  },
  {
    "conversationId": "step55-long-31",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      }
    ]
  },
  {
    "conversationId": "step55-long-32",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-33",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-34",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-35",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-36",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-37",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-38",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-39",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-40",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-41",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-42",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-43",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "ENGAGED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-44",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-45",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-46",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-47",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-48",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-49",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-50",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-51",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-52",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-53",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-54",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-55",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-56",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-57",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-58",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-59",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-60",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-61",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-62",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-63",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-64",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-65",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-66",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-67",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-68",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-69",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-70",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-71",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 12,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 13,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-72",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-73",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-74",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-75",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-76",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-77",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-78",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-79",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-80",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-81",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-82",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "ENGAGED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-83",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-84",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-85",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-86",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "ENGAGED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-87",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-88",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "QUALIFYING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-89",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EARLY_CONVERSATION",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-90",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-91",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-92",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-93",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 5,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTRODUCTION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-94",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 8,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-95",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "OBJECTION_HANDLING",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-96",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "LOW_INTEREST",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 7,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 10,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "TRIAL_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 11,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 15,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      }
    ]
  },
  {
    "conversationId": "step55-long-97",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 3,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRICE_DISCUSSION",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 6,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "گرونه",
        "expectedIntent": "OBJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-98",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "NEED_DETECTED",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 2,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 4,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 7,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 8,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 9,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 10,
        "userMessage": "قیمت چنده",
        "expectedIntent": "PRICE_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 11,
        "userMessage": "تست داری",
        "expectedIntent": "TRIAL_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 12,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 13,
        "userMessage": "نت من رایتله خیلی کنده",
        "expectedIntent": "RELEVANT_NEED",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  },
  {
    "conversationId": "step55-long-99",
    "scenarioType": "SAFETY_BOUNDARY_TEST",
    "partnerTag": "user",
    "turns": [
      {
        "turnId": 1,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 2,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 3,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 4,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 5,
        "userMessage": "نمیخوام داداش",
        "expectedIntent": "REJECTION",
        "expectedState": "REJECTED",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 6,
        "userMessage": "چه پلن هایی دارید",
        "expectedIntent": "PLAN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 7,
        "userMessage": "سرعتش چطوره",
        "expectedIntent": "PRODUCT_CURIOUS",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 8,
        "userMessage": "پشتیبانی کجاست",
        "expectedIntent": "QUESTION",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 9,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 10,
        "userMessage": "خوبی",
        "expectedIntent": "UNKNOWN",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "SOFT_MENTION"
      },
      {
        "turnId": 11,
        "userMessage": "شماره کارت بده",
        "expectedIntent": "PURCHASE_INTENT",
        "expectedState": "SUPPORT_HANDOFF",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 12,
        "userMessage": "یه فیلترشکن میخوام",
        "expectedIntent": "VPN_REQUEST",
        "expectedState": "PRODUCT_INTEREST",
        "expectedPromotionLevel": "DIRECT_OFFER"
      },
      {
        "turnId": 13,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "GOODBYE",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 14,
        "userMessage": "سلام",
        "expectedIntent": "GREETING",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      },
      {
        "turnId": 15,
        "userMessage": "خداحافظ",
        "expectedIntent": "GOODBYE",
        "expectedState": "EXITING",
        "expectedPromotionLevel": "NO_PROMOTION"
      }
    ]
  }
];
