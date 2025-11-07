import { AnalysisData, DetailedTaxReportItem, VergiselAnalizItem, MizanItem, BilancoData, GelirGiderItem, RasyoData, KurganAnaliz, NakitAkimData, KKEGItem, KurumlarVergisiHesaplama } from '../types';

// Generic helper to call our backend API endpoints
async function callApi<T>(endpoint: string, body: object): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText, error: '' }));
            // Backend returns { message, error }, let's combine them for a better client-side error.
            const detailedError = errorData.error ? `${errorData.message} - Detay: ${errorData.error}` : errorData.message;
            throw new Error(detailedError || `Sunucu hatası: ${response.status}`);
        }

        return await response.json() as T;

    } catch (error) {
        console.error(`API Error at '${endpoint}':`, error);
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir ağ hatası oluştu.';
        // Prepend the generic message to provide context to the user.
        throw new Error(`Analiz sunucusuna bağlanırken bir hata oluştu: ${errorMessage}`);
    }
}


export const performFullAnalysis = async (
    dataSourceText: string,
    onProgress: (message: string) => void,
    initialMizan?: MizanItem[]
): Promise<AnalysisData> => {
    
    onProgress("Kapsamlı finansal analiz yapılıyor...");

    // The backend now handles all analysis types in a single, efficient call to prevent rate-limiting.
    const analysisResults = await callApi<Omit<AnalysisData, 'dashboard' | 'gelirGiderAnalizi' | 'dataSourceText'>>(
        `/api/analyze`, 
        { dataSourceText } // The analysisType parameter is no longer needed.
    );
    
    onProgress("Analiz sonuçları birleştiriliyor...");

    let mizanData = analysisResults.mizan;

    // If mizan was pre-parsed from Excel, overwrite the AI-generated one to ensure 100% accuracy.
    if (initialMizan) {
        mizanData = initialMizan;
    }

    const bilancoData = analysisResults.bilanco as BilancoData;
    const gelirGiderData = analysisResults.gelirGider as GelirGiderItem[];
    
    // Assemble the final JSON object, including derived dashboard data.
    const finalAnalysisData: AnalysisData = {
        ...analysisResults,
        dataSourceText,
        mizan: mizanData,
        dashboard: {
            summary: {
                mizan: mizanData.length,
                bilanco: bilancoData.aktif.flatMap(b => b.stoklar).length + bilancoData.pasif.flatMap(b => b.stoklar).length,
                gelirGider: gelirGiderData.length,
                analizler: analysisResults.vergiselAnaliz.length,
                kkeg: analysisResults.kkegAnalizi.length,
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
        gelirGiderAnalizi: gelirGiderData.slice(0, 8).map(item => ({
            name: item.aciklama.toUpperCase(),
            'Cari Dönem': Math.abs(item.cariDonem),
            'Önceki Dönem': Math.abs(item.oncekiDonem),
        })),
    };

    onProgress("Analiz tamamlandı!");
    return finalAnalysisData;
};

export const generateDetailedTaxReport = async (
    items: VergiselAnalizItem[],
    dataSourceText: string
): Promise<DetailedTaxReportItem[]> => {
    const reportData = await callApi<DetailedTaxReportItem[]>('/api/generate-tax-report', { items, dataSourceText });
    return reportData;
};