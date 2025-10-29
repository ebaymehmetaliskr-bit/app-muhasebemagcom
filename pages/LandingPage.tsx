import React from 'react';
import { Route } from '../App';

interface LandingPageProps {
  onNavigate: (route: Route) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.querySelector(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#0D1117] text-[#E6EDF3] antialiased">
<header className="sticky top-0 z-50 flex items-center justify-center border-b border-solid border-gray-800/80 bg-[#0D1117]/80 backdrop-blur-md">
<nav className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-3 w-full max-w-7xl">
<a className="flex items-center gap-3 text-foreground-dark" href="#">
<div className="size-7 text-[#10B981]">
<svg aria-hidden="true" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_6_543)">
<path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
<path clip-rule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill-rule="evenodd"></path>
</g>
<defs>
<clipPath id="clip0_6_543"><rect fill="white" height="48" width="48"></rect></clipPath>
</defs>
</svg>
</div>
<span className="text-lg font-bold">Finansal Analiz AI</span>
</a>
<div className="hidden md:flex flex-1 justify-end items-center gap-8">
<div className="flex items-center gap-8">
<a onClick={(e) => handleScroll(e, '#features')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#features">Özellikler</a>
<a onClick={(e) => handleScroll(e, '#howitworks')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#howitworks">Nasıl Çalışır</a>
<a onClick={(e) => handleScroll(e, '#testimonials')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#testimonials">Referanslar</a>
<a onClick={(e) => handleScroll(e, '#faq')} className="text-gray-400 hover:text-white text-sm font-medium transition-colors" href="#faq">SSS</a>
</div>
<div className="flex gap-2">
<button onClick={() => onNavigate('login')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-gray-800 text-foreground-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-700 transition-colors">
<span className="truncate">Giriş Yap</span>
</button>
<button onClick={() => onNavigate('app')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-[#4F46E5] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4F46E5]/90 transition-colors">
<span className="truncate">Ücretsiz Deneyin</span>
</button>
</div>
</div>
<button aria-label="Menüyü aç" className="md:hidden text-foreground-dark">
<span className="material-symbols-outlined">menu</span>
</button>
</nav>
</header>
<main className="flex flex-1 justify-center py-5">
<div className="flex flex-col w-full max-w-7xl">
<section className="flex justify-center items-center py-20 sm:py-32">
<div className="container mx-auto px-4 text-center">
<div className="flex flex-col gap-6 items-center max-w-3xl mx-auto">
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter">AI Destekli Otomatik Finansal Raporlama</h1>
<p className="text-lg sm:text-xl text-gray-400">PDF vergi beyannamelerinizi saniyeler içinde kapsamlı finansal raporlara dönüştürün. Hız, doğruluk ve verimliliği bir araya getirin.</p>
<div className="flex flex-col sm:flex-row gap-4 mt-4">
<button onClick={() => onNavigate('app')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-[#4F46E5] text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#4F46E5]/90 transition-colors shadow-lg shadow-[#4F46E5]/20">
<span className="truncate">Hemen Deneyin</span>
</button>
<button onClick={() => onNavigate('demo')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-gray-800 text-foreground-dark text-lg font-bold leading-normal tracking-[0.015em] hover:bg-gray-700 transition-colors border border-gray-700">
<span className="truncate">Demo Talep Edin</span>
</button>
</div>
</div>
<div className="mt-16">
<img alt="Yapay zeka analizini simgeleyen veri blokları ve grafiklerin soyut 3D render'ı." className="rounded-xl w-full h-auto object-cover aspect-video shadow-2xl shadow-gray-900/20" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwjxN5foFS6fAsWoxZjPOMwHApQDednVsKjHVBk-vsz65YSyJHJ-KOQ8wHxqhn-PIMLj3af8V17qdHazrF8s1GEdgbpyDOuKAgmTkKMuIm7a6o8H_l7YFu5FmDq0aw_kXztTHgwO8xCJ22mRBGQuKo1JJ5ltdckSsoZB1QvUSRp51FGIZcDIpn1f-ZLzTTfomq2Y0KJAOgKNg_qu-CzJBp7NPcY0ZUJpzpSL3u-jY2ohehgMcvurqfSAdi13LVfgatMBnaK-Uvzrg"/>
</div>
</div>
</section>
<section className="py-16 sm:py-24" id="howitworks">
<div className="container mx-auto px-4">
<div className="flex flex-col items-center gap-4 text-center mb-12">
<h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">Sadece 3 Basit Adımda Raporlama</h2>
<p className="text-lg text-gray-400 max-w-2xl">Platformumuz, karmaşık finansal belgeleri analiz etme ve raporlama sürecini basitleştirmek için tasarlanmıştır.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
<div className="flex flex-col gap-4 text-center items-center p-6">
<div className="flex items-center justify-center text-[#10B981] bg-[#10B981]/10 h-16 w-16 rounded-full"><span className="material-symbols-outlined text-3xl">upload_file</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-xl font-bold">1. PDF Yükle</h3>
<p className="text-gray-400">Vergi beyannamesi PDF belgenizi güvenli platformumuza yükleyin.</p>
</div>
</div>
<div className="flex flex-col gap-4 text-center items-center p-6">
<div className="flex items-center justify-center text-[#10B981] bg-[#10B981]/10 h-16 w-16 rounded-full"><span className="material-symbols-outlined text-3xl">model_training</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-xl font-bold">2. AI Analiz Etsin</h3>
<p className="text-gray-400">Yapay zeka motorumuz verileri anında analiz eder ve önemli bilgileri çıkarır.</p>
</div>
</div>
<div className="flex flex-col gap-4 text-center items-center p-6">
<div className="flex items-center justify-center text-[#10B981] bg-[#10B981]/10 h-16 w-16 rounded-full"><span className="material-symbols-outlined text-3xl">assessment</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-xl font-bold">3. Rapor Hazır</h3>
<p className="text-gray-400">Kapsamlı finansal raporunuz anında görüntülenmeye ve indirilmeye hazır.</p>
</div>
</div>
</div>
</div>
</section>
<section className="py-16 sm:py-24" id="features">
<div className="container mx-auto px-4">
<div className="flex flex-col gap-4 max-w-3xl mb-12">
<h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">İş Akışınızı Güçlendiren Özellikler</h2>
<p className="text-lg text-gray-400">Finansal analiz sürecinizi dönüştürmek için tasarlanmış güçlü araç setimizi keşfedin.</p>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
<div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
<div className="text-[#10B981]"><span className="material-symbols-outlined text-3xl">table_chart</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-lg font-bold">Otomatik Finansal Tablolar</h3>
<p className="text-gray-400">Verilerinizden otomatik olarak doğru ve düzenli finansal tablolar oluşturun.</p>
</div>
</div>
<div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
<div className="text-[#10B981]"><span className="material-symbols-outlined text-3xl">sell</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-lg font-bold">21 Farklı Vergi Analizi</h3>
<p className="text-gray-400">Kapsamlı içgörüler için 21 farklı vergi analizi türünden yararlanın.</p>
</div>
</div>
<div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
<div className="text-[#10B981]"><span className="material-symbols-outlined text-3xl">pie_chart</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-lg font-bold">Önemli Oran Analizleri</h3>
<p className="text-gray-400">İşletmenizin finansal sağlığını değerlendirmek için temel oranları analiz edin.</p>
</div>
</div>
<div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
<div className="text-[#10B981]"><span className="material-symbols-outlined text-3xl">space_dashboard</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-lg font-bold">Etkileşimli Paneller</h3>
<p className="text-gray-400">Verilerinizi daha önce hiç olmadığı gibi görselleştirmek için dinamik panelleri kullanın.</p>
</div>
</div>
<div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
<div className="text-[#10B981]"><span className="material-symbols-outlined text-3xl">download</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-lg font-bold">Tek Tıkla Excel'e Aktarım</h3>
<p className="text-gray-400">Daha fazla analiz için tüm raporlarınızı kolayca Excel formatında dışa aktarın.</p>
</div>
</div>
<div className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
<div className="text-[#10B981]"><span className="material-symbols-outlined text-3xl">lock</span></div>
<div className="flex flex-col gap-1">
<h3 className="text-lg font-bold">Güvenli Veri İşleme</h3>
<p className="text-gray-400">Hassas finansal verilerinizin güvenliğini en üst düzeyde şifreleme ile sağlıyoruz.</p>
</div>
</div>
</div>
</div>
</section>
<section className="py-16 sm:py-24 bg-gray-900/50" id="testimonials">
<div className="container mx-auto px-4">
<div className="flex flex-col gap-4 text-center items-center mb-12">
<h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Profesyoneller Tarafından Güveniliyor</h2>
<p className="text-lg text-gray-400 max-w-3xl">Müşterilerimizin Vergi ve Finansal Analiz AI ile elde ettikleri verimlilik ve doğruluk artışları hakkında neler söylediklerine göz atın.</p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="flex flex-col gap-6 p-6 rounded-xl border border-gray-800 bg-[#0D1117]">
<p className="text-gray-300">"Bu araç, raporlama sürecimizi tamamen değiştirdi. Eskiden günler süren işleri artık dakikalar içinde hallediyoruz. Özellikle zaman tasarrufu inanılmaz."</p>
<div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-800">
<img alt="Profile picture of Ayşe Yılmaz" className="w-12 h-12 rounded-full object-cover" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy0dGpDOMbn-GJyiGwZ-Z-bdhNnH4I2voPhNo0v9Qkj-LPZW8jD7VoWRZKMxDkt8SDF17MezhvaI30IfTiOpfaiRNbM3EW2aCoHmkeBYrpjUpUgk83QizVKH5nLBgicKmJp5mZ2x41ou6QRIkQoxdXFqYZYG1ealyxwXb8BAU-CMksvOVlBxWc-ZRw-cGkYaKkBAVObya3C7uQABV0EC8JSKMRBAVYgZwXgU-JU8ADL84rDAfo63R9H_aH6XDcoIzBDQz1OM2MTZw"/>
<div>
<h3 className="text-base font-bold">Ayşe Yılmaz</h3>
<p className="text-sm text-gray-500">Mali Müşavir</p>
</div>
</div>
</div>
<div className="flex flex-col gap-6 p-6 rounded-xl border border-gray-800 bg-[#0D1117]">
<p className="text-gray-300">"AI destekli analizlerin doğruluğu bizi çok etkiledi. Manuel hataları neredeyse sıfıra indirdik. Kullanımı da son derece kolay, ekibimiz hemen adapte oldu."</p>
<div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-800">
<img alt="Profile picture of Mehmet Öztürk" className="w-12 h-12 rounded-full object-cover" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxJKDsYShndNFj-lEx4fZ7awWn7QyW9r29TrBJvV68DBbieUvPP0cbYCTdcL4xRzl8yLocDvCX4Pr0imvQ7TDbt8GXzfSPt6hcRPiZUNGLZ44RGdhEwCEc-nYDXSszq9Er5oANtRFp1C9T3B_WPwcs6t1GXOlZzdF7MV-w7hwCoYQeDwFuklQAGy_j-AbB9JI2jU8IhnQlWwbbEZy4CoqLzWGHa8zFh01F0ESaUhN44scuOOUADYbCbPYEgFcEwxwJAk6odawaAP0"/>
<div>
<h3 className="text-base font-bold">Mehmet Öztürk</h3>
<p className="text-sm text-gray-500">Finans Direktörü</p>
</div>
</div>
</div>
<div className="flex flex-col gap-6 p-6 rounded-xl border border-gray-800 bg-[#0D1117]">
<p className="text-gray-300">"Vergi analizleri ve oran analizleri özellikleri işimizi inanılmaz kolaylaştırdı. Karmaşık verileri anlaşılır raporlara dönüştürmek hiç bu kadar hızlı olmamıştı."</p>
<div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-800">
<img alt="Profile picture of Elif Kaya" className="w-12 h-12 rounded-full object-cover" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiLmoxMhM9fJdtRp3Ah8ZjsQTn5Rovy_utj3jyummQUR53X5dm5IPveYofuckGzqphz_GA93BI3PBxn-WuPOmN4u-X7aWjFWcGGcNevYkg5RqXKLbO4vYq1Ej5NYgjYp6s-ruSAurTgKTm4gfArJy_4vMHxIQA2XzJFga_zqam0ztrbk-xT4BdBv331_nkIVWgrX-rKwHsWec6VCd8bMJzXpb5p_zyBl4XY1wIghY0OTJaqYsg6OrdOzXBn9XRXPEbX7wVeghp1sI"/>
<div>
<h3 className="text-base font-bold">Elif Kaya</h3>
<p className="text-sm text-gray-500">Bağımsız Denetçi</p>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="py-16 sm:py-24" id="faq">
<div className="container mx-auto px-4">
<div className="flex flex-col gap-4 text-center items-center mb-12">
<h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Sıkça Sorulan Sorular</h2>
<p className="text-lg text-gray-400 max-w-3xl">Aklınıza takılan her şey için cevaplarımız burada. Daha fazla sorunuz varsa bizimle iletişime geçmekten çekinmeyin.</p>
</div>
<div className="max-w-4xl mx-auto flex flex-col gap-4">
<details className="group border-b border-gray-800 pb-4">
<summary className="flex items-center justify-between cursor-pointer list-none py-2">
<h3 className="text-lg font-medium text-foreground-dark">Vergi ve Finansal Analiz AI aracı nedir?</h3>
<span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
</summary>
<div className="mt-2 text-gray-400">
<p>Bu araç, PDF formatındaki vergi beyannamelerini yapay zeka kullanarak analiz eden ve saniyeler içinde otomatik olarak finansal tablolar, vergi analizleri ve oran analizleri gibi kapsamlı raporlar oluşturan bir web uygulamasıdır.</p>
</div>
</details>
<details className="group border-b border-gray-800 pb-4">
<summary className="flex items-center justify-between cursor-pointer list-none py-2">
<h3 className="text-lg font-medium text-foreground-dark">Hangi tür belgeleri işleyebilirim?</h3>
<span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
</summary>
<div className="mt-2 text-gray-400">
<p>Şu an için platformumuz, Türkiye'deki standart vergi beyannamesi PDF'lerini işlemek üzere optimize edilmiştir. Gelecekte farklı belge türleri için destek eklemeyi planlıyoruz.</p>
</div>
</details>
<details className="group border-b border-gray-800 pb-4">
<summary className="flex items-center justify-between cursor-pointer list-none py-2">
<h3 className="text-lg font-medium text-foreground-dark">Verilerimin güvenliği nasıl sağlanıyor?</h3>
<span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
</summary>
<div className="mt-2 text-gray-400">
<p>Veri güvenliği en büyük önceliğimizdir. Tüm belgeleriniz, aktarım sırasında ve sunucularımızda en üst düzey şifreleme standartları ile korunur. Verileriniz izniniz olmadan üçüncü taraflarla asla paylaşılmaz.</p>
</div>
</details>
<details className="group border-b border-gray-800 pb-4">
<summary className="flex items-center justify-between cursor-pointer list-none py-2">
<h3 className="text-lg font-medium text-foreground-dark">Ücretsiz deneme sürümü mevcut mu?</h3>
<span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
</summary>
<div className="mt-2 text-gray-400">
<p>Evet, platformun yeteneklerini kendiniz görmeniz için sınırlı özelliklere sahip bir ücretsiz deneme sürümü sunuyoruz. "Hemen Deneyin" butonuna tıklayarak kaydolabilir ve test etmeye başlayabilirsiniz.</p>
</div>
</details>
<details className="group pb-4">
<summary className="flex items-center justify-between cursor-pointer list-none py-2">
<h3 className="text-lg font-medium text-foreground-dark">Raporları hangi formatlarda indirebilirim?</h3>
<span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
</summary>
<div className="mt-2 text-gray-400">
<p>Oluşturulan tüm finansal raporları ve analizleri, daha fazla düzenleme ve analiz yapabilmeniz için tek bir tıklama ile Excel (.xlsx) formatında bilgisayarınıza indirebilirsiniz.</p>
</div>
</details>
</div>
</div>
</section>
<section className="py-16 sm:py-24">
<div className="container mx-auto px-4">
<div className="bg-gray-900/60 rounded-xl p-8 sm:p-16 flex flex-col items-center text-center gap-6">
<h2 className="text-3xl lg:text-4xl font-bold tracking-tight max-w-2xl">Finansal Analizlerinizi Dönüştürmeye Hazır mısınız?</h2>
<p className="text-lg text-gray-300 max-w-3xl">Verimliliğinizi artırın, hataları azaltın ve daha önce hiç olmadığı kadar hızlı bir şekilde değerli içgörüler elde edin. AI destekli platformumuzu bugün deneyin.</p>
<div className="mt-2 w-full max-w-xl">
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button onClick={() => onNavigate('app')} className="flex-1 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-[#4F46E5] text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-[#4F46E5]/90 transition-colors shadow-lg shadow-[#4F46E5]/20">
            <span className="truncate">Hemen Başlayın</span>
        </button>
        <button onClick={() => onNavigate('demo')} className="flex-1 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-gray-800 text-foreground-dark text-lg font-bold leading-normal tracking-[0.015em] hover:bg-gray-700 transition-colors border border-gray-700">
            <span className="truncate">Demo Talep Edin</span>
        </button>
    </div>
</div>
</div>
</div>
</section>
<section className="py-16 sm:py-24" id="legal">
    <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 text-center items-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Yasal Bilgiler</h2>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col gap-8 text-gray-400">
            <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Gizlilik Politikası</h3>
                <p className="mb-2">Bu, gizlilik politikası için bir yer tutucu metindir. Verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi burada yer alacaktır. Müşteri verilerinin gizliliğine ve güvenliğine büyük önem veriyoruz.</p>
                <p>Topladığımız bilgiler, hizmetlerimizi iyileştirmek ve size daha iyi bir kullanıcı deneyimi sunmak amacıyla kullanılır. Kişisel bilgileriniz asla izniniz olmadan üçüncü taraflarla paylaşılmaz.</p>
            </div>
            <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Hizmet Şartları</h3>
                <p className="mb-2">Bu, hizmet şartları için bir yer tutucu metindir. Platformumuzu kullanarak, burada belirtilen şartları ve koşulları kabul etmiş olursunuz. Lütfen bu şartları dikkatlice okuyun.</p>
                <p>Hizmetlerimizin kötüye kullanılması yasaktır. Fikri mülkiyet haklarına saygı gösterilmelidir ve platform, yasa dışı faaliyetler için kullanılamaz.</p>
            </div>
        </div>
    </div>
</section>
</div>
</main>
<footer className="bg-[#0D1117] border-t border-gray-800">
<div className="w-full max-w-7xl mx-auto px-4 sm:px-10 py-16">
<div className="flex flex-col lg:flex-row justify-between gap-12">
<div className="max-w-sm">
<a className="flex items-center gap-3 text-foreground-dark" href="#">
<div className="size-8 text-[#10B981]">
<svg aria-hidden="true" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_6_543_footer)">
<path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path>
<path clip-rule="evenodd" d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z" fill-rule="evenodd"></path>
</g>
<defs>
<clipPath id="clip0_6_543_footer"><rect fill="white" height="48" width="48"></rect></clipPath>
</defs>
</svg>
</div>
<span className="text-xl font-bold">Vergi ve Finansal Analiz AI</span>
</a>
<p className="mt-4 text-gray-400">Yapay zeka ile finansal raporlamayı otomatikleştirerek verimliliği artırın ve doğruluğu en üst düzeye çıkarın.</p>
</div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
<div>
<h4 className="font-bold text-foreground-dark mb-4">Ürün</h4>
<ul className="space-y-3">
<li><a onClick={(e) => handleScroll(e, '#features')} className="text-gray-400 hover:text-white transition-colors" href="#features">Özellikler</a></li>
<li><a onClick={(e) => handleScroll(e, '#howitworks')} className="text-gray-400 hover:text-white transition-colors" href="#howitworks">Nasıl Çalışır</a></li>
<li><a className="text-gray-400 hover:text-white transition-colors" href="#">Fiyatlandırma</a></li>
<li><a className="text-gray-400 hover:text-white transition-colors" href="#" onClick={(e) => { e.preventDefault(); onNavigate('demo'); }}>Demo</a></li>
</ul>
</div>
<div>
<h4 className="font-bold text-foreground-dark mb-4">Şirket</h4>
<ul className="space-y-3">
<li><a className="text-gray-400 hover:text-white transition-colors" href="#">Hakkımızda</a></li>
<li><a className="text-gray-400 hover:text-white transition-colors" href="#">İletişim</a></li>
</ul>
</div>
<div>
<h4 className="font-bold text-foreground-dark mb-4">Yasal</h4>
<ul className="space-y-3">
<li><a onClick={(e) => handleScroll(e, '#legal')} className="text-gray-400 hover:text-white transition-colors" href="#legal">Gizlilik Politikası</a></li>
<li><a onClick={(e) => handleScroll(e, '#legal')} className="text-gray-400 hover:text-white transition-colors" href="#legal">Hizmet Şartları</a></li>
</ul>
</div>
</div>
</div>
<div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
<p className="text-sm text-gray-500">© 2024 Vergi ve Finansal Analiz AI. Tüm hakları saklıdır.</p>
<div className="flex gap-4">
<a aria-label="LinkedIn" className="text-gray-500 hover:text-white transition-colors" href="#">
<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
</svg>
</a>
<a aria-label="Twitter" className="text-gray-500 hover:text-white transition-colors" href="#">
<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.296 1.634 4.209 3.803 4.649-.6.166-1.246.223-1.903.223-.305 0-.6-.03-.89-.084.608 1.882 2.373 3.256 4.478 3.3-1.798 1.407-4.069 2.245-6.516 2.245-.423 0-.84-.025-1.25-.074 2.323 1.496 5.077 2.372 8.034 2.372 9.637 0 14.904-7.994 14.904-14.904 0-.227-.005-.454-.015-.68 1.023-.738 1.905-1.66 2.608-2.705z"></path>
</svg>
</a>
</div>
</div>
</div>
</footer>
</div>
    );
}