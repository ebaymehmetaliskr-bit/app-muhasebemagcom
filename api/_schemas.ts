import { Type } from '@google/genai';

// Schema for a single DetailedTaxReportItem
const detailedTaxReportItemSchema = {
    type: Type.OBJECT,
    properties: {
        baslik: { type: Type.STRING, description: 'The title of the tax risk analysis item.' },
        riskAnalizi: { type: Type.STRING, description: 'Detailed analysis of the potential tax risk.' },
        mevzuatReferanslari: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'List of relevant articles from Turkish tax laws (e.g., "VUK Madde 323").'
        },
        yapilmasiGerekenler: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of actionable steps to mitigate the risk.'
        },
        potensiyelVergiCezalari: { type: Type.STRING, description: 'Description of potential tax penalties.' },
    },
    required: ['baslik', 'riskAnalizi', 'mevzuatReferanslari', 'yapilmasiGerekenler', 'potensiyelVergiCezalari']
};

// Schema for the entire response of generateDetailedTaxReport, which is an array of the above items
export const detailedTaxReportSchema = {
    type: Type.ARRAY,
    items: detailedTaxReportItemSchema
};


// --- Schemas for Parallel Analysis ---

export const mizanSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            hesapKodu: { type: Type.STRING },
            hesapAdi: { type: Type.STRING },
            oncekiDonem: { type: Type.NUMBER },
            cariDonem: { type: Type.NUMBER },
            isMain: { type: Type.BOOLEAN },
            isSub: { type: Type.BOOLEAN },
        },
        required: ['hesapKodu', 'hesapAdi', 'oncekiDonem', 'cariDonem', 'isMain', 'isSub']
    }
};

export const bilancoSchema = {
    type: Type.OBJECT,
    properties: {
        aktif: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    bolumAdi: { type: Type.STRING },
                    stoklar: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                aciklama: { type: Type.STRING },
                                oncekiDonem: { type: Type.NUMBER },
                                cariDonem: { type: Type.NUMBER },
                            },
                            required: ['aciklama', 'oncekiDonem', 'cariDonem']
                        }
                    }
                },
                required: ['bolumAdi', 'stoklar']
            }
        },
        pasif: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    bolumAdi: { type: Type.STRING },
                    stoklar: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                aciklama: { type: Type.STRING },
                                oncekiDonem: { type: Type.NUMBER },
                                cariDonem: { type: Type.NUMBER },
                            },
                            required: ['aciklama', 'oncekiDonem', 'cariDonem']
                        }
                    }
                },
                required: ['bolumAdi', 'stoklar']
            }
        },
    },
    required: ['aktif', 'pasif']
};

export const gelirGiderSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            aciklama: { type: Type.STRING },
            oncekiDonem: { type: Type.NUMBER },
            cariDonem: { type: Type.NUMBER },
        },
        required: ['aciklama', 'oncekiDonem', 'cariDonem']
    }
};

const rasyoItemSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        oncekiDonem: { type: Type.NUMBER },
        cariDonem: { type: Type.NUMBER },
        formula: { type: Type.STRING, description: "Mathematical formula for the ratio." },
        yorum: { type: Type.STRING, description: "AI-generated interpretation of the ratio." },
    },
    required: ['name', 'oncekiDonem', 'cariDonem', 'formula', 'yorum']
};

const rasyoGrupSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        ratios: {
            type: Type.ARRAY,
            items: rasyoItemSchema
        },
        ozet: { type: Type.STRING, description: "A concise, AI-generated summary of the financial health based on the ratios in this group." }
    },
    required: ['title', 'ratios', 'ozet']
};

export const ratiosSchema = {
    type: Type.OBJECT,
    properties: {
        finansalYapi: rasyoGrupSchema,
        likidite: rasyoGrupSchema,
        devirHizlari: rasyoGrupSchema,
        karlilik: rasyoGrupSchema,
    },
    required: ['finansalYapi', 'likidite', 'devirHizlari', 'karlilik']
};


export const vergiselAnalizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            hesapKodlari: { type: Type.ARRAY, items: { type: Type.STRING } },
            baslik: { type: Type.STRING },
            kategori: { type: Type.STRING },
            durum: { type: Type.STRING, enum: ['Evet', 'Hayır'] },
            aciklama: { type: Type.STRING },
            uyariMesaji: { type: Type.STRING, description: "Optional warning message." },
            mevzuatReferanslari: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Optional list of law references." },
        },
        required: ['hesapKodlari', 'baslik', 'kategori', 'durum', 'aciklama']
    }
};

export const kkegAnalizSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            giderAciklamasi: { type: Type.STRING, description: "Description of the non-deductible expense." },
            tutar: { type: Type.NUMBER, description: "The amount of the expense." },
            gerekce: { type: Type.STRING, description: "Justification for why this is considered a non-deductible expense." },
            dayanakMevzuat: { type: Type.STRING, description: "The legal article or reference for the non-deductibility (e.g., KVK Madde 11/1-d)." },
            ilgiliHesapKodlari: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of related account codes from the trial balance (e.g., ['770', '689'])."
            },
        },
        required: ['giderAciklamasi', 'tutar', 'gerekce', 'dayanakMevzuat', 'ilgiliHesapKodlari']
    }
};

