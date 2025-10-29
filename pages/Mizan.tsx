import React, { useState, useMemo } from 'react';
import { MizanItem } from '../types';
import { Card } from '../components/ui/Card';
import { ArrowUpIcon, ArrowDownIcon } from '../components/ui/Icons';
import { formatCurrency } from '../utils/formatters';

interface MizanProps {
    data: MizanItem[];
}

const ChangeIndicator: React.FC<{ change: number }> = ({ change }) => {
    if (change === 0) return <span className="text-gray-500">-</span>;
    const isPositive = change > 0;
    const isInfinite = !isFinite(change);

    return (
        <div className={`flex items-center justify-end px-2 py-1 rounded-md text-xs font-bold ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            <span className="ml-1">
                {isInfinite ? '100.0%' : `${Math.abs(change).toFixed(1)}%`}
            </span>
        </div>
    );
};

export const Mizan: React.FC<MizanProps> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.hesapAdi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.hesapKodu.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Mizan Tablosu</h2>
            
            <Card>
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <h3 className="text-lg font-semibold">{filteredData.length} hesap gösteriliyor</h3>
                    <div className="w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Hesap kodu veya adı ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
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
                                <th scope="col" className="px-6 py-4 font-medium text-right">Değişim</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => {
                                const change = item.oncekiDonem === 0 
                                    ? (item.cariDonem > 0 ? Infinity : 0) 
                                    : ((item.cariDonem - item.oncekiDonem) / Math.abs(item.oncekiDonem)) * 100;
                                
                                let rowClass;
                                if (item.isMain) {
                                    rowClass = 'bg-blue-900/30 font-bold hover:bg-blue-900/50 hover:border-blue-400';
                                } else if (item.isSub) {
                                    rowClass = 'bg-slate-800/50 font-semibold hover:bg-slate-700/80 hover:border-slate-500';
                                } else {
                                    rowClass = 'hover:bg-slate-700/50 hover:border-slate-500';
                                }

                                return (
                                    <tr key={item.hesapKodu} className={`border-b border-slate-700 border-l-2 border-transparent transition-all duration-150 ${rowClass}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.hesapKodu}</td>
                                        <td className="px-6 py-4 font-medium text-white">{item.hesapAdi}</td>
                                        <td className="px-6 py-4 text-right font-mono">{formatCurrency(item.oncekiDonem)}</td>
                                        <td className="px-6 py-4 text-right font-mono">{formatCurrency(item.cariDonem)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {!item.isMain && !item.isSub && <ChangeIndicator change={change} />}
                                        </td>
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