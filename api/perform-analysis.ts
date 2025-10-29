import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
    mizanSchema,
    bilancoSchema,
    gelirGiderSchema,
    ratiosSchema, 
    vergiselAnalizSchema, 
    kurganAnalizSchema, 
    nakitAkimSchema 
} from './_schemas.js';
import type { AnalysisData, MizanItem, BilancoData, GelirGiderItem, RasyoData, VergiselAnalizItem, KurganAnaliz, NakitAkimData } from '../types';

// Helper function to make individual requests to the Gemini API
const generateJson = async <T>(ai: GoogleGenAI, prompt: string, schema: object): Promise<T> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.1,
        },
    });
    const responseText = response.text.trim();
    return JSON.parse(responseText) as T;
};


export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { pdfText } = req.body;

        if (!pdfText || typeof pdfText !== 'string' || pdfText.trim().length < 100) {
            return res.status(400).json({ message: "Invalid or insufficient 'pdfText' provided in the request body." });
        }
        
        if (!process.env.API_KEY) {
            return res.status(500).json({ message: "API key is not configured on the server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // --- Step 1: Run ALL analyses in PARALLEL ---
        const mizanPrompt = `Analyze the provided text from a Turkish Corporate Tax Return PDF. Extract the Mizan (Trial Balance) for current and previous periods. Identify main (isMain: true) and sub-account (isSub: true) groups. The output MUST be a single, valid JSON object that strictly adheres to the provided schema. --- ${pdfText} ---`;
        const bilancoPrompt = `Analyze the provided text from a Turkish Corporate Tax Return PDF. Extract the Bilanço (Balance Sheet). Structure assets (Aktif) and liabilities (Pasif) into their respective sections and stock items. The output MUST be a single, valid JSON object that strictly adheres to the provided schema. --- ${pdfText} ---`;
        const gelirGiderPrompt = `Analyze the provided text from a Turkish Corporate Tax Return PDF. Extract the Gelir Tablosu (Income Statement) data. The output MUST be a single, valid JSON array of objects that strictly adheres to the provided schema. --- ${pdfText} ---`;
        const ratiosPrompt = `Based on the financial text, calculate key financial ratios (Leverage, Liquidity, Activity, Profitability). Adhere to the schema. --- ${pdfText} ---`;
        const vergiselAnalizPrompt = `Based on the financial text, identify at least 20 potential tax risks or compliance checks according to Turkish tax law. Adhere to the schema. --- ${pdfText} ---`;
        const kurganAnalizPrompt = `Based on the financial text, perform a fraud risk assessment for fraudulent documents (Sahte Belge) using the VDK KURGAN methodology. Adhere to the schema. --- ${pdfText} ---`;
        const nakitAkimPrompt = `Based on the financial text, generate a cash flow statement using the indirect method. Adhere to the schema. --- ${pdfText} ---`;
        
        const [
            mizanData,
            bilancoData,
            gelirGiderData,
            ratiosData,
            vergiselAnalizData,
            kurganAnalizData,
            nakitAkimData
        ] = await Promise.all([
            generateJson<MizanItem[]>(ai, mizanPrompt, mizanSchema),
            generateJson<BilancoData>(ai, bilancoPrompt, bilancoSchema),
            generateJson<GelirGiderItem[]>(ai, gelirGiderPrompt, gelirGiderSchema),
            generateJson<RasyoData>(ai, ratiosPrompt, ratiosSchema),
            generateJson<VergiselAnalizItem[]>(ai, vergiselAnalizPrompt, vergiselAnalizSchema),
            generateJson<KurganAnaliz>(ai, kurganAnalizPrompt, kurganAnalizSchema),
            generateJson<NakitAkimData>(ai, nakitAkimPrompt, nakitAkimSchema),
        ]);


        // --- Step 2: Assemble the final JSON object ---
        const finalAnalysisData: AnalysisData = {
            dashboard: {
                summary: {
                    mizan: mizanData.length,
                    bilanco: bilancoData.aktif.flatMap(b => b.stoklar).length + bilancoData.pasif.flatMap(b => b.stoklar).length,
                    gelirGider: gelirGiderData.length,
                    analizler: vergiselAnalizData.length,
                },
                 aktifYapi: [
                    { name: 'Dönen Varlıklar', value: bilancoData.aktif.find(b => b.bolumAdi.includes("Dönen"))?.stoklar.reduce((sum, s) => sum + s.cariDonem, 0) || 0 },
                    { name: 'Duran Varlıklar', value: bilancoData.aktif.find(b => b.bolumAdi.includes("Duran"))?.stoklar.reduce((sum, s) => sum + s.cariDonem, 0) || 0 },
                ],
                pasifYapi: [
                    { name: 'Kısa Vadeli Yabancı Kaynaklar', value: bilancoData.pasif.find(b => b.bolumAdi.includes("Kısa"))?.stoklar.reduce((sum, s) => sum + s.cariDonem, 0) || 0 },
                    { name: 'Uzun Vadeli Yabancı Kaynaklar', value: bilancoData.pasif.find(b => b.bolumAdi.includes("Uzun"))?.stoklar.reduce((sum, s) => sum + s.cariDonem, 0) || 0 },
                    { name: 'Özkaynaklar', value: bilancoData.pasif.find(b => b.bolumAdi.includes("Özkaynaklar"))?.stoklar.reduce((sum, s) => sum + s.cariDonem, 0) || 0 },
                ],
            },
            mizan: mizanData,
            bilanco: bilancoData,
            gelirGider: gelirGiderData,
            rasyolar: ratiosData,
            vergiselAnaliz: vergiselAnalizData,
            // Simple extraction for chart from GelirGider
            gelirGiderAnalizi: gelirGiderData.slice(0, 8).map(item => ({
                name: item.aciklama.toUpperCase(),
                'Cari Dönem': Math.abs(item.cariDonem),
                'Önceki Dönem': Math.abs(item.oncekiDonem)
            })),
            kurganAnalizi: kurganAnalizData,
            nakitAkim: nakitAkimData
        };

        return res.status(200).json(finalAnalysisData);

    } catch (error) {
        console.error('Error during analysis:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while communicating with the analysis service.",
            error: errorMessage
        });
    }
}