export const kurganAnalizSchema = {
    type: Type.OBJECT,
    properties: {
        genelRiskDurumu: { type: Type.STRING, enum: ['Düşük', 'Orta', 'Yüksek'] },
        riskOzeti: { type: Type.STRING },
        kriterAnalizleri: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    kriterAdi: { type: Type.STRING },
                    riskDurumu: { type: Type.STRING, enum: ['Düşük', 'Orta', 'Yüksek', 'Tespit Edilmedi'] },
                    analizDetayi: { type: Type.STRING },
                    ilgiliHesaplar: { type: Type.ARRAY, items: { type: Type.STRING } },
                    mevzuatReferansi: { type: Type.STRING },
                },
                required: ['kriterAdi', 'riskDurumu', 'analizDetayi', 'ilgiliHesaplar', 'mevzuatReferansi']
            }
        },
        aksiyonOnerileri: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['genelRiskDurumu', 'riskOzeti', 'kriterAnalizleri', 'aksiyonOnerileri']
};

export const nakitAkimSchema = {
    type: Type.OBJECT,
    properties: {
        isletme: {
            type: Type.OBJECT,
            properties: {
                bolumAdi: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER }, isSub: { type: Type.BOOLEAN } },
                        required: ['aciklama', 'tutar', 'isSub']
                    }
                },
                toplam: { type: Type.NUMBER }
            },
            required: ['bolumAdi', 'items', 'toplam']
        },
        yatirim: {
            type: Type.OBJECT,
            properties: {
                bolumAdi: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER }, isSub: { type: Type.BOOLEAN } },
                        required: ['aciklama', 'tutar', 'isSub']
                    }
                },
                toplam: { type: Type.NUMBER }
            },
            required: ['bolumAdi', 'items', 'toplam']
        },
        finansman: {
            type: Type.OBJECT,
            properties: {
                bolumAdi: { type: Type.STRING },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER }, isSub: { type: Type.BOOLEAN } },
                        required: ['aciklama', 'tutar', 'isSub']
                    }
                },
                toplam: { type: Type.NUMBER }
            },
            required: ['bolumAdi', 'items', 'toplam']
        },
        netArtis: { type: Type.OBJECT, properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER } }, required: ['aciklama', 'tutar'] },
        donemBasi: { type: Type.OBJECT, properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER } }, required: ['aciklama', 'tutar'] },
        donemSonu: { type: Type.OBJECT, properties: { aciklama: { type: Type.STRING }, tutar: { type: Type.NUMBER } }, required: ['aciklama', 'tutar'] },
    },
    required: ['isletme', 'yatirim', 'finansman', 'netArtis', 'donemBasi', 'donemSonu']
};

export const kurumlarVergisiSchema = {
    type: Type.OBJECT,
    properties: {
        ticariKar: { type: Type.NUMBER },
        kkegToplam: { type: Type.NUMBER },
        zararIfaGideri: { type: Type.NUMBER },
        digerIlaveler: { type: Type.NUMBER },
        toplamIlaveler: { type: Type.NUMBER },
        karIlavelerToplami: { type: Type.NUMBER },
        gecmisYilZararlari: { type: Type.NUMBER },
        istisnalar: { type: Type.NUMBER },
        indirimeEsasTutar: { type: Type.NUMBER },
        digerIndirimler: { type: Type.NUMBER },
        toplamIndirimler: { type: Type.NUMBER },
        vergiMatrahi: { type: Type.NUMBER },
        vergiOrani: { type: Type.NUMBER },
        hesaplananKurumlarVergisi: { type: Type.NUMBER },
        mahsupEdilecekVergiler: { type: Type.NUMBER },
        odenmesiGerekenKV: { type: Type.NUMBER },
        sonrakiYilaDevredenKV: { type: Type.NUMBER }
    },
    required: [
        'ticariKar', 'kkegToplam', 'toplamIlaveler', 'karIlavelerToplami', 
        'gecmisYilZararlari', 'istisnalar', 'toplamIndirimler', 'vergiMatrahi', 
        'vergiOrani', 'hesaplananKurumlarVergisi', 'mahsupEdilecekVergiler', 'odenmesiGerekenKV'
    ]
};


export const vatValuesSchema = {
    type: Type.OBJECT,
    properties: {
        devredenKDV: { type: Type.NUMBER, description: "The 'Sonraki Döneme Devreden KDV' value from the VAT declaration for the current period." },
        hesaplananKDV: { type: Type.NUMBER, description: "The 'Toplam Hesaplanan KDV' value from the VAT declaration for the current period." }
    },
    required: ['devredenKDV', 'hesaplananKDV']
};
