import React, { useState } from 'react';

interface FileUploadScreenProps {
    onAnalyze: (file: File) => void;
    error: string | null;
}

const PDFIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm5 2a1 1 0 00-1 1v1a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H9zM6 9a1 1 0 000 2h8a1 1 0 100-2H6zm0 3a1 1 0 100 2h5a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

export const FileUploadScreen: React.FC<FileUploadScreenProps> = ({ onAnalyze, error }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-4xl font-bold text-white mb-2">AI Financial Analyst</h1>
                <p className="text-lg text-gray-400 mb-8">Kurumlar Vergisi Beyannamesi PDF'lerini analiz edin.</p>
                
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <label htmlFor="pdf-upload" className="cursor-pointer flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-600 rounded-lg hover:bg-slate-700 transition-colors">
                            <PDFIcon />
                            <span className="mt-2 text-sm font-medium text-gray-300">
                                {fileName ? fileName : "PDF SEÇ"}
                            </span>
                            <input id="pdf-upload" name="pdf-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                        </label>

                        <div className="text-green-400 font-semibold text-lg p-3 bg-slate-700/50 rounded-lg">
                           2024 YILI KURUMLAR...
                        </div>

                        <button
                            onClick={() => selectedFile && onAnalyze(selectedFile)}
                            disabled={!selectedFile}
                            className="w-full md:w-auto flex-1 bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-700 transition-all disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            ✓ ANALİZ
                        </button>
                    </div>

                    {error && <p className="mt-4 text-red-500">{error}</p>}

                    <div className="mt-8 text-gray-500 text-sm">
                        <p>Hızlı Analizler</p>
                        <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-4">
                            {['Likidite Oranları', 'Finansal Yapı', 'Dikey Analiz', 'Yatay Analiz', 'Vergisel Analiz', 'Devir Hızları'].map(item => (
                                <div key={item} className="p-3 bg-slate-700/50 rounded-lg text-center">
                                    <p className="font-semibold text-gray-300 text-xs">{item}</p>
                                    <p className="text-gray-400 text-[10px] leading-tight mt-1">{item} analizi</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};