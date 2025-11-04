import React, { useMemo } from 'react';
import { BilancoData, GelirGiderItem } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { DownloadIcon } from '../components/ui/Icons';
import { exportToCsv } from '../utils/exportUtils';
import { SimpleBarChart } from '../components/charts/Charts';

interface YatayAnalizProps {
    bilancoData: BilancoData;
    gelirGiderData: GelirGiderItem[];
}

interface TableRow {
    aciklama: string;
    oncekiDonem: number;
    cariDonem: number;
    isMain?: boolean;
    isSub?: boolean;
}

const getSignificantChanges = (items: { aciklama: string; oncekiDonem: number; cariDonem: number }[], count: number = 8) => {
    const changes = items
        .map(item => ({
            name: item.aciklama.replace(/^(\.\.\s*)/, ''),
            'Fark (Tutar)': item.cariDonem - item.oncekiDonem,
        }))
        .filter(item => 
            item['Fark (Tutar)'] !== 0 && 
            !item.name.toLowerCase().includes('toplam') &&
            !item.name.toLowerCase().includes('varlıklar') &&
            !item.name.toLowerCase().includes('kaynaklar') &&
            !/^[A-Z]\.\s/.test(item.name) && // Filter out headings like 'A. Hazır Değerler'
            !/^[IVX]+\.\s/.test(item.name) // Filter out headings like 'I. Dönen Varlıklar'
        );

    changes.sort((a, b) => Math.abs(b['Fark (Tutar)']) - Math.abs(a['Fark (Tutar)']));
    
    // Reverse for vertical bar chart to show largest at top
    return changes.slice(0, count).reverse();
};

const YatayAnalizTable: React.FC<{ title: string; data: TableRow[] }> = ({ title, data }) => {
    
    const hasPrevPeriodData = data.some(item => item.oncekiDonem !== 0);

    if (!hasPrevPeriodData) {
        return (
            <Card>
                 <h3 className="text-lg font-bold mb-4">{title}</h3>
                 <p className="text-gray-400">Yatay analiz için karşılaştırılacak bir önceki dönem verisi bulunamadı.</p>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-lg font-bold mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                        <tr>
                            <th className="px-4 py-2 text-left">Hesap Adı</th>
                            <th className="px-4 py-2 text-right">Önceki Dönem</th>
                            <th className="px-4 py-2 text-right">Cari Dönem</th>
                            <th className="px-4 py-2 text-right">Fark (Tutar)</th>
                            <th className="px-4 py-2 text-right">Fark (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {data.map((item, idx) => {
                            const farkTutar = item.cariDonem - item.oncekiDonem;
                            const farkYuzde = item.oncekiDonem !== 0 ? (farkTutar / Math.abs(item.oncekiDonem)) * 100 : (item.cariDonem !== 0 ? Infinity : 0);
                            
                            const rowClass = item.isMain ? 'font-bold bg-slate-800/60' : item.isSub ? 'font-semibold' : '';

                            return (
                                <tr key={idx} className={`hover:bg-slate-700/50 ${rowClass}`}>
                                    <td className="px-4 py-2">{item.aciklama}</td>
                                    <td className="px-4 py-2 text-right font-mono">{formatCurrency(item.oncekiDonem)}</td>
                                    <td className="px-4 py-2 text-right font-mono">{formatCurrency(item.cariDonem)}</td>
                                    <td className="px-4 py-2 text-right font-mono">{formatCurrency(farkTutar)}</td>
                                    <td className={`px-4 py-2 text-right font-mono font-semibold ${farkYuzde >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {isFinite(farkYuzde) ? formatPercent(farkYuzde) : 'N/A'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export const YatayAnaliz: React.FC<YatayAnalizProps> = ({ bilancoData, gelirGiderData }) => {
    
    const bilancoFlatDataForTable = [
        ...bilancoData.aktif.flatMap(b => [{aciklama: b.bolumAdi, oncekiDonem: 0, cariDonem: 0, isMain: true}, ...b.stoklar.map(s => ({...s, isSub: !s.aciklama.startsWith('..')}))]),
        ...bilancoData.pasif.flatMap(b => [{aciklama: b.bolumAdi, oncekiDonem: 0, cariDonem: 0, isMain: true}, ...b.stoklar.map(s => ({...s, isSub: !s.aciklama.startsWith('..')}))])
    ];

    const bilancoFlatDataForChart = [
        ...bilancoData.aktif.flatMap(b => b.stoklar),
        ...bilancoData.pasif.flatMap(b => b.stoklar)
    ];

    const bilancoChartData = useMemo(() => getSignificantChanges(bilancoFlatDataForChart), [bilancoData]);
    const gelirGiderChartData = useMemo(() => getSignificantChanges(gelirGiderData), [gelirGiderData]);

    const handleExport = () => {
        const dataToExport = [
            { type: 'Bilanço', data: bilancoFlatDataForTable },
            { type: 'Gelir Tablosu', data: gelirGiderData }
        ].flatMap(table => 
            table.data.map(item => {
                const farkTutar = item.cariDonem - item.oncekiDonem;
                const farkYuzde = item.oncekiDonem !== 0 ? (farkTutar / Math.abs(item.oncekiDonem)) * 100 : 0;
                return {
                    Tablo: table.type,
                    Açıklama: item.aciklama,
                    'Önceki Dönem': item.oncekiDonem,
                    'Cari Dönem': item.cariDonem,
                    'Fark (Tutar)': farkTutar,
                    'Fark (%)': farkYuzde.toFixed(2),
                };
            })
        );
        
        const headers = [
            { key: 'Tablo', label: 'Tablo' },
            { key: 'Açıklama', label: 'Açıklama' },
            { key: 'Önceki Dönem', label: 'Önceki Dönem' },
            { key: 'Cari Dönem', label: 'Cari Dönem' },
            { key: 'Fark (Tutar)', label: 'Fark (Tutar)' },
            { key: 'Fark (%)', label: 'Fark (%)' },
        ];
        exportToCsv('yatay_analiz', dataToExport, headers);
    };

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">Yatay Analiz (Karşılaştırmalı Tablolar)</h2>
                    <p className="text-gray-400">Finansal tabloların birbirini izleyen iki dönem arasındaki değişimini inceleme.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Bilanço - Öne Çıkan Değişimler">
                    <SimpleBarChart 
                        data={bilancoChartData}
                        keys={['Fark (Tutar)']}
                        layout="vertical"
                    />
                </Card>
                <Card title="Gelir Tablosu - Öne Çıkan Değişimler">
                     <SimpleBarChart 
                        data={gelirGiderChartData}
                        keys={['Fark (Tutar)']}
                        layout="vertical"
                    />
                </Card>
            </div>

            <YatayAnalizTable title="Bilanço Yatay Analizi" data={bilancoFlatDataForTable} />
            <YatayAnalizTable title="Gelir Tablosu Yatay Analizi" data={gelirGiderData} />
        </div>
    );
};