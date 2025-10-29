import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { detailedTaxReportSchema } from './_schemas.js';
import type { DetailedTaxReportItem, VergiselAnalizItem } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { items, pdfText } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "A valid array of 'items' must be provided." });
        }
        if (!pdfText || typeof pdfText !== 'string' || pdfText.trim().length < 100) {
            return res.status(400).json({ message: "Invalid or insufficient 'pdfText' provided." });
        }
        if (!process.env.API_KEY) {
            return res.status(500).json({ message: "API key is not configured on the server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `
            You are a senior tax consultant and auditor with deep expertise in Turkish tax legislation (VUK, KVK, etc.).
            Your task is to generate a detailed tax risk report based on a list of pre-identified potential risks and the full text of a financial document.
            For each item in the provided list, you must conduct a thorough analysis and provide:
            1.  **Risk Analysis (riskAnalizi):** A detailed explanation of the risk, its implications, and why it's relevant based on the document's context.
            2.  **Relevant Legislation (mevzuatReferanslari):** A list of specific articles from Turkish tax laws (e.g., "VUK Madde 281", "KVK Madde 12").
            3.  **Actionable Steps (yapilmasiGerekenler):** A clear, bullet-pointed list of actions the company should take to mitigate the risk.
            4.  **Potential Penalties (potansiyelVergiCezalari):** A concise description of potential tax fines or penalties if the risk materializes.

            The output MUST be a JSON array of objects, strictly adhering to the provided schema. Do not include any markdown formatting or explanatory text outside the JSON array.

            **List of Risks to Analyze:**
            ---
            ${JSON.stringify(items, null, 2)}
            ---

            **Full Document Context:**
            ---
            ${pdfText}
            ---
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: detailedTaxReportSchema,
                temperature: 0.2,
            },
        });
        
        const responseText = response.text.trim();
        const reportResult: DetailedTaxReportItem[] = JSON.parse(responseText);

        return res.status(200).json(reportResult);

    } catch (error) {
        console.error('Error generating detailed tax report:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while generating the report.",
            error: errorMessage 
        });
    }
}
