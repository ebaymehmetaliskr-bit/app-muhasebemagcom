
import React from 'react';

interface LoaderProps {
    message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold">{message}</p>
            <p className="text-sm text-gray-400 mt-2">Bu işlem birkaç saniye sürebilir...</p>
        </div>
    );
};
