import React from 'react';
import { KurganKriterAnalizi } from '../../types';
import { Modal } from '../ui/Modal';
import { WarningIcon } from '../ui/Icons';
import { getRiskColorClasses } from './KriterAnalizCard';

interface KriterDetailModalProps {
    kriter: KurganKriterAnalizi | null;
    onClose: () => void;
}

export const KriterDetailModal: React.FC<KriterDetailModalProps> = ({ kriter, onClose }) => {
    if (!kriter) return null;

    return (
        <Modal
            isOpen={!!kriter}
            onClose={onClose}
            title={kriter.kriterAdi}
        >
            <div className="space-y-5 text-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-700/50 rounded-lg">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Risk Durumu</p>
                        <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${getRiskColorClasses(kriter.riskDurumu).bg}`}>
                            {kriter.riskDurumu}
                        </span>
                    </div>
                    <div className="sm:text-right">
                        <p className="text-xs text-gray-400 mb-1">Mevzuat Referansı</p>
                        <span className="text-xs font-mono bg-slate-600 text-slate-100 px-2 py-1 rounded">{kriter.mevzuatReferansi}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-300 mb-2 flex items-center gap-2">
                        <WarningIcon className="w-5 h-5 text-orange-400" />AI Analiz Detayı
                    </h4>
                    <div className="p-3 bg-slate-900/40 border border-slate-700 text-gray-300 text-sm rounded-md">
                        <p className="leading-relaxed whitespace-pre-wrap">{kriter.analizDetayi}</p>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-300 mb-2">Analizde Kullanılan İlgili Hesaplar</h4>
                    <div className="flex flex-wrap gap-2">
                        {kriter.ilgiliHesaplar.length > 0 ?
                            kriter.ilgiliHesaplar.map(kod => (
                                <span key={kod} className="text-xs font-semibold bg-blue-600 text-white px-2 py-1 rounded">
                                    {kod}
                                </span>
                            )) : <span className="text-xs text-gray-500">Bu analiz için spesifik hesap kullanılmadı.</span>
                        }
                    </div>
                </div>
            </div>
        </Modal>
    );
};