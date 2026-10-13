import React from 'react';
import { 
  Tv, Smartphone, Layers, Database, Globe, Code, ShieldCheck, 
  ExternalLink, Sparkles 
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeView: 'simulator' | 'architect' | 'supabase' | 'expo_config' | 'codebase';
  onSelectView: (view: 'simulator' | 'architect' | 'supabase' | 'expo_config' | 'codebase') => void;
  currentUser: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  currentUser,
}) => {
  return (
    <header className="bg-[#070b13]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Lead Architect Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 font-black text-lg">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                <span>TedzTV</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-bold">
                  Mobile Platform
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              Lead Architect Migration Plan & Live Expo Native Simulation
            </p>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onSelectView('simulator')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'simulator'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Native App Simulator</span>
          </button>

          <button
            onClick={() => onSelectView('architect')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'architect'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Migration Matrix</span>
          </button>

          <button
            onClick={() => onSelectView('supabase')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'supabase'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Retention</span>
          </button>

          <button
            onClick={() => onSelectView('expo_config')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'expo_config'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Expo / EAS Linkage</span>
          </button>

          <button
            onClick={() => onSelectView('codebase')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeView === 'codebase'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Expo Source Files</span>
          </button>
        </div>

        {/* User Status / Safeguard badge */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-semibold">{currentUser.displayName}</span>
            {currentUser.isVerified && (
              <span className="text-[10px] bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">
                VERIFIED
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
