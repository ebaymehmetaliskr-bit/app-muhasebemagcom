import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { MizanItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { InfoIcon, WarningIcon } from '../ui/Icons';

interface VatCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfText: string;
    mizanData: MizanItem[];
}

type ComparisonResult = {
    mizan190: number;
    mizan391: number;
    beyan190: number;
    beyan391: number;
};

const StatusIndicator: React.FC<{ isMatch: boolean }> = ({ isMatch }) => {
    return isMatch ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
            ✓ Uyumlu
        </span>
    ) : (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
            ✗ Farklı
        </span>
    );
};


export const VatCheckModal: React.FC<VatCheckModalProps> = ({ isOpen, onClose, pdfText, mizanData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ComparisonResult | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchAndCompare = async () => {
                setIsLoading(true);
                setError(null);
                setResult(null);

                try {
                    const apiResponse = await fetch('/api/extract-vat-values', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pdfText }),
                    });

                    if (!apiResponse.ok) {
                        const errorData = await apiResponse.json();
                        throw new Error(errorData.message || 'Beyanname verileri alınamadı.');
                    }
                    
                    const vatData = await apiResponse.json();

                    const mizan190 = mizanData.find(m => m.hesapKodu === '190')?.cariDonem ?? 0;
                    const mizan391 = Math.abs(mizanData.find(m => m.hesapKodu === '391')?.cariDonem ?? 0);

                    setResult({
                        mizan190,
                        mizan391,
                        beyan190: vatData.devredenKDV,
                        beyan391: vatData.hesaplananKDV,
                    });

                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchAndCompare();
        }
    }, [isOpen, pdfText, mizanData]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-md font-semibold">Beyanname verileri okunuyor...</p>
                </div>
            );
        }

        if (error) {
            return <div className="p-4 text-red-400 bg-red-900/50 border border-red-500/50 rounded-lg">{error}</div>;
        }

        if (result) {
            const fark190 = result.beyan190 - result.mizan190;
            const fark391 = result.beyan391 - result.mizan391;
            const isMatch190 = Math.abs(fark190) < 0.01;
            const isMatch391 = Math.abs(fark391) < 0.01;
            const isFullyMatched = isMatch190 && isMatch391;

            return (
                <div className="space-y-6">
                    <p className="text-sm text-gray-400">
                        Bu modül, defter kayıtlarınızdaki (Mizan) KDV tutarları ile KDV Beyannamesi üzerinde beyan edilen tutarları karşılaştırır.
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-700/50 text-xs text-gray-400 uppercase">
                                <tr>
                                    <th scope="col" className="px-4 py-3 font-medium">Açıklama</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-right">Defter Kaydı (Mizan)</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-right">Beyanname Değeri</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-right">Fark</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-center">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr className="hover:bg-slate-700/50">
                                    <td className="px-4 py-3 font-medium">190 - Sonraki Döneme Devreden KDV</td>
                                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(result.mizan190)}</td>
                                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(result.beyan190)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-semibold ${!isMatch190 ? 'text-red-400' : ''}`}>{formatCurrency(fark190)}</td>
                                    <td className="px-4 py-3 text-center"><StatusIndicator isMatch={isMatch190} /></td>
                                </tr>
                                <tr className="hover:bg-slate-700/50">
                                    <td className="px-4 py-3 font-medium">391 - Toplam Hesaplanan KDV</td>
                                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(result.mizan391)}</td>
                                    <td className="px-4 py-3 text-right font-mono">{formatCurrency(result.beyan391)}</td>
                                    <td className={`px-4 py-3 text-right font-mono font-semibold ${!isMatch391 ? 'text-red-400' : ''}`}>{formatCurrency(fark391)}</td>
                                    <td className="px-4 py-3 text-center"><StatusIndicator isMatch={isMatch391} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {isFullyMatched ? (
                        <div className="p-4 bg-green-900/50 border-l-4 border-green-500 text-green-200 text-sm rounded-lg flex items-start gap-3">
                             <InfoIcon className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
                            <p>Tebrikler! Defter kayıtlarınız ile KDV beyannameniz arasında bir tutarsızlık tespit edilmedi.</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-orange-900/50 border-l-4 border-orange-500 text-orange-200 text-sm rounded-lg flex items-start gap-3">
                            <WarningIcon className="w-5 h-5 flex-shrink-0 text-orange-400 mt-0.5" />
                            <p>Dikkat! Defter kayıtları ile KDV beyannamesi arasında fark tespit edildi. Bu durum, potansiyel bir vergi incelemesinde risk oluşturabilir. Farkın neden kaynaklandığının (örn: kur farkları, muhasebe kayıt hataları) araştırılması önerilir.</p>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="KDV Beyannamesi ve Mizan Karşılaştırması"
        >
            {renderContent()}
        </Modal>
    );
};