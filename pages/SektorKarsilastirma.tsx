import React, { useState, useEffect } from 'react';
import { AnalysisData, IndustryComparisonData } from '../types';
import { Card } from '../components/ui/Card';
import { SimpleBarChart } from '../components/charts/Charts';
import { Loader } from '../components/ui/Loader';
import { IndustryIcon, LightbulbIcon, ThumbsDownIcon, ThumbsUpIcon } from '../components/ui/Icons';
import { formatPercent } from '../utils/formatters';

interface SektorKarsilastirmaProps {
    analysisData: AnalysisData;
}

const RatioComparisonRow: React.FC<{ ratio: IndustryComparisonData['ratios'][0] }> = ({ ratio }) => {
    const isAboveAverage = ratio.companyValue > ratio.industryAverage;
    const valueClass = isAboveAverage ? 'text-green-400' : 'text-red-400';

    const formatValue = (value: number) => {
        if (ratio.name.toLowerCase().includes('marj') || ratio.name.toLowerCase().includes('oran')) {
            return formatPercent(value * 100);
        }
        if (ratio.name.toLowerCase().includes('hız') || ratio.name.toLowerCase().includes('devir')) {
             return `${value.toFixed(2)} kez`;
        }
        return value.toFixed(2);
    };

    return (
        <div className="py-4 border-b border-slate-700 last:border-b-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                    <h4 className="font-bold text-white">{ratio.name}</h4>
                </div>
                <div className="md:col-span-1 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-xs text-gray-400">Şirket Değeri</p>
                        <p className={`font-bold text-lg ${valueClass}`}>{formatValue(ratio.companyValue)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Sektör Ortalaması</p>
                        <p className="font-bold text-lg text-gray-300">{formatValue(ratio.industryAverage)}</p>
                    </div>
                </div>
                <div className="md:col-span-1 text-sm flex items-start gap-2 text-cyan-300 italic">
                     {isAboveAverage ? <ThumbsUpIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" /> : <ThumbsDownIcon className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />}
                    <p>{ratio.interpretation}</p>
                </div>
            </div>
        </div>
    );
};


export const SektorKarsilastirma: React.FC<SektorKarsilastirmaProps> = ({ analysisData }) => {
    const [comparisonData, setComparisonData] = useState<IndustryComparisonData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchComparisonData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/compare-industry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ratios: analysisData.rasyolar }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Sektör karşılaştırma verileri alınamadı.');
                }
                
                const data = await response.json();
                setComparisonData(data);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchComparisonData();
    }, [analysisData.rasyolar]);

    if (isLoading) {
        return <Loader message="Sektör verileri ve AI analizi oluşturuluyor..." />;
    }

    if (error) {
        return (
            <Card>
                <h3 className="text-xl font-bold text-red-400">Analiz Hatası</h3>
                <p className="text-gray-300 mt-2">{error}</p>
                 <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                    Tekrar Dene
                </button>
            </Card>
        );
    }
    
    if (!comparisonData) {
        return <p>Karşılaştırma verisi bulunamadı.</p>;
    }

    const chartData = comparisonData.ratios.map(r => ({
        name: r.name,
        'Şirket': r.companyValue,
        'Sektör Ortalaması': r.industryAverage,
    }));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Sektör Karşılaştırma Analizi</h2>
                <p className="text-gray-400">Şirketinizin finansal performansının sektör ortalamalarına göre değerlendirilmesi.</p>
            </div>
            
             <Card title="Genel Değerlendirme" titleIcon={<IndustryIcon className="w-6 h-6 text-blue-400" />}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-1 text-center">
                        <p className="text-sm text-gray-400">Tespit Edilen Sektör</p>
                        <p className="text-2xl font-bold text-white">{comparisonData.industryName}</p>
                    </div>
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                            <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                            AI Analist Yorumu
                        </h4>
                        <p className="text-sm text-cyan-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700 italic">
                           {comparisonData.summary}
                        </p>
                    </div>
                </div>
            </Card>

            <Card title="Oranların Karşılaştırma Grafiği">
                <p className="text-xs text-gray-400 mb-4 -mt-2">Not: Bu grafikte oranlar normalize edilmemiştir, bu nedenle mutlak değerleri değil, şirket ve sektör arasındaki göreceli farkları gözlemlemek önemlidir.</p>
                 <SimpleBarChart data={chartData} keys={['Şirket', 'Sektör Ortalaması']} />
            </Card>

            <Card title="Detaylı Oran Analizi">
                <div className="divide-y divide-slate-700">
                    {comparisonData.ratios.map(ratio => (
                        <RatioComparisonRow key={ratio.name} ratio={ratio} />
                    ))}
                </div>
            </Card>
        </div>
    );
};