import React from 'react';
import { Target, GraduationCap, BookmarkCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'interview' | 'training' | 'saved';
  setActiveTab: (tab: 'interview' | 'training' | 'saved') => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Kariyer & Mülakat Koçu
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI Agent
              </span>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              Yeni mezun, staj ve mühendisler için akıllı mülakat & gelişim motoru
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Mülakatçı Soruları & Simülatör</span>
          </button>

          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'training'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Eğitim Analizi & Yol Haritası</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Pratik Geçmişi</span>
            {savedCount > 0 && (
              <span className="text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Quick Action */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 text-xs text-slate-400">
          <span>Teknoloji & Yazılım</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Gemini 3.8 Destekli</span>
        </div>
      </div>
    </header>
  );
};
