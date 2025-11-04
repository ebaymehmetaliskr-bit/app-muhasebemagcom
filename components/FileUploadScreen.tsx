import React, { useState } from 'react';

interface FileUploadScreenProps {
    onAnalyze: (file: File, fileType: 'pdf' | 'excel') => void;
    onUseMockData: () => void;
    error: string | null;
}

const PDFIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm5 2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H9zM6 9a1 1 0 000 2h8a1 1 0 100-2H6zm0 3a1 1 0 100 2h5a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const ExcelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1-1H3a1 1 0 01-1-1V3zm2 2v2h12V5H4zm0 4v2h12V9H4zm0 4v2h12v-2H4z"/>
    </svg>
);


export const FileUploadScreen: React.FC<FileUploadScreenProps> = ({ onAnalyze, onUseMockData, error }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'pdf' | 'excel'>('pdf');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setFileName(file.name);
        } else {
            setSelectedFile(null);
            setFileName(null);
        }
    };
    
    const resetFile = () => {
        setSelectedFile(null);
        setFileName(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-3xl text-center">
                <h1 className="text-4xl font-bold text-white mb-2">Finansal Analiz AI</h1>
                <p className="text-lg text-gray-400 mb-8">Kurumlar Vergisi Beyannamesi veya Mizan dosyalarınızı analiz edin.</p>
                
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
                    <div className="flex justify-center mb-6 border-b border-slate-700">
                        <button 
                            onClick={() => { setFileType('pdf'); resetFile(); }}
                            className={`px-6 py-3 text-lg font-semibold border-b-4 transition-colors ${fileType === 'pdf' ? 'text-blue-400 border-blue-400' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            PDF Beyanname
                        </button>
                        <button 
                            onClick={() => { setFileType('excel'); resetFile(); }}
                            className={`px-6 py-3 text-lg font-semibold border-b-4 transition-colors ${fileType === 'excel' ? 'text-green-400 border-green-400' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
                        >
                            Excel Mizan
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <label htmlFor="file-upload" className="cursor-pointer flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
                            {fileType === 'pdf' ? <PDFIcon /> : <ExcelIcon />}
                            <span className="mt-2 text-sm font-medium text-gray-300">
                                {fileName ? fileName : `BİR ${fileType.toUpperCase()} DOSYASI SEÇİN`}
                            </span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept={fileType === 'pdf' ? '.pdf' : '.xlsx, .xls, .csv'} onChange={handleFileChange} />
                        </label>

                        <button
                            onClick={() => selectedFile && onAnalyze(selectedFile, fileType)}
                            disabled={!selectedFile}
                            className="w-full md:w-auto flex-1 bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            ✓ ANALİZ ET
                        </button>
                    </div>

                    {error && <p className="mt-6 text-red-500">{error}</p>}
                    
                    <div className="mt-6 border-t border-slate-700 pt-4">
                        <button
                            onClick={onUseMockData}
                            className="w-full text-sm text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/50 py-2 px-4 rounded-lg transition-colors"
                        >
                            Geliştirme için Test Verisi Yükle
                        </button>
                    </div>

                    <div className="mt-8 text-left text-xs text-gray-500 p-4 bg-slate-900/50 rounded-lg">
                        {fileType === 'excel' ? (
                            <>
                                <h4 className="font-bold text-gray-400 mb-2">Excel Mizan Formatı:</h4>
                                <p>Lütfen Excel dosyanızın ilk sayfasının aşağıdaki sütunları içerdiğinden emin olun (başlıklar dahil):</p>
                                <ul className="list-disc list-inside mt-2 text-gray-400">
                                    <li><span className="font-mono bg-slate-700 px-1 rounded">Hesap Numarası</span></li>
                                    <li><span className="font-mono bg-slate-700 px-1 rounded">Hesap Adı</span></li>
                                    <li><span className="font-mono bg-slate-700 px-1 rounded">Kümüle Bakiye</span> (tek dönem analiz için)</li>
                                </ul>
                                <p className="mt-2">VEYA karşılaştırmalı analiz (Yatay Analiz) için:</p>
                                 <ul className="list-disc list-inside mt-2 text-gray-400">
                                    <li><span className="font-mono bg-slate-700 px-1 rounded">Hesap Numarası</span>, <span className="font-mono bg-slate-700 px-1 rounded">Hesap Adı</span></li>
                                    <li><span className="font-mono bg-slate-700 px-1 rounded">Önceki Dönem Bakiye</span></li>
                                    <li><span className="font-mono bg-slate-700 px-1 rounded">Cari Dönem Bakiye</span></li>
                                </ul>
                            </>
                        ) : (
                             <>
                                <h4 className="font-bold text-gray-400 mb-2">PDF Beyanname Formatı:</h4>
                                <p>Lütfen Gelir İdaresi Başkanlığı (GİB) sisteminden indirilmiş standart Kurumlar Vergisi Beyannamesi PDF'ini yüklediğinizden emin olun. Metin tabanlı PDF'ler en iyi sonuçları verir.</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};