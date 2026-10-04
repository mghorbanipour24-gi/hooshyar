# هوش‌یار 🤖 — چت با APIهای رایگان هوش مصنوعی

وب‌اپلیکیشن فارسی و راست‌چین برای گفتگو با مدل‌های رایگان هوش مصنوعی، بر اساس فهرست
[awesome-freellm-apis](https://github.com/open-free-llm-api/awesome-freellm-apis).

## ✨ ویژگی‌ها

- ⚡ **بدون نیاز به کلید** — سرویس پیش‌فرض LLM7 بدون ثبت‌نام و کلید کار می‌کند (۶۸ مدل زنده!)
- 🔄 پاسخ‌دهی **استریم** (زنده، کلمه‌به‌کلمه) با دکمه توقف
- 📎 **ضمیمه فایل** — متن و کد (txt, md, py, js, csv و…) ، **PDF** (استخراج خودکار متن) و **تصویر** (با مدل‌های بینایی‌دار)
- ⚖️ **مقایسه هم‌زمان ۲ تا ۴ مدل** — پاسخ‌ها کنار هم با زمان و امکان «ادامه با این مدل»
- 💾 **خروجی فایل** — دانلود کل گفتگو یا هر پاسخ به‌صورت فایل Markdown + دکمه کپی
- 🧩 **۱۰ سرویس رایگان** قابل انتخاب: LLM7، Groq، Google Gemini، NVIDIA NIM، OpenRouter، Cerebras، Mistral، Hugging Face، SambaNova، Cohere
- 📋 لیست مدل‌ها به‌صورت **زنده** از خود سرویس خوانده می‌شود
- 🔑 کلیدهای API فقط در مرورگر خودت (localStorage) ذخیره می‌شوند
- 🎭 تنظیم «شخصیت مدل» (System Prompt) دلخواه
- 💾 ذخیره خودکار تاریخچه گفتگو، نمایش Markdown و کد با دکمه کپی
- 🖥️ حالت تاریک، کاملاً راست‌چین و فارسی

## 🚀 اجرا

```bash
npm install
npm start
```

بعد مرورگر را باز کن: `http://localhost:3000`

## 🔑 گرفتن کلیدهای رایگان (اختیاری)

جدول راهنما داخل خود برنامه (بخش «🔑 کلیدها») لینک مستقیم گرفتن کلید هر سرویس را دارد:

| سرویس | لینک کلید | نیاز به کارت؟ |
|---|---|---|
| LLM7 | بدون کلید کار می‌کند ❌ | نه |
| Groq | console.groq.com/keys | نه |
| Gemini | aistudio.google.com/app/apikey | نه |
| NVIDIA NIM | build.nvidia.com/settings/api-keys | تأیید موبایل |
| OpenRouter | openrouter.ai/keys | نه (مدل‌های :free) |
| Cerebras | cloud.cerebras.ai | نه |
| Mistral | console.mistral.ai/api-keys | نه |

## ⚙️ کلید روی سرور (اختیاری)

اگر نمی‌خواهی کلید را در مرورگر وارد کنی، می‌توانی قبل از اجرا ست کنی:

```bash
export GROQ_API_KEY="gsk_..."
export GEMINI_API_KEY="..."
export PORT=3000
npm start
```

## ☁️ دیپلوی رایگان روی سرور

### گزینه ۱ — Vercel (سرورلس، بدون نیاز به مدیریت سرور)
پروژه برای Vercel آماده است (`api/` + `vercel.json`). دو راه داری:

**الف) از طریق گیت‌هاب (بدون نصب چیزی):**
1. در https://github.com اکانت بساز و وارد شو → **New repository** → نام: `hooshyar` → Create
2. روی **uploading an existing file** کلیک کن و همه فایل‌های پروژه (داخل زیپ `hooshyar-deploy.zip`) را بکش رها کن → **Commit changes**
3. https://vercel.com → **Sign up → Continue with GitHub**
4. **Add New → Project** → مخزن `hooshyar` → **Import** → **Deploy** ✅
5. بعد از یک دقیقه آدرست آماده است: `https://hooshyar-xxxx.vercel.app`

**ب) با ترمینال (Vercel CLI):**
```bash
npm i -g vercel
cd free-llm-chat
vercel login     # با ایمیل
vercel --prod
```

> ⏱ پلن رایگان Vercel هر پاسخ را تا ۶۰ ثانیه نگه می‌دارد — برای پرسش‌های خیلی طولانی، جواب ممکن است قطع شود؛ در آن صورت سؤال را کوتاه‌تر کن.

### گزینه ۲ — Hugging Face Spaces (ساده‌ترین، بدون نیاز به گیت)
1. اکانت رایگان بساز: https://huggingface.co/join
2. https://huggingface.co/new-space → نام: `hooshyar` → SDK: **Docker** → Public → **Create Space**
3. تب **Files** → **Add file → Upload files** → این فایل‌ها را بکش و رها کن: `Dockerfile`، `server.js`، `package.json`، پوشه `public` (و README)
4. **Commit changes** → چند دقیقه صبر کن تا Build تمام شود
5. اپلیکیشنت روی آدرس `https://نام-اسپیس-تو.hf.space` بالا می‌آید 🎉

### گزینه ۳ — Render.com
1. کد را در یک مخزن گیت‌هاب بگذار (New repository → آپلود فایل‌ها)
2. https://dashboard.render.com → **New → Web Service** → مخزن را وصل کن
3. Render خودش `render.yaml` را تشخیص می‌دهد → **Create Web Service**
4. بعد از چند دقیقه آدرس `https://hooshyar-xxxx.onrender.com` را می‌گیرد

> 💤 نکته: پلن رایگان Render بعد از ۱۵ دقیقه بی‌استفاده، سرور را به خواب می‌برد و اولین بازدید بعدش چند ثانیه طول می‌کشد.

> ⚠️ امنیت: بهتر است کلید API را **داخل مرورگر خودت** (بخش 🔑 کلیدها) بگذاری نه روی سرور — اگر کلید را روی سرور بگذاری و آدرس عمومی باشد، دیگران از سهمیه رایگان تو استفاده می‌کنند. اگر هم خواستی، در Vercel از مسیر **Project → Settings → Environment Variables** می‌توانی `GROQ_API_KEY` و... را اضافه کنی.

## 🗂 ساختار

```
free-llm-chat/
├── server.js          # سرور Express + پروکسی SSE به سرویس‌ها
├── public/index.html  # رابط کاربری (فارسی، RTL، تکی‌فایلی)
└── package.json
```

> ⚠️ توجه: سرویس‌های رایگان محدودیت نرخ (Rate Limit) دارند؛ اگر خطای 429 گرفتی چند ثانیه صبر کن یا سرویس/مدل را عوض کن. همچنین داده‌هایت به سرویس‌دهنده مدل ارسال می‌شود، پس اطلاعات حساس وارد نکن.
