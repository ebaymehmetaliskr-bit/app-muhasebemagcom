import React from 'react';
import { RasyoItem } from '../../types';
import { Card } from './Card';
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from './Icons';

interface RatioCardProps {
    ratio: RasyoItem;
}

const TrendIndicator: React.FC<{ cari: number, onceki: number }> = ({ cari, onceki }) => {
    if (onceki === 0 && cari === 0) return null;
    const change = cari - onceki;
    const isPositive = change >= 0;

    const percentageChange = onceki !== 0 
        ? ((change / Math.abs(onceki)) * 100) 
        : (cari !== 0 ? Infinity : 0);

    const changeText = isFinite(percentageChange)
        ? `${isPositive ? '+' : ''}${percentageChange.toFixed(1)}%`
        : (isPositive ? '∞' : '-∞');

    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const changeBgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';

    return (
        <div className={`flex items-center px-2 py-1 rounded-md text-xs font-bold ${changeBgColor} ${changeColor}`}>
            {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            <span className="ml-1">{changeText}</span>
        </div>
    );
};


export const RatioCard: React.FC<RatioCardProps> = ({ ratio }) => {
    
    // Check if the value is a rate/ratio (float) or a 'day' count.
    const formatValue = (value: number) => {
        if (value % 1 !== 0 || Math.abs(value) < 5) {
            return value.toFixed(3);
        }
        return value.toFixed(1);
    }
    
    return (
        <Card className="flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white pr-2">{ratio.name}</h4>
                    <TrendIndicator cari={ratio.cariDonem} onceki={ratio.oncekiDonem} />
                </div>
                <p className="text-3xl font-bold text-white my-1">{formatValue(ratio.cariDonem)}</p>
                <p className="text-xs text-gray-500">Önceki Dönem: {formatValue(ratio.oncekiDonem)}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                <div className="text-xs">
                    <p className="font-semibold text-gray-500 mb-1">Formül:</p>
                    <p className="text-gray-400 font-mono bg-slate-900/50 p-2 rounded-md">{ratio.formula}</p>
                </div>
                <div className="text-xs">
                    <p className="font-semibold text-gray-500 mb-1 flex items-center gap-1"><InfoIcon className="w-4 h-4"/> AI Yorumu:</p>
                    <p className="text-cyan-300">{ratio.yorum}</p>
                </div>
            </div>
        </Card>
    );
};
