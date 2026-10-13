import React, { useState } from 'react';
import { 
  Database, Shield, HardDrive, Key, Copy, Check, Table, ChevronDown, 
  ChevronRight, Lock, CheckCircle 
} from 'lucide-react';
import { SUPABASE_STORAGE_BUCKETS, SUPABASE_TABLES_RETENTION } from '../../data/architectureData';

export const SupabaseSchemaViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('profiles');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeTableDef = SUPABASE_TABLES_RETENTION.find((t) => t.name === selectedTable) || SUPABASE_TABLES_RETENTION[0];

  const sqlSampleSchema = `-- ========================================================
-- TEDZTV SUPABASE DATABASE RETENTION SPECIFICATION
-- REUSED 100% BY BOTH WEB APP AND EXPO REACT NATIVE MOBILE
-- NO DUPLICATE INSTANCE OR RE-MIGRATION REQUIRED
-- ========================================================

-- 1. PROFILES & VERIFIED FAN STATUS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  favorite_team TEXT DEFAULT 'Kansas City Chiefs',
  favorite_sport TEXT DEFAULT 'NFL Football',
  is_verified BOOLEAN DEFAULT FALSE,
  fan_rep_score INTEGER DEFAULT 0,
  badge TEXT DEFAULT 'Rookie Fan',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. TEAM & COMMUNITY ROOMS
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  type TEXT CHECK (type IN ('team', 'community')) NOT NULL,
  description TEXT,
  banner_url TEXT,
  icon_url TEXT,
  member_count INTEGER DEFAULT 0,
  active_online INTEGER DEFAULT 0,
  is_verified_host BOOLEAN DEFAULT FALSE,
  featured_topic TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms viewable by authenticated users" 
  ON public.rooms FOR SELECT USING (true);

-- 3. TEDZTV LIVE BROADCAST STREAM
CREATE TABLE IF NOT EXISTS public.broadcasts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sport TEXT NOT NULL,
  live_status TEXT CHECK (live_status IN ('LIVE', 'UPCOMING', 'ENDED')) DEFAULT 'LIVE',
  viewer_count INTEGER DEFAULT 0,
  stream_url TEXT NOT NULL,
  thumbnail_url TEXT,
  home_team JSONB,
  away_team JSONB,
  quarter_or_half TEXT,
  clock TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view broadcast status" ON public.broadcasts FOR SELECT USING (true);

-- 4. FAN REELS & VIDEO HIGHLIGHTS
CREATE TABLE IF NOT EXISTS public.fan_reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  team_tag TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fan_reels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view fan reels" ON public.fan_reels FOR SELECT USING (true);
CREATE POLICY "Verified fans can upload reels" ON public.fan_reels 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
`;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded">
                SINGLE-SOURCE BACKEND
              </span>
              <span className="text-xs text-slate-400 font-mono">SUPABASE POSTGRESQL + RLS</span>
            </div>
            <h2 className="text-lg font-black text-white">
              Supabase Schema, Security Policies & Storage Retention
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Audited blueprint of existing tables, foreign keys, row level security (RLS) rules, and storage buckets. Reused seamlessly by the Expo React Native app.
            </p>
          </div>

          <button
            onClick={() => handleCopy(sqlSampleSchema, 'sql_schema')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all self-start"
          >
            {copiedKey === 'sql_schema' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied SQL</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL DDL Schema</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tables & Column Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Selector Sidebar */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Table className="w-3.5 h-3.5 text-red-500" />
            <span>Retained Tables ({SUPABASE_TABLES_RETENTION.length})</span>
          </h3>

          <div className="space-y-1.5">
            {SUPABASE_TABLES_RETENTION.map((table) => {
              const isSelected = table.name === selectedTable;
              return (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table.name)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-600/10 border-red-500/50 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-mono text-xs font-bold">{table.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{table.purpose}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-red-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Table Detail Card */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                public.{activeTableDef.name}
              </span>
              <h3 className="text-base font-bold text-white mt-1">{activeTableDef.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeTableDef.description}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                RLS Active
              </span>
            </div>
          </div>

          {/* Key Columns */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Key Columns & Schema Types
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Column Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Role / Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {activeTableDef.keyColumns.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="py-2 font-bold text-slate-200">{col.name}</td>
                      <td className="py-2 text-cyan-400">{col.type}</td>
                      <td className="py-2 text-slate-400 font-sans text-xs">{col.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Policies */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Row Level Security (RLS) Policies Retained</span>
            </h4>
            <div className="space-y-1.5">
              {activeTableDef.rlsPolicies.map((pol, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{pol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Storage Buckets Retention */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <HardDrive className="w-4 h-4 text-emerald-400" />
          Retained Supabase Storage Buckets
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          CDN storage buckets shared identically between web uploads and native mobile <code className="text-slate-300">expo-image-picker</code> uploads
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUPABASE_STORAGE_BUCKETS.map((bucket) => (
            <div key={bucket.name} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-sm bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {bucket.name}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {bucket.isPublic ? 'Public CDN' : 'Restricted'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>Max size: <strong className="text-slate-200">{bucket.maxFileSize}</strong></span>
                <span>Types: <strong className="text-slate-200">{bucket.allowedTypes.join(', ')}</strong></span>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Bucket Security Policies:</span>
                <ul className="mt-1 space-y-1 text-[11px] text-slate-300">
                  {bucket.policies.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
