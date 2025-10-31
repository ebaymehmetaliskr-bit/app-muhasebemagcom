import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
    mizanSchema,
    bilancoSchema,
    gelirGiderSchema,
    ratiosSchema, 
    vergiselAnalizSchema, 
    kurganAnalizSchema, 
    nakitAkimSchema,
    kkegAnalizSchema
} from './_schemas.js';

// Helper function to make individual requests to the Gemini API
const generateJson = async (ai: GoogleGenAI, prompt: string, schema: object) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.1,
        },
    });
    const responseText = response.text?.trim();
    if (!responseText) {
        throw new Error("Received an empty response from the AI service for this part of the analysis.");
    }
    return JSON.parse(responseText);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { pdfText, analysisType } = req.body;

        if (!pdfText || typeof pdfText !== 'string' || pdfText.trim().length < 100) {
            return res.status(400).json({ message: "Invalid or insufficient 'pdfText' provided." });
        }
        if (!analysisType || typeof analysisType !== 'string') {
            return res.status(400).json({ message: "An 'analysisType' must be provided." });
        }
        
        if (!process.env.API_KEY) {
            return res.status(500).json({ message: "API key is not configured on the server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let prompt;
        let schema;

        switch (analysisType) {
            case 'mizan':
                prompt = `Analyze the provided text from a Turkish Corporate Tax Return PDF. Extract the Mizan (Trial Balance) for current and previous periods. Identify main (isMain: true) and sub-account (isSub: true) groups. The output MUST be a single, valid JSON object that strictly adheres to the provided schema. --- ${pdfText} ---`;
                schema = mizanSchema;
                break;
            case 'bilanco':
                prompt = `Analyze the provided text from a Turkish Corporate Tax Return PDF. Extract the Bilanço (Balance Sheet). Structure assets (Aktif) and liabilities (Pasif) into their respective sections and stock items. The output MUST be a single, valid JSON object that strictly adheres to the provided schema. --- ${pdfText} ---`;
                schema = bilancoSchema;
                break;
            case 'gelirGider':
                prompt = `Analyze the provided text from a Turkish Corporate Tax Return PDF. Extract the Gelir Tablosu (Income Statement) data. The output MUST be a single, valid JSON array of objects that strictly adheres to the provided schema. --- ${pdfText} ---`;
                schema = gelirGiderSchema;
                break;
            case 'rasyolar':
                 prompt = `Provided is the text from a Turkish Corporate Tax Return PDF. Your task is to perform a comprehensive ratio analysis. Calculate the following financial ratios for both the current ('cariDonem') and previous ('oncekiDonem') periods. Group them into four categories: 'finansalYapi', 'likidite', 'devirHizlari', and 'karlilik'.

For each ratio, you MUST provide:
1.  'name': The Turkish name of the ratio.
2.  'cariDonem': The calculated value for the current period.
3.  'oncekiDonem': The calculated value for the previous period.
4.  'formula': The mathematical formula used for the calculation in Turkish.
5.  'yorum': A brief, insightful interpretation of the ratio's value and trend, including generally accepted standards where applicable (e.g., "Cari Oran için 1.5-2.0 arası ideal kabul edilir.").

For each of the four groups, you MUST also provide an 'ozet':
- 'ozet': A concise, 2-3 sentence summary of the company's situation based on the ratios in that specific group. For example, for 'finansalYapi', summarize the overall debt structure and financial risk.

**Ratio List:**
- **likidite:** Cari Oran, Asit-Test Oranı, Nakit Oranı.
- **finansalYapi:** Kaldıraç Oranı, Öz Kaynak Oranı, Borç / Öz Kaynak Oranı, Duran Varlıkların Devamlı Sermayeye Oranı, Kısa Vadeli Yabancı Kaynak Oranı, Uzun Vadeli Yabancı Kaynak Oranı, Duran Varlıkların Özkaynaklara Oranı.
- **devirHizlari:** Stok Devir Hızı, Stokta Kalma Süresi (Gün), Alacak Devir Hızı, Ortalama Tahsil Süresi (Gün), Aktif Devir Hızı.
- **karlilik:** Brüt Kâr Marjı, Net Kâr Marjı, Öz Kaynak Kârlılığı (ROE), Varlıkların Kârlılığı (ROA).

The output MUST be a single, valid JSON object that strictly adheres to the provided schema. Do not include any explanations outside the JSON.
---
${pdfText}
---`;
                 schema = ratiosSchema;
                break;
            case 'vergiselAnaliz':
                 prompt = `Based on the financial text, identify at least 20 potential tax risks or compliance checks according to Turkish tax law. Adhere to the schema. --- ${pdfText} ---`;
                 schema = vergiselAnalizSchema;
                break;
            case 'kkeg':
                prompt = `Analyze the provided financial text from a Turkish Corporate Tax Return. Identify and extract all items that are considered "Kanunen Kabul Edilmeyen Giderler" (KKEG) - Non-Deductible Expenses. This includes items like tax penalties, undocumented expenses, excess depreciation, motor vehicle tax for passenger cars, etc. For each item, provide a detailed description, the amount, a justification, the relevant legal basis (e.g., KVK Madde 11/1-d), and the associated account codes. The output must be a valid JSON array adhering strictly to the provided schema. --- ${pdfText} ---`;
                schema = kkegAnalizSchema;
                break;
            case 'kurganAnalizi':
                prompt = `Based on the financial text, perform a fraud risk assessment for fraudulent documents (Sahte Belge) using the VDK KURGAN methodology. Adhere to the schema. --- ${pdfText} ---`;
                schema = kurganAnalizSchema;
                break;
            case 'nakitAkim':
                prompt = `Based on the financial text, generate a cash flow statement using the indirect method. Adhere to the schema. --- ${pdfText} ---`;
                schema = nakitAkimSchema;
                break;
            default:
                return res.status(400).json({ message: "Invalid 'analysisType' provided." });
        }

        const result = await generateJson(ai, prompt, schema);
        return res.status(200).json(result);

    } catch (error) {
        console.error(`Error during analysis type: ${req.body.analysisType}`, error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while communicating with the analysis service.",
            error: errorMessage
        });
    }
}