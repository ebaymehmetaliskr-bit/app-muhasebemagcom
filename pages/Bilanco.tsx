import React from 'react';
import { BilancoData, BilancoBolum } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { DownloadIcon } from '../components/ui/Icons';
import { exportToCsv } from '../utils/exportUtils';

const BilancoTable: React.FC<{ data: BilancoBolum[], title: string, titleColor: string }> = ({ data, title, titleColor }) => (
    <Card className="flex-1">
        <h3 className={`text-lg font-bold text-center p-3 rounded-t-lg ${titleColor}`}>{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 uppercase bg-slate-800">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left font-medium">Açıklama</th>
                        <th scope="col" className="px-6 py-3 text-right font-medium">Önceki Dönem</th>
                        <th scope="col" className="px-6 py-3 text-right font-medium">Cari Dönem</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(bolum => (
                        <React.Fragment key={bolum.bolumAdi}>
                            <tr className="bg-slate-800/60">
                                <td colSpan={3} className="px-6 py-3 font-bold text-white">{bolum.bolumAdi}</td>
                            </tr>
                            {bolum.stoklar.map(stok => (
                                <tr key={stok.aciklama} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50 transition-colors duration-150">
                                    <td className={`px-6 py-3 ${stok.aciklama.startsWith('..') ? 'pl-10' : ''}`}>{stok.aciklama}</td>
                                    <td className="px-6 py-3 text-right font-mono">{formatCurrency(stok.oncekiDonem)}</td>
                                    <td className="px-6 py-3 text-right font-mono">{formatCurrency(stok.cariDonem)}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);


export const Bilanco: React.FC<{ data: BilancoData }> = ({ data }) => {
    
    const handleExport = () => {
        const flatData: any[] = [];

        data.aktif.forEach(bolum => {
            bolum.stoklar.forEach(stok => {
                flatData.push({
                    kategori: 'AKTİF (VARLIKLAR)',
                    bolumAdi: bolum.bolumAdi,
                    aciklama: stok.aciklama.replace(/^../, ''), // remove .. prefixes
                    oncekiDonem: stok.oncekiDonem,
                    cariDonem: stok.cariDonem,
                });
            });
        });

        data.pasif.forEach(bolum => {
            bolum.stoklar.forEach(stok => {
                flatData.push({
                    kategori: 'PASİF (KAYNAKLAR)',
                    bolumAdi: bolum.bolumAdi,
                    aciklama: stok.aciklama.replace(/^../, ''), // remove .. prefixes
                    oncekiDonem: stok.oncekiDonem,
                    cariDonem: stok.cariDonem,
                });
            });
        });

        const headers = [
            { key: 'kategori', label: 'Kategori' },
            { key: 'bolumAdi', label: 'Bölüm Adı' },
            { key: 'aciklama', label: 'Açıklama' },
            { key: 'oncekiDonem', label: 'Önceki Dönem' },
            { key: 'cariDonem', label: 'Cari Dönem' },
        ];
        exportToCsv('bilanco', flatData, headers);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-white">Bilanço Tablosu</h2>
                 <button
                    onClick={handleExport}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    title="Excel'e Aktar"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Aktar</span>
                </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <BilancoTable data={data.aktif} title="AKTİF (VARLIKLAR)" titleColor="bg-green-600" />
                <BilancoTable data={data.pasif} title="PASİF (KAYNAKLAR)" titleColor="bg-red-600" />
            </div>
        </div>
    );
};
