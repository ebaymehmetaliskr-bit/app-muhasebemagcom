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
        potansiyelVergiCezalari: { type: Type.STRING, description: 'Description of potential tax penalties.' },
    },
    required: ['baslik', 'riskAnalizi', 'mevzuatReferanslari', 'yapilmasiGerekenler', 'potansiyelVergiCezalari']
};

// Schema for the entire response of generateDetailedTaxReport, which is an array of the above items
export const detailedTaxReportSchema = {
    type: Type.ARRAY,
    items: detailedTaxReportItemSchema
};


// Schema for the full analysis data
export const analysisDataSchema = {
    type: Type.OBJECT,
    properties: {
        dashboard: {
            type: Type.OBJECT,
            properties: {
                summary: {
                    type: Type.OBJECT,
                    properties: {
                        mizan: { type: Type.INTEGER },
                        bilanco: { type: Type.INTEGER },
                        gelirGider: { type: Type.INTEGER },
                        analizler: { type: Type.INTEGER },
                    },
                    required: ['mizan', 'bilanco', 'gelirGider', 'analizler']
                },
                aktifYapi: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } },
                        required: ['name', 'value']
                    }
                },
                pasifYapi: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } },
                        required: ['name', 'value']
                    }
                },
            },
            required: ['summary', 'aktifYapi', 'pasifYapi']
        },
        mizan: {
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
        },
        bilanco: {
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
        },
        gelirGider: {
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
        },
        rasyolar: {
            type: Type.OBJECT,
            properties: {
                finansalYapi: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        ratios: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    cariDonem: { type: Type.NUMBER },
                                    oncekiDonem: { type: Type.NUMBER },
                                    formula: { type: Type.STRING, description: "Optional formula text." },
                                },
                                required: ['name', 'cariDonem', 'oncekiDonem']
                            }
                        }
                    },
                    required: ['title', 'ratios']
                },
                likidite: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        ratios: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    cariDonem: { type: Type.NUMBER },
                                    oncekiDonem: { type: Type.NUMBER },
                                },
                                required: ['name', 'cariDonem', 'oncekiDonem']
                            }
                        },
                        dagilim: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } },
                                required: ['name', 'value']
                            }
                        }
                    },
                    required: ['title', 'ratios', 'dagilim']
                },
                devirHizlari: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        ratios: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    cariDonem: { type: Type.NUMBER },
                                    oncekiDonem: { type: Type.NUMBER },
                                },
                                required: ['name', 'cariDonem', 'oncekiDonem']
                            }
                        },
                        karsilastirma: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, 'Cari Dönem': { type: Type.NUMBER }, 'Önceki Dönem': { type: Type.NUMBER } },
                                required: ['name', 'Cari Dönem', 'Önceki Dönem']
                            }
                        }
                    },
                    required: ['title', 'ratios', 'karsilastirma']
                },
                karlilik: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, 'Cari Dönem': { type: Type.NUMBER }, 'Önceki Dönem': { type: Type.NUMBER } },
                        required: ['name', 'Cari Dönem', 'Önceki Dönem']
                    }
                }
            },
            required: ['finansalYapi', 'likidite', 'devirHizlari', 'karlilik']
        },
        vergiselAnaliz: {
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
        },
        gelirGiderAnalizi: {
             type: Type.ARRAY,
             items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, 'Cari Dönem': { type: Type.NUMBER }, 'Önceki Dönem': { type: Type.NUMBER } },
                required: ['name', 'Cari Dönem', 'Önceki Dönem']
             }
        },
        kurganAnalizi: {
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
        },
        nakitAkim: {
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
        },
    },
    required: [
        'dashboard', 'mizan', 'bilanco', 'gelirGider', 'rasyolar', 'vergiselAnaliz',
        'gelirGiderAnalizi', 'kurganAnalizi', 'nakitAkim'
    ]
};
