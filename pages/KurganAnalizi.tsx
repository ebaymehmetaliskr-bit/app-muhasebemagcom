import React, { useState } from 'react';
import { KurganAnaliz, KurganKriterAnalizi } from '../types';
import { Card } from '../components/ui/Card';
import { ChecklistIcon, ReportIcon, VergiselAnalizIcon } from '../components/ui/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { KriterAnalizCard, getRiskColorClasses } from '../components/kurgan/KriterAnalizCard';
import { KriterDetailModal } from '../components/kurgan/KriterDetailModal';


export const KurganAnalizi: React.FC<{ data: KurganAnaliz }> = ({ data }) => {
    const [selectedKriter, setSelectedKriter] = useState<KurganKriterAnalizi | null>(null);
    
    const { bg: genelBg, text: genelText, iconText } = getRiskColorClasses(data.genelRiskDurumu);
    
    const riskLevelMap: { [key: string]: { value: number; color: string; label: string } } = {
        'Yüksek': { value: 3, color: '#ef4444', label: 'Yüksek' },
        'Orta': { value: 2, color: '#f59e0b', label: 'Orta' },
        'Düşük': { value: 1, color: '#10b981', label: 'Düşük' },
        'Tespit Edilmedi': { value: 0, color: '#6b7280', label: 'Tespit Edilmedi' },
    };

    const chartData = data.kriterAnalizleri.map(kriter => ({
        name: kriter.kriterAdi,
        riskValue: riskLevelMap[kriter.riskDurumu]?.value ?? 0,
        fill: riskLevelMap[kriter.riskDurumu]?.color ?? '#6b7280',
        riskLabel: riskLevelMap[kriter.riskDurumu]?.label ?? 'N/A',
    }));

    const formatXAxisTick = (tickValue: number) => {
        if (tickValue === 1) return 'Düşük';
        if (tickValue === 2) return 'Orta';
        if (tickValue === 3) return 'Yüksek';
        return '';
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-600 shadow-xl text-sm">
                    <p className="font-bold text-white mb-2">{data.name}</p>
                    <p style={{ color: data.fill }}>Risk Durumu: <span className="font-semibold">{data.riskLabel}</span></p>
                </div>
            );
        }
        return null;
    };


    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white">Kurgan Analizi - Sahte Belge Risk Değerlendirmesi</h2>
                <p className="text-gray-400">Yapay zekanın, VDK KURGAN metodolojisi ve 13 kritere göre yaptığı SMİYB risk analizi.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center">
                    <h3 className="text-gray-400 text-sm mb-2">Genel Risk Durumu</h3>
                     <div className={`px-6 py-2 text-2xl font-bold rounded-lg ${genelBg} ${genelText}`}>
                        {data.genelRiskDurumu.toUpperCase()}
                    </div>
                    <VergiselAnalizIcon className={`w-24 h-24 mt-4 ${iconText}`} />
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                        <ReportIcon className="w-6 h-6 text-blue-400" />
                        AI Risk Özeti
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm italic">{data.riskOzeti}</p>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                    Kriter Bazlı Risk Seviyeleri Grafiği
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            type="number"
                            domain={[0, 3]}
                            ticks={[0, 1, 2, 3]}
                            tickFormatter={formatXAxisTick}
                            stroke="#9ca3af"
                            fontSize={12}
                            tick={{ fill: '#d1d5db' }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#9ca3af"
                            fontSize={12}
                            tick={{ fill: '#d1d5db' }}
                            width={150}
                            interval={0}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100,116,139,0.1)' }} />
                        <Bar dataKey="riskValue" barSize={20}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">13 Kast Değerlendirme Kriteri Analizi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.kriterAnalizleri.map((kriter) => (
                        <KriterAnalizCard key={kriter.kriterAdi} kriter={kriter} onSelect={() => setSelectedKriter(kriter)} />
                    ))}
                </div>
            </div>

            <Card>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <ChecklistIcon className="w-6 h-6 text-cyan-400"/>
                    Risk Azaltıcı Aksiyon Önerileri
                </h3>
                <ul className="space-y-3">
                    {data.aksiyonOnerileri.map((item, index) => (
                        <li key={index} className="flex items-start p-3 bg-slate-700/50 rounded-lg">
                            <svg className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                            <span className="text-sm text-gray-300">{item}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <KriterDetailModal
                kriter={selectedKriter}
                onClose={() => setSelectedKriter(null)}
            />
        </div>
    );
};