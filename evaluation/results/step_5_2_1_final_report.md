# Step 5.2.1 — Blind Holdout Validation & Overfitting Audit Report

## 1. Executive Summary & Verdict

* **Evaluation Step:** Step 5.2.1 Blind Holdout Validation & Overfitting Audit
* **Dataset:** `evaluation/holdout_intent_v1.json` (200 cases, 100% independent, 0 exact/normalized duplicates with Gold Dataset or unit tests)
* **Status:** Engine Frozen (No production modifications applied)
* **Overall Holdout Accuracy:** **63.0%** (126 / 200 correct)
* **Macro Intent F1:** **0.5887**
* **Weighted Intent F1:** **0.6277**
* **Gold Baseline Accuracy (Step 5.2):** 100.0%
* **Holdout Accuracy Degradation ($\Delta$):** **-37.0%**
* **Holdout Macro F1 Degradation ($\Delta$):** **-0.4113**
* **Critical Errors:** 2 (1.0%)
* **Commercial False Positive Rate (FPR):** 8.55%
* **Rejection False Negative Rate (FNR):** 14.29%
* **Suspicion Bot Recall:** 100.0%
* **Verdict:** **HIGH OVERFITTING DETECTED (Production Deployment Blocked). Comprehensive generalization refactoring required in Step 5.3.**

---

## 2. Comparison: Gold Baseline (Step 5.2) vs. Blind Holdout (Step 5.2.1)

| Metric | Step 5.1 Baseline | Step 5.2 (Gold Dataset) | Step 5.2.1 (Blind Holdout) | Delta (5.2.1 vs 5.2) |
| :--- | :--- | :--- | :--- | :--- |
| **Total Evaluation Cases** | 138 turns | 138 turns | **200 cases** | +62 cases |
| **Intent Accuracy** | 94.2% | **100.0%** | **63.0%** | **-37.0%** |
| **Macro Precision** | 0.9310 | **1.0000** | **0.6598** | **-0.3402** |
| **Macro Recall** | 0.9250 | **1.0000** | **0.6036** | **-0.3964** |
| **Macro F1 Score** | 0.9280 | **1.0000** | **0.5887** | **-0.4113** |
| **Weighted F1 Score** | 0.9410 | **1.0000** | **0.6277** | **-0.3723** |
| **Critical Intent Errors** | 0 | **0** | **2** | +2 |
| **Commercial False Positive Rate** | 6.8% | **0.0%** | **8.55%** | +8.55% |
| **Rejection False Negative Rate** | 0.0% | **0.0%** | **14.29%** | +14.29% |
| **Bot Suspicion Recall** | 100.0% | **100.0%** | **100.0%** | 0.0% |
| **Multi-Intent Exact Match Rate** | N/A | **96.5%** | **24.24%** | **-72.26%** |

---

## 3. Detailed Per-Class Breakdown

