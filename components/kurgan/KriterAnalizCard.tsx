import React from 'react';
import { KurganKriterAnalizi } from '../../types';
import { Card } from '../ui/Card';
import { InfoIcon } from '../ui/Icons';

export const getRiskColorClasses = (risk: 'Düşük' | 'Orta' | 'Yüksek' | 'Tespit Edilmedi') => {
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

export const KriterAnalizCard: React.FC<{ kriter: KurganKriterAnalizi, onSelect: () => void }> = ({ kriter, onSelect }) => {
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