import React, { useState, useCallback } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Dashboard } from './Dashboard';
import { Mizan } from './Mizan';
import { Bilanco } from './Bilanco';
import { GelirGider } from './GelirGider';
import { DikeyAnaliz } from './DikeyAnaliz';
import { YatayAnaliz } from './YatayAnaliz';
import { VergiselAnaliz } from './VergiselAnaliz';
import { FileUploadScreen } from '../components/FileUploadScreen';
import { performFullAnalysis } from '../services/geminiService';
import { AnalysisData, MizanItem, Page } from '../types';
import { Loader } from '../components/ui/Loader';
import { KurganAnalizi } from './KurganAnalizi';
import { ProgressLoader } from '../components/ui/ProgressLoader';
import { NakitAkim } from './NakitAkim';
import { KKEGAnalizi } from './KKEGAnalizi';
import { FinansalYapiOranlari } from './FinansalYapiOranlari';
import { LikiditeOranlari } from './LikiditeOranlari';
import { DevirHizlari } from './DevirHizlari';
import { KarlilikOranlari } from './KarlilikOranlari';
import { KurumlarVergisi } from './KurumlarVergisi';
import { processExcelFile } from '../utils/excelParser';


async function extractTextFromPdf(file: File, onProgress: (progress: number) => void): Promise<string> {
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
        throw new Error("pdf.js library not loaded. Please check network connection and script tags.");
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    onProgress(0);
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
        const progress = Math.round((i / pdf.numPages) * 100);
        onProgress(progress);
    }
    return fullText;
}

export const MainApp: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [parsingProgress, setParsingProgress] = useState<number>(0);
    const [analysisStep, setAnalysisStep] = useState<string>('');
    const [highlightedAccountCode, setHighlightedAccountCode] = useState<string | null>(null);

    const handleAnalysis = useCallback(async (file: File, fileType: 'pdf' | 'excel') => {
        setIsLoading(true);
        setError(null);
        setAnalysisStep('');

        try {
            let dataSourceText: string;
            let initialMizan: MizanItem[] | undefined = undefined;

            if (fileType === 'pdf') {
                setAnalysisStep("PDF dosyası okunuyor...");
                setParsingProgress(0);
                dataSourceText = await extractTextFromPdf(file, setParsingProgress);
            } else { // Excel flow
                setAnalysisStep("Excel dosyası işleniyor...");
                setParsingProgress(50);
                initialMizan = await processExcelFile(file);
                // For subsequent AI steps, use the clean, stringified mizan data
                dataSourceText = JSON.stringify(initialMizan, null, 2); 
                setParsingProgress(100);
            }
            
            if (!dataSourceText || dataSourceText.trim().length < 10) {
                 throw new Error("Dosyadan yeterli veri çıkarılamadı. Dosyanın içeriğini ve formatını kontrol edin.");
            }
            
            setParsingProgress(0);
            setAnalysisStep("Analiz başlatılıyor...");
            
            const data = await performFullAnalysis(dataSourceText, setAnalysisStep, initialMizan);
            setAnalysisData(data);
            setCurrentPage('Dashboard');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analiz sırasında bilinmeyen bir hata oluştu.');
            console.error("Analysis or Parsing Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetAnalysis = () => {
        setAnalysisData(null);
        setCurrentPage('Dashboard');
    };
    
    const handleHighlightAccount = (hesapKodu: string) => {
        setHighlightedAccountCode(hesapKodu);
        setCurrentPage('Mizan');
    };

    const renderPage = () => {
        if (!analysisData) return null;

        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard data={analysisData} />;
            case 'Mizan':
                return <Mizan 
                    data={analysisData.mizan} 
                    highlightedAccountCode={highlightedAccountCode}
                    onHighlightComplete={() => setHighlightedAccountCode(null)}
                />;
            case 'Bilanço':
                return <Bilanco data={analysisData.bilanco} />;
            case 'Gelir ve Gider':
                return <GelirGider data={analysisData.gelirGider} />;
            case 'Finansal Yapı Oranları':
                return <FinansalYapiOranlari data={analysisData.rasyolar.finansalYapi} />;
            case 'Likidite Oranları':
                 return <LikiditeOranlari data={analysisData.rasyolar.likidite} />;
            case 'Devir Hızları':
                 return <DevirHizlari data={analysisData.rasyolar.devirHizlari} />;
            case 'Kârlılık Oranları':
                return <KarlilikOranlari data={analysisData.rasyolar.karlilik} />;
            case 'Dikey Analiz':
                return <DikeyAnaliz bilancoData={analysisData.bilanco} gelirGiderData={analysisData.gelirGider} />;
            case 'Yatay Analiz':
                return <YatayAnaliz bilancoData={analysisData.bilanco} gelirGiderData={analysisData.gelirGider} />;
            case 'Kurumlar Vergisi':
                return <KurumlarVergisi data={analysisData.kurumlarVergisi} />;
            case 'Vergisel Analiz':
                return <VergiselAnaliz 
                    data={analysisData.vergiselAnaliz} 
                    dataSourceText={analysisData.dataSourceText || ''} 
                    mizanData={analysisData.mizan}
                    onHighlightAccount={handleHighlightAccount}
                />;
            case 'KKEG Analizi':
                return <KKEGAnalizi
                    data={analysisData.kkegAnalizi}
                    onHighlightAccount={handleHighlightAccount}
                />;
            case 'Kurgan Analizi':
                return <KurganAnalizi data={analysisData.kurganAnalizi} />;
            case 'Nakit Akım':
                return <NakitAkim data={analysisData.nakitAkim} />;
            default:
                return <Dashboard data={analysisData} />;
        }
    };

    if (isLoading) {
        if (parsingProgress > 0) {
            return <ProgressLoader progress={parsingProgress} message={analysisStep || "Dosya işleniyor..."} />;
        }
        return <Loader message={analysisStep || "Analiz hazırlanıyor..."} />;
    }

    if (!analysisData) {
        return <FileUploadScreen onAnalyze={handleAnalysis} error={error} />;
    }

    return (
        <div className="flex h-screen bg-slate-900 text-gray-300">
            <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onReset={resetAnalysis} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 md:p-8">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};