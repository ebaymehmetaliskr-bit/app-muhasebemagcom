
import React from 'react';
import { GelirGiderItem } from '../types';
import { Card } from '../components/ui/Card';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

export const GelirGider: React.FC<{ data: GelirGiderItem[] }> = ({ data }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gelir ve Gider</h2>
            <Card title="GELİR TABLOSU">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-xs text-gray-400 uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left font-medium">Açıklama</th>
                                <th scope="col" className="px-6 py-4 text-right font-medium">Önceki Dönem</th>
                                <th scope="col" className="px-6 py-4 text-right font-medium">Cari Dönem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors duration-150">
                                    <td className="px-6 py-4 font-medium text-white">{item.aciklama}</td>
                                    <td className={`px-6 py-4 text-right font-mono ${item.oncekiDonem < 0 ? 'text-red-400' : ''}`}>
                                        {formatCurrency(item.oncekiDonem)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono ${item.cariDonem < 0 ? 'text-red-400' : ''}`}>
                                        {formatCurrency(item.cariDonem)}
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
