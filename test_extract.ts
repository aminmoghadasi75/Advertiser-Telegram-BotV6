import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

function extractText(response: any): string {
  if (response.text) return response.text.trim();
  const parts = response.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const textPart = parts.map((p: any) => p.text || '').join('').trim();
    if (textPart) return textPart;
  }
  return '';
}

async function test() {
  const models = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-flash-latest"];
  for (const m of models) {
    const t0 = Date.now();
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: "من نپرسیدم چطوری :) فقط سلام کردم",
        config: {
          systemInstruction: "شما در نقش ملودی در تلگرام هستید. به پیام کاربر به صورت خودمانی و در ۱ جمله جواب دهید.",
          maxOutputTokens: 150,
          temperature: 0.7
        }
      });
      const txt = extractText(res);
      console.log(`[${m}] in ${Date.now()-t0}ms -> "${txt}"`);
    } catch(e: any) {
      console.log(`[${m}] error:`, e.message);
    }
  }
}
test();
