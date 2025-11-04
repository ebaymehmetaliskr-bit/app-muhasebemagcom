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
    kkegAnalizSchema,
    kurumlarVergisiSchema
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
        const { dataSourceText, analysisType } = req.body;

        if (!dataSourceText || typeof dataSourceText !== 'string' || dataSourceText.trim().length < 10) {
            return res.status(400).json({ message: "Invalid or insufficient 'dataSourceText' provided." });
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

        // Base instruction for all prompts
        const baseInstruction = `You are an expert Turkish accountant and financial analyst. The following data is either unstructured text from a tax document or a JSON string from a trial balance (Mizan). Your task is to analyze it and generate a valid JSON output based on the specific analysis type requested.`;

        switch (analysisType) {
            case 'mizan':
                prompt = `${baseInstruction}
                Analysis Type: Mizan (Trial Balance)
                Task: Analyze the provided data, which may be unstructured text or a JSON array from an Excel file. Extract the Trial Balance for both the previous period ('oncekiDonem') and current period ('cariDonem'). Identify main account groups (isMain: true) and sub-groups (isSub: true). If the source data only contains a single period or a cumulative balance ('Kümüle Bakiye' or similar), map this value to 'cariDonem' and set 'oncekiDonem' to 0. The output MUST be a valid JSON array of objects strictly adhering to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = mizanSchema;
                break;
            case 'bilanco':
                prompt = `${baseInstruction}
                Analysis Type: Bilanço (Balance Sheet)
                Task: Using the provided financial data, construct a Balance Sheet for both 'oncekiDonem' and 'cariDonem'. Structure assets (Aktif) and liabilities/equity (Pasif) into their respective sections and items. If only one period is available, use it for 'cariDonem' and set 'oncekiDonem' to 0. The output MUST be a single, valid JSON object strictly adhering to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = bilancoSchema;
                break;
            case 'gelirGider':
                prompt = `${baseInstruction}
                Analysis Type: Gelir Tablosu (Income Statement)
                Task: Using the provided financial data, construct an Income Statement for both 'oncekiDonem' and 'cariDonem'. If only one period is available, use it for 'cariDonem' and set 'oncekiDonem' to 0. The output MUST be a valid JSON array of objects strictly adhering to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = gelirGiderSchema;
                break;
            case 'rasyolar':
                 prompt = `${baseInstruction}
                 Analysis Type: Financial Ratios
                 Task: Perform a comprehensive ratio analysis. Calculate ratios for both 'oncekiDonem' and 'cariDonem'. If only one period's data is available, calculate for 'cariDonem' and set 'oncekiDonem' to 0. Group ratios into 'finansalYapi', 'likidite', 'devirHizlari', and 'karlilik'. For each ratio, provide 'name', 'oncekiDonem' value, 'cariDonem' value, 'formula', and a brief 'yorum' (interpretation). For each group, provide a 2-3 sentence 'ozet' (summary). The output must be a single, valid JSON object strictly adhering to the schema.
                 --- DATA ---
                 ${dataSourceText}
                 --- END DATA ---`;
                 schema = ratiosSchema;
                break;
            case 'vergiselAnaliz':
                 prompt = `${baseInstruction}
                 Analysis Type: Tax Risk Analysis
                 Task: Based on the financial data, identify at least 20 potential tax risks or compliance checks according to Turkish tax law. For each, determine its 'durum' ('Evet' for compliant, 'Hayır' for risk). The output must be a valid JSON array strictly adhering to the schema.
                 --- DATA ---
                 ${dataSourceText}
                 --- END DATA ---`;
                 schema = vergiselAnalizSchema;
                break;
            case 'kkeg':
                prompt = `${baseInstruction}
                Analysis Type: KKEG (Non-Deductible Expenses)
                Task: Identify all "Kanunen Kabul Edilmeyen Giderler" (KKEG) from the current period data. For each, provide a description, amount ('tutar'), justification, legal basis, and associated account codes. The output must be a valid JSON array adhering strictly to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = kkegAnalizSchema;
                break;
            case 'kurganAnalizi':
                prompt = `${baseInstruction}
                Analysis Type: Kurgan (Fraudulent Document Risk)
                Task: Perform a fraud risk assessment for fraudulent documents (Sahte Belge) using the VDK KURGAN methodology based on the current period data. Provide an overall risk level, summary, criteria-based analysis, and action recommendations. The output must be a valid JSON object adhering strictly to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = kurganAnalizSchema;
                break;
            case 'nakitAkim':
                prompt = `${baseInstruction}
                Analysis Type: Nakit Akım (Cash Flow Statement)
                Task: Generate a cash flow statement using the indirect method, based on the changes between the two available periods. The output must be a valid JSON object adhering strictly to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = nakitAkimSchema;
                break;
             case 'kurumlarVergisi':
                prompt = `${baseInstruction}
                Analysis Type: Kurumlar Vergisi Hesaplaması (Corporate Tax Calculation)
                Task: Based on the provided financial data (likely a trial balance for the current period), calculate the corporate tax. Follow the standard Turkish tax calculation format: start with 'ticariKar', add 'kkegToplam' and other additions, subtract deductions and exemptions to find 'vergiMatrahi', apply the 'vergiOrani' (use 25% if not specified) to get 'hesaplananKurumlarVergisi', and finally determine 'odenmesiGerekenKV'. The output MUST be a single, valid JSON object adhering strictly to the schema.
                --- DATA ---
                ${dataSourceText}
                --- END DATA ---`;
                schema = kurumlarVergisiSchema;
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
