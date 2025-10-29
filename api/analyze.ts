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
                 prompt = `Based on the financial text, calculate key financial ratios (Leverage, Liquidity, Activity, Profitability). Adhere to the schema. --- ${pdfText} ---`;
                 schema = ratiosSchema;
                break;
            case 'vergiselAnaliz':
                 prompt = `Based on the financial text, identify at least 20 potential tax risks or compliance checks according to Turkish tax law. Adhere to the schema. --- ${pdfText} ---`;
                 schema = vergiselAnalizSchema;
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