| Intent | Support | TP | FP | FN | Precision | Recall | F1 Score | Status / Health |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **GREETING** | 11 | 10 | 0 | 1 | 1.0000 | 0.9091 | **0.9524** | Robust |
| **SMALL_TALK** | 13 | 1 | 1 | 12 | 0.5000 | 0.0769 | **0.1333** | Severe Underfitting (Brittle ASL regex) |
| **QUESTION** | 12 | 11 | 19 | 1 | 0.3667 | 0.9167 | **0.5238** | Severe Over-generation (Question fallback) |
| **RELEVANT_NEED** | 14 | 3 | 0 | 11 | 1.0000 | 0.2143 | **0.3529** | High Precision, Low Recall (Lexical gap) |
| **VPN_REQUEST** | 13 | 6 | 2 | 7 | 0.7500 | 0.4615 | **0.5714** | Moderate Leakage to Question/ProductCurious |
| **PRODUCT_CURIOUS** | 13 | 5 | 4 | 8 | 0.5556 | 0.3846 | **0.4545** | Ambiguity with Question / Price |
| **TRIAL_REQUEST** | 12 | 10 | 2 | 2 | 0.8333 | 0.8333 | **0.8333** | Good Generalization |
| **PRICE_REQUEST** | 12 | 9 | 9 | 3 | 0.5000 | 0.7500 | **0.6000** | High False Positives (Trap words & fallback) |
| **PLAN_REQUEST** | 8 | 0 | 0 | 8 | 0.0000 | 0.0000 | **0.0000** | Zero Recall (Missing Candidate Generator) |
| **SUPPORT_REQUEST** | 13 | 10 | 0 | 3 | 1.0000 | 0.7692 | **0.8696** | Solid Performance |
| **PURCHASE_INTENT** | 12 | 9 | 1 | 3 | 0.9000 | 0.7500 | **0.8182** | Solid Performance |
| **OBJECTION** | 13 | 6 | 2 | 7 | 0.7500 | 0.4615 | **0.5714** | Lexical Gap in pricing objections |
| **REJECTION** | 14 | 12 | 0 | 2 | 1.0000 | 0.8571 | **0.9231** | High Safety Precision, 2 critical misses |
| **GOODBYE** | 12 | 12 | 5 | 0 | 0.7059 | 1.0000 | **0.8276** | 100% Recall, Oversensitive to 'باید/برم' |
| **SUSPICION_BOT** | 9 | 9 | 0 | 0 | 1.0000 | 1.0000 | **1.0000** | Perfect Generalization |
| **INAPPROPRIATE** | 7 | 7 | 4 | 0 | 0.6364 | 1.0000 | **0.7778** | False Positives on loanwords (پادکست, عکسی) |
| **SPAM** | 6 | 5 | 0 | 1 | 1.0000 | 0.8333 | **0.9091** | High Safety Precision |
| **OFF_TOPIC** | 4 | 1 | 25 | 3 | 0.0385 | 0.2500 | **0.0667** | Catch-all sink for unhandled SmallTalk/Need |
| **UNKNOWN** | 2 | 0 | 0 | 2 | 0.0000 | 0.0000 | **0.0000** | Ambiguous short turns misclassified as Question |

---

## 4. Stratified Slice Performance

| Slice Dimension | Slice Name | Total Cases | Correct | Accuracy | Key Observation |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Difficulty** | Easy | 118 | 84 | **71.19%** | Standard single-phrase matching works adequately |
| **Difficulty** | Medium | 72 | 39 | **54.17%** | Multi-clause and contextual disambiguation degrades |
| **Difficulty** | Hard | 10 | 3 | **30.00%** | Commercial traps & ambiguous short turns fail severely |
| **Context** | Standalone (Turn 1) | 32 | 26 | **81.25%** | High baseline pattern performance |
| **Context** | Contextual ($T \ge 2$) | 168 | 100 | **59.52%** | State/history conditioning lacks fuzzy semantic resolution |

---

## 5. Root Cause Taxonomy & Overfitting Analysis

### Root Cause 1: Substring Matching without Word Boundaries in Profanity Filter
* **Manifestation:** In `extractEntities`, the regex `/(کص|کس|جنده)/` matches any Persian token containing those two letters.
* **Failure Cases:**
  * `holdout_032`: *"پادکست چی گوش میدی تو تایم خالیت؟"* $\rightarrow$ Classified as `INAPPROPRIATE` (0.98) due to `پادکست` (podcast).
  * `holdout_037`: *"اینترنت همراه اول افتضاح شده هیچ عکسی تو تلگرام لود نمیشه"* $\rightarrow$ Classified as `INAPPROPRIATE` (0.98) due to `عکسی` (photo).
  * `holdout_054`: *"پروکسی تلگرام با پینگ پایین داری به منم بدی؟"* $\rightarrow$ Classified as `INAPPROPRIATE` (0.98) due to `پروکسی` (proxy).
* **Impact:** Critical safety false alarms on completely benign, high-value user turns.

### Root Cause 2: Missing Candidate Generator for PLAN_REQUEST
* **Manifestation:** In Step 5.2, `generateCandidates` did not implement an independent candidate builder for `Intent.PLAN_REQUEST`, causing 100% of plan queries (support=8) to be swallowed by `QUESTION`, `PRICE_REQUEST`, or `GOODBYE`.
* **Failure Cases:**
  * `holdout_101`: *"چه پلن‌هایی دارید؟ مثلاً سه ماهه یا شش ماهه هم هست؟"* $\rightarrow$ Predicted as `QUESTION`.
  * `holdout_102`: *"پلن نامحدود حجمی هم ارائه میدین یا فقط گیگابایتیه؟"* $\rightarrow$ Predicted as `GOODBYE` due to loose substring matching on *"باید/ماه"*.
