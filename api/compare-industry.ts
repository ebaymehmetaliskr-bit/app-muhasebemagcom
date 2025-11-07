import { GoogleGenAI } from '@google/genai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { industryComparisonSchema } from './_schemas.js';
import type { RasyoData } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { ratios }: { ratios: RasyoData } = req.body;

        if (!ratios) {
            return res.status(400).json({ message: "Financial ratios ('ratios') must be provided." });
        }
        if (!process.env.API_KEY) {
            return res.status(500).json({ message: "API key is not configured on the server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const simplifiedRatios = {
            karlilik: ratios.karlilik.ratios.map(r => ({ name: r.name, value: r.cariDonem })),
            likidite: ratios.likidite.ratios.map(r => ({ name: r.name, value: r.cariDonem })),
            finansalYapi: ratios.finansalYapi.ratios.map(r => ({ name: r.name, value: r.cariDonem })),
            devirHizlari: ratios.devirHizlari.ratios.map(r => ({ name: r.name, value: r.cariDonem })),
        };

        const prompt = `
            You are a senior financial analyst specializing in the Turkish market.
            Based on the provided financial ratios for a company, your task is to perform an industry comparison analysis.

            1.  **Identify Industry (industryName):** Based on the ratios, infer the most likely industry for this company in Turkey (e.g., 'Üretim' (Manufacturing), 'Perakende Ticaret' (Retail), 'Teknoloji', 'İnşaat' (Construction), 'Hizmet' (Services)).
            2.  **Generate Averages (ratios):** For each ratio provided, generate a realistic industry average for the industry you identified. The 'companyValue' should be the value from the input.
            3.  **Interpret (interpretation):** For each ratio, write a concise interpretation of how the company's value compares to the industry average (e.g., "Şirketin kârlılığı sektör ortalamasının üzerinde, bu da güçlü fiyatlandırma ve maliyet kontrolüne işaret ediyor." or "Düşük likidite oranı, kısa vadeli yükümlülükleri karşılama konusunda potansiyel bir riske işaret ediyor.").
            4.  **Summarize (summary):** Write a comprehensive summary of the company's overall financial health compared to its peers. Highlight its key strengths and weaknesses based on this comparative analysis.

            The output MUST be a single, valid JSON object that strictly adheres to the provided schema. Do not include any markdown formatting or explanatory text outside the JSON object.

            **Company's Financial Ratios:**
            ---
            ${JSON.stringify(simplifiedRatios, null, 2)}
            ---
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: industryComparisonSchema,
                temperature: 0.4,
            },
        });
        
        const responseText = response.text?.trim();
        if (!responseText) {
            throw new Error("Received an empty response from the AI service for industry comparison.");
        }
        const comparisonResult = JSON.parse(responseText);

        return res.status(200).json(comparisonResult);

    } catch (error) {
        console.error('Error generating industry comparison:', error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ 
            message: "An error occurred while generating the industry comparison report.",
            error: errorMessage 
        });
    }
}