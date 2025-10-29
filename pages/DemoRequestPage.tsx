import React from 'react';
import { Route } from '../App';

interface DemoRequestPageProps {
  onNavigate: (route: Route) => void;
}

export const DemoRequestPage: React.FC<DemoRequestPageProps> = ({ onNavigate }) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle form submission to a backend
        // For this demo, we'll navigate to the thank you page
        onNavigate('thank-you');
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#101922] group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 flex flex-1 justify-center py-5 sm:px-10 md:px-20 lg:px-40">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-4 sm:px-10 py-3">
                            <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => onNavigate('landing')}>
                                <div className="size-4 text-[#1173d4]">
                                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_6_543)"><path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path></g>
                                    </svg>
                                </div>
                                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Finansal Analiz AI</h2>
                            </div>
                        </header>
                        <main className="flex flex-col flex-1 items-center justify-center p-4 sm:p-6 md:p-8 w-full">
                            <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
                                <div className="flex flex-col gap-3 text-center">
                                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Demo Talep Edin</h1>
                                    <p className="text-[#9dabb9] text-base font-normal leading-normal">Yapay zeka destekli vergi ve finansal analiz aracımızın gücünü keşfedin.</p>
                                </div>
                                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-white text-sm font-medium leading-normal" htmlFor="ad">Ad</label>
                                            <input className="h-12 w-full rounded-lg border border-solid border-[#283039] bg-[#1a2530] px-4 text-white text-base font-normal leading-normal placeholder:text-[#677587] focus:border-[#1173d4] focus:ring-[#1173d4]" id="ad" placeholder="Adınız" type="text" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-white text-sm font-medium leading-normal" htmlFor="soyad">Soyad</label>
                                            <input className="h-12 w-full rounded-lg border border-solid border-[#283039] bg-[#1a2530] px-4 text-white text-base font-normal leading-normal placeholder:text-[#677587] focus:border-[#1173d4] focus:ring-[#1173d4]" id="soyad" placeholder="Soyadınız" type="text" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-medium leading-normal" htmlFor="email">E-posta</label>
                                        <input className="h-12 w-full rounded-lg border border-solid border-[#283039] bg-[#1a2530] px-4 text-white text-base font-normal leading-normal placeholder:text-[#677587] focus:border-[#1173d4] focus:ring-[#1173d4]" id="email" placeholder="is@ornek.com" type="email" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-white text-sm font-medium leading-normal" htmlFor="firma-adi">Firma Adı</label>
                                        <input className="h-12 w-full rounded-lg border border-solid border-[#283039] bg-[#1a2530] px-4 text-white text-base font-normal leading-normal placeholder:text-[#677587] focus:border-[#1173d4] focus:ring-[#1173d4]" id="firma-adi" placeholder="Firma Adı" type="text" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-white text-sm font-medium leading-normal" htmlFor="unvan">Unvan</label>
                                            <select className="h-12 w-full rounded-lg border border-solid border-[#283039] bg-[#1a2530] px-4 text-white text-base font-normal leading-normal focus:border-[#1173d4] focus:ring-[#1173d4]" id="unvan">
                                                <option className="text-placeholder-text">Unvan Seçin</option>
                                                <option>Mali Müşavir</option>
                                                <option>Finans Direktörü (CFO)</option>
                                                <option>Analist</option>
                                                <option>Yönetici</option>
                                                <option>Diğer</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-white text-sm font-medium leading-normal" htmlFor="calisan-sayisi">Çalışan Sayısı</label>
                                            <select className="h-12 w-full rounded-lg border border-solid border-[#283039] bg-[#1a2530] px-4 text-white text-base font-normal leading-normal focus:border-[#1173d4] focus:ring-[#1173d4]" id="calisan-sayisi">
                                                <option className="text-placeholder-text">Çalışan Sayısı Seçin</option>
                                                <option>1-10</option>
                                                <option>11-50</option>
                                                <option>51-200</option>
                                                <option>201-500</option>
                                                <option>500+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3 pt-3">
                                        <button className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1173d4] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#1173d4]/90 transition-colors" type="submit">
                                            <span className="truncate">Demo Talebini Gönder</span>
                                        </button>
                                        <p className="text-[#9dabb9] text-sm font-normal leading-normal">Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                                    </div>
                                </form>
                            </div>
                        </main>
                        <footer className="flex flex-col gap-6 px-5 py-10 text-center mt-auto">
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <button onClick={() => onNavigate('landing')} className="text-[#9dabb9] text-base font-normal leading-normal min-w-40 hover:text-white transition-colors">Ana Sayfa</button>
                                <a className="text-[#9dabb9] text-base font-normal leading-normal min-w-40 hover:text-white transition-colors" href="#">Gizlilik Politikası</a>
                            </div>
                            <p className="text-[#9dabb9] text-base font-normal leading-normal">© 2024 Finansal Analiz AI. Tüm hakları saklıdır.</p>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};
