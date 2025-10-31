import React from 'react';
import { NakitAkimData, NakitAkimBolum } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { DownloadIcon } from '../components/ui/Icons';
import { exportToCsv } from '../utils/exportUtils';

const SectionTable: React.FC<{ bolum: NakitAkimBolum }> = ({ bolum }) => (
    <div className="mb-6">
        <h4 className="text-md font-semibold text-cyan-300 bg-slate-700/80 p-3 rounded-t-md">{bolum.bolumAdi}</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-700">
                    {bolum.items.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-700/50 transition-colors duration-150">
                            <td className={`py-3 px-4 ${item.isSub ? 'pl-8' : ''}`}>{item.aciklama}</td>
                            <td className={`py-3 px-4 text-right font-mono`}>
                                {formatCurrency(item.tutar)}
                            </td>
                        </tr>
                    ))}
                    <tr className="font-bold bg-slate-700/50">
                        <td className="py-3 px-4 text-right">Bölüm Toplamı</td>
                        <td className={`py-3 px-4 text-right font-mono ${bolum.toplam < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {formatCurrency(bolum.toplam)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export const NakitAkim: React.FC<{ data: NakitAkimData }> = ({ data }) => {
    
    const handleExport = () => {
        const flatData: any[] = [];
        const processBolum = (bolum: NakitAkimBolum) => {
            bolum.items.forEach(item => {
                flatData.push({
                    bolum: bolum.bolumAdi,
                    aciklama: item.aciklama,
                    tutar: item.tutar,
                });
            });
            flatData.push({
                bolum: bolum.bolumAdi,
                aciklama: `Bölüm Toplamı`,
                tutar: bolum.toplam,
            });
        };

        processBolum(data.isletme);
        processBolum(data.yatirim);
        processBolum(data.finansman);
        
        flatData.push({ bolum: 'ÖZET', aciklama: data.netArtis.aciklama, tutar: data.netArtis.tutar });
        flatData.push({ bolum: 'ÖZET', aciklama: data.donemBasi.aciklama, tutar: data.donemBasi.tutar });
        flatData.push({ bolum: 'ÖZET', aciklama: data.donemSonu.aciklama, tutar: data.donemSonu.tutar });

        const headers = [
            { key: 'bolum', label: 'Bölüm' },
            { key: 'aciklama', label: 'Açıklama' },
            { key: 'tutar', label: 'Tutar' },
        ];
        exportToCsv('nakit_akim', flatData, headers);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">Nakit Akım Tablosu (Dolaylı Yöntem)</h2>
                    <p className="text-gray-400">Şirketin nakit giriş ve çıkışlarının kaynakları ve kullanım yerleri.</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    title="Excel'e Aktar"
                >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Aktar</span>
                </button>
            </div>

            <Card>
                <SectionTable bolum={data.isletme} />
                <SectionTable bolum={data.yatirim} />
                <SectionTable bolum={data.finansman} />

                <div className="mt-6 border-t-2 border-cyan-500 pt-4">
                    <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-700">
                            <tr className="font-bold text-lg text-white">
                                <td className="py-3 px-4">{data.netArtis.aciklama}</td>
                                <td className={`py-3 px-4 text-right font-mono ${data.netArtis.tutar < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {formatCurrency(data.netArtis.tutar)}
                                </td>
                            </tr>
                            <tr className="text-gray-400">
                                <td className="py-3 px-4">{data.donemBasi.aciklama}</td>
                                <td className="py-3 px-4 text-right font-mono">{formatCurrency(data.donemBasi.tutar)}</td>
                            </tr>
                            <tr className="font-bold text-md bg-slate-700/50 text-white">
                                <td className="py-4 px-4">{data.donemSonu.aciklama}</td>
                                <td className="py-4 px-4 text-right font-mono">{formatCurrency(data.donemSonu.tutar)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};