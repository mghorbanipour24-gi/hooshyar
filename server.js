// ============================================================
//  هوش‌یار — سرور پروکسی برای APIهای رایگان LLM
//  مبتنی بر فهرست: github.com/open-free-llm-api/awesome-freellm-apis
// ============================================================
const express = require('express');
const path = require('path');
const { Readable } = require('stream');

const app = express();
app.use(express.json({ limit: '12mb' })); // برای پشتیبانی از تصاویر base64
app.use(express.static(path.join(__dirname, 'public')));

// ---------- رجیستری سرویس‌ها (همه OpenAI-compatible) ----------
const PROVIDERS = {
  llm7: {
    id: 'llm7',
    name: 'LLM7 — شروع فوری',
    baseURL: 'https://api.llm7.io/v1',
    envKey: 'LLM7_API_KEY',
    keyUrl: 'https://token.llm7.io/',
    needsKey: false,
    defaultKey: 'unused',
    note: 'بدون نیاز به کلید و ثبت‌نام — همین الان کار می‌کند',
    models: ['DeepSeek-V4-Flash-0731', 'deepseek-v4-pro', 'GLM-5.3-Flash', 'glm-5.3', 'gpt-5.5', 'grok-4.5', 'kimi-k2.6', 'llama-4-maverick', 'mistral-large-3:675b'],
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    baseURL: 'https://api.groq.com/openai/v1',
    envKey: 'GROQ_API_KEY',
    keyUrl: 'https://console.groq.com/keys',
    needsKey: true,
    note: 'رایگان بدون کارت بانکی — فقط ثبت‌نام با ایمیل',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'openai/gpt-oss-120b'],
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    envKey: 'GEMINI_API_KEY',
    keyUrl: 'https://aistudio.google.com/app/apikey',
    needsKey: true,
    note: 'رایگان با حساب گوگل',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  },
  nvidia: {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    envKey: 'NVIDIA_API_KEY',
    keyUrl: 'https://build.nvidia.com/settings/api-keys',
    needsKey: true,
    note: 'بیشترین تعداد مدل رایگان — نیاز به تأیید شماره موبایل',
    models: ['meta/llama-3.3-70b-instruct', 'deepseek-ai/deepseek-v3.1-terminus', 'z-ai/glm-5.2'],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseURL: 'https://openrouter.ai/api/v1',
    envKey: 'OPENROUTER_API_KEY',
    keyUrl: 'https://openrouter.ai/keys',
    needsKey: true,
    note: 'مدل‌های :free رایگان‌اند',
    models: ['meta-llama/llama-3.3-70b-instruct:free', 'deepseek/deepseek-r1-0528:free', 'google/gemma-3-27b-it:free'],
  },
  cerebras: {
    id: 'cerebras',
    name: 'Cerebras',
    baseURL: 'https://api.cerebras.ai/v1',
    envKey: 'CEREBRAS_API_KEY',
    keyUrl: 'https://cloud.cerebras.ai/',
    needsKey: true,
    note: 'سریع‌ترین inference دنیا — رایگان بدون کارت',
    models: ['llama-3.3-70b', 'llama3.1-8b'],
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    baseURL: 'https://api.mistral.ai/v1',
    envKey: 'MISTRAL_API_KEY',
    keyUrl: 'https://console.mistral.ai/api-keys',
    needsKey: true,
    note: 'سرویس رایگان آزمایشی',
    models: ['mistral-small-latest', 'open-mistral-nemo'],
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    baseURL: 'https://router.huggingface.co/v1',
    envKey: 'HF_TOKEN',
    keyUrl: 'https://huggingface.co/settings/tokens',
    needsKey: true,
    note: 'رایگان با حساب هاگینگ‌فیس',
    models: ['meta-llama/Llama-3.3-70B-Instruct'],
  },
  sambanova: {
    id: 'sambanova',
    name: 'SambaNova',
    baseURL: 'https://api.sambanova.ai/v1',
    envKey: 'SAMBANOVA_API_KEY',
    keyUrl: 'https://cloud.sambanova.ai/apis',
    needsKey: true,
    note: 'رایگان با ثبت‌نام',
    models: ['Meta-Llama-3.3-70B-Instruct'],
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    baseURL: 'https://api.cohere.ai/compatibility/v1',
    envKey: 'COHERE_API_KEY',
    keyUrl: 'https://dashboard.cohere.com/api-keys',
    needsKey: true,
    note: 'کلید Trial رایگان',
    models: ['command-a-03-2025'],
  },
};

