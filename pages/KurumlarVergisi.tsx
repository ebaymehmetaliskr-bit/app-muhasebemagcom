import React from 'react';
import { KurumlarVergisiHesaplama } from '../types';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/formatters';
import { CalculatorIcon } from '../components/ui/Icons';

interface KurumlarVergisiProps {
    data: KurumlarVergisiHesaplama;
}

const CalculationRow: React.FC<{ label: string; value: number; isSub?: boolean; isBold?: boolean; highlight?: 'positive' | 'negative' | 'neutral' }> = ({ label, value, isSub = false, isBold = false, highlight }) => {
    let valueClass = 'text-white';
    if (highlight === 'positive') valueClass = 'text-green-400';
    if (highlight === 'negative') valueClass = 'text-red-400';
    if (highlight === 'neutral') valueClass = 'text-blue-400';

    return (
        <tr className={isBold ? 'bg-slate-700/50' : 'hover:bg-slate-700/50'}>
            <td className={`py-3 px-4 ${isSub ? 'pl-8 text-gray-400' : 'font-medium'}`}>{label}</td>
            <td className={`py-3 px-4 text-right font-mono ${isBold ? 'font-bold' : ''} ${valueClass}`}>{formatCurrency(value)}</td>
        </tr>
    );
};

export const KurumlarVergisi: React.FC<KurumlarVergisiProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Kurumlar Vergisi Hesaplaması</h2>
            <p className="text-gray-400 -mt-4">Yüklenen mizan verilerine göre yapay zeka tarafından oluşturulan tahmini kurumlar vergisi tablosu.</p>

            <Card>
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    <CalculatorIcon className="w-5 h-5" />
                    Vergi Hesaplama Detayları
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-slate-700">
                            <CalculationRow label="Ticari Bilanço Kârı / (Zararı)" value={data.ticariKar} isBold />

                            {/* İlaveler */}
                            <tr className="bg-slate-800/60"><td colSpan={2} className="px-4 py-2 font-semibold text-cyan-300">İlaveler</td></tr>
                            <CalculationRow label="Kanunen Kabul Edilmeyen Giderler (KKEG)" value={data.kkegToplam} isSub />
                             <CalculationRow label="Zarar Dahi Olsa İnd. Edilecek Gider" value={data.zararIfaGideri} isSub />
                            <CalculationRow label="Diğer İlaveler" value={data.digerIlaveler} isSub />
                            <CalculationRow label="Toplam İlaveler" value={data.toplamIlaveler} />
                            <CalculationRow label="Kâr ve İlaveler Toplamı" value={data.karIlavelerToplami} isBold />

                            {/* İndirimler ve İstisnalar */}
                            <tr className="bg-slate-800/60"><td colSpan={2} className="px-4 py-2 font-semibold text-cyan-300">İndirim ve İstisnalar</td></tr>
                            <CalculationRow label="Geçmiş Yıl Zararları" value={data.gecmisYilZararlari} isSub />
                            <CalculationRow label="İstisnalar" value={data.istisnalar} isSub />
                            <CalculationRow label="İndirime Esas Tutar" value={data.indirimeEsasTutar} />
                             <CalculationRow label="Diğer İndirimler" value={data.digerIndirimler} isSub />
                            <CalculationRow label="Toplam İndirimler" value={data.toplamIndirimler} highlight="negative" />

                            {/* Sonuç */}
                            <tr className="bg-slate-800/60"><td colSpan={2} className="px-4 py-2 font-semibold text-cyan-300">Vergi Matrahı ve Hesaplama</td></tr>
                            <CalculationRow label="KURUMLAR VERGİSİ MATRAHI" value={data.vergiMatrahi} isBold highlight="neutral" />
                            <CalculationRow label="Kurumlar Vergisi Oranı" value={data.vergiOrani * 100} />
                            <CalculationRow label="Hesaplanan Kurumlar Vergisi" value={data.hesaplananKurumlarVergisi} isBold highlight="positive" />
                            <CalculationRow label="Mahsup Edilecek Vergiler Toplamı" value={data.mahsupEdilecekVergiler} highlight="negative" />
                            <CalculationRow label="ÖDENMESİ GEREKEN KURUMLAR VERGİSİ" value={data.odenmesiGerekenKV} isBold highlight="positive" />
                            <CalculationRow label="Sonraki Yıla Devreden Kurumlar Vergisi" value={data.sonrakiYilaDevredenKV} />
                        </tbody>
                    </table>
                </div>
                 <div className="mt-6 text-center text-xs text-gray-500 p-2 bg-slate-900/50 rounded-md">
                    <p><strong>Yasal Uyarı:</strong> Bu hesaplama, sunulan verilere dayanarak yapay zeka tarafından oluşturulmuş bir tahmindir ve resmi bir beyanname niteliği taşımaz. Rakamların doğruluğu için mutlaka kendi kayıtlarınızla karşılaştırma yapınız ve bir mali müşavire danışınız.</p>
                </div>
            </Card>
        </div>
    );
};
