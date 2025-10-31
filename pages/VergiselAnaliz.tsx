import React, { useState, useMemo } from 'react';
import { VergiselAnalizItem, DetailedTaxReportItem, MizanItem, PdfSettings } from '../types';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { BookIcon, DownloadIcon, ExternalLinkIcon, InfoIcon, ReportIcon, SettingsIcon, WarningIcon, ChecklistIcon, CalculatorIcon, CompareIcon } from '../components/ui/Icons';
import { generateDetailedTaxReport } from '../services/geminiService';
import { robotoFont } from '../utils/robotoFont';
import useLocalStorage from '../hooks/useLocalStorage';
import { formatCurrency } from '../utils/formatters';
import { VatCheckModal } from '../components/vergisel/VatCheckModal';


// Forward declaration for jsPDF and autoTable from window object
declare const jspdf: any;

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Alacak Riskleri':
            return 'bg-blue-600 text-blue-100';
        case 'Varlık Riskleri':
            return 'bg-green-600 text-green-100';
        case 'Borç ve Kaynak Riskleri':
            return 'bg-purple-600 text-purple-100';
        case 'Kar/Zarar ve Gider Riskleri':
            return 'bg-orange-600 text-orange-100';
        case 'Genel Uyum Riskleri':
            return 'bg-yellow-600 text-yellow-100';
        default:
            return 'bg-slate-600 text-slate-100';
    }
};

const AnalizCard: React.FC<{ 
    item: VergiselAnalizItem; 
    onCardClick: () => void;
    onAccountCodeClick: (hesapKodu: string) => void;
    isSelected: boolean;
    onSelectToggle: (baslik: string) => void;
    onCompareClick?: () => void;
}> = ({ item, onCardClick, onAccountCodeClick, isSelected, onSelectToggle, onCompareClick }) => {
    const isRisk = item.durum === 'Hayır';
    const durumClass = isRisk ? 'bg-red-600' : 'bg-green-600';
    const categoryColorClass = getCategoryColor(item.kategori);

    const borderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-500' : isRisk ? 'border-red-600/50' : 'hover:border-blue-500/50';

    return (
        <Card 
            className={`relative flex flex-col justify-between bg-slate-800/80 group transition-all ${borderClass}`}
        >
            {isRisk && (
                <div className="absolute top-3 right-3 z-10">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectToggle(item.baslik)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 rounded bg-slate-700 border-slate-500 text-blue-500 focus:ring-blue-600 cursor-pointer"
                    />
                </div>
            )}
            <div onClick={onCardClick} className="cursor-pointer h-full flex flex-col">
                {/* === TOP SECTION === */}
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${categoryColorClass}`}>
                            {item.kategori}
                        </span>
                        <div className="flex flex-wrap gap-1 justify-end max-w-[50%]">
                            {item.hesapKodlari.length > 0 && item.hesapKodlari[0] !== '-' ?
                                item.hesapKodlari.map(kod => (
                                <button 
                                    key={kod} 
                                    onClick={(e) => { e.stopPropagation(); onAccountCodeClick(kod); }}
                                    className="text-xs font-semibold bg-slate-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
                                >
                                    {kod}
                                </button>
                            )) : <span className="text-xs text-gray-500">N/A</span>}
                        </div>
                    </div>
                     <h4 className="font-bold text-white mb-2 pr-8 group-hover:text-blue-400 transition-colors text-base leading-tight">
                        {item.baslik}
                    </h4>
                </div>
                
                {/* === MIDDLE SECTION (grows) === */}
                <div className="flex-1 py-2">
                    {isRisk && item.uyariMesaji && (
                        <div className="mb-3 p-3 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-xs rounded-lg flex items-start gap-3">
                            <WarningIcon className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                            <p className="leading-relaxed">{item.uyariMesaji}</p>
                        </div>
                    )}
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        {item.aciklama.substring(0, 100)}{item.aciklama.length > 100 ? '...' : ''}
                    </p>
                    {isRisk && item.mevzuatReferanslari && item.mevzuatReferanslari.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {item.mevzuatReferanslari.map((ref, refIndex) => (
                                <a 
                                    key={refIndex} 
                                    href={`https://www.google.com/search?q=${encodeURIComponent(ref)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    title={`Mevzuat ara: ${ref}`}
                                    className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-600/80 hover:bg-purple-600 text-white px-2 py-1 rounded transition-colors"
                                >
                                    {ref}
                                    <ExternalLinkIcon className="w-3 h-3" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* === FOOTER SECTION === */}
                <div className="mt-auto pt-3 border-t border-slate-700/50 flex justify-between items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onCardClick(); }} className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                        Detayları Gör <InfoIcon className="w-4 h-4" />
                    </button>
                    {onCompareClick && (
                        <button 
                            onClick={(e) => {e.stopPropagation(); onCompareClick()}}
                            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline font-semibold"
                        >
                            <CompareIcon className="w-4 h-4" />
                            Karşılaştır
                        </button>
                    )}
                    <span className={`px-4 py-1 text-sm font-bold text-white rounded-full ${durumClass}`}>
                        {item.durum}
                    </span>
                </div>
            </div>
        </Card>
    );
};

