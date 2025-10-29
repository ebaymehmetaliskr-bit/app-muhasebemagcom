import React, { useState } from 'react';
import { VergiselAnalizItem, DetailedTaxReportItem, MizanItem, PdfSettings } from '../types';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { BookIcon, DownloadIcon, ExternalLinkIcon, InfoIcon, ReportIcon, SettingsIcon, WarningIcon } from '../components/ui/Icons';
import { generateDetailedTaxReport } from '../services/geminiService';
import { robotoFont } from '../utils/robotoFont';
import { formatCurrency } from '../utils/formatters';

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
    onTitleClick: () => void;
    onAccountCodeClick: (hesapKodu: string) => void;
}> = ({ item, onTitleClick, onAccountCodeClick }) => {
    const isRisk = item.durum === 'Hayır';
    const durumClass = isRisk ? 'bg-red-600' : 'bg-green-600';
    const categoryColorClass = getCategoryColor(item.kategori);

    return (
        <Card className={`flex flex-col justify-between bg-slate-800/80 group transition-all hover:shadow-lg ${isRisk ? 'border-red-600' : 'hover:border-blue-500/50'}`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${categoryColorClass}`}>
                        {item.kategori}
                    </span>
                    <div className="flex flex-wrap gap-1 justify-end">
                        {item.hesapKodlari.length > 0 && item.hesapKodlari[0] !== '-' ?
                            item.hesapKodlari.map(kod => (
                            <button 
                                key={kod} 
                                onClick={() => onAccountCodeClick(kod)}
                                className="text-xs font-semibold bg-slate-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500"
                            >
                                {kod}
                            </button>
                        )) : <span className="text-xs text-gray-500">N/A</span>}
                    </div>
                </div>
                <div 
                    className="font-bold text-white mb-2 cursor-pointer group-hover:text-blue-400 transition-colors flex items-center justify-between"
                    onClick={onTitleClick}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onTitleClick(); }}
                >
                    <h4 className="text-base leading-tight pr-2">{item.baslik}</h4>
                    <InfoIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-end">
                {isRisk && item.uyariMesaji && (
                    <div className="my-2 p-3 bg-red-900/50 border-l-4 border-red-500 text-red-200 text-xs rounded-lg flex items-start gap-3">
                        <WarningIcon className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                        <p className="leading-relaxed">{item.uyariMesaji}</p>
                    </div>
                )}
                <p className="text-xs text-gray-400 leading-relaxed mt-2 mb-3 flex-1">
                    {item.aciklama.substring(0, 80)}...
                </p>
                <div className="flex justify-end">
                    <span className={`px-4 py-1 text-sm font-bold text-white rounded-full ${durumClass}`}>
                        {item.durum}
                    </span>
                </div>
            </div>
        </Card>
    );
};

export const VergiselAnaliz: React.FC<{ data: VergiselAnalizItem[], pdfText: string, mizanData: MizanItem[] }> = ({ data, pdfText, mizanData }) => {
    const [selectedItem, setSelectedItem] = useState<VergiselAnalizItem | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<MizanItem | null>(null);
    const [isReportLoading, setIsReportLoading] = useState<boolean>(false);
    const [detailedReport, setDetailedReport] = useState<DetailedTaxReportItem[] | null>(null);
    const [reportError, setReportError] = useState<string | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
    const [pdfSettings, setPdfSettings] = useState<PdfSettings>({
        logo: null,
        headerBgColor: '#1e3a8a',
        headerTextColor: '#ffffff',
        subHeaderColor: '#3b82f6',
        font: 'Roboto',
    });


    const evetCount = data.filter(item => item.durum === 'Evet').length;
    const hayirItems = data.filter(item => item.durum === 'Hayır');
    const hayirCount = hayirItems.length;

    const handleAccountCodeClick = (hesapKodu: string) => {
        const account = mizanData.find(m => m.hesapKodu === hesapKodu);
        if (account) {
            setSelectedAccount(account);
        } else {
             setSelectedAccount({
                hesapKodu: hesapKodu,
                hesapAdi: "Hesap bulunamadı",
                oncekiDonem: 0,
                cariDonem: 0,
                isMain: false,
                isSub: false
            });
        }
    };

    const handleGenerateReport = async () => {
        setIsReportLoading(true);
        setReportError(null);
        setDetailedReport(null);
        try {
            const report = await generateDetailedTaxReport(hayirItems, pdfText);
            setDetailedReport(report);
        } catch (err) {
            setReportError(err instanceof Error ? err.message : 'Rapor oluşturulurken bir hata oluştu.');
        } finally {
            setIsReportLoading(false);
        }
    };
    
    const handleClearReport = () => {
        setDetailedReport(null);
        setReportError(null);
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

    const handleDownloadPdf = async () => {
        if (!detailedReport) return;
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        // Add custom font for Turkish characters
        doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');

        let yPos = 20;

        // Add Logo
        if (pdfSettings.logo) {
            try {
                const img = new Image();
                img.src = pdfSettings.logo;
                await new Promise(resolve => img.onload = resolve);
                const aspectRatio = img.width / img.height;
                const logoWidth = 40;
                const logoHeight = logoWidth / aspectRatio;
                doc.addImage(pdfSettings.logo, 'PNG', 15, 10, logoWidth, logoHeight);
            } catch(e) {
                console.error("Error adding logo to PDF:", e);
            }
        }

        // Add Header
        doc.setFillColor(pdfSettings.headerBgColor);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(pdfSettings.headerTextColor);
        doc.setFontSize(18);
        doc.text('Detaylı Vergisel Risk Raporu', 105, 22, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 105, 28, { align: 'center' });
        yPos = 45;

        // Add Report Content
        detailedReport.forEach((item, index) => {
            if (yPos > 260) {
                doc.addPage();
                yPos = 20;
            }

            doc.setTextColor('#000000');
            doc.setFontSize(14);
            doc.setFont('Roboto', 'bold');
            doc.text(`${index + 1}. ${item.baslik}`, 15, yPos);
            yPos += 8;

            const body = [
                ['Risk Analizi', item.riskAnalizi],
                ['İlgili Mevzuat', item.mevzuatReferanslari.join(', ')],
                ['Potansiyel Vergi Cezaları', item.potansiyelVergiCezalari],
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
                    font: 'Roboto',
                },
                styles: {
                    font: 'Roboto',
                    cellPadding: 3,
                },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 50 },
                    1: { cellWidth: 130 },
                },
                didDrawPage: (data: any) => {
                    yPos = data.cursor.y + 10;
                }
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        });

        doc.save('Vergisel_Risk_Raporu.pdf');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Vergisel Analiz</h2>
            <p className="text-gray-400 -mt-4">Mali tablolara göre vergisel analiz kontrolleri</p>

            <Card>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center justify-center gap-8 text-center">
                        <div>
                            <p className="text-gray-400 text-sm">Toplam Kontrol:</p>
                            <p className="text-2xl font-bold">{data.length}</p>
                        </div>
                        <div>
                            <p className="text-green-400 text-sm">Uyumlu:</p>
                            <p className="text-2xl font-bold text-green-400">{evetCount}</p>
                        </div>
                        <div>
                            <p className="text-red-400 text-sm">İnceleme Gerekli:</p>
                            <p className="text-2xl font-bold text-red-400">{hayirCount}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={hayirCount === 0 || isReportLoading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isReportLoading ? (
                           <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Rapor Oluşturuluyor...
                           </>
                        ) : (
                            <>
                                <ReportIcon className="w-5 h-5" />
                                Detaylı Risk Raporu Oluştur
                            </>
                        )}
                    </button>
                </div>
            </Card>

            {(isReportLoading || detailedReport || reportError) && (
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
                                <button onClick={handleDownloadPdf} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors" title="PDF Olarak İndir">
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
                                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                                    <h3 className="text-lg font-bold text-blue-400 mb-3">{item.baslik}</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-300 mb-2">Risk Analizi</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{item.riskAnalizi}</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                                <BookIcon className="w-5 h-5 text-purple-400" />
                                                İlgili Mevzuat
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {item.mevzuatReferanslari.map((ref, refIndex) => (
                                                    <span key={refIndex} className="text-xs font-semibold bg-purple-600 text-white px-2 py-1 rounded">
                                                        {ref}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2"><WarningIcon className="w-5 h-5 text-orange-400" />Potansiyel Vergi Cezaları</h4>
                                            <div className="p-3 bg-orange-900/40 border-l-4 border-orange-600 text-orange-300 text-xs rounded-r-md">
                                                <p className="leading-relaxed whitespace-pre-wrap">{item.potansiyelVergiCezalari}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-300 mb-2">Yapılması Gerekenler</h4>
                                            <ul className="space-y-2 list-disc list-inside text-sm text-gray-400">
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
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((item, index) => (
                    <AnalizCard 
                        key={index} 
                        item={item} 
                        onTitleClick={() => setSelectedItem(item)} 
                        onAccountCodeClick={handleAccountCodeClick}
                    />
                ))}
            </div>

            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.baslik ?? 'Analiz Detayı'}
            >
                {selectedItem && (
                    <div className="space-y-6 text-sm">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-700/50 rounded-lg">
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
            
            <Modal
                isOpen={!!selectedAccount}
                onClose={() => setSelectedAccount(null)}
                title={`Hesap Detayı: ${selectedAccount?.hesapKodu ?? ''}`}
            >
                {selectedAccount && (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900 rounded-lg text-center">
                            <p className="text-sm text-gray-400">Hesap Adı</p>
                            <p className="text-lg font-bold text-white mt-1">{selectedAccount.hesapAdi}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="text-center">
                                <h4 className="text-sm text-gray-400">Önceki Dönem</h4>
                                <p className="text-2xl font-bold mt-2">
                                    {formatCurrency(selectedAccount.oncekiDonem)}
                                </p>
                            </Card>
                            <Card className="text-center">
                                <h4 className="text-sm text-gray-400">Cari Dönem</h4>
                                <p className="text-2xl font-bold mt-2">
                                    {formatCurrency(selectedAccount.cariDonem)}
                                </p>
                            </Card>
                        </div>

                        {selectedAccount.hesapAdi === "Hesap bulunamadı" &&
                            <p className="text-center text-yellow-400 mt-4 text-xs">Bu hesap koduna ait detaylar mizan verileri arasında bulunamadı.</p>
                        }
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