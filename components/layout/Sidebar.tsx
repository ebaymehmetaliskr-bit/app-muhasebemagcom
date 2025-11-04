

import React from 'react';
import { Page } from '../../types';
import { 
    DashboardIcon, MizanIcon, BilancoIcon, GelirGiderIcon, RasyoIcon, 
    DikeyAnalizIcon, YatayAnalizIcon, VergiselAnalizIcon, DevirHizlariIcon, 
    KurganAnaliziIcon, NakitAkimIcon, KKEGIcon, CalculatorIcon 
} from '../ui/Icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const sidebarItems: { name: Page; icon: React.FC<any> }[] = [
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Mizan', icon: MizanIcon },
  { name: 'Bilanço', icon: BilancoIcon },
  { name: 'Gelir ve Gider', icon: GelirGiderIcon },
  { name: 'Nakit Akım', icon: NakitAkimIcon },
  { name: 'Kurumlar Vergisi', icon: CalculatorIcon },
  { name: 'Finansal Yapı Oranları', icon: RasyoIcon },
  { name: 'Likidite Oranları', icon: RasyoIcon },
  { name: 'Devir Hızları', icon: DevirHizlariIcon },
  { name: 'Kârlılık Oranları', icon: RasyoIcon },
  { name: 'Dikey Analiz', icon: DikeyAnalizIcon },
  { name: 'Yatay Analiz', icon: YatayAnalizIcon },
  { name: 'Vergisel Analiz', icon: VergiselAnalizIcon },
  { name: 'KKEG Analizi', icon: KKEGIcon },
  { name: 'Kurgan Analizi', icon: KurganAnaliziIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 bg-slate-800 p-4 flex flex-col border-r border-slate-700">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold text-white">BUDGET</h1>
        <p className="text-sm text-cyan-400">SMARTLODGE ALL IN ONE</p>
      </div>
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => setCurrentPage(item.name)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors text-left text-sm
                  ${currentPage === item.name
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
