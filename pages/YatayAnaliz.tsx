
import React from 'react';
import { BilancoData, GelirGiderItem } from '../types';
import { Card } from '../components/ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from '../components/ui/Icons';

const formatCurrency = (value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

const YatayAnalizTable: React.FC<{ title: string; data: { ad: string; onceki: number; cari: number }[] }> = ({ title, data }) => (
    <Card>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-xs text-gray-500 mb-4">Dönemler arası değişim: (Cari Dönem - Önceki Dönem) / Önceki Dönem x 100</p>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 uppercase bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-left font-medium">Hesap Adı</th>
                        <th scope="col" className="px-6 py-4 text-right font-medium">Önceki Dönem</th>
                        <th scope="col" className="px-6 py-4 text-right font-medium">Cari Dönem</th>
                        <th scope="col" className="px-6 py-4 text-right font-medium">Değişim Tutarı</th>
                        <th scope="col" className="px-6 py-4 text-right font-medium">Artış/Azalış %</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {data.map((item, idx) => {
                        const degisim = item.cari - item.onceki;
                        const yuzde = item.onceki !== 0 ? (degisim / Math.abs(item.onceki)) * 100 : (item.cari > 0 ? Infinity : 0);
                        const isPositive = degisim > 0;

                        return (
                            <tr key={idx} className="hover:bg-slate-700/50 transition-colors duration-150">
                                <td className="px-6 py-3 font-medium text-white">{item.ad}</td>
                                <td className="px-6 py-3 text-right font-mono">{formatCurrency(item.onceki)}</td>
                                <td className="px-6 py-3 text-right font-mono">{formatCurrency(item.cari)}</td>
                                <td className={`px-6 py-3 text-right font-mono font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatCurrency(degisim)}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <div className={`flex items-center justify-end font-bold text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        <span className="ml-1 font-mono">{isFinite(yuzde) ? yuzde.toFixed(2) : '---'}</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </Card>
);

export const YatayAnaliz: React.FC<{ bilancoData: BilancoData; gelirGiderData: GelirGiderItem[] }> = ({ bilancoData, gelirGiderData }) => {
    
    const bilancoAnalizData = bilancoData.aktif[0].stoklar.map(s => ({
        ad: s.aciklama,
        onceki: s.oncekiDonem,
        cari: s.cariDonem
    }));

    const gelirGiderAnalizData = gelirGiderData.slice(0, 5).map(item => ({
        ad: item.aciklama,
        onceki: item.oncekiDonem,
        cari: item.cariDonem
    }));
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Yatay Analiz</h2>
            <p className="text-gray-400 -mt-4">Dönemler arası değişim analizi</p>
            
            <div className="space-y-6">
                <YatayAnalizTable title="Bilanço Yatay Analizi" data={bilancoAnalizData} />
                <YatayAnalizTable title="Gelir Tablosu Yatay Analizi" data={gelirGiderAnalizData} />
            </div>
        </div>
    );
};
