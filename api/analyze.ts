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
        You must generate a single, valid JSON object that contains all the required sections as defined in the provided schema. The sections are: mizan, bilanco, gelirGider, rasyolar, vergiselAnaliz, kkegAnalizi, kurganAnalizi, nakitAkim, and kurumlarVergisi.
        - If the source is PDF text, extract and generate all sections.
        - If the source is a Mizan JSON string, use that data to generate all other sections. The 'mizan' in your output should reflect the input Mizan.
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