
import React from 'react';
import { NakitAkimData, NakitAkimBolum } from '../types';
import { Card } from '../components/ui/Card';

const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
    return value < 0 ? `(${formatted.replace('-', '')})` : formatted;
};

const SectionTable: React.FC<{ bolum: NakitAkimBolum }> = ({ bolum }) => (
    <div className="mb-6">
        <h4 className="text-md font-semibold text-cyan-300 bg-slate-700/80 p-3 rounded-t-md">{bolum.bolumAdi}</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-700">
                    {bolum.items.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-700/50 transition-colors duration-150">
                            <td className={`py-3 px-4 ${item.isSub ? 'pl-8' : ''}`}>{item.aciklama}</td>
                            <td className={`py-3 px-4 text-right font-mono ${item.tutar < 0 ? 'text-red-400' : 'text-gray-300'}`}>
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
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Nakit Akım Tablosu (Dolaylı Yöntem)</h2>
            <p className="text-gray-400 -mt-4">Şirketin nakit giriş ve çıkışlarının kaynakları ve kullanım yerleri.</p>

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
