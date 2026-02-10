
# 農易訂 AI 智慧叫貨系統 (Agri-Order AI)

這是一個專為 LINE OA 設計的 AI 智慧叫貨系統前端示範頁面。

## 功能特點
- **AI 對話式叫貨**：使用 Gemini API 解析自然語言意圖。
- **異常偵測**：自動計算訂單變動率並提醒。
- **身分綁定**：模擬 LIFF 的身分驗證流程。
- **權限查價**：基於角色的價格查詢功能。

## 部署說明 (Netlify)

1. 將此專案推播至 GitHub。
2. 在 Netlify 連結專案。
3. **設定環境變數**：
   - 進入 `Site Settings` > `Build & deploy` > `Environment variables`。
   - 新增 `API_KEY`：您的 Google Gemini API Key。

## 技術棧
- React (ESM via esm.sh)
- Tailwind CSS
- Google Gemini API
- Recharts (數據視覺化)
