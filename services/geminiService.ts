import { AnalysisData, DetailedTaxReportItem, VergiselAnalizItem } from '../types';

// Helper function to call our new backend proxy
async function callApiProxy<T>(endpoint: string, body: object): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Sunucu hatası: ${response.status}`);
        }

        return await response.json() as T;

    } catch (error) {
        console.error(`API Proxy Error at '${endpoint}':`, error);
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir ağ hatası oluştu.';
        throw new Error(`Analiz sunucusuna bağlanırken bir hata oluştu: ${errorMessage}`);
    }
}


export const performFullAnalysis = async (
    pdfText: string, 
    onProgress: (message: string) => void
): Promise<AnalysisData> => {
    onProgress("Analiz verileri güvenli sunucuya gönderiliyor...");
    
    // The complex logic of prompts and multi-step calls is now on the backend.
    // The frontend just sends the raw text and gets the final structured data.
    const analysisData = await callApiProxy<AnalysisData>('/api/perform-analysis', { pdfText });
    
    onProgress("Analiz tamamlanıyor...");

    // The backend now provides the full analysis data, including the text.
    return { ...analysisData, pdfText };
};

export const generateDetailedTaxReport = async (
    items: VergiselAnalizItem[],
    pdfText: string
): Promise<DetailedTaxReportItem[]> => {
    
    // This call is also proxied to our secure backend.
    const reportData = await callApiProxy<DetailedTaxReportItem[]>('/api/generate-tax-report', { items, pdfText });

    return reportData;
};
