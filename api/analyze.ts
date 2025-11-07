import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fullAnalysisSchema } from './_schemas.js';

// This handler now performs the full analysis in a single API call to avoid rate limiting.
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { dataSourceText } = req.body; // Removed analysisType

        if (!dataSourceText || typeof dataSourceText !== 'string' || dataSourceText.trim().length < 10) {
            return res.status(400).json({ message: "Invalid or insufficient 'dataSourceText' provided." });
        }
        
        if (!process.env.API_KEY) {
            return res.status(500).json({ message: "API key is not configured on the server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `You are an expert Turkish accountant and financial analyst. The following text is either from a Turkish Corporate Tax Return PDF or a JSON string of a trial balance (Mizan).
        Your task is to perform a complete and detailed financial analysis based on this data.
        You must generate a single, valid JSON object that contains all the required sections as defined in the provided schema.

        **CRITICAL INSTRUCTIONS for Bilanço (Balance Sheet) and Gelir Tablosu (Income Statement):**

        **1. Bilanço Classification:**
        You MUST structure the 'bilanco' object according to the following classification. Group accounts under the correct 'bolumAdi' and present the items ('stoklar') in the exact order specified. Calculate totals for each main and sub-group.

        *   **AKTİF (Assets):**
            *   **I- DÖNEN VARLIKLAR (Current Assets):**
                *   A- HAZIR DEĞERLER (Cash and Cash Equivalents)
                *   B- MENKUL KIYMETLER (Marketable Securities)
                *   C- TİCARİ ALACAKLAR (Trade Receivables)
                *   D- DİĞER ALACAKLAR (Other Receivables)
                *   E- STOKLAR (Inventories)
                *   F- YILLARA YAYGIN İNŞAAT VE ONARIM MALİYETLERİ (Construction in Progress)
                *   G- GELECEK AYLARA AİT GİDERLER VE GELİR TAHAKKUKLARI (Prepaid Expenses and Accrued Income)
                *   H- DİĞER DÖNEN VARLIKLAR (Other Current Assets)
            *   **II- DURAN VARLIKLAR (Non-current Assets):**
                *   A- TİCARİ ALACAKLAR (Trade Receivables)
                *   B- DİĞER ALACAKLAR (Other Receivables)
                *   C- MALİ DURAN VARLIKLAR (Financial Fixed Assets)
                *   D- MADDİ DURAN VARLIKLAR (Tangible Fixed Assets)
                *   E- MADDİ OLMAYAN DURAN VARLIKLAR (Intangible Fixed Assets)
                *   F- ÖZEL TÜKENMEYE TABİ VARLIKLAR (Assets Subject to Special Depletion)
                *   G- GELECEK YILLARA AİT GİDERLER VE GELİR TAHAKKUKLARI (Prepaid Expenses and Accrued Income)
                *   H- DİĞER DURAN VARLIKLAR (Other Non-current Assets)
        *   **PASİF (Liabilities and Equity):**
            *   **III- KISA VADELİ YABANCI KAYNAKLAR (Short-term Liabilities):**
                *   A- MALİ BORÇLAR (Financial Liabilities)
                *   B- TİCARİ BORÇLAR (Trade Payables)
                *   C- DİĞER BORÇLAR (Other Payables)
                *   D- ALINAN AVANSLAR (Advances Received)
                *   E- YILLARA YAYGIN İNŞAAT VE ONARIM HAKEDİŞLERİ (Construction Progress Payments)
                *   F- ÖDENECEK VERGİ VE DİĞER YÜKÜMLÜLÜKLER (Taxes and Other Liabilities Payable)
                *   G- BORÇ VE GİDER KARŞILIKLARI (Provisions for Liabilities and Charges)
                *   H- GELECEK AYLARA AİT GELİRLER VE GİDER TAHAKKUKLARI (Unearned Revenue and Accrued Expenses)
                *   I- DİĞER KISA VADELİ YABANCI KAYNAKLAR (Other Short-term Liabilities)
            *   **IV- UZUN VADELİ YABANCI KAYNAKLAR (Long-term Liabilities):**
                *   A- MALİ BORÇLAR (Financial Liabilities)
                *   B- TİCARİ BORÇLAR (Trade Payables)
                *   C- DİĞER BORÇLAR (Other Payables)
                *   D- ALINAN AVANSLAR (Advances Received)
                *   E- BORÇ VE GİDER KARŞILIKLARI (Provisions for Liabilities and Charges)
                *   F- GELECEK YILLARA AİT GELİRLER VE GİDER TAHAKKUKLARI (Unearned Revenue and Accrued Expenses)
                *   G- DİĞER UZUN VADELİ YABANCI KAYNAKLAR (Other Long-term Liabilities)
            *   **V- ÖZKAYNAKLAR (Equity):**
                *   A- ÖDENMİŞ SERMAYE (Paid-in Capital)
                *   B- SERMAYE YEDEKLERİ (Capital Reserves)
                *   C- KAR YEDEKLERİ (Profit Reserves)
                *   D- GEÇMİŞ YILLAR KARLARI (Retained Earnings)
                *   E- GEÇMİŞ YILLAR ZARARLARI (-) (Accumulated Losses)
                *   F- DÖNEM NET KARI (ZARARI) (Net Income/Loss for the Period)

        **2. Gelir Tablosu Classification:**
        You MUST structure the 'gelirGider' array items in the exact order specified below. The 'aciklama' field must match these descriptions. You must calculate the values for the summary lines (e.g., NET SATIŞLAR, BRÜT SATIŞ KARI).

        1.  A- BRÜT SATIŞLAR (Gross Sales)
        2.  B- SATIŞ İNDİRİMLERİ (-) (Sales Discounts)
        3.  C- NET SATIŞLAR (Net Sales)
        4.  D- SATIŞLARIN MALİYETİ (-) (Cost of Goods Sold)
        5.  BRÜT SATIŞ KARI VEYA ZARARI (Gross Profit or Loss)
        6.  E- FAALİYET GİDERLERİ (-) (Operating Expenses)
        7.  FAALİYET KARI VEYA ZARARI (Operating Profit or Loss)
        8.  F- DİĞER FAALİYETLERDEN OLAĞAN GELİR VE KARLAR (Other Operating Income and Profits)
        9.  G- DİĞER FAALİYETLERDEN OLAĞAN GİDER VE ZARARLAR (-) (Other Operating Expenses and Losses)
        10. H- FİNANSMAN GİDERLERİ (-) (Financing Expenses)
        11. OLAĞAN KAR VEYA ZARAR (Profit or Loss from Ordinary Activities)
        12. I- OLAĞANDIŞI GELİR VE KARLAR (Extraordinary Income and Profits)
        13. J- OLAĞANDIŞI GİDER VE ZARARLAR (-) (Extraordinary Expenses and Losses)
        14. DÖNEM KARI VEYA ZARARI (Income or Loss for the Period)
        15. K- DÖNEM KARI VERGİ VE DİĞER YASAL YÜKÜMLÜLÜK KARŞILIKLARI (-) (Provision for Taxes and Other Legal Liabilities)
        16. DÖNEM NET KARI VEYA ZARARI (Net Income or Loss for the Period)

        ---

        **General Instructions:**
        - If the source is PDF text, extract and generate all sections using the classifications above.
        - If the source is a Mizan JSON string, use that data to generate all other sections, adhering strictly to the classifications. The 'mizan' in your output should reflect the input Mizan.
        - For any financial values, ensure they are numbers, not strings.
        - For comparative fields like 'oncekiDonem' (previous period), if the source data only contains a single period, set 'oncekiDonem' values to 0.
        - The output MUST be a single, valid JSON object that strictly adheres to the schema. Do not include any markdown formatting, comments, or other text outside of the JSON object.

        --- DATA ---
        ${dataSourceText}
        --- END DATA ---`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: fullAnalysisSchema,
                temperature: 0.1,
            },
        });

        const responseText = response.text?.trim();
        if (!responseText) {
            throw new Error("Received an empty response from the AI service for the full analysis.");
        }
        
        const result = JSON.parse(responseText);
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error during full analysis:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while communicating with the analysis service.",
            error: errorMessage
        });
    }
}