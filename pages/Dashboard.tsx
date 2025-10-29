import React from 'react';
import { AnalysisData } from '../types';
import { Card } from '../components/ui/Card';
import { SimplePieChart, SimpleBarChart } from '../components/charts/Charts';
import { ArrowDownIcon, ArrowUpIcon } from '../components/ui/Icons';
import { formatCurrency } from '../utils/formatters';

interface DashboardProps {
    data: AnalysisData;
}

const SummaryCard: React.FC<{ title: string; value: number; detail: string; }> = ({ title, value, detail }) => (
    <Card className="flex flex-col justify-between">
        <div>
            <h4 className="text-gray-400 text-sm">{title}</h4>
            <p className="text-3xl font-bold text-white">{value} <span className="text-lg">hesap</span></p>
        </div>
        <p className="text-xs text-gray-500 mt-2">{detail}</p>
    </Card>
);

const ProfitabilityTrendCard: React.FC<{
    name: string;
    cariDonem: number;
    oncekiDonem: number;
}> = ({ name, cariDonem, oncekiDonem }) => {
    const change = cariDonem - oncekiDonem;
    const percentageChange = oncekiDonem !== 0 ? (change / Math.abs(oncekiDonem)) * 100 : (cariDonem !== 0 ? Infinity : 0);
    const isPositive = change >= 0;

    const changeText = isFinite(percentageChange)
        ? `${isPositive ? '+' : ''}${percentageChange.toFixed(1)}%`
        : (isPositive ? '∞' : '-∞');

    const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
    const changeBgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';
    
    return (
        <Card className="flex flex-col justify-between bg-slate-800/60 p-4">
            <div>
                <div className="flex justify-between items-center">
                    <h4 className="text-sm text-gray-400 font-medium">{name}</h4>
                    <div className={`flex items-center px-2 py-1 rounded-md text-xs font-bold ${changeBgColor} ${changeColor}`}>
                        {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                        <span className="ml-1">{changeText}</span>
                    </div>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(cariDonem)}</p>
            </div>
            <div className="text-xs text-gray-500 mt-1">
                Önceki Dönem: {formatCurrency(oncekiDonem)}
            </div>
        </Card>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    const { summary, aktifYapi, pasifYapi } = data.dashboard;
    const { gelirGiderAnalizi, rasyolar: { karlilik } } = data;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white">Dashboard</h2>
            <p className="text-gray-400 -mt-6">Mali tablolarınızın genel görünümü ve analizleri</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Mizan" value={summary.mizan} detail="Mizan tablosu detayları" />
                <SummaryCard title="Bilanço" value={summary.bilanco} detail="Bilanço tablosu detayları" />
                <SummaryCard title="Gelir-Gider" value={summary.gelirGider} detail="Gelir tablosu detayları" />
                <SummaryCard title="Analizler" value={summary.analizler} detail="Finansal analiz araçları" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Aktif-Pasif Yapısı">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold mb-2">Aktif Yapısı</h4>
                            <SimplePieChart data={aktifYapi} />
                        </div>
                        <div className="flex flex-col items-center">
                            <h4 className="font-semibold mb-2">Pasif Yapısı</h4>
                            <SimplePieChart data={pasifYapi} />
                        </div>
                    </div>
                </Card>
                <Card title="Gelir-Gider Analizi">
                     <SimpleBarChart data={gelirGiderAnalizi} keys={['Cari Dönem']} />
                </Card>
            </div>
            
            <Card title="Kârlılık Trend Analizi">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {karlilik.map(item => (
                        <ProfitabilityTrendCard
                            key={item.name}
                            name={item.name}
                            cariDonem={item['Cari Dönem']}
                            oncekiDonem={item['Önceki Dönem']}
                        />
                    ))}
                </div>
            </Card>

        </div>
    );
};