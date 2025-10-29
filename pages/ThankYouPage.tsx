import React from 'react';
import { Route } from '../App';

interface ThankYouPageProps {
    onNavigate: (route: Route) => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ onNavigate }) => {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 bg-[#101922] text-gray-200">
            <header className="absolute top-0 left-0 flex w-full items-center justify-between p-6 sm:p-8">
                <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => onNavigate('landing')}>
                    <div className="size-6 text-[#1173d4]">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_6_543)"><path d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"></path></g>
                        </svg>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight">Finansal Analiz AI</h2>
                </div>
            </header>
            <main className="flex w-full max-w-2xl flex-col items-center justify-center text-center">
                <div className="flex flex-col items-center justify-center rounded-xl bg-white/5 dark:border dark:border-white/10 p-8 sm:p-12 shadow-2xl shadow-[#1173d4]/5">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1173d4]/20 text-[#1173d4]">
                        <span className="material-symbols-outlined !text-5xl">task_alt</span>
                    </div>
                    <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight">İlginiz İçin Teşekkür Ederiz!</h1>
                    <p className="mt-4 max-w-md text-base text-gray-300">Demo talebiniz başarıyla gönderildi. Ekibimiz bilgilerinizi inceleyecek ve size uygun bir zaman planlamak için en kısa sürede sizinle iletişime geçecektir.</p>
                    <div className="mt-8">
                        <button onClick={() => onNavigate('landing')} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-[#1173d4] text-white text-base font-bold transition-transform hover:scale-105">
                            <span className="truncate">Ana Sayfaya Dön</span>
                        </button>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Acil sorularınız varsa, lütfen bizimle <a className="text-[#1173d4] hover:underline" href="mailto:support@finanalysis.ai">support@finanalysis.ai</a> adresinden iletişime geçin.</p>
                </div>
            </main>
        </div>
    );
};