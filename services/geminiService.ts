import { AnalysisData, DetailedTaxReportItem, VergiselAnalizItem, MizanItem, BilancoData, GelirGiderItem, RasyoData, KurganAnaliz, NakitAkimData, KKEGItem, KurumlarVergisiHesaplama } from '../types';

// Constants for the retry mechanism
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 2000; // Start with a 2-second delay

// Generic helper to call our backend API endpoints with a robust retry mechanism
async function callApi<T>(
    endpoint: string, 
    body: object, 
    onProgress?: (message: string) => void
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            // If the request was successful, return the JSON data.
            if (response.ok) {
                return await response.json() as T;
            }

            // For specific transient errors (like 503 Service Unavailable or 429 Too Many Requests),
            // we prepare to retry instead of failing immediately.
            if (response.status === 503 || response.status === 429) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                const errorMessage = `Sunucu geçici olarak meşgul (Hata ${response.status}).`;
                 console.warn(`Attempt ${attempt + 1} failed: ${errorMessage}`, errorData);
                lastError = new Error(errorMessage);
                // Continue to the retry logic below
            } else {
                // For other client/server errors (e.g., 400, 500), fail fast.
                const errorData = await response.json().catch(() => ({ message: response.statusText, error: '' }));
                const detailedError = errorData.error ? `${errorData.message} - Detay: ${errorData.error}` : errorData.message;
                throw new Error(detailedError || `Sunucu hatası: ${response.status}`);
            }

        } catch (error) {
            // This catches network errors or errors thrown from the block above.
            lastError = error instanceof Error ? error : new Error('Bilinmeyen bir ağ hatası oluştu.');
            
            // If it's a non-retryable error caught here, break the loop to fail fast.
            const isRetryable = lastError.message.includes("meşgul") || lastError.message.includes("overloaded");
            if (!isRetryable) {
                break; 
            }
        }
        
        // If we are here, it means a retryable error occurred.
        // Wait before the next attempt, but not after the last one.
        if (attempt < MAX_RETRIES - 1) {
            // Exponential backoff with jitter: 2^attempt * initial_delay + random_offset
            const delay = INITIAL_BACKOFF_MS * Math.pow(2, attempt) + Math.random() * 1000;
            const progressMessage = `AI modeli meşgul. ${Math.round(delay / 1000)} saniye içinde yeniden denenecek... (${attempt + 1}/${MAX_RETRIES - 1})`;
            
            if (onProgress) {
                onProgress(progressMessage);
            }
            console.warn(progressMessage);
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    // If all retries have been exhausted, throw the last captured error.
    console.error(`API Error at '${endpoint}' after ${MAX_RETRIES} attempts:`, lastError);
    throw new Error(`Analiz sunucusuna bağlanılamadı. Lütfen daha sonra tekrar deneyin. Son hata: ${lastError?.message}`);
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
        { dataSourceText },
        onProgress // Pass onProgress to the API caller for retry messages
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
    // This call will also benefit from the retry logic, but without progress updates.
    const reportData = await callApi<DetailedTaxReportItem[]>('/api/generate-tax-report', { items, dataSourceText });
    return reportData;
};