import React from 'react';
import { RasyoGrup, PieChartData } from '../types';
import { RatioCard } from '../components/ui/RatioCard';
import { Card } from '../components/ui/Card';
import { SimplePieChart } from '../components/charts/Charts';
import { LightbulbIcon } from '../components/ui/Icons';

interface FinansalYapiOranlariProps {
    data: RasyoGrup;
}

export const FinansalYapiOranlari: React.FC<FinansalYapiOranlariProps> = ({ data }) => {
    
    const leverageRatio = data.ratios.find(r => r.name === 'Kaldıraç Oranı')?.cariDonem || 0;
    const equityRatio = data.ratios.find(r => r.name === 'Öz Kaynak Oranı')?.cariDonem || 0;

    const capitalStructureData: PieChartData[] = [
        { name: 'Yabancı Kaynaklar', value: leverageRatio },
        { name: 'Öz Kaynaklar', value: equityRatio },
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">{data.title}</h2>
            <p className="text-gray-400 -mt-6">İşletmenin borçlanma düzeyi, finansal riski ve sermaye yapısı hakkında bilgi veren oranlar.</p>
            
            <Card title="Finansal Yapı Özeti">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="flex flex-col items-center">
                        <h4 className="font-semibold mb-2 text-gray-300">Sermaye Yapısı (Varlıkların Finansmanı)</h4>
                        <SimplePieChart data={capitalStructureData} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                            <LightbulbIcon className="w-6 h-6 text-yellow-400" />
                            AI Değerlendirmesi
                        </h4>
                        <p className="text-sm text-cyan-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700 italic">
                            {data.ozet}
                        </p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.ratios.map(ratio => (
                    <RatioCard key={ratio.name} ratio={ratio} />
                ))}
            </div>
        </div>
    );
};
