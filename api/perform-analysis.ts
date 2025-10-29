import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analysisDataSchema } from './_schemas.js';
import type { AnalysisData } from '../types';

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

        const prompt = `
            You are a world-class expert financial analyst specializing in Turkish corporate tax law and accounting standards.
            Your task is to meticulously analyze the provided text, which is extracted from a Turkish Corporate Tax Return PDF document (Kurumlar Vergisi Beyannamesi), and generate a comprehensive financial analysis.
            The output MUST be a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting (like \`\`\`json) or explanatory text outside the JSON object.
            
            Perform the following analyses based on the text:
            1.  **Mizan (Trial Balance):** Extract trial balance data for the current and previous periods. Identify main and sub-account groups.
            2.  **Bilanço (Balance Sheet):** Structure the assets (Aktif) and liabilities (Pasif) into their respective sections.
            3.  **Gelir Gider (Income Statement):** Extract the income statement data.
            4.  **Rasyolar (Ratios):** Calculate key financial ratios (Leverage, Liquidity, Activity).
            5.  **Vergisel Analiz (Tax Analysis):** Based on the financial data, identify at least 20 potential tax risks or compliance checks. For each, determine if the company's situation is compliant ('Evet') or requires investigation ('Hayır'). Provide a concise explanation, a warning message if it's a risk, and cite relevant Turkish Tax Procedure Law (VUK) or Corporate Tax Law (KVK) articles.
            6.  **Kurgan Analizi (Fraud Risk Analysis):** Perform a risk assessment for fraudulent documents (Sahte Belge) based on the VDK KURGAN methodology. Provide a general risk level, a summary, and analysis of at least 4 key criteria.
            7.  **Nakit Akım (Cash Flow):** Generate a cash flow statement using the indirect method.

            Here is the text to analyze:
            ---
            ${pdfText}
            ---
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisDataSchema,
                temperature: 0.1,
            },
        });

        // The response text should already be a valid JSON string due to responseSchema
        const responseText = response.text.trim();
        const analysisResult: AnalysisData = JSON.parse(responseText);

        return res.status(200).json(analysisResult);

    } catch (error) {
        console.error('Error during analysis:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while communicating with the analysis service.",
            error: errorMessage
        });
    }
}
