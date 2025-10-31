import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { vatValuesSchema } from './_schemas.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { pdfText } = req.body;

        if (!pdfText || typeof pdfText !== 'string' || pdfText.trim().length < 100) {
            return res.status(400).json({ message: "Invalid or insufficient 'pdfText' provided." });
        }
        if (!process.env.API_KEY) {
            return res.status(500).json({ message: "API key is not configured on the server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `Provided is the text from a Turkish Corporate Tax Return PDF. Your task is to extract two specific values from the KDV Beyannamesi (VAT Declaration) section for the current period:
    1. The value for "Sonraki Döneme Devreden KDV".
    2. The value for "Toplam Hesaplanan KDV".

    Return ONLY a single, valid JSON object that strictly adheres to the provided schema. Do not include any explanations or markdown.
    ---
    ${pdfText}
    ---`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: vatValuesSchema,
                temperature: 0.0,
            },
        });

        const responseText = response.text?.trim();
        if (!responseText) {
            throw new Error("Received an empty response from the AI service when extracting VAT values.");
        }
        
        const result = JSON.parse(responseText);
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error extracting VAT values:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while extracting VAT values from the document.",
            error: errorMessage
        });
    }
}