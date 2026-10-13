import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Layers, Database, Smartphone, 
  GitBranch, Check, Copy, ExternalLink, Terminal, Cpu, FileCode2 
} from 'lucide-react';
import { 
  FEATURE_REUSE_ANALYSIS, REPOSITORY_AUDIT, REQUIRED_ENV_VARS, 
  EXPO_ORG_LINKAGE_PLAN 
} from '../../data/architectureData';

export const MigrationDashboard: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredFeatures = FEATURE_REUSE_ANALYSIS.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'reused') return item.verdict.includes('Reused');
    if (filter === 'native') return item.verdict.includes('Required') || item.verdict.includes('Native');
    return true;
  });

  return (
    <div className="space-y-6 text-slate-100">
      {/* Lead Architect Executive Summary Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
                Lead Mobile Architect Report
              </span>
              <span className="text-xs text-slate-400 font-mono">v1.0.0-PROPOSAL</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              TedzTV Mobile Native Migration Plan (Expo + React Native)
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Complete architectural roadmap migrating the Lovable web community into high-performance native iOS & Android applications using Expo Router while preserving 100% of the live website, production branch, and existing Supabase database.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Web Repo Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Protected & Pristine
              </div>
            </div>
          </div>
        </div>

        {/* Safeguard Assurance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Production Branch Preservation</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Web production branch remains untouched. Native code is quarantined in a dedicated <code className="text-slate-300">mobile-app</code> branch / repository.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1">
              <Database className="w-4 h-4 flex-shrink-0" />
              <span>Single Supabase Backend Reused</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Zero duplicate Supabase projects. Both web and native share the existing database, auth users, RLS security policies, and storage buckets.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <Smartphone className="w-4 h-4 flex-shrink-0" />
              <span>Existing Expo Organization Link</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Directly linked to your existing Tedz TV Expo organization (<code className="text-slate-300">@tedztv</code>) via EAS Project ID. No duplicate orgs created.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Reuse vs React Native Implementation Matrix */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              Feature Reuse & Migration Decision Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Detailed audit of web codebase features, indicating direct reuse vs native re-implementation
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Features ({FEATURE_REUSE_ANALYSIS.length})
            </button>
            <button
              onClick={() => setFilter('reused')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'reused' ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Directly Reused
            </button>
            <button
              onClick={() => setFilter('native')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === 'native' ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              React Native Required
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredFeatures.map((item, index) => {
            const isReused = item.verdict.includes('Reused');
            return (
              <div 
                key={index}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.feature}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.action}
                  </p>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center gap-1 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    isReused
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {item.verdict}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {item.complexity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Translation Architectural Guide (DOM -> React Native) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Technical Component Translation Guide
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          How web constructs from the Lovable codebase map directly into native Expo React Native primitives
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-red-400 font-bold mb-2 flex items-center justify-between">
              <span>Web (Lovable / DOM)</span>
              <span className="text-[10px] font-mono bg-red-950/50 text-red-300 px-2 py-0.5 rounded">Existing</span>
            </div>
            <ul className="space-y-2 text-slate-300 font-mono text-[11px]">
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span>&lt;div&gt;, &lt;section&gt;, &lt;main&gt;</span>
                <span className="text-slate-500">Block containers</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span>&lt;p&gt;, &lt;span&gt;, &lt;h1&gt;</span>
                <span className="text-slate-500">Text typography</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span>&lt;video controls&gt; / HLS.js</span>
                <span className="text-slate-500">HTML5 player</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span>&lt;input type="file"&gt;</span>
                <span className="text-slate-500">DOM file input</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span>window.localStorage</span>
                <span className="text-slate-500">Unencrypted storage</span>
              </li>
              <li className="flex justify-between">
                <span>react-router-dom</span>
                <span className="text-slate-500">Browser history</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-emerald-400 font-bold mb-2 flex items-center justify-between">
              <span>Native (Expo React Native)</span>
              <span className="text-[10px] font-mono bg-emerald-950/50 text-emerald-300 px-2 py-0.5 rounded">Target Mobile</span>
            </div>
            <ul className="space-y-2 text-slate-300 font-mono text-[11px]">
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-cyan-400">&lt;View&gt;, &lt;SafeAreaView&gt;</span>
                <span className="text-slate-500">Flexbox layout</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-cyan-400">&lt;Text&gt;</span>
                <span className="text-slate-500">Native text renderer</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-cyan-400">expo-video / expo-av</span>
                <span className="text-slate-500">AVPlayer & ExoPlayer</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-cyan-400">expo-image-picker</span>
                <span className="text-slate-500">Native camera & gallery</span>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-cyan-400">expo-secure-store</span>
                <span className="text-slate-500">Keychain & Keystore</span>
              </li>
              <li className="flex justify-between">
                <span className="text-cyan-400">expo-router v4</span>
                <span className="text-slate-500">Native stack / tabs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Environment Variables & Secrets Matrix */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-amber-400" />
          Required Environment Variables Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-3">
          Public client variables for Expo mobile builds. No service role or database master secrets are exposed.
        </p>

        <div className="space-y-2">
          {REQUIRED_ENV_VARS.map((env, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{env.variable}</span>
                  <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                    {env.exposure}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5">{env.purpose}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">{env.notes}</span>
                <button
                  onClick={() => handleCopy(`${env.variable}=`, env.variable)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Copy var name"
                >
                  {copiedKey === env.variable ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
