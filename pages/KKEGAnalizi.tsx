import React from 'react';
import { KKEGItem } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { InfoIcon, BookIcon, WarningIcon, DownloadIcon } from '../components/ui/Icons';
import { exportToCsv } from '../utils/exportUtils';

interface KKEGAnaliziProps {
    data: KKEGItem[];
    onHighlightAccount: (hesapKodu: string) => void;
}

const KURUMAR_VERGISI_ORANI = 0.25;

export const KKEGAnalizi: React.FC<KKEGAnaliziProps> = ({ data, onHighlightAccount }) => {

    const toplamKKEG = data.reduce((sum, item) => sum + item.tutar, 0);
    const vergiEtkisi = toplamKKEG * KURUMAR_VERGISI_ORANI;

    const handleExport = () => {
        const headers = [
            { key: 'giderAciklamasi', label: 'Gider Açıklaması' },
            { key: 'tutar', label: 'Tutar' },
            { key: 'gerekce', label: 'Gerekçe' },
            { key: 'dayanakMevzuat', label: 'Dayanak Mevzuat' },
            { key: 'ilgiliHesapKodlari', label: 'İlgili Hesap Kodları' },
        ];
        const dataToExport = data.map(item => ({
            ...item,
            ilgiliHesapKodlari: item.ilgiliHesapKodlari.join(', '),
        }));
        exportToCsv('kkeg_analizi', dataToExport, headers);
    };

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">Kanunen Kabul Edilmeyen Giderler (KKEG) Analizi</h2>
                    <p className="text-gray-400">Vergi matrahını doğrudan etkileyen, gider olarak kabul edilmeyen kalemlerin dökümü.</p>
                </div>
                 <button
                    onClick={handleExport}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    title="Excel'e Aktar"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Aktar</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="text-gray-400 text-sm mb-2">Toplam Tespit Edilen KKEG Tutarı</h3>
                    <p className="text-3xl font-bold text-red-400">{formatCurrency(toplamKKEG)}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-400 text-sm mb-2">Vergi Matrahına Potansiyel Etkisi (%{KURUMAR_VERGISI_ORANI * 100})</h3>
                    <p className="text-3xl font-bold text-orange-400">{formatCurrency(vergiEtkisi)}</p>
                    <p className="text-xs text-gray-500 mt-1">Bu tutar kadar daha fazla vergi ödenebilir.</p>
                </Card>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-xs text-gray-400 uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-left">Gider Açıklaması</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Tutar</th>
                                <th scope="col" className="px-6 py-4 font-medium text-left">Dayanak Mevzuat</th>
                                <th scope="col" className="px-6 py-4 font-medium text-center">İlgili Hesaplar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150 group">
                                    <td className="px-6 py-4 font-medium text-white align-top">
                                        <div className="flex items-start gap-3">
                                            <div>
                                                {item.giderAciklamasi}
                                                <div className="relative">
                                                     <p className="text-xs text-gray-400 mt-2 flex items-center gap-1 cursor-help w-fit">
                                                        <InfoIcon className="w-3 h-3"/> Gerekçe
                                                     </p>
                                                     <div className="absolute z-10 bottom-full mb-2 w-72 p-3 bg-slate-900 border border-slate-600 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                         <h5 className="font-bold mb-1 flex items-center gap-2"><WarningIcon className="w-4 h-4 text-yellow-400"/> AI Gerekçesi</h5>
                                                         {item.gerekce}
                                                     </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono align-top">{formatCurrency(item.tutar)}</td>
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex items-center gap-1 text-xs font-semibold bg-purple-600/50 text-purple-200 px-2 py-1 rounded w-fit">
                                            <BookIcon className="w-3 h-3"/>
                                            {item.dayanakMevzuat}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                         <div className="flex flex-wrap gap-2 justify-center">
                                            {item.ilgiliHesapKodlari.map(kod => (
                                                <button 
                                                    key={kod} 
                                                    onClick={() => onHighlightAccount(kod)}
                                                    className="text-xs font-semibold bg-blue-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-blue-500 transition-colors"
                                                >
                                                    {kod}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};