
import React from 'react';

interface HeaderProps {
  onReset: () => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700 p-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-green-900/50 border border-green-500/50 text-green-300 rounded-full px-3 py-1 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          AI AKTİF
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray="100, 100"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-bold text-green-300">
              100<span className="text-xs">%</span>
            </div>
          </div>
          <div className="text-xs">
            <p className="font-semibold">PDF DOĞRULUK</p>
            <p>Mizan: 100%</p>
            <p>Bilanço: 100%</p>
            <p>Gelir: 100%</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
            <p className="font-bold text-sm">CRAXA</p>
            <p className="text-xs text-gray-400">Her Hakkı Saklıdır</p>
        </div>
        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <UserIcon />
        </div>
        <button onClick={onReset} className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md transition-colors">
            Yeni Analiz
        </button>
      </div>
    </header>
  );
};