function resolveKey(p, clientKey) {
  return (clientKey && clientKey.trim()) || process.env[p.envKey] || p.defaultKey || null;
}

// ---------- لیست سرویس‌ها برای فرانت‌اند ----------
app.get('/api/providers', (req, res) => {
  const providers = Object.values(PROVIDERS).map((p) => ({
    id: p.id,
    name: p.name,
    needsKey: p.needsKey,
    keyUrl: p.keyUrl,
    note: p.note,
    models: p.models,
    hasServerKey: !!process.env[p.envKey],
  }));
  res.json({ providers });
});

// ---------- دریافت زندهٔ لیست مدل‌های یک سرویس ----------
app.get('/api/models', async (req, res) => {
  const p = PROVIDERS[req.query.provider];
  if (!p) return res.status(400).json({ error: 'سرویس نامعتبر است' });
  const key = resolveKey(p, req.headers['x-api-key']);
  if (p.needsKey && !key) return res.status(200).json({ models: p.models, fallback: true, reason: 'no_key' });
  try {
    const r = await fetch(p.baseURL + '/models', {
      headers: key ? { Authorization: `Bearer ${key}` } : {},
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    const ids = (data.data || []).map((m) => m.id || m.name).filter(Boolean);
    res.json({ models: ids.length ? ids : p.models, fallback: !ids.length });
  } catch (e) {
    res.json({ models: p.models, fallback: true });
  }
});

// ---------- پروکسی چت (با پشتیبانی استریم SSE) ----------
app.post('/api/chat', async (req, res) => {
  const { provider: pid, model, messages, stream = true } = req.body || {};
  const p = PROVIDERS[pid];
  if (!p) return res.status(400).json({ error: 'سرویس نامعتبر است' });
  if (!model || !Array.isArray(messages) || !messages.length)
    return res.status(400).json({ error: 'مدل یا پیام‌ها ارسال نشده است' });

  const key = resolveKey(p, req.headers['x-api-key']);
  if (p.needsKey && !key) {
    return res.status(400).json({
      error: `برای ${p.name} باید کلید API وارد کنی. از بخش «🔑 کلیدها» کلیدت را اضافه کن.`,
    });
  }

  try {
    const upstream = await fetch(p.baseURL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({ model, messages, stream: !!stream }),
      signal: AbortSignal.timeout(120000),
    });

    if (!upstream.ok) {
      const txt = await upstream.text();
      let msg = null;
      try { msg = JSON.parse(txt)?.error?.message; } catch {}
      return res.status(upstream.status).json({
        error: msg || `سرویس خطا داد (کد ${upstream.status})`,
        hint: upstream.status === 429
          ? 'به محدودیت نرخ رایگان رسیدی — چند ثانیه صبر کن یا سرویس/مدل دیگری انتخاب کن.'
          : upstream.status === 401
          ? 'کلید API معتبر نیست — از بخش کلیدها بررسیش کن.'
          : /vision|image/i.test(msg || '')
          ? 'این مدل تصویر قبول نمی‌کند — یک مدل بینایی‌دار انتخاب کن (مثل gemini از سرویس داخلی یا مدل‌های vision در لیست).'
          : upstream.status === 404 || /model/i.test(msg || '')
          ? 'این مدل الان در دسترس نیست — مدل دیگری از لیست انتخاب کن.'
          : /key|invalid|expired/i.test(msg || '')
          ? 'این مدل رایگان نیست یا به کلید اختصاصی نیاز دارد — مدل دیگری انتخاب کن.'
          : undefined,
      });
    }

    if (!stream) {
      const data = await upstream.json();
      return res.json(data);
    }

    // استریم: عبور مستقیم SSE از سرویس به مرورگر
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    if (res.flushHeaders) res.flushHeaders();

    const nodeStream = Readable.fromWeb(upstream.body);
    nodeStream.pipe(res);
    req.on('close', () => nodeStream.destroy());
  } catch (e) {
    if (!res.headersSent) {
      res.status(502).json({ error: 'خطا در اتصال به سرویس: ' + e.message });
    } else {
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ هوش‌یار روی پورت ${PORT} اجرا شد`);
  });
}

// برای Vercel Serverless Functions
module.exports = app;