interface VergiselAnalizProps {
    data: VergiselAnalizItem[];
    pdfText: string;
    mizanData: MizanItem[];
    onHighlightAccount: (hesapKodu: string) => void;
}

const VERGI_ZIYAI_ORANI = 1; // 100%
const GECIKME_FAIZI_AYLIK_ORAN = 0.035; // 3.5%
const GECIKME_AY_SAYISI = 12; // Assumption of 12 months delay

export const VergiselAnaliz: React.FC<VergiselAnalizProps> = ({ data, pdfText, mizanData, onHighlightAccount }) => {
    const [selectedItem, setSelectedItem] = useState<VergiselAnalizItem | null>(null);
    const [isReportLoading, setIsReportLoading] = useState<boolean>(false);
    const [detailedReport, setDetailedReport] = useState<DetailedTaxReportItem[] | null>(null);
    const [reportError, setReportError] = useState<string | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [isVatModalOpen, setIsVatModalOpen] = useState<boolean>(false);
    const [taxBases, setTaxBases] = useState<Record<string, number>>({});

    const hayirItems = useMemo(() => data.filter(item => item.durum === 'Hayır'), [data]);
    
    const [selectedRisks, setSelectedRisks] = useState<Set<string>>(() => new Set(hayirItems.map(item => item.baslik)));

    const [pdfSettings, setPdfSettings] = useLocalStorage<PdfSettings>('pdfSettings', {
        logo: null,
        headerBgColor: '#1e3a8a',
        headerTextColor: '#ffffff',
        subHeaderColor: '#3b82f6',
        font: 'Roboto',
    });


    const evetCount = data.length - hayirItems.length;

    const handleToggleRisk = (baslik: string) => {
        setSelectedRisks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(baslik)) {
                newSet.delete(baslik);
            } else {
                newSet.add(baslik);
            }
            return newSet;
        });
    };

    const handleSelectAllRisks = (checked: boolean) => {
        if (checked) {
            setSelectedRisks(new Set(hayirItems.map(item => item.baslik)));
        } else {
            setSelectedRisks(new Set());
        }
    };
    
    const handleDownloadPdf = async (reportToDownload: DetailedTaxReportItem[]) => {
        if (!reportToDownload) return;
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        if (pdfSettings.font === 'Roboto') {
            doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
            doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        }
        doc.setFont(pdfSettings.font);

        let yPos = 20;

        if (pdfSettings.logo) {
            try {
                const img = new Image();
                img.src = pdfSettings.logo;
                await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
                if(img.complete && img.naturalHeight !== 0) {
                    const aspectRatio = img.width / img.height;
                    const logoWidth = 40;
                    const logoHeight = logoWidth / aspectRatio;
                    doc.addImage(pdfSettings.logo, 'PNG', 15, 10, logoWidth, logoHeight);
                }
            } catch(e) {
                console.error("Error adding logo to PDF:", e);
            }
        }

        doc.setFillColor(pdfSettings.headerBgColor);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(pdfSettings.headerTextColor);
        doc.setFontSize(18);
        doc.text('Detaylı Vergisel Risk Raporu', 105, 22, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 105, 28, { align: 'center' });
        yPos = 45;

        reportToDownload.forEach((item, index) => {
            if (yPos > 250) { // Margin before adding new page
                doc.addPage();
                yPos = 20;
            }

            doc.setTextColor('#000000');
            doc.setFontSize(14);
            doc.setFont(pdfSettings.font, 'bold');
            const splitTitle = doc.splitTextToSize(`${index + 1}. ${item.baslik}`, 180);
            doc.text(splitTitle, 15, yPos);
            yPos += (splitTitle.length * 6) + 2;

            // FIX: Corrected a typo in the 'potensiyelVergiCezalari' property name.
            const body = [
                ['Risk Analizi', item.riskAnalizi],
                ['İlgili Mevzuat', item.mevzuatReferanslari.join('\n')],
                ['Potansiyel Vergi Cezaları', item.potensiyelVergiCezalari],
                ['Yapılması Gerekenler', item.yapilmasiGerekenler.map(step => `- ${step}`).join('\n')],
            ];

            (doc as any).autoTable({
                startY: yPos,
                head: [['Bölüm', 'Açıklama']],
                body: body,
                theme: 'grid',
                headStyles: {
                    fillColor: pdfSettings.subHeaderColor,
                    textColor: pdfSettings.headerTextColor,
                    font: pdfSettings.font,
                },
                styles: {
                    font: pdfSettings.font,
                    cellPadding: 3,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1,
                },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 45 },
                    1: { cellWidth: 135 },
                },
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;
        });

        doc.save('Vergisel_Risk_Raporu.pdf');
    };

    const handleGenerateReport = async () => {
        const itemsToReport = hayirItems.filter(item => selectedRisks.has(item.baslik));
        if(itemsToReport.length === 0) {
            setReportError("Lütfen rapor oluşturmak için en az bir risk kalemi seçin.");
            return;
        }

        setIsReportLoading(true);
        setReportError(null);
        setDetailedReport(null);
        try {
            const report = await generateDetailedTaxReport(itemsToReport, pdfText);
            setDetailedReport(report);
            setIsSettingsModalOpen(true); // Automatically open settings after generation
        } catch (err) {
            setReportError(err instanceof Error ? err.message : 'Rapor oluşturulurken bir hata oluştu.');
        } finally {
            setIsReportLoading(false);
        }
    };
    
    const handleClearReport = () => {
        setDetailedReport(null);
        setReportError(null);
        setTaxBases({});
    };

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPdfSettings(prev => ({ ...prev, logo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSettingsChange = (field: keyof PdfSettings, value: string | null) => {
        setPdfSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleTaxBaseChange = (baslik: string, value: string) => {
        const amount = Number(value) >= 0 ? Number(value) : 0;
        setTaxBases(prev => ({ ...prev, [baslik]: amount }));
    };

    const penaltyTotals = useMemo(() => {
        if (!detailedReport) return { totalBase: 0, totalTaxLoss: 0, totalInterest: 0, grandTotal: 0 };

        return detailedReport.reduce((acc, item) => {
            const base = taxBases[item.baslik] || 0;
            const taxLoss = base * VERGI_ZIYAI_ORANI;
            const interest = base * GECIKME_FAIZI_AYLIK_ORAN * GECIKME_AY_SAYISI;
            const totalRisk = base + taxLoss + interest;

            acc.totalBase += base;
            acc.totalTaxLoss += taxLoss;
            acc.totalInterest += interest;
            acc.grandTotal += totalRisk;
            return acc;
        }, { totalBase: 0, totalTaxLoss: 0, totalInterest: 0, grandTotal: 0 });

    }, [detailedReport, taxBases]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Vergisel Analiz</h2>
            <p className="text-gray-400 -mt-4">Mali tablolara göre vergisel analiz kontrolleri</p>

            <Card>
                {/* Summary Section */}
                <div className="flex flex-wrap items-center justify-around gap-8 text-center border-b border-slate-700 pb-6 mb-6">
                    <div>
                        <p className="text-gray-400 text-sm">Toplam Kontrol Noktası</p>
                        <p className="text-3xl font-bold text-white">{data.length}</p>
                    </div>
                    <div>
                        <p className="text-green-400 text-sm">Uyumlu Kalemler</p>
                        <p className="text-3xl font-bold text-green-400">{evetCount}</p>
                    </div>
                    <div>
                        <p className="text-red-400 text-sm">Tespit Edilen Riskler</p>
                        <p className="text-3xl font-bold text-red-400">{hayirItems.length}</p>
                    </div>
                </div>

                {/* Report Generation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                    <label htmlFor="select-all" className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                        <input
                            id="select-all"
                            type="checkbox"
                            className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-blue-500 focus:ring-blue-600"
                            checked={selectedRisks.size === hayirItems.length && hayirItems.length > 0}
                            onChange={(e) => handleSelectAllRisks(e.target.checked)}
                            disabled={hayirItems.length === 0}
                        />
                        Tüm Riskleri Seç ({selectedRisks.size} / {hayirItems.length})
                    </label>
                    <button
                        onClick={handleGenerateReport}
                        disabled={selectedRisks.size === 0 || isReportLoading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isReportLoading ? (
                           <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Rapor Oluşturuluyor...
                           </>
                        ) : (
                            <>
                                <ReportIcon className="w-5 h-5" />
                                Seçili ({selectedRisks.size}) Risk İçin Rapor Oluştur
                            </>
                        )}
                    </button>
                </div>
            </Card>

            {(isReportLoading || detailedReport || reportError) && (
                <div className="space-y-6">
                    <Card>
                        <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <ReportIcon className="w-6 h-6 text-blue-400"/>
                                Detaylı Vergisel Risk Raporu
                            </h3>
                             {detailedReport && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors" title="PDF Ayarları">
                                        <SettingsIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDownloadPdf(detailedReport)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors" title="PDF Olarak İndir">
                                        <DownloadIcon className="w-5 h-5" />
                                        <span>PDF İndir</span>
                                    </button>
                                    <button onClick={handleClearReport} className="p-2 text-gray-400 hover:text-white" aria-label="Raporu kapat">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {isReportLoading && (
                            <div className="flex flex-col items-center justify-center p-8">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-md font-semibold">Rapor oluşturuluyor...</p>
                            </div>
                        )}
                        {reportError && <div className="p-4 text-red-400 bg-red-900/50 border border-red-500/50 rounded-lg">{reportError}</div>}
                        {detailedReport && (
                            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2" id="report-content">
                                {detailedReport.map((item, index) => (
                                    <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                                        <h3 className="text-lg font-bold text-blue-400 mb-3">{item.baslik}</h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                                    <InfoIcon className="w-5 h-5 text-gray-400" />Risk Analizi
                                                </h4>
                                                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap pl-7">{item.riskAnalizi}</p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                                    <BookIcon className="w-5 h-5 text-purple-400" />
                                                    İlgili Mevzuat
                                                </h4>
                                                <div className="flex flex-wrap gap-2 pl-7">
                                                    {item.mevzuatReferanslari.map((ref, refIndex) => (
                                                        <span key={refIndex} className="text-xs font-semibold bg-purple-600 text-white px-2 py-1 rounded">
                                                            {ref}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2"><WarningIcon className="w-5 h-5 text-orange-400" />Potansiyel Vergi Cezaları</h4>
                                                <div className="p-3 ml-7 bg-orange-900/40 border-l-4 border-orange-600 text-orange-300 text-sm rounded-r-md">
                                                    <p className="leading-relaxed whitespace-pre-wrap">{item.potensiyelVergiCezalari}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                                   <ChecklistIcon className="w-5 h-5 text-green-400" />Yapılması Gerekenler
                                                </h4>
                                                <ul className="space-y-2 list-disc list-inside text-sm text-gray-300 pl-7">
                                                    {item.yapilmasiGerekenler.map((step, stepIndex) => (
                                                        <li key={stepIndex} className="leading-relaxed">{step}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {detailedReport && detailedReport.length > 0 && (
                         <Card>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <CalculatorIcon className="w-6 h-6 text-green-400" />
                                Potansiyel Vergi Cezası Hesaplaması
                            </h3>
                            <div className="divide-y divide-slate-700">
                                {detailedReport.map((item) => {
                                    const base = taxBases[item.baslik] || 0;
                                    const taxLoss = base * VERGI_ZIYAI_ORANI;
                                    const interest = base * GECIKME_FAIZI_AYLIK_ORAN * GECIKME_AY_SAYISI;
                                    const totalRisk = base + taxLoss + interest;

                                    return (
                                        <div key={item.baslik} className="py-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-1">
                                                    <h4 className="font-bold text-white">{item.baslik}</h4>
                                                    <p className="text-xs text-orange-300 mt-1 italic">"{item.potensiyelVergiCezalari}"</p>
                                                </div>
                                                <div className="md:col-span-1 flex flex-col justify-center">
                                                    <label htmlFor={`tax-base-${item.baslik}`} className="text-xs font-medium text-gray-400 mb-1">Vergi Matrahı (Ana Para)</label>
                                                    <input
                                                        id={`tax-base-${item.baslik}`}
                                                        type="number"
                                                        value={taxBases[item.baslik] || ''}
                                                        onChange={(e) => handleTaxBaseChange(item.baslik, e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="md:col-span-1 space-y-2 text-sm text-right bg-slate-900/50 p-3 rounded-lg">
                                                    <div className="flex justify-between items-center"><span className="text-gray-400">Vergi Aslı:</span><span className="font-mono text-white">{formatCurrency(base)}</span></div>
                                                    <div className="flex justify-between items-center"><span className="text-gray-400">Vergi Ziyaı Cezası:</span><span className="font-mono text-white">{formatCurrency(taxLoss)}</span></div>
                                                    <div className="flex justify-between items-center"><span className="text-gray-400">Gecikme Faizi (12 Ay):</span><span className="font-mono text-white">{formatCurrency(interest)}</span></div>
                                                    <div className="flex justify-between items-center border-t border-slate-600 mt-2 pt-2"><span className="font-bold text-red-400">Toplam Risk:</span><span className="font-mono font-bold text-red-400">{formatCurrency(totalRisk)}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-4 border-t-2 border-blue-500">
                                <h4 className="text-lg font-bold text-white mb-3">Genel Toplam Risk</h4>
                                <div className="max-w-md ml-auto space-y-2 text-md">
                                    <div className="flex justify-between items-center"><span className="text-gray-400">Toplam Vergi Aslı:</span><span className="font-mono text-white">{formatCurrency(penaltyTotals.totalBase)}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-400">Toplam Vergi Ziyaı Cezası:</span><span className="font-mono text-white">{formatCurrency(penaltyTotals.totalTaxLoss)}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-400">Toplam Gecikme Faizi:</span><span className="font-mono text-white">{formatCurrency(penaltyTotals.totalInterest)}</span></div>
                                    <div className="flex justify-between items-center border-t border-slate-600 mt-2 pt-2 text-xl"><span className="font-bold text-red-400">TOPLAM RİSK:</span><span className="font-mono font-bold text-red-400">{formatCurrency(penaltyTotals.grandTotal)}</span></div>
                                </div>
                            </div>
                            <div className="mt-6 text-center text-xs text-gray-500 p-2 bg-slate-900/50 rounded-md">
                                <p><strong>Yasal Uyarı:</strong> Bu hesaplamalar tahmini olup, Vergi Ziyaı Cezası için %{VERGI_ZIYAI_ORANI*100} ve Gecikme Faizi için {GECIKME_AY_SAYISI} aylık bir süre boyunca aylık %{GECIKME_FAIZI_AYLIK_ORAN*100} oran varsayımıyla yapılmıştır. Gerçek tutarlar farklılık gösterebilir. Lütfen bir vergi danışmanına başvurun.</p>
                            </div>
                         </Card>
                    )}
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item, index) => (
                    <AnalizCard 
                        key={index} 
                        item={item} 
                        onCardClick={() => setSelectedItem(item)} 
                        onAccountCodeClick={onHighlightAccount}
                        isSelected={selectedRisks.has(item.baslik)}
                        onSelectToggle={handleToggleRisk}
                        onCompareClick={item.baslik === 'KDV Beyannamesi Tutarlılığı' ? () => setIsVatModalOpen(true) : undefined}
                    />
                ))}
            </div>

             {isVatModalOpen && (
              <VatCheckModal
                isOpen={isVatModalOpen}
                onClose={() => setIsVatModalOpen(false)}
                pdfText={pdfText}
                mizanData={mizanData}
              />
            )}

            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.baslik ?? 'Analiz Detayı'}
            >
                {selectedItem && (
                    <div className="space-y-6 text-sm">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-700/50 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Kategori</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${getCategoryColor(selectedItem.kategori)}`}>
                                    {selectedItem.kategori}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Durum</p>
                                <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${selectedItem.durum === 'Evet' ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {selectedItem.durum === 'Evet' ? 'Uyumlu' : 'İnceleme Gerekli'}
                                </span>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-xs text-gray-400 mb-1">İlgili Hesaplar</p>
                                <div className="flex flex-wrap gap-1 justify-start sm:justify-end">
                                    {selectedItem.hesapKodlari.length > 0 && selectedItem.hesapKodlari[0] !== '-' ?
                                        selectedItem.hesapKodlari.map(kod => (
                                            <span key={kod} className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded">
                                                {kod}
                                            </span>
                                        )) : <span className="text-xs text-gray-500">Genel</span>
                                    }
                                </div>
                            </div>
                        </div>

                        {selectedItem.durum === 'Hayır' && selectedItem.uyariMesaji && (
                            <div>
                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                    <WarningIcon className="w-5 h-5 text-orange-400" />Önemli Uyarı
                                </h4>
                                <div className="p-3 bg-orange-900/40 border-l-4 border-orange-600 text-orange-300 text-xs rounded-r-md">
                                    <p className="leading-relaxed">{selectedItem.uyariMesaji}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Açıklama</h4>
                            <p className="text-gray-300 leading-relaxed">{selectedItem.aciklama}</p>
                        </div>
                        
                        {selectedItem.mevzuatReferanslari && selectedItem.mevzuatReferanslari.length > 0 && (
                             <div>
                                <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                    <BookIcon className="w-5 h-5 text-purple-400" />
                                    İlgili Mevzuat
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.mevzuatReferanslari.map((ref, refIndex) => (
                                        <a 
                                            key={refIndex} 
                                            href={`https://www.google.com/search?q=${encodeURIComponent(ref)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded transition-colors"
                                        >
                                            {ref}
                                            <ExternalLinkIcon className="w-3 h-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
            
            <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="PDF Şablon Ayarları">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Şirket Logosu</label>
                        <div className="flex items-center gap-4">
                            <label htmlFor="logo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">
                                Logo Seç
                            </label>
                            <input id="logo-upload" type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleLogoUpload} />
                            {pdfSettings.logo && (
                                <div className="p-2 border border-slate-600 rounded-md bg-slate-700">
                                    <img src={pdfSettings.logo} alt="Logo Önizleme" className="h-12 max-w-[150px] object-contain" />
                                </div>
                            )}
                            {pdfSettings.logo && (
                                 <button onClick={() => handleSettingsChange('logo', null)} className="text-xs text-red-400 hover:text-red-300">Kaldır</button>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Renk Şeması</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="headerBgColor" className="text-xs text-gray-400 mb-1">Başlık Arka Plan</label>
                                <input type="color" id="headerBgColor" value={pdfSettings.headerBgColor} onChange={(e) => handleSettingsChange('headerBgColor', e.target.value)} className="w-full h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="headerTextColor" className="text-xs text-gray-400 mb-1">Başlık Metin</label>
                                <input type="color" id="headerTextColor" value={pdfSettings.headerTextColor} onChange={(e) => handleSettingsChange('headerTextColor', e.target.value)} className="w-full h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="subHeaderColor" className="text-xs text-gray-400 mb-1">Alt Başlıklar</label>
                                <input type="color" id="subHeaderColor" value={pdfSettings.subHeaderColor} onChange={(e) => handleSettingsChange('subHeaderColor', e.target.value)} className="w-full h-10 p-1 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="font-select" className="block text-sm font-medium text-gray-300 mb-2">Yazı Tipi</label>
                        <select
                            id="font-select"
                            value={pdfSettings.font}
                            onChange={(e) => handleSettingsChange('font', e.target.value as PdfSettings['font'])}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Roboto">Roboto (Önerilen)</option>
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                         <p className="text-xs text-gray-500 mt-1">Türkçe karakter desteği için 'Roboto' önerilir.</p>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-700">
                         <button onClick={() => setIsSettingsModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            Kapat
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};