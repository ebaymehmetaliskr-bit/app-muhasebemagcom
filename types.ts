


export type Page = 
  | 'Dashboard'
  | 'Mizan'
  | 'Finansal Yapı Oranları'
  | 'Bilanço'
  | 'Gelir ve Gider'
  | 'Likidite Oranları'
  | 'Rasyon Analizi'
  | 'Kârlılık Oranları'
  | 'Dikey Analiz'
  | 'Yatay Analiz'
  | 'Vergisel Analiz'
  | 'Devir Hızları'
  | 'Kurgan Analizi'
  | 'Nakit Akım';

export interface DashboardSummary {
    mizan: number;
    bilanco: number;
    gelirGider: number;
    analizler: number;
}

export interface PieChartData {
    name: string;
    value: number;
}

export interface BarChartData {
    name: string;
    'Cari Dönem': number;
    'Önceki Dönem': number;
}

export interface MizanItem {
    hesapKodu: string;
    hesapAdi: string;
    oncekiDonem: number;
    cariDonem: number;
    isMain: boolean;
    isSub: boolean;
}

export interface BilancoStok {
    aciklama: string;
    oncekiDonem: number;
    cariDonem: number;
}

export interface BilancoBolum {
    bolumAdi: string;
    stoklar: BilancoStok[];
}

export interface BilancoData {
    aktif: BilancoBolum[];
    pasif: BilancoBolum[];
}

export interface GelirGiderItem {
    aciklama: string;
    oncekiDonem: number;
    cariDonem: number;
}


export interface RasyoItem {
    name: string;
    cariDonem: number;
    oncekiDonem: number;
    formula?: string;
}

export interface RasyoGrup {
    title: string;
    ratios: RasyoItem[];
}

export interface RasyoData {
    finansalYapi: RasyoGrup;
    likidite: RasyoGrup & { dagilim: PieChartData[] };
    devirHizlari: RasyoGrup & { karsilastirma: BarChartData[] };
    karlilik: BarChartData[];
}


export interface VergiselAnalizItem {
    hesapKodlari: string[];
    baslik: string;
    kategori: string;
    durum: 'Evet' | 'Hayır';
    aciklama: string;
    uyariMesaji?: string;
    mevzuatReferanslari?: string[];
}

export interface DetailedTaxReportItem {
    baslik: string;
    riskAnalizi: string;
    mevzuatReferanslari: string[];
    yapilmasiGerekenler: string[];
    potansiyelVergiCezalari: string;
}

export interface PdfSettings {
    logo: string | null;
    headerBgColor: string;
    headerTextColor: string;
    subHeaderColor: string;
    font: 'Roboto' | 'Helvetica' | 'Times New Roman';
}

export interface KurganKriterAnalizi {
    kriterAdi: string;
    riskDurumu: 'Düşük' | 'Orta' | 'Yüksek' | 'Tespit Edilmedi';
    analizDetayi: string;
    ilgiliHesaplar: string[];
    mevzuatReferansi: string;
}

export interface KurganAnaliz {
    genelRiskDurumu: 'Düşük' | 'Orta' | 'Yüksek';
    riskOzeti: string;
    kriterAnalizleri: KurganKriterAnalizi[];
    aksiyonOnerileri: string[];
}


export interface NakitAkimItem {
    aciklama: string;
    tutar: number;
    isSub: boolean;
}

export interface NakitAkimBolum {
    bolumAdi: string;
    items: NakitAkimItem[];
    toplam: number;
}

export interface NakitAkimData {
    isletme: NakitAkimBolum;
    yatirim: NakitAkimBolum;
    finansman: NakitAkimBolum;
    netArtis: { aciklama: string; tutar: number };
    donemBasi: { aciklama: string; tutar: number };
    donemSonu: { aciklama: string; tutar: number };
}

export interface AnalysisData {
    dashboard: {
        summary: DashboardSummary;
        aktifYapi: PieChartData[];
        pasifYapi: PieChartData[];
    };
    mizan: MizanItem[];
    bilanco: BilancoData;
    gelirGider: GelirGiderItem[];
    rasyolar: RasyoData;
    vergiselAnaliz: VergiselAnalizItem[];
    gelirGiderAnalizi: BarChartData[];
    kurganAnalizi: KurganAnaliz;
    nakitAkim: NakitAkimData;
    pdfText?: string;
}