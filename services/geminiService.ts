import { AnalysisData, DetailedTaxReportItem, VergiselAnalizItem, MizanItem, BilancoData, GelirGiderItem, RasyoData, KurganAnaliz, NakitAkimData, KKEGItem } from '../types';

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
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Sunucu hatası: ${response.status} - Endpoint: ${endpoint}`);
        }

        return await response.json() as T;

    } catch (error) {
        console.error(`API Error at '${endpoint}':`, error);
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir ağ hatası oluştu.';
        throw new Error(`Analiz sunucusuna bağlanırken bir hata oluştu: ${errorMessage}`);
    }
}


// This is the new orchestrator function
export const performFullAnalysis = async (
    pdfText: string,
    onProgress: (message: string) => void
): Promise<AnalysisData> => {
    
    const analysisSteps = [
        { type: 'mizan', message: 'Mizan verileri analiz ediliyor...' },
        { type: 'bilanco', message: 'Bilanço oluşturuluyor...' },
        { type: 'gelirGider', message: 'Gelir-Gider tablosu çıkarılıyor...' },
        { type: 'rasyolar', message: 'Finansal rasyolar hesaplanıyor...' },
        { type: 'vergiselAnaliz', message: 'Vergisel riskler taranıyor...' },
        { type: 'kkeg', message: 'Kanunen Kabul Edilmeyen Giderler (KKEG) taranıyor...' },
        { type: 'kurganAnalizi', message: 'Sahte belge (Kurgan) risk analizi yapılıyor...' },
        { type: 'nakitAkim', message: 'Nakit akım tablosu hazırlanıyor...' },
    ];
    
    const results: any = {};

    for (const step of analysisSteps) {
        onProgress(step.message);
        results[step.type] = await callApi(`/api/analyze`, { pdfText, analysisType: step.type });
    }

    onProgress("Raporlar birleştiriliyor...");

    const mizanData = results.mizan as MizanItem[];
    const bilancoData = results.bilanco as BilancoData;
    const gelirGiderData = results.gelirGider as GelirGiderItem[];
    const rasyolarData = results.rasyolar as RasyoData;
    const vergiselAnalizData = results.vergiselAnaliz as VergiselAnalizItem[];
    const kkegAnalizData = results.kkeg as KKEGItem[];
    const kurganAnalizData = results.kurganAnalizi as KurganAnaliz;
    const nakitAkimData = results.nakitAkim as NakitAkimData;
    
    // Assemble the final JSON object
    const finalAnalysisData: AnalysisData = {
        pdfText,
        dashboard: {
            summary: {
                mizan: mizanData.length,
                bilanco: bilancoData.aktif.flatMap(b => b.stoklar).length + bilancoData.pasif.flatMap(b => b.stoklar).length,
                gelirGider: gelirGiderData.length,
                analizler: vergiselAnalizData.length,
                kkeg: kkegAnalizData.length,
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
        rasyolar: rasyolarData,
        vergiselAnaliz: vergiselAnalizData,
        gelirGiderAnalizi: gelirGiderData.slice(0, 8).map(item => ({
            name: item.aciklama.toUpperCase(),
            'Cari Dönem': Math.abs(item.cariDonem),
            'Önceki Dönem': Math.abs(item.oncekiDonem)
        })),
        kkegAnalizi: kkegAnalizData,
        kurganAnalizi: kurganAnalizData,
        nakitAkim: nakitAkimData
    };

    onProgress("Analiz tamamlandı!");
    return finalAnalysisData;
};

export const generateDetailedTaxReport = async (
    items: VergiselAnalizItem[],
    pdfText: string
): Promise<DetailedTaxReportItem[]> => {
    const reportData = await callApi<DetailedTaxReportItem[]>('/api/generate-tax-report', { items, pdfText });
    return reportData;
};