import React from 'react';
import { GelirGiderItem } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { DownloadIcon } from '../components/ui/Icons';
import { exportToCsv } from '../utils/exportUtils';

export const GelirGider: React.FC<{ data: GelirGiderItem[] }> = ({ data }) => {
    
    const handleExport = () => {
        const headers = [
            { key: 'aciklama', label: 'Açıklama' },
            { key: 'oncekiDonem', label: 'Önceki Dönem' },
            { key: 'cariDonem', label: 'Cari Dönem' },
        ];
        exportToCsv('gelir_gider', data, headers);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-white">Gelir ve Gider</h2>
                <button
                    onClick={handleExport}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    title="Excel'e Aktar"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Aktar</span>
                </button>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">GELİR TABLOSU</h3>
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
                                    <td className="px-6 py-4 text-right font-mono">
                                        {formatCurrency(item.oncekiDonem)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">
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
