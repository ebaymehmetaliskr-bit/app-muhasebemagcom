import React, { useState, useMemo, useEffect } from 'react';
import { MizanItem } from '../types';
import { Card } from '../components/ui/Card';
import { DownloadIcon, ArrowUpIcon, ArrowDownIcon } from '../components/ui/Icons';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { exportToCsv } from '../utils/exportUtils';

interface MizanProps {
    data: MizanItem[];
    highlightedAccountCode: string | null;
    onHighlightComplete: () => void;
}

const ChangeIndicator: React.FC<{ change: number }> = ({ change }) => {
    if (isNaN(change) || !isFinite(change) || change === 0) {
        return <span className="text-gray-500">-</span>;
    }

    const isPositive = change > 0;
    const color = isPositive ? 'text-green-400' : 'text-red-400';

    return (
        <span className={`flex items-center justify-end font-semibold ${color}`}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {formatPercent(Math.abs(change))}
        </span>
    );
};


export const Mizan: React.FC<MizanProps> = ({ data, highlightedAccountCode, onHighlightComplete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.hesapAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.hesapKodu.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    useEffect(() => {
        if (highlightedAccountCode) {
            setSearchTerm(highlightedAccountCode);
        }
    }, [highlightedAccountCode]);

    useEffect(() => {
        if (highlightedAccountCode) {
            const timer = setTimeout(() => {
                const element = document.getElementById(`mizan-row-${highlightedAccountCode}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-row');
                    
                    const animationTimer = setTimeout(() => {
                        element.classList.remove('highlight-row');
                        onHighlightComplete();
                    }, 2500);

                    return () => clearTimeout(animationTimer);
                } else {
                    onHighlightComplete();
                }
            }, 100); 
            return () => clearTimeout(timer);
        }
    }, [filteredData, highlightedAccountCode, onHighlightComplete]);

    const handleExport = () => {
        const headers = [
            { key: 'hesapKodu', label: 'Hesap Kodu' },
            { key: 'hesapAdi', label: 'Hesap Adı' },
            { key: 'oncekiDonem', label: 'Önceki Dönem' },
            { key: 'cariDonem', label: 'Cari Dönem' },
        ];
        exportToCsv('mizan', filteredData, headers);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Mizan Tablosu</h2>
            
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <h3 className="text-lg font-semibold">{filteredData.length} hesap gösteriliyor</h3>
                     <div className="flex w-full md:w-auto items-center gap-2">
                        <input
                            type="text"
                            placeholder="Hesap kodu veya adı ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-72 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                            title="Excel'e Aktar"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            <span>Aktar</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-800 text-xs text-gray-400 uppercase">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-left">Hesap Kodu</th>
                                <th scope="col" className="px-6 py-4 font-medium text-left">Hesap Adı</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Önceki Dönem</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Cari Dönem</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Değişim (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => {
                                let rowClass;
                                if (item.isMain) {
                                    rowClass = 'bg-blue-900/30 font-bold hover:bg-blue-900/50 hover:border-blue-400';
                                } else if (item.isSub) {
                                    rowClass = 'bg-slate-800/50 font-semibold hover:bg-slate-700/80 hover:border-slate-500';
                                } else {
                                    rowClass = 'hover:bg-slate-700/50 hover:border-slate-500';
                                }
                                
                                const change = item.oncekiDonem !== 0 
                                    ? ((item.cariDonem - item.oncekiDonem) / Math.abs(item.oncekiDonem)) * 100 
                                    : (item.cariDonem !== 0 ? Infinity : 0);

                                return (
                                    <tr key={item.hesapKodu} id={`mizan-row-${item.hesapKodu}`} className={`border-b border-slate-700 border-l-2 border-transparent transition-all duration-150 ${rowClass}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.hesapKodu}</td>
                                        <td className="px-6 py-4 font-medium text-white">{item.hesapAdi}</td>
                                        <td className="px-6 py-4 text-right font-mono">{formatCurrency(item.oncekiDonem)}</td>
                                        <td className="px-6 py-4 text-right font-mono">{formatCurrency(item.cariDonem)}</td>
                                        <td className="px-6 py-4 text-right font-mono"><ChangeIndicator change={change} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
