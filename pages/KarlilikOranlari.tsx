import React from 'react';
import { RasyoGrup } from '../types';
import { RatioCard } from '../components/ui/RatioCard';

interface KarlilikOranlariProps {
    data: RasyoGrup;
}

export const KarlilikOranlari: React.FC<KarlilikOranlariProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">{data.title}</h2>
            <p className="text-gray-400 -mt-4">İşletmenin faaliyet sonuçlarının etkinliğini ve kâr elde etme yeteneğini ölçen oranlar.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.ratios.map(ratio => (
                    <RatioCard key={ratio.name} ratio={ratio} />
                ))}
            </div>
        </div>
    );
};