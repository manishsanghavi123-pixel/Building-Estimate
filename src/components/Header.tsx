import React from 'react';
import { Language } from '../types/estimation';
import { UI_TEXT } from '../data/translations';
import { Printer, Bookmark, Settings2, Globe } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenRates: () => void;
  onOpenSaved: () => void;
  onPrint: () => void;
  totalCost: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeTab,
  onTabChange,
  onOpenRates,
  onOpenSaved,
  onPrint,
  totalCost,
}) => {
  const isGu = language === 'gu';

  const navItems = [
    { id: 'overview', label: isGu ? 'અંદાજ & સમરી' : 'Overview' },
    { id: 'detailed', label: isGu ? 'A-Z ખર્ચ (BOQ)' : 'A-Z BOQ' },
    { id: 'materials', label: isGu ? 'જથ્થા ગણક' : 'Materials' },
    { id: 'milestones', label: isGu ? 'ચૂકવણી તબક્કા' : 'Milestones' },
    { id: 'compare', label: isGu ? 'સરખામણી' : 'Compare' },
    { id: 'quotation', label: isGu ? 'કોટેશન' : 'Quotation' },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('overview')}
              className="text-left focus:outline-none group flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-900 text-amber-400 font-bold flex items-center justify-center text-lg tracking-wider shadow-sm group-hover:bg-neutral-800 transition-colors">
                NC
              </div>
              <div className="leading-tight">
                <span className="text-lg font-extrabold tracking-tight text-neutral-900 block">
                  {UI_TEXT.appTitle[language]}
                </span>
                <span className="text-[11px] font-medium text-neutral-500 block">
                  {UI_TEXT.appSubtitle[language]}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single line, text with subtle hover) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language toggle, Market rates, Saved, Print) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Live Estimate total badge */}
            <div className="hidden lg:flex flex-col items-end mr-2 text-right">
              <span className="text-[10px] text-neutral-500 uppercase font-semibold tracking-wider">
                {isGu ? 'કુલ અંદાજ' : 'Est. Total'}
              </span>
              <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                ₹{totalCost.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Market Rates button */}
            <button
              onClick={onOpenRates}
              title={isGu ? 'બજાર ભાવ બદલો' : 'Market Rates'}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Saved Estimates */}
            <button
              onClick={onOpenSaved}
              title={isGu ? 'સેવ કરેલા અંદાજ' : 'Saved Estimates'}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(isGu ? 'en' : 'gu')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
              title={isGu ? 'Switch to English' : 'ગુજરાતીમાં જુઓ'}
            >
              <Globe className="w-3.5 h-3.5 text-neutral-500" />
              <span>{isGu ? 'English' : 'ગુજરાતી'}</span>
            </button>

            {/* Primary Action Button: Print / Export */}
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isGu ? 'પ્રિન્ટ / PDF' : 'Print / PDF'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation row */}
        <div className="flex md:hidden items-center gap-1 overflow-x-auto py-2 border-t border-neutral-100 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-colors ${
                activeTab === item.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 bg-neutral-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
