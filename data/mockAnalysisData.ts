

import { AnalysisData } from '../types';

export const mockAnalysisData: AnalysisData = {
  dataSourceText: 'Bu alanda analiz edilen PDF dosyasının tam metni yer alacaktır. Detaylı raporlama gibi özellikler bu metni bağlam olarak kullanır.',
  dashboard: {
    summary: {
      mizan: 89,
      bilanco: 77,
      gelirGider: 15,
      analizler: 21,
      kkeg: 4,
    },
    aktifYapi: [
      { name: 'Dönen Varlıklar', value: 106063019.43 },
      { name: 'Duran Varlıklar', value: 70000000 },
    ],
    pasifYapi: [
      { name: 'Kısa Vadeli Yabancı Kaynaklar', value: 85000000 },
      { name: 'Uzun Vadeli Yabancı Kaynaklar', value: 40000000 },
      { name: 'Özkaynaklar', value: 51063019.43 },
    ],
  },
  mizan: [
    { hesapKodu: 'I', hesapAdi: 'Dönen Varlıklar', oncekiDonem: 74261885.75, cariDonem: 106063019.43, isMain: true, isSub: false },
    { hesapKodu: 'A', hesapAdi: 'Hazır Değerler', oncekiDonem: 18717780.78, cariDonem: 35100908.34, isMain: false, isSub: true },
    { hesapKodu: '100', hesapAdi: 'Kasa', oncekiDonem: 2022558.53, cariDonem: 820834.77, isMain: false, isSub: false },
    { hesapKodu: '102', hesapAdi: 'Bankalar', oncekiDonem: 26095902.23, cariDonem: 23606817.25, isMain: false, isSub: false },
    { hesapKodu: 'C', hesapAdi: 'Ticari Alacaklar', oncekiDonem: 47348312.88, cariDonem: 65524183.72, isMain: false, isSub: true },
    { hesapKodu: '120', hesapAdi: 'Alıcılar', oncekiDonem: 46238312.88, cariDonem: 63209927.72, isMain: false, isSub: false },
    { hesapKodu: 'E', hesapAdi: 'Stoklar', oncekiDonem: 4935117.96, cariDonem: 5426927.37, isMain: false, isSub: true },
  ],
  bilanco: {
    aktif: [
      {
        bolumAdi: 'I. Dönen Varlıklar',
        stoklar: [
          { aciklama: 'A. Hazır Değerler', oncekiDonem: 18717780.78, cariDonem: 35100908.34 },
          { aciklama: '.. Kasa', oncekiDonem: 2022558.53, cariDonem: 820834.77 },
          { aciklama: '.. Bankalar', oncekiDonem: 26095902.23, cariDonem: 23606817.25 },
          { aciklama: 'C. Ticari Alacaklar', oncekiDonem: 47348312.88, cariDonem: 65524183.72 },
          { aciklama: '.. Alıcılar', oncekiDonem: 46238312.88, cariDonem: 63209927.72 },
        ],
      },
    ],
    pasif: [
      {
        bolumAdi: 'III. Kısa Vadeli Yabancı Kaynaklar',
        stoklar: [
          { aciklama: 'A. Mali Borçlar', oncekiDonem: 30000000, cariDonem: 45000000 },
          { aciklama: 'C. Ticari Borçlar', oncekiDonem: 25000000, cariDonem: 35000000 },
        ],
      },
      {
        bolumAdi: 'V. Özkaynaklar',
        stoklar: [{ aciklama: 'A. Ödenmiş Sermaye', oncekiDonem: 20000000, cariDonem: 20000000 }],
      },
    ],
  },
  gelirGider: [
    { aciklama: 'BRÜT SATIŞLAR', oncekiDonem: 150000000, cariDonem: 200000000 },
    { aciklama: 'SATIŞLARIN MALİYETİ (-)', oncekiDonem: -100000000, cariDonem: -140000000 },
    { aciklama: 'BRÜT SATIŞ KÂRI', oncekiDonem: 50000000, cariDonem: 60000000 },
    { aciklama: 'FAALİYET GİDERLERİ (-)', oncekiDonem: -20000000, cariDonem: -25000000 },
    { aciklama: 'FAALİYET KÂRI', oncekiDonem: 30000000, cariDonem: 35000000 },
    { aciklama: 'FİNANSMAN GİDERLERİ (-)', oncekiDonem: -5000000, cariDonem: -7000000 },
    { aciklama: 'DÖNEM KÂRI (VERGİ ÖNCESİ)', oncekiDonem: 25000000, cariDonem: 28000000 },
    { aciklama: 'DÖNEM NET KÂRI', oncekiDonem: 20000000, cariDonem: 22400000 },
  ],
  gelirGiderAnalizi: [
    { name: 'BRÜT SATIŞLAR', 'Cari Dönem': 200000000, 'Önceki Dönem': 150000000 },
    { name: 'SATIŞLARIN MALİYETİ (-)', 'Cari Dönem': 140000000, 'Önceki Dönem': 100000000 },
    { name: 'BRÜT SATIŞ KÂRI', 'Cari Dönem': 60000000, 'Önceki Dönem': 50000000 },
    { name: 'FAALİYET GİDERLERİ (-)', 'Cari Dönem': 25000000, 'Önceki Dönem': 20000000 },
    { name: 'FAALİYET KÂRI', 'Cari Dönem': 35000000, 'Önceki Dönem': 30000000 },
    { name: 'FİNANSMAN GİDERLERİ (-)', 'Cari Dönem': 7000000, 'Önceki Dönem': 5000000 },
    { name: 'DÖNEM KÂRI (VERGİ ÖNCESİ)', 'Cari Dönem': 28000000, 'Önceki Dönem': 25000000 },
    { name: 'DÖNEM NET KÂRI', 'Cari Dönem': 22400000, 'Önceki Dönem': 20000000 },
  ],
  rasyolar: {
    finansalYapi: {
        title: 'Finansal Yapı Oranları',
        ratios: [
            { name: 'Kaldıraç Oranı', oncekiDonem: 0.6, cariDonem: 0.65, formula: 'Toplam Yabancı Kaynaklar / Toplam Varlıklar', yorum: 'Cari dönemde borçlanma oranı artmıştır.' },
            { name: 'Öz Kaynak Oranı', oncekiDonem: 0.4, cariDonem: 0.35, formula: 'Öz Kaynaklar / Toplam Varlıklar', yorum: 'İşletmenin varlıklarının finanse edilmesinde öz kaynakların payı azalmıştır.' },
        ],
        ozet: 'İşletmenin finansal yapısında borçların payı artarken, öz kaynakların payı azalmıştır. Bu durum finansal riski bir miktar artırmıştır.'
    },
    likidite: {
        title: 'Likidite Oranları',
        ratios: [],
        ozet: ''
    },
    devirHizlari: {
        title: 'Devir Hızları',
        ratios: [],
        ozet: ''
    },
    karlilik: {
      title: 'Kârlılık Oranları',
      ratios: [
        { name: 'Brüt Kâr Marjı', oncekiDonem: 0.33, cariDonem: 0.30, formula: 'Brüt Satış Kârı / Net Satışlar', yorum: 'Satışların maliyeti arttığı için brüt kârlılıkta düşüş gözlenmiştir.' },
        { name: 'Faaliyet Kâr Marjı', oncekiDonem: 0.20, cariDonem: 0.175, formula: 'Faaliyet Kârı / Net Satışlar', yorum: 'Faaliyet giderlerindeki artış, faaliyet kârlılığını olumsuz etkilemiştir.' },
        { name: 'Net Kâr Marjı', oncekiDonem: 0.133, cariDonem: 0.112, formula: 'Net Dönem Kârı / Net Satışlar', yorum: 'Genel olarak kârlılık marjlarında bir düşüş yaşanmaktadır.' },
        { name: 'Özkaynak Kârlılığı', oncekiDonem: 0.45, cariDonem: 0.40, formula: 'Net Dönem Kârı / Ortalama Öz Kaynaklar', yorum: 'Öz kaynakların kâr yaratma verimliliği azalmıştır.' },
      ],
      ozet: 'İşletmenin kârlılık oranlarında genel bir düşüş trendi gözlemlenmektedir. Maliyet ve gider yönetimine odaklanılması gerekmektedir.'
    },
  },
  vergiselAnaliz: [
      { hesapKodlari: ['190'], baslik: 'KDV Beyannamesi Tutarlılığı', kategori: 'Genel Uyum Riskleri', durum: 'Hayır', aciklama: 'Mizan üzerindeki 190 Devreden KDV hesabı ile KDV beyannamesindeki devreden KDV tutarı karşılaştırılır.', uyariMesaji: 'Mizan ve Beyanname arasında tutarsızlık olabilir.' }
  ],
  kkegAnalizi: [
      { giderAciklamasi: 'Motorlu Taşıtlar Vergisi', tutar: 15000, gerekce: 'KVK madde 11/1-d uyarınca binek otomobillerine ait MTV gider olarak kabul edilmez.', dayanakMevzuat: 'KVK Madde 11/1-d', ilgiliHesapKodlari: ['770'] }
  ],
  kurganAnalizi: {
      genelRiskDurumu: 'Düşük',
      riskOzeti: 'Yapılan analizde sahte belge kullanımına ilişkin önemli bir risk tespit edilmemiştir.',
      kriterAnalizleri: [
          { kriterAdi: 'Hasılattaki Ani Artışlar', riskDurumu: 'Düşük', analizDetayi: 'Satışlarda istikrarlı bir artış var, ani ve şüpheli bir yükseliş gözlenmedi.', ilgiliHesaplar: ['600'], mevzuatReferansi: 'VUK 359' }
      ],
      aksiyonOnerileri: ['Periyodik iç denetimlere devam edilmelidir.']
  },
  nakitAkim: {
      isletme: { bolumAdi: 'İşletme Faaliyetlerinden Nakit Akışları', items: [], toplam: 10000 },
      yatirim: { bolumAdi: 'Yatırım Faaliyetlerinden Nakit Akışları', items: [], toplam: -5000 },
      finansman: { bolumAdi: 'Finansman Faaliyetlerinden Nakit Akışları', items: [], toplam: 2000 },
      netArtis: { aciklama: 'Nakit ve Nakit Benzerlerinde Net Artış/Azalış', tutar: 7000 },
      donemBasi: { aciklama: 'Dönem Başı Nakit ve Nakit Benzerleri', tutar: 10000 },
      donemSonu: { aciklama: 'Dönem Sonu Nakit ve Nakit Benzerleri', tutar: 17000 },
  },
  kurumlarVergisi: {
      ticariKar: 28000000,
      kkegToplam: 15000,
      zararIfaGideri: 0,
      digerIlaveler: 0,
      toplamIlaveler: 15000,
      karIlavelerToplami: 28015000,
      gecmisYilZararlari: 0,
      istisnalar: 0,
      indirimeEsasTutar: 28015000,
      digerIndirimler: 0,
      toplamIndirimler: 0,
      vergiMatrahi: 28015000,
      vergiOrani: 0.25,
      hesaplananKurumlarVergisi: 7003750,
      mahsupEdilecekVergiler: 0,
      odenmesiGerekenKV: 7003750,
      sonrakiYilaDevredenKV: 0
  }
};