* **Impact:** 0.000 F1 score on a core commercial intent.

### Root Cause 3: Hardcoded ASL/Fact Phrases in SMALL_TALK
* **Manifestation:** In `intentEngine.ts` (lines 308-314), `SMALL_TALK` relies on an enumerated list of exact phrases (`قورمه سبزی`, `مهندس معمارم`, `آلمان اقدام میکنم`) instead of generalized linguistic templates.
* **Failure Cases:**
  * `holdout_013`: *"من کارمند بانکم، تایم بیکاریم گیم میزنم"* $\rightarrow$ Predicted as `OFF_TOPIC`.
  * `holdout_015`: *"۲۵ یزد، رشته مکانیک خوندم"* $\rightarrow$ Predicted as `OFF_TOPIC` (only Tehran/Mashhad/Shiraz/Isfahan/Tabriz/Karaj/Ahvaz/Rasht/Hamedan were hardcoded).
  * `holdout_020`: *"شام پیتزا سفارش دادم منتظرم بیارن"* $\rightarrow$ Predicted as `OFF_TOPIC`.
* **Impact:** SMALL_TALK Recall plummeted to 7.69% (F1: 0.1333).

### Root Cause 4: Overly Broad GOODBYE Regex Collisions
* **Manifestation:** Regex matching `/(سر ماه.*پیام میدم|باید برم|برم)/` matched words containing `بدم` or `باید` in commercial messages.
* **Failure Cases:**
  * `holdout_089`: *"ماهی چقدر باید بابتش بدم؟"* $\rightarrow$ Predicted as `GOODBYE`.
  * `holdout_095`: *"چند هزار تومن باید واریز کنیم برای پلن یک ماهه؟"* $\rightarrow$ Predicted as `GOODBYE`.
* **Impact:** Commercial price inquiries prematurely treated as conversation exits.

### Root Cause 5: Commercial False Positive Traps
* **Manifestation:** Generic queries mentioning `قیمت` or `خرید` or `تست` outside of VPN context triggered commercial intents.
* **Failure Cases:**
  * `holdout_195`: *"قیمت روز طلا و سکه امامی امروز چنده در بازار؟"* $\rightarrow$ Predicted as `PRICE_REQUEST`.
  * `holdout_198`: *"تست رانندگی پایه دو قبول شدی بالاخره یا رد شدی؟"* $\rightarrow$ Predicted as `TRIAL_REQUEST`.
* **Impact:** Commercial False Positive Rate rose to 8.55%.

---

## 6. Actionable Blueprint for Step 5.3

1. **Word-Boundary & Affix Tokenizer for Safety:**
   Replace raw substring profanity regexes with isolated token boundary matching (`(^|\s)کص($|\s)`) and Persian negative lookaheads to eliminate false positives on `پادکست`, `پروکسی`, `عکسی`, `تاکسی`.
2. **Dedicated PLAN_REQUEST Generator & Priority Integration:**
   Implement dedicated candidate generator for `PLAN_REQUEST` capturing terms like `پلن`, `اشتراک ماهانه`, `ترافیک`, `کاربره`.
3. **Generalized Small Talk & Personal Fact Extraction:**
   Replace city-specific and hobby-specific hardcoded lists with generic patterns for occupation, age, education, food, and hobbies.
4. **Disambiguation between Commercial Inquiries and GOODBYE/QUESTION:**
   Refactor `GOODBYE` patterns to require explicit exit markers and disallow matches when strong price/payment tokens (`واریز`, `تومن`, `هزینه`, `چقدر`) are present.
5. **Context-Grounded Commercial Disambiguation:**
   Ensure commercial intents require active conversation context (VPN/product discussed or state $\ge$ NEED_DETECTED) when ambiguous keywords like `قیمت`, `تست`, `خرید` appear without product nouns.
