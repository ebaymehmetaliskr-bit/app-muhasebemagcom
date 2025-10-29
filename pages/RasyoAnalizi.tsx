
import React from 'react';
import { RasyoData } from '../types';
import { Card } from '../components/ui/Card';
import { SimplePieChart, SimpleBarChart } from '../components/charts/Charts';

const RatioCard: React.FC<{ title: string; cari: number; onceki: number; formula?: string }> = ({ title, cari, onceki, formula }) => (
    <Card className="bg-slate-800/50">
        <h4 className="text-gray-400 text-sm">{title}</h4>
        <p className="text-3xl font-bold text-white my-1">{cari.toFixed(3)}</p>
        <p className="text-xs text-gray-500">Önceki: {onceki.toFixed(3)}</p>
        {formula && <p className="text-xs text-gray-600 mt-2">{formula}</p>}
    </Card>
);

export const RasyoAnalizi: React.FC<{ data: RasyoData }> = ({ data }) => {
    const { finansalYapi, likidite, devirHizlari } = data;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">{finansalYapi.title}</h2>
                <p className="text-gray-400">İşletmenin finansal yapısını gösteren kapsamlı oranlar</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {finansalYapi.ratios.map(r => <RatioCard key={r.name} title={r.name} cari={r.cariDonem} onceki={r.oncekiDonem} />)}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {finansalYapi.ratios.map(r => (
                        <Card key={r.name + "-detail"}>
                            <h4 className="font-semibold">{r.name}</h4>
                            <div className="flex justify-between items-baseline mt-2">
                                <span className="text-xs text-gray-400">Cari Dönem:</span>
                                <span className="font-bold text-lg text-cyan-400">{r.cariDonem.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                                <span className="text-xs text-gray-400">Önceki Dönem:</span>
                                <span>{r.oncekiDonem.toFixed(3)}</span>
                            </div>
                            {r.formula && <p className="text-[10px] text-gray-500 mt-2">{r.formula}</p>}
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white">{likidite.title}</h2>
                <p className="text-gray-400">İşletmenin kısa vadeli borçlarını ödeme kabiliyetini analiz eder</p>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                       {likidite.ratios.map(r => <RatioCard key={r.name} title={r.name} cari={r.cariDonem} onceki={r.oncekiDonem} />)}
                    </div>
                    <Card title="Dönen Varlık Dağılımı" className="lg:col-span-2">
                        <SimplePieChart data={likidite.dagilim} />
                    </Card>
                </div>
            </div>

             <div>
                <h2 className="text-2xl font-bold text-white">{devirHizlari.title}</h2>
                <p className="text-gray-400">İşletmenin varlık ve kaynak kullanım etkinliğini analiz eder</p>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                       {devirHizlari.ratios.map(r => <RatioCard key={r.name} title={r.name} cari={r.cariDonem} onceki={r.oncekiDonem} />)}
                    </div>
                    <Card title="Devir Hızları Karşılaştırması" className="lg:col-span-2">
                         <SimpleBarChart data={devirHizlari.karsilastirma} keys={['Cari Dönem', 'Önceki Dönem']} layout="vertical" />
                    </Card>
                </div>
            </div>
        </div>
    );
};
