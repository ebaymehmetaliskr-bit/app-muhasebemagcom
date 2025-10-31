

import { AnalysisData, KKEGItem } from '../types';

export const mockAnalysisData: AnalysisData = {
  pdfText: 'Bu alanda analiz edilen PDF dosyasının tam metni yer alacaktır. Detaylı raporlama gibi özellikler bu metni bağlam olarak kullanır.',
  dashboard: {
    summary: {
      mizan: 89,
      bilanco: 77,
      gelirGider: 33,
      analizler: 12,
      kkeg: 4,
    },
    aktifYapi: [
      { name: 'Dönen Varlıklar', value: 60 },
      { name: 'Duran Varlıklar', value: 40 },
    ],
    pasifYapi: [
      { name: 'Kısa Vadeli Yabancı Kaynaklar', value: 45 },
      { name: 'Uzun Vadeli Yabancı Kaynaklar', value: 20 },
      { name: 'Özkaynaklar', value: 35 },
    ],
  },
  mizan: [
    { hesapKodu: 'I', hesapAdi: 'Dönen Varlıklar', oncekiDonem: 74261885.75, cariDonem: 106063019.43, isMain: true, isSub: false },
    { hesapKodu: 'A', hesapAdi: 'Hazır Değerler', oncekiDonem: 18717780.78, cariDonem: 35100908.34, isMain: false, isSub: true },
    { hesapKodu: '100', hesapAdi: 'Kasa', oncekiDonem: 2022558.53, cariDonem: 820834.77, isMain: false, isSub: false },
    { hesapKodu: '101', hesapAdi: 'Alınan Çekler', oncekiDonem: 926201.80, cariDonem: 0.00, isMain: false, isSub: false },
    { hesapKodu: '102', hesapAdi: 'Bankalar', oncekiDonem: 26095902.23, cariDonem: 23606817.25, isMain: false, isSub: false },
    { hesapKodu: '103', hesapAdi: 'Verilen Çekler ve Ödeme Emirleri (-)', oncekiDonem: -16739247.17, cariDonem: 0.00, isMain: false, isSub: false },
    { hesapKodu: 'C', hesapAdi: 'Ticari Alacaklar', oncekiDonem: 47348312.88, cariDonem: 65524183.72, isMain: false, isSub: true },
    { hesapKodu: '120', hesapAdi: 'Alıcılar', oncekiDonem: 46238312.88, cariDonem: 63209927.72, isMain: false, isSub: false },
    { hesapKodu: '121', hesapAdi: 'Alacak Senetleri', oncekiDonem: 0, cariDonem: 1264256, isMain: false, isSub: false },
    { hesapKodu: 'E', hesapAdi: 'Stoklar', oncekiDonem: 4935117.96, cariDonem: 5426927.37, isMain: false, isSub: true },
  ],
  bilanco: {
    aktif: [
      {
        bolumAdi: 'I. Dönen Varlıklar',
        stoklar: [
          { aciklama: 'A. Hazır Değerler', oncekiDonem: 18717780.78, cariDonem: 35100908.34 },
          { aciklama: '..Kasa', oncekiDonem: 2022558.53, cariDonem: 820834.77 },
          { aciklama: '..Bankalar', oncekiDonem: 26095902.23, cariDonem: 23606817.25 },
          { aciklama: 'C. Ticari Alacaklar', oncekiDonem: 47348312.88, cariDonem: 65524183.72 },
          { aciklama: 'E. Stoklar', oncekiDonem: 4935117.96, cariDonem: 5426927.37 },
        ]
      },
    ],
    pasif: [
      {
        bolumAdi: 'III. Kısa Vadeli Yabancı Kaynaklar',
        stoklar: [
          { aciklama: 'A. Mali Borçlar', oncekiDonem: 126266.54, cariDonem: 225289.28 },
          { aciklama: 'B. Ticari Borçlar', oncekiDonem: 22450980.22, cariDonem: 34116582.01 },
          { aciklama: '..Satıcılar', oncekiDonem: -22343112.22, cariDonem: -31535005.41 },
          { aciklama: 'C. Diğer Borçlar', oncekiDonem: 21855380.04, cariDonem: 3367252.33 },
        ]
      },
    ]
  },
  gelirGider: [
    { aciklama: 'Brüt Satışlar', oncekiDonem: 255504289.30, cariDonem: 438726561.85 },
    { aciklama: 'Yurtiçi Satışlar', oncekiDonem: -253182848.85, cariDonem: -435967136.66 },
    { aciklama: 'Diğer Gelirler', oncekiDonem: -2321440.45, cariDonem: -2759425.36 },
    { aciklama: 'Satış İndirimleri (-)', oncekiDonem: 324504.89, cariDonem: 215810.91 },
    { aciklama: 'Net Satışlar', oncekiDonem: 255179784.41, cariDonem: 438510750.94 },
    { aciklama: 'Satışların Maliyeti (-)', oncekiDonem: 235248975.56, cariDonem: 381012427.47 },
  ],
  gelirGiderAnalizi: [
    { name: 'BRÜT SATIŞLAR', 'Cari Dönem': 438000000, 'Önceki Dönem': 255000000 },
    { name: 'SATIŞ İNDİRİMLERİ', 'Cari Dönem': -215000, 'Önceki Dönem': -324000 },
    { name: 'SATIŞLARIN MALİYETİ', 'Cari Dönem': 381000000, 'Önceki Dönem': 235000000 },
    { name: 'FAALİYET GİDERLERİ', 'Cari Dönem': 10000000, 'Önceki Dönem': 8000000 },
    { name: 'DİĞER GELİRLER VE KARLAR', 'Cari Dönem': 5000000, 'Önceki Dönem': 4000000 },
    { name: 'FİNANSMAN GİDERLERİ', 'Cari Dönem': 3000000, 'Önceki Dönem': 2000000 },
    { name: 'OLAĞANDIŞI GİDER VE ZARARLAR', 'Cari Dönem': 1000000, 'Önceki Dönem': 500000 },
    { name: 'OLAĞANDIŞI GELİR VE KARLAR', 'Cari Dönem': 2000000, 'Önceki Dönem': 1500000 },
  ],
  rasyolar: {
    finansalYapi: {
      title: 'Finansal Yapı Oranları',
      ozet: 'İşletmenin finansal yapısı oldukça güçlüdür. Cari dönemde borçluluk azalmış, öz kaynakların varlıklar içindeki payı artmıştır. Bu durum, şirketin finansal riskinin düştüğünü ve borç ödeme kapasitesinin iyileştiğini göstermektedir.',
      ratios: [
        { name: 'Kaldıraç Oranı', cariDonem: 0.366, oncekiDonem: 0.459, formula: 'Toplam Yabancı Kaynaklar / Toplam Varlıklar', yorum: 'Cari dönemde varlıkların %36.6\'sı yabancı kaynaklarla finanse edilmiş. Önceki döneme göre borçluluk azalmış, bu durum finansal riskin düştüğünü gösterir. İdeal oran sektöre göre değişir, ancak %50 civarı makul kabul edilebilir.' },
        { name: 'Öz Kaynak Oranı', cariDonem: 0.634, oncekiDonem: 0.541, formula: 'Öz Kaynaklar / Toplam Varlıklar', yorum: 'İşletmenin varlıklarının %63.4\'ü öz kaynaklarla finanse ediliyor. Bu, şirketin finansal yapısının güçlü olduğunu ve borca bağımlılığının azaldığını gösterir. Artış trendi olumludur.' },
        { name: 'Borç / Öz Kaynak Oranı', cariDonem: 0.577, oncekiDonem: 0.848, formula: 'Toplam Yabancı Kaynaklar / Öz Kaynaklar', yorum: 'Cari dönemde her 1 TL\'lik öz kaynağa karşılık 0.58 TL borç bulunmaktadır. Oranın 1\'den küçük olması ve düşüş trendinde olması, borç ödeme kapasitesinin arttığını ve alacaklılar için güvencenin yükseldiğini gösterir.' },
        { name: 'Duran Varlıkların Devamlı Sermayeye Oranı', cariDonem: 0.85, oncekiDonem: 0.92, formula: 'Duran Varlıklar / (Öz Kaynaklar + Uzun Vadeli Y.K.)', yorum: 'Duran varlıklar, uzun vadeli kaynaklarla finanse edilmektedir (oran < 1). Bu, "altın kural" olarak bilinen duruma uygun ve olumlu bir göstergedir. İşletme, yatırım harcamalarını doğru kaynaklarla finanse etmektedir.' },
        { name: 'Kısa Vadeli Yabancı Kaynak Oranı', cariDonem: 0.250, oncekiDonem: 0.300, formula: 'Kısa Vadeli Yabancı Kaynaklar / Toplam Varlıklar', yorum: 'Varlıkların ne kadarının kısa vadeli borçlarla finanse edildiğini gösterir. Oranın düşmesi, kısa vadeli borç baskısının azaldığını gösterir ve olumludur.' },
        { name: 'Uzun Vadeli Yabancı Kaynak Oranı', cariDonem: 0.116, oncekiDonem: 0.159, formula: 'Uzun Vadeli Yabancı Kaynaklar / Toplam Varlıklar', yorum: 'Varlıkların ne kadarının uzun vadeli borçlarla finanse edildiğini gösterir. Şirketin uzun vadeli borçlanma yapısını analiz etmek için kullanılır.' },
        { name: 'Duran Varlıkların Özkaynaklara Oranı', cariDonem: 0.90, oncekiDonem: 1.10, formula: 'Duran Varlıklar / Öz Kaynaklar', yorum: 'Duran varlıkların özkaynaklar tarafından ne ölçüde karşılandığını gösterir. Oranın 1\'den küçük olması, duran varlıkların tamamen özkaynaklarla finanse edildiğini gösterir ve bu ideal bir durumdur.' }
      ],
    },
    likidite: {
      title: 'Likidite Oranları',
      ozet: 'Şirketin likidite durumu son derece sağlıklıdır. Tüm likidite oranları ideal seviyelerin üzerinde ve artış trendindedir. Bu, şirketin kısa vadeli yükümlülüklerini karşılama konusunda hiçbir zorluk yaşamadığını göstermektedir.',
      ratios: [
        { name: 'Cari Oran', cariDonem: 2.162, oncekiDonem: 1.139, formula: 'Dönen Varlıklar / Kısa Vadeli Yabancı Kaynaklar', yorum: 'İşletmenin kısa vadeli borçlarını ödeme gücü oldukça iyi durumda ve önceki döneme göre önemli bir artış göstermiş. 1.5-2.0 arası ideal kabul edilir, 2\'nin üzeri likidite fazlasına işaret edebilir.' },
        { name: 'Asit-Test Oranı', cariDonem: 2.039, oncekiDonem: 1.067, formula: '(Dönen Varlıklar - Stoklar) / Kısa Vadeli Yabancı Kaynaklar', yorum: 'Stoklar hariç tutulduğunda dahi şirketin borç ödeme gücü çok yüksek. İdeal değer 1\'dir. Bu oran, stoklara bağımlılığın çok düşük olduğunu gösteriyor.' },
        { name: 'Nakit Oranı', cariDonem: 0.554, oncekiDonem: 0.243, formula: '(Hazır Değerler + Menkul Kıymetler) / Kısa Vadeli Yabancı Kaynaklar', yorum: 'İşletmenin en likit varlıkları, kısa vadeli borçların %55\'ini karşılayabiliyor. 0.20\'nin üzerindeki bu değer, şirketin nakit pozisyonunun çok güçlü olduğunu gösterir.' },
      ],
    },
    devirHizlari: {
      title: 'Devir Hızları (Faaliyet Oranları)',
      ozet: 'İşletme, faaliyet verimliliğini önemli ölçüde artırmıştır. Stok ve alacak devir hızlarındaki artış, şirketin varlıklarını daha etkin kullandığını ve nakit döngüsünü iyileştirdiğini kanıtlamaktadır.',
      ratios: [
        { name: 'Stok Devir Hızı', cariDonem: 73.54, oncekiDonem: 47.67, formula: 'Satışların Maliyeti / Ortalama Stoklar', yorum: 'Stokların paraya çevrilme hızı önemli ölçüde artmış. Bu, stok yönetiminin etkin olduğunu ve stokların hızla satıldığını gösterir. Yüksek devir hızı genellikle olumludur.' },
        { name: 'Stokta Kalma Süresi (Gün)', cariDonem: 4.9, oncekiDonem: 7.6, formula: '365 / Stok Devir Hızı', yorum: 'Stoklar ortalama 4.9 günde bir yenileniyor. Sürenin kısalması, stokların verimli yönetildiğini ve atıl stok riskinin düşük olduğunu gösterir.' },
        { name: 'Alacak Devir Hızı', cariDonem: 6.69, oncekiDonem: 5.52, formula: 'Net Satışlar / Ortalama Ticari Alacaklar', yorum: 'Alacakların tahsil edilme hızı artmış. Bu, şirketin alacak yönetiminde daha başarılı olduğunu ve nakit akışını iyileştirdiğini gösterir.' },
        { name: 'Ortalama Tahsil Süresi (Gün)', cariDonem: 54.5, oncekiDonem: 66.1, formula: '365 / Alacak Devir Hızı', yorum: 'Alacakların ortalama tahsil süresi 54.5 güne düşmüş. Bu olumlu bir gelişmedir ve şirketin sermaye bağlama süresini kısaltır.' },
        { name: 'Aktif Devir Hızı', cariDonem: 1.79, oncekiDonem: 1.45, formula: 'Net Satışlar / Ortalama Toplam Varlıklar', yorum: 'Şirket, varlıklarını satış yaratmak için daha verimli kullanıyor. Oranın yükselmesi, varlık kullanım etkinliğinin arttığını gösterir.' },
      ],
    },
    karlilik: {
      title: 'Kârlılık Oranları',
      ozet: 'Şirketin kârlılığı tüm metriklerde önemli bir iyileşme göstermiştir. Satış kârlılığı, öz kaynak ve varlık kârlılığındaki artışlar, hem operasyonel verimliliğin hem de genel yönetim performansının arttığına işaret etmektedir.',
      ratios: [
          { name: 'Brüt Kâr Marjı', cariDonem: 0.131, oncekiDonem: 0.078, formula: 'Brüt Satış Kârı / Net Satışlar', yorum: 'Satılan malın maliyetinin kontrolünde iyileşme var. Satışların her 100 TL\'si 13.1 TL brüt kâr yaratıyor. Marjdaki artış çok olumlu.' },
          { name: 'Net Kâr Marjı', cariDonem: 0.073, oncekiDonem: 0.043, formula: 'Dönem Net Kârı / Net Satışlar', yorum: 'Tüm giderler düşüldükten sonra satışlardan elde edilen net kârlılık oranı artmış. Bu, şirketin genel verimliliğinin ve kârlılığının arttığını gösterir.' },
          { name: 'Öz Kaynak Kârlılığı (ROE)', cariDonem: 0.25, oncekiDonem: 0.18, formula: 'Dönem Net Kârı / Ortalama Öz Kaynaklar', yorum: 'Ortakların yatırdığı sermayenin kârlılığı artmış. Her 100 TL\'lik öz kaynak 25 TL net kâr yaratıyor. Bu, hissedarlar için olumlu bir göstergedir.' },
          { name: 'Varlıkların Kârlılığı (ROA)', cariDonem: 0.15, oncekiDonem: 0.10, formula: 'Dönem Net Kârı / Ortalama Toplam Varlıklar', yorum: 'Şirketin varlıklarını kâr yaratmak için ne kadar etkin kullandığı artmış. Bu, genel yönetim performansının iyileştiğini gösterir.' },
      ]
    }
  },
  vergiselAnaliz: [
    { hesapKodlari: ['122'], baslik: 'Çek ve Senetlerde Reeskont Uygulaması', kategori: 'Alacak Riskleri', durum: 'Hayır', aciklama: 'Güncel reeskont oranı ve hesaplama yönteminin yanı sıra, varsa borç senetlerinin reeskont işlemleri ve önceki yıllara ait iptallerin gözden geçirilmesi gerekmektedir.', uyariMesaji: 'VUK 281/285 uyarınca reeskont hesaplamaları TCMB oranlarına göre yapılmalıdır. Hatalı oran kullanımı vergi ziyaına yol açabilir.', mevzuatReferanslari: ['VUK Madde 281', 'VUK Madde 285'] },
    { hesapKodlari: ['645', '655'], baslik: 'Girişim Sermayesi Fonu İstisnası', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Evet', aciklama: 'Girişim sermayesi fonu istisnasının uygulanabilmesi için gerekli koşulların sağlanıp sağlanmadığı kontrol edilmelidir.', mevzuatReferanslari: ['KVK Madde 10/1-g', 'VUK Madde 325/A'] },
    { hesapKodlari: ['129'], baslik: 'Şüpheli Ticari Alacaklardaki Hareket', kategori: 'Alacak Riskleri', durum: 'Hayır', aciklama: 'Dava yazısına istinaden karşılık ayırma dönemi atlanmamalıdır. Fazla tahakkuk eden gelirler indirimler kapsamında değerlendirilmelidir. Eksik tahakkuk edilen gelirler ise kanunen kabul edilmeyen gider (KKEG) olarak dikkate alınmalıdır.', uyariMesaji: 'VUK 323\'e göre şüpheli alacak karşılığı sadece dava veya icra safhasındaki alacaklar için ayrılabilir. Hatalı işlem KKEG gerektirir.', mevzuatReferanslari: ['VUK Madde 323'] },
    { hesapKodlari: ['131'], baslik: 'Ortaklardan Alacaklar', kategori: 'Alacak Riskleri', durum: 'Hayır', aciklama: 'Ortaklardan alacaklar için vade farkı faturalaması gerçekleştirildi mi? Uygulanan faiz oranı piyasa koşullarına uygun mu? Ayrıca, emsal KDV durumu incelendi mi?', uyariMesaji: '131 nolu hesapta yüksek bakiye, örtülü kazanç dağıtımı riski taşır ve KDV\'li faiz faturası gerektirir. Acil inceleyin.', mevzuatReferanslari: [] },
    { hesapKodlari: ['158'], baslik: 'Stok Değer Düşüklüğü ve/veya İmha', kategori: 'Varlık Riskleri', durum: 'Hayır', aciklama: 'Stok değer düşüklüğü, kanunen kabul edilmeyen gider (KKEG) olarak değerlendirilmelidir. Ayrıca, takdir komisyonu kararı olmadan gerçekleştirilen imha işlemi ve buna ilişkin KDV de KKEG olarak dikkate alınmalıdır.', uyariMesaji: 'Takdir Komisyonu kararı olmaksızın yapılan stok imhası ve değer düşüklüğü KKEG olarak kabul edilir (VUK 278).', mevzuatReferanslari: ['VUK Madde 278'] },
    { hesapKodlari: ['181'], baslik: 'Gelir Tahakkuku Analizi', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Hayır', aciklama: 'Fazla veya eksik gelir tahakkuku analizi yapılmalıdır. Fazla tahakkuk eden gelirler indirimler kapsamında değerlendirilmelidir. Eksik tahakkuk edilen gelirler ise kanunen kabul edilmeyen gider (KKEG) bölümünde ilave olarak dikkate alınmalıdır.', mevzuatReferanslari: [] },
    { hesapKodlari: ['190', '391'], baslik: 'KDV Beyannamesi Tutarlılığı', kategori: 'Genel Uyum Riskleri', durum: 'Evet', aciklama: 'Mizan verileri ile KDV beyannamesindeki devreden KDV ve hesaplanan KDV tutarlarının birbiriyle tutarlı olup olmadığı kontrol edilmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['193', '360'], baslik: 'Geçici Vergi ve Kurumlar Vergisi Uyumu', kategori: 'Genel Uyum Riskleri', durum: 'Hayır', aciklama: 'Yıl içinde ödenen geçici vergilerin, hesaplanan kurumlar vergisinden doğru bir şekilde mahsup edilip edilmediği incelenmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['257', '770'], baslik: 'Amortisman Hesaplamaları ve VUK Uyumu', kategori: 'Varlık Riskleri', durum: 'Evet', aciklama: 'Maddi ve maddi olmayan duran varlıklar için ayrılan amortismanların uygun oran ve yöntemlerle hesaplanıp hesaplanmadığı kontrol edilmelidir.', mevzuatReferanslari: ['VUK Madde 313', 'VUK Madde 321'] },
    { hesapKodlari: ['522'], baslik: 'Yeniden Değerleme Fonları', kategori: 'Borç ve Kaynak Riskleri', durum: 'Hayır', aciklama: 'Duran varlık yeniden değerleme fonlarının vergi mevzuatına uygun şekilde kullanılıp kullanılmadığı ve vergilendirme işlemlerinin doğru yapılıp yapılmadığı kontrol edilmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['689', '770'], baslik: 'Bağış ve Yardımların İndirimi', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Evet', aciklama: 'Yapılan bağış ve yardımların, belirtilen kurum ve kuruluşlara yapılıp yapılmadığı ve indirim sınırlarına uyulup uyulmadığı incelenmelidir.', mevzuatReferanslari: ['KVK Madde 10'] },
    { hesapKodlari: ['131', '331'], baslik: 'Örtülü Sermaye ve Transfer Fiyatlandırması', kategori: 'Borç ve Kaynak Riskleri', durum: 'Hayır', aciklama: 'İlişkili kişilerle yapılan işlemlerde (borçlanma, mal/hizmet alım-satımı vb.) emsallere uygunluk ilkesine uyulup uyulmadığı kontrol edilmelidir.', mevzuatReferanslari: ['KVK Madde 12', 'KVK Madde 13'] },
    { hesapKodlari: ['601', '570'], baslik: 'Yurtdışı Kazanç İstisnaları', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Hayır', aciklama: 'Yurtdışı şube kazançları veya iştirak temettüleri gibi gelirler için uygulanan vergi istisnalarının koşullarının sağlanıp sağlanmadığı incelenmelidir.', mevzuatReferanslari: ['KVK Madde 5'] },
    { hesapKodlari: ['263', '549'], baslik: 'Ar-Ge ve Tasarım İndirimleri', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Evet', aciklama: 'Ar-Ge veya tasarım merkezlerinde yapılan harcamaların, ilgili kanunlar kapsamında indirim veya istisna olarak doğru bir şekilde dikkate alınıp alınmadığı kontrol edilmelidir.', mevzuatReferanslari: ['Law No. 5746'] },
    { hesapKodlari: ['-'], baslik: 'E-Defter ve E-Fatura Uyumluluğu', kategori: 'Genel Uyum Riskleri', durum: 'Evet', aciklama: 'Elektronik defter ve fatura sistemine dahil olan mükelleflerin, GİB tarafından belirlenen format ve standartlara uygun hareket edip etmediği kontrol edilmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['360'], baslik: 'Damga Vergisi Yükümlülükleri', kategori: 'Genel Uyum Riskleri', durum: 'Evet', aciklama: 'Düzenlenen sözleşmeler, belgeler ve diğer kağıtlar üzerinden hesaplanması gereken damga vergisinin beyan edilip ödendiği kontrol edilmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['770', '361'], baslik: 'Personel Giderleri ve SGK Primleri Uyumu', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Evet', aciklama: 'Maaş bordroları ile SGK bildirgeleri arasında tutarlılık olup olmadığı ve gelir vergisi tevkifatlarının doğru yapılıp yapılmadığı incelenmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['689'], baslik: 'Kanunen Kabul Edilmeyen Giderler (KKEG)', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Hayır', aciklama: 'Vergi kanunları tarafından gider olarak kabul edilmeyen harcamaların (örneğin, para cezaları, belgesiz giderler) mali kârın tespitinde doğru bir şekilde KKEG olarak eklenip eklenmediği kontrol edilmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['25', '54'], baslik: 'Yatırım Teşvik Belgeleri Kullanımı', kategori: 'Varlık Riskleri', durum: 'Hayır', aciklama: 'Yatırım teşvik belgesi kapsamında yapılan harcamalar için uygulanan indirimli kurumlar vergisi, KDV istisnası gibi teşviklerin doğru uygulanıp uygulanmadığı kontrol edilmelidir.', mevzuatReferanslari: [] },
    { hesapKodlari: ['580', '570'], baslik: 'Zarar Mahsubu İşlemleri', kategori: 'Kar/Zarar ve Gider Riskleri', durum: 'Evet', aciklama: 'Geçmiş yıl mali zararlarının, ilgili dönem kârından mahsup edilirken 5 yıllık zaman aşımı süresine ve mahsup kurallarına uyulup uyulmadığı incelenmelidir.', mevzuatReferanslari: ['KVK Madde 9'] },
    { hesapKodlari: ['100', '102'], baslik: 'Kasa ve Banka Hesapları Mutabakatı', kategori: 'Varlık Riskleri', durum: 'Evet', aciklama: 'Dönem sonu kasa sayım tutanağı ile mizan kasa bakiyesinin ve banka ekstreleri ile mizan banka bakiyelerinin uyumlu olup olmadığı kontrol edilmelidir. Özellikle kasa hesabının yüksek bakiyeli olması vergisel riskler taşıyabilir.', mevzuatReferanslari: ['VUK'] },
  ],
  kkegAnalizi: [
    {
      giderAciklamasi: 'Binek otomobillere ait Motorlu Taşıtlar Vergisi (MTV)',
      tutar: 15450.75,
      gerekce: 'Gelir Vergisi Kanunu\'nun 40. maddesi ve Motorlu Taşıtlar Vergisi Kanunu\'nun 14. maddesi uyarınca, binek otomobillerine ait MTV, ticari kazancın tespitinde gider olarak kabul edilmez.',
      dayanakMevzuat: 'MTV Kanunu Madde 14',
      ilgiliHesapKodlari: ['770']
    },
    {
      giderAciklamasi: 'Vergi Usul Kanununa göre düzenlenmemiş belgesiz giderler',
      tutar: 8200.00,
      gerekce: 'Vergi Usul Kanunu\'nda belirtilen fatura, perakende satış fişi gibi yasal belgelerle tevsik edilemeyen harcamalar gider olarak yazılamaz.',
      dayanakMevzuat: 'VUK Madde 227',
      ilgiliHesapKodlari: ['770', '760']
    },
    {
      giderAciklamasi: 'Dönemle ilgili olmayan gelecek döneme ait giderler',
      tutar: 25000.00,
      gerekce: 'Dönemsellik ilkesi gereği, cari döneme ait olmayan ve gelecek hesap dönemlerini ilgilendiren giderler, ilgili dönemde giderleştirilmelidir. Bu tutar 180 hesaptan 770 hesaba yanlışlıkla virmanlanmıştır.',
      dayanakMevzuat: 'VUK Madde 287',
      ilgiliHesapKodlari: ['180', '770']
    },
    {
      giderAciklamasi: 'Ödenen Vergi Cezaları ve Gecikme Zammı',
      tutar: 5678.50,
      gerekce: 'Kurumlar Vergisi Kanunu\'nun 11. maddesi uyarınca, her türlü vergi cezaları, para cezaları ve gecikme zamları kurum kazancının tespitinde gider olarak indirilemez.',
      dayanakMevzuat: 'KVK Madde 11/1-d',
      ilgiliHesapKodlari: ['689']
    },
  ],
  kurganAnalizi: {
    genelRiskDurumu: 'Orta',
    riskOzeti: 'Şirketin genel mali durumu ve faaliyet konusu uyumu sahte belge riski açısından olumlu bir tablo çizerken, özellikle ödeme yöntemlerinde kasa kullanımının yüksekliği ve bazı büyük tutarlı alımların oran analizi dikkat çekmektedir. Bu alanlarda belgelendirmenin güçlendirilmesi, olası bir denetimde ispat kolaylığı sağlayacaktır.',
    kriterAnalizleri: [
      {
        kriterAdi: 'VTR Bulguları',
        riskDurumu: 'Tespit Edilmedi',
        analizDetayi: 'Tedarikçilere ait Vergi Tekniği Raporu (VTR) bulgularına sunulan mali tablolardan ulaşılamamaktadır. Bu analiz harici bir veri kaynağı gerektirir.',
        ilgiliHesaplar: ['320'],
        mevzuatReferansi: 'Genelge Madde 1.1'
      },
      {
        kriterAdi: 'Faaliyet Konusu Uyumu',
        riskDurumu: 'Düşük',
        analizDetayi: 'Gider hesapları (740, 770 vb.) ve stoklar (153) incelendiğinde, yapılan harcamaların şirketin ana faaliyet konusu ile genel olarak uyumlu olduğu görülmektedir. Faaliyet konusu dışı, büyük tutarlı bir alıma rastlanmamıştır.',
        ilgiliHesaplar: ['153', '740', '770'],
        mevzuatReferansi: 'Genelge Madde 1.2'
      },
      {
        kriterAdi: 'Ödeme Yöntemleri',
        riskDurumu: 'Yüksek',
        analizDetayi: 'Kasa (100) hesabının önceki döneme göre azalmış olmasına rağmen, dönem içindeki işlemlerde yüksek nakit kullanımı potansiyeli bir risk faktörüdür. Bankalar (102) ve Çekler (103) yoluyla yapılan ödemeler daha düşük risk teşkil eder. Yüksek tutarlı ödemelerin banka kanalıyla yapıldığının tevsik edilmesi önemlidir.',
        ilgiliHesaplar: ['100', '102', '103', '320'],
        mevzuatReferansi: 'Genelge Madde 1.9'
      },
      {
        kriterAdi: 'Genel Mali Durum',
        riskDurumu: 'Düşük',
        analizDetayi: 'Şirket her iki dönemde de kârlıdır ve satışlarını önemli ölçüde artırmıştır. Ödenen vergiler ve finansal rasyolar, şirketin sağlıklı ve istikrarlı bir mali yapıya sahip olduğunu göstermektedir. Bu durum, sahte belge kullanma motivasyonunu düşüren bir unsurdur.',
        ilgiliHesaplar: ['690', '193', '360'],
        mevzuatReferansi: 'Genelge Madde 1.5'
      }
    ],
    aksiyonOnerileri: [
      'Özellikle 8.000 TL üzeri mal ve hizmet alımlarına ilişkin ödemelerin mutlaka banka, çek gibi tevsik edici kanallarla yapıldığından emin olun.',
      'Yüksek tutarlı mal alımlarına ilişkin sevkiyat irsaliyeleri, taşıma belgeleri ve mal kabul fişlerini dijital olarak arşivleyin.',
      'Kasa hesabının bakiyesini makul seviyelerde tutun ve yüksek tutarlı nakit hareketlerinden kaçının.',
      'Yeni ve daha önce çalışılmamış tedarikçiler için vergi kimlik numarası üzerinden temel bir mükellefiyet kontrolü yapın.'
    ]
  },
  nakitAkim: {
    isletme: {
        bolumAdi: "İşletme Faaliyetlerinden Nakit Akışları",
        items: [
            { aciklama: "Dönem Net Karı", tutar: 32000000, isSub: false },
            { aciklama: "Amortisman ve İtfa Giderleri", tutar: 2000000, isSub: true },
            { aciklama: "Kıdem Tazminatı Karşılığı Artışı", tutar: 500000, isSub: true },
            { aciklama: "Ticari Alacaklardaki Azalış (Artış)", tutar: -18175870.84, isSub: true },
            { aciklama: "Stoklardaki Azalış (Artış)", tutar: -491809.41, isSub: true },
            { aciklama: "Ticari Borçlardaki Artış (Azalış)", tutar: 11665601.79, isSub: true },
        ],
        toplam: 27497921.54
    },
    yatirim: {
        bolumAdi: "Yatırım Faaliyetlerinden Nakit Akışları",
        items: [
            { aciklama: "Maddi Duran Varlık Alımı", tutar: -5000000, isSub: false },
        ],
        toplam: -5000000
    },
    finansman: {
        bolumAdi: "Finansman Faaliyetlerinden Nakit Akışları",
        items: [
            { aciklama: "Kullanılan Krediler", tutar: 99022.74, isSub: false },
            { aciklama: "Ödenen Temettüler", tutar: -10000000, isSub: false },
        ],
        toplam: -9900977.26
    },
    netArtis: { aciklama: "Nakit ve Nakit Benzerlerinde Net Artış/Azalış", tutar: 12596944.28 },
    donemBasi: { aciklama: "Dönem Başı Nakit ve Nakit Benzerleri", tutar: 18717780.78 },
    donemSonu: { aciklama: "Dönem Sonu Nakit ve Nakit Benzerleri", tutar: 31314725.06 }
  },
};