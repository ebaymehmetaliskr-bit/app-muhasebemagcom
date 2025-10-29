
import React from 'react';

interface ProgressLoaderProps {
    progress: number;
    message: string;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({ progress, message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold mb-4">{message}</p>
            <div className="w-full max-w-md bg-slate-700 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{progress}% tamamlandı</p>
        </div>
    );
};
