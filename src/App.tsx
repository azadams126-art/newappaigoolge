import React, { useState } from 'react';
import { 
  Header 
} from './components/Header';
import { MobileSimulator } from './components/mobile/MobileSimulator';
import { MigrationDashboard } from './components/architect/MigrationDashboard';
import { SupabaseSchemaViewer } from './components/architect/SupabaseSchemaViewer';
import { ExpoConfigViewer } from './components/architect/ExpoConfigViewer';
import { CodebaseTreeViewer } from './components/architect/CodebaseTreeViewer';
import { CURRENT_USER, LIVE_BROADCAST, TEAM_ROOMS, FAN_REELS, INITIAL_CHAT_MESSAGES } from './data/mockData';
import { FanReel, UserProfile } from './types';
import { 
  X, Copy, Check, Share2, Sparkles, ShieldCheck, Smartphone, 
  Layers, Database, Globe, Code 
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'simulator' | 'architect' | 'supabase' | 'expo_config' | 'codebase'>('simulator');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [userMode, setUserMode] = useState<'verified' | 'unverified' | 'guest'>('verified');
  const [reels, setReels] = useState<FanReel[]>(FAN_REELS);
  
  // Share modal state
  const [shareData, setShareData] = useState<{ title: string; link: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleUserModeChange = (mode: 'verified' | 'unverified' | 'guest') => {
    setUserMode(mode);
    if (mode === 'verified') {
      setCurrentUser({
        ...CURRENT_USER,
        isVerified: true,
        badge: 'Founding Fan & Verified Host',
        fanRepScore: 8450,
      });
    } else if (mode === 'unverified') {
      setCurrentUser({
        ...CURRENT_USER,
        isVerified: false,
        badge: 'Rookie Fan (Pending Email Verification)',
        fanRepScore: 120,
      });
    } else {
      setCurrentUser({
        ...CURRENT_USER,
        id: 'anon_guest',
        displayName: 'Guest Spectator',
        username: 'guest_fan',
        email: 'unregistered@tedztv.com',
        isVerified: false,
        badge: 'Guest Spectator',
        fanRepScore: 0,
      });
    }
  };

  const handleOpenShare = (title: string, link: string) => {
    setShareData({ title, link });
    setIsCopied(false);
  };

  const handleCopyShareLink = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUploadReel = (newReel: FanReel) => {
    setReels((prev) => [newReel, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {/* Banner Quick Switcher between Simulator and Architect View */}
        <div className="mb-6 bg-gradient-to-r from-red-950/30 via-slate-900 to-amber-950/20 border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                TedzTV Mobile Native Architecture Status: <span className="text-emerald-400">Ready for Review</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Preserves web production repo • Single Supabase backend • React Native Expo Router v4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('simulator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'simulator'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Preview Native Mobile</span>
            </button>
            <button
              onClick={() => setActiveView('architect')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'architect'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Migration Audit & Specs</span>
            </button>
          </div>
        </div>

        {/* View Switcher Routing */}
        {activeView === 'simulator' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-2">
              <h2 className="text-lg font-black text-white">
                Interactive TedzTV Expo App Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Interact with the native live broadcast player, team rooms, real-time fan comments, floating hype taps, and verified-user reel uploads below.
              </p>
            </div>

            <MobileSimulator
              stream={LIVE_BROADCAST}
              currentUser={currentUser}
              initialMessages={INITIAL_CHAT_MESSAGES}
              rooms={TEAM_ROOMS}
              reels={reels}
              onOpenShareModal={handleOpenShare}
              onUploadReel={handleUploadReel}
              userMode={userMode}
              onChangeUserMode={handleUserModeChange}
            />
          </div>
        )}

        {activeView === 'architect' && <MigrationDashboard />}
        {activeView === 'supabase' && <SupabaseSchemaViewer />}
        {activeView === 'expo_config' && <ExpoConfigViewer />}
        {activeView === 'codebase' && <CodebaseTreeViewer />}
      </main>

      {/* Share / Universal Deep Link Modal */}
      {shareData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">Share TedzTV Content</h3>
              </div>
              <button
                onClick={() => setShareData(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-300 mb-1">{shareData.title}</p>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Expo Native Deep Link (Scheme: <code className="text-slate-300">tedztv://</code>)
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="flex-1 text-cyan-400 truncate">{shareData.link}</span>
                <button
                  onClick={handleCopyShareLink}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1 font-sans text-xs"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
              <span className="text-slate-200 font-bold">Universal Link Routing:</span> When opened on a mobile device with the TedzTV Expo app installed, iOS Universal Links and Android App Links route directly into Expo Router’s matching screen.
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TedzTV Lead Mobile Architect Suite • React Native & Expo Router v4</span>
          <span className="text-[11px] text-slate-400">Single Supabase Project Architecture • No Duplication</span>
        </div>
      </footer>
    </div>
  );
}
