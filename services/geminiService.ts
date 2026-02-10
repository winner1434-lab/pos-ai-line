
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants.tsx";

export async function processUserMessage(message: string, userRole: string) {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return {
      intent: '系統提示',
      reply: '抱歉，系統尚未設定 API 金鑰，請先在 Netlify 的環境變數中設定 API_KEY。',
      extractedOrder: []
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: `你是「農易訂」智慧叫貨系統的 AI 助理。
      當前用戶權限：${userRole}。
      
      你的任務：
      1. 判斷用戶意圖：叫貨、詢價、報表、閒聊、客訴。
      2. 如果用戶想叫貨，請從以下產品清單中匹配：${JSON.stringify(MOCK_PRODUCTS)}。
      3. 叫貨必須包含：品項、數量。如果規格不明（例如多種規格），請反問確認。
      4. 如果用戶詢價，且權限不是 ADMIN，請委婉拒絕。
      5. 回應必須簡短、親切，符合台灣市場口吻（例如：老闆、您好）。
      
      請以 JSON 格式回覆，包含：
      - intent: string
      - reply: string (給用戶的回覆)
      - extractedOrder: Array<{ name: string, quantity: number, spec?: string }> (選填)
      `,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          intent: { type: Type.STRING },
          reply: { type: Type.STRING },
          extractedOrder: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                spec: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
