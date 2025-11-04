import React from 'react';
import { BilancoData, GelirGiderItem } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency, formatPercent } from '../utils/formatters';

const DikeyAnalizTable: React.FC<{ 
    title: string; 
    data: { ad: string; cariTutar: number; oncekiTutar: number }[]; 
    toplamCari: number;
    toplamOnceki: number;
}> = ({ title, data, toplamCari, toplamOnceki }) => (
    <Card>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                    <tr>
                        <th className="px-4 py-2 text-left">Hesap Adı</th>
                        <th className="px-4 py-2 text-right">Önceki Dönem Tutar</th>
                        <th className="px-4 py-2 text-right">Önceki Dönem %</th>
                        <th className="px-4 py-2 text-right">Cari Dönem Tutar</th>
                        <th className="px-4 py-2 text-right">Cari Dönem %</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-700/50">
                            <td className="px-4 py-2">{item.ad}</td>
                            <td className="px-4 py-2 text-right font-mono">{formatCurrency(item.oncekiTutar)}</td>
                            <td className="px-4 py-2 text-right font-semibold text-cyan-400">{formatPercent((item.oncekiTutar / toplamOnceki) * 100)}</td>
                            <td className="px-4 py-2 text-right font-mono">{formatCurrency(item.cariTutar)}</td>
                            <td className="px-4 py-2 text-right font-semibold text-cyan-400">{formatPercent((item.cariTutar / toplamCari) * 100)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);


export const DikeyAnaliz: React.FC<{ bilancoData: BilancoData; gelirGiderData: GelirGiderItem[] }> = ({ bilancoData, gelirGiderData }) => {
    
    const bilancoAnalizData = bilancoData.aktif.flatMap(b => b.stoklar).map(s => ({
        ad: s.aciklama,
        cariTutar: s.cariDonem,
        oncekiTutar: s.oncekiDonem,
    }));
    
    const toplamAktifCari = bilancoData.aktif.reduce((sum, bolum) => sum + bolum.stoklar.reduce((s, stok) => s + stok.cariDonem, 0), 0);
    const toplamAktifOnceki = bilancoData.aktif.reduce((sum, bolum) => sum + bolum.stoklar.reduce((s, stok) => s + stok.oncekiDonem, 0), 0);

    const gelirGiderAnalizData = gelirGiderData.map(item => ({
        ad: item.aciklama,
        cariTutar: item.cariDonem,
        oncekiTutar: item.oncekiDonem
    }));
    const brutSatislarCari = gelirGiderData.find(i => i.aciklama.toUpperCase().includes('BRÜT SATIŞLAR'))?.cariDonem || 1;
    const brutSatislarOnceki = gelirGiderData.find(i => i.aciklama.toUpperCase().includes('BRÜT SATIŞLAR'))?.oncekiDonem || 1;


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Dikey Analiz</h2>
            <p className="text-gray-400 -mt-4">Bilanço ve Gelir Tablosunun oransal analizi</p>
            
            <div className="space-y-6">
                <DikeyAnalizTable 
                    title="Bilanço Dikey Analizi (Aktifler)" 
                    data={bilancoAnalizData} 
                    toplamCari={toplamAktifCari} 
                    toplamOnceki={toplamAktifOnceki} 
                />
                <DikeyAnalizTable 
                    title="Gelir Tablosu Dikey Analizi" 
                    data={gelirGiderAnalizData} 
                    toplamCari={brutSatislarCari} 
                    toplamOnceki={brutSatislarOnceki} 
                />
            </div>
        </div>
    );
};
