import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Dashboard } from './Dashboard';
import { Mizan } from './Mizan';
import { Bilanco } from './Bilanco';
import { GelirGider } from './GelirGider';
import { RasyoAnalizi } from './RasyoAnalizi';
import { DikeyAnaliz } from './DikeyAnaliz';
import { YatayAnaliz } from './YatayAnaliz';
import { VergiselAnaliz } from './VergiselAnaliz';
import { FileUploadScreen } from '../components/FileUploadScreen';
import { performFullAnalysis } from '../services/geminiService';
import { AnalysisData, Page } from '../types';
import { Loader } from '../components/ui/Loader';
import { KurganAnalizi } from './KurganAnalizi';
import { ProgressLoader } from '../components/ui/ProgressLoader';
import { NakitAkim } from './NakitAkim';

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

const analysisMessages = [
    "Temel mali tablolar oluşturuluyor...",
    "Finansal oranlar hesaplanıyor...",
    "Varlık ve kaynak yapısı inceleniyor...",
    "Vergisel riskler taranıyor...",
    "Nakit akım analizi yapılıyor...",
    "Sahte belge (Kurgan) riskleri değerlendiriliyor...",
    "Raporlar birleştiriliyor, lütfen bekleyin...",
];

export const MainApp: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [parsingProgress, setParsingProgress] = useState<number>(0);
    const [analysisStep, setAnalysisStep] = useState<string>('');
    const messageIntervalRef = useRef<number | null>(null);


    useEffect(() => {
        if (isLoading && parsingProgress === 0 && !analysisStep) {
            let messageIndex = 0;
            setAnalysisStep(analysisMessages[messageIndex]);
            messageIntervalRef.current = window.setInterval(() => {
                messageIndex = (messageIndex + 1) % analysisMessages.length;
                setAnalysisStep(analysisMessages[messageIndex]);
            }, 2500);
        } else if (!isLoading && messageIntervalRef.current) {
            clearInterval(messageIntervalRef.current);
            messageIntervalRef.current = null;
        }

        return () => {
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        };
    }, [isLoading, parsingProgress, analysisStep]);

    const handleAnalysis = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);
        setParsingProgress(0);
        setAnalysisStep('');
        let pdfText;
        try {
            pdfText = await extractTextFromPdf(file, (progress) => {
                setParsingProgress(progress);
            });
        } catch (err) {
            console.error("PDF Parsing Error:", err);
            setError('Analiz sırasında bir hata oluştu. PDF dosyası okunamıyor veya hasarlı olabilir.');
            setIsLoading(false);
            setParsingProgress(0);
            return;
        }
        
        // Reset progress and clear interval to switch to the next loader phase
        setParsingProgress(0);
        if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
        messageIntervalRef.current = null;


        try {
            if (!pdfText || pdfText.trim().length < 100) {
                 throw new Error("PDF'ten yeterli metin çıkarılamadı. Dosyanın metin tabanlı olduğundan emin olun.");
            }
             // Dummy onProgress for the service as we now handle messaging internally
            const data = await performFullAnalysis(pdfText, () => {});
            setAnalysisData({ ...data, pdfText });
            setCurrentPage('Dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analiz sırasında bilinmeyen bir hata oluştu.');
            console.error("Analysis Service Error:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const resetAnalysis = () => {
        setAnalysisData(null);
        setCurrentPage('Dashboard');
    };

    const renderPage = () => {
        if (!analysisData) return null;

        switch (currentPage) {
            case 'Dashboard':
                return <Dashboard data={analysisData} />;
            case 'Mizan':
                return <Mizan data={analysisData.mizan} />;
            case 'Bilanço':
                return <Bilanco data={analysisData.bilanco} />;
            case 'Gelir ve Gider':
                return <GelirGider data={analysisData.gelirGider} />;
            case 'Finansal Yapı Oranları':
            case 'Likidite Oranları':
            case 'Devir Hızları':
                return <RasyoAnalizi data={analysisData.rasyolar} />;
            case 'Dikey Analiz':
                return <DikeyAnaliz bilancoData={analysisData.bilanco} gelirGiderData={analysisData.gelirGider} />;
            case 'Yatay Analiz':
                return <YatayAnaliz bilancoData={analysisData.bilanco} gelirGiderData={analysisData.gelirGider} />;
            case 'Vergisel Analiz':
                return <VergiselAnaliz data={analysisData.vergiselAnaliz} pdfText={analysisData.pdfText || ''} mizanData={analysisData.mizan} />;
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
            return <ProgressLoader progress={parsingProgress} message="PDF dosyası okunuyor ve metin çıkarılıyor..." />;
        }
        return <Loader message={analysisStep || "Analiz başlatılıyor..."} />;
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