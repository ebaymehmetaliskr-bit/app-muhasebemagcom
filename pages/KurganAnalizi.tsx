import React, { useState } from 'react';
import { KurganAnaliz, KurganKriterAnalizi } from '../types';
import { Card } from '../components/ui/Card';
import { ChecklistIcon, InfoIcon, ReportIcon, VergiselAnalizIcon, WarningIcon } from '../components/ui/Icons';
import { Modal } from '../components/ui/Modal';


const getRiskColorClasses = (risk: 'Düşük' | 'Orta' | 'Yüksek' | 'Tespit Edilmedi') => {
    switch (risk) {
        case 'Düşük':
            return {
                bg: 'bg-green-600', text: 'text-green-100', border: 'border-green-500', iconText: 'text-green-400'
            };
        case 'Orta':
            return {
                bg: 'bg-yellow-600', text: 'text-yellow-100', border: 'border-yellow-500', iconText: 'text-yellow-400'
            };
        case 'Yüksek':
            return {
                bg: 'bg-red-600', text: 'text-red-100', border: 'border-red-500', iconText: 'text-red-400'
            };
        case 'Tespit Edilmedi':
        default:
            return {
                bg: 'bg-slate-600', text: 'text-slate-100', border: 'border-slate-500', iconText: 'text-slate-400'
            };
    }
};

const KriterAnalizCard: React.FC<{ kriter: KurganKriterAnalizi, onSelect: () => void }> = ({ kriter, onSelect }) => {
    const { bg, text } = getRiskColorClasses(kriter.riskDurumu);

    return (
        <Card className={`group transition-all hover:shadow-lg hover:border-blue-500/50 flex flex-col justify-between`} onClick={onSelect}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-white pr-2 flex-1">{kriter.kriterAdi}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${bg} ${text}`}>
                        {kriter.riskDurumu}
                    </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                    {kriter.analizDetayi.substring(0, 100)}{kriter.analizDetayi.length > 100 ? '...' : ''}
                </p>
            </div>
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-700/50">
                <div className="flex flex-wrap gap-1">
                     {kriter.ilgiliHesaplar.slice(0, 3).map(kod => (
                        <span key={kod} className="text-[10px] font-semibold bg-slate-600 text-white px-2 py-0.5 rounded">
                            {kod}
                        </span>
                    ))}
                    {kriter.ilgiliHesaplar.length > 3 && <span className="text-[10px] text-gray-400">...</span>}
                </div>
                <InfoIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
            </div>
        </Card>
    );
};


export const KurganAnalizi: React.FC<{ data: KurganAnaliz }> = ({ data }) => {
    const [selectedKriter, setSelectedKriter] = useState<KurganKriterAnalizi | null>(null);
    
    const { bg: genelBg, text: genelText, iconText } = getRiskColorClasses(data.genelRiskDurumu);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Kurgan Analizi - Sahte Belge Risk Değerlendirmesi</h2>
                <p className="text-gray-400">Yapay zekanın, VDK KURGAN metodolojisi ve 13 kritere göre yaptığı SMİYB risk analizi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-gray-400 text-sm mb-2">Genel Risk Durumu</h3>
                     <div className={`px-6 py-2 text-2xl font-bold rounded-lg ${genelBg} ${genelText}`}>
                        {data.genelRiskDurumu.toUpperCase()}
                    </div>
                    <VergiselAnalizIcon className={`w-24 h-24 mt-4 ${iconText}`} />
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                        <ReportIcon className="w-6 h-6 text-blue-400" />
                        AI Risk Özeti
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm italic">{data.riskOzeti}</p>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">13 Kast Değerlendirme Kriteri Analizi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.kriterAnalizleri.map((kriter) => (
                        <KriterAnalizCard key={kriter.kriterAdi} kriter={kriter} onSelect={() => setSelectedKriter(kriter)} />
                    ))}
                </div>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <ChecklistIcon className="w-6 h-6 text-cyan-400"/>
                    Risk Azaltıcı Aksiyon Önerileri
                </h3>
                <ul className="space-y-3">
                    {data.aksiyonOnerileri.map((item, index) => (
                        <li key={index} className="flex items-start p-3 bg-slate-700/50 rounded-lg">
                            <svg className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span className="text-sm text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <Modal
                isOpen={!!selectedKriter}
                onClose={() => setSelectedKriter(null)}
                title={selectedKriter?.kriterAdi ?? 'Kriter Detayı'}
            >
                {selectedKriter && (
                     <div className="space-y-5 text-sm">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-700/50 rounded-lg">
                             <div>
                                 <p className="text-xs text-gray-400 mb-1">Risk Durumu</p>
                                <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${getRiskColorClasses(selectedKriter.riskDurumu).bg}`}>
                                     {selectedKriter.riskDurumu}
                                 </span>
                             </div>
                             <div className="sm:text-right">
                                 <p className="text-xs text-gray-400 mb-1">Mevzuat Referansı</p>
                                 <span className="text-xs font-mono bg-slate-600 text-slate-100 px-2 py-1 rounded">{selectedKriter.mevzuatReferansi}</span>
                             </div>
                         </div>

                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                                <WarningIcon className="w-5 h-5 text-orange-400" />AI Analiz Detayı
                            </h4>
                            <div className="p-3 bg-slate-900/40 border border-slate-700 text-gray-300 text-sm rounded-md">
                                <p className="leading-relaxed whitespace-pre-wrap">{selectedKriter.analizDetayi}</p>
                            </div>
                        </div>

                         <div>
                             <h4 className="font-semibold text-gray-300 mb-2">Analizde Kullanılan İlgili Hesaplar</h4>
                             <div className="flex flex-wrap gap-2">
                                 {selectedKriter.ilgiliHesaplar.length > 0 ?
                                     selectedKriter.ilgiliHesaplar.map(kod => (
                                         <span key={kod} className="text-xs font-semibold bg-blue-600 text-white px-2 py-1 rounded">
                                             {kod}
                                         </span>
                                     )) : <span className="text-xs text-gray-500">Bu analiz için spesifik hesap kullanılmadı.</span>
                                 }
                             </div>
                         </div>
                     </div>
                )}
            </Modal>
        </div>
    );
};