import React, { useState } from 'react';
import { 
  CheckCircle, Shield, Award, Users, MessageSquare, Flame, 
  Settings, LogOut, ExternalLink, RefreshCw, Smartphone, Key 
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileTabProps {
  currentUser: UserProfile;
  onChangeUserMode: (mode: 'verified' | 'unverified' | 'guest') => void;
  userMode: 'verified' | 'unverified' | 'guest';
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  onChangeUserMode,
  userMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'badges' | 'security'>('overview');

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] text-slate-100 overflow-y-auto no-scrollbar">
      {/* Profile Header Banner */}
      <div className="relative">
        <div className="h-28 bg-gradient-to-r from-red-900 via-slate-900 to-amber-900 w-full relative">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-slate-300 font-mono">
              Supabase Auth UID: {currentUser.id}
            </span>
          </div>
        </div>

        {/* Avatar + Main Details */}
        <div className="px-4 -mt-10 flex items-end justify-between">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-20 h-20 rounded-full border-4 border-[#0a0e17] object-cover shadow-xl"
            />
            {currentUser.isVerified && (
              <span className="absolute bottom-1 right-1 bg-cyan-500 text-black p-1 rounded-full shadow" title="Verified Fan">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex gap-1.5 mb-1">
            <button
              onClick={() => onChangeUserMode(userMode === 'verified' ? 'unverified' : 'verified')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                currentUser.isVerified
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              }`}
            >
              Mode: {currentUser.isVerified ? 'Verified' : 'Unverified'}
            </button>
          </div>
        </div>
      </div>

      {/* User Bio & Meta */}
      <div className="px-4 pt-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-black text-white">{currentUser.displayName}</h2>
          {currentUser.isVerified && (
            <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-bold">
              VERIFIED FAN
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 font-mono">@{currentUser.username} • {currentUser.email}</p>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          {currentUser.bio}
        </p>

        {/* Favorite Team Tag */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400">Allegiance:</span>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span>🏈</span> {currentUser.favoriteTeam}
          </span>
        </div>

        {/* Follower Stats Bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-center">
          <div>
            <div className="text-sm font-black text-white">{(currentUser.followersCount / 1000).toFixed(1)}k</div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">Followers</div>
          </div>
          <div>
            <div className="text-sm font-black text-amber-400 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 fill-amber-400" />
              {currentUser.fanRepScore.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">Fan Rep</div>
          </div>
          <div>
            <div className="text-sm font-black text-white">{currentUser.followingCount}</div>
            <div className="text-[10px] text-slate-400 uppercase font-medium">Following</div>
          </div>
        </div>

        {/* Switcher for testing Supabase Security Policies in Mobile simulator */}
        <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              Supabase Auth Simulation State:
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">auth.users()</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => onChangeUserMode('verified')}
              className={`py-1.5 px-2 rounded-lg text-center font-bold transition-all ${
                userMode === 'verified'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Verified Fan
            </button>
            <button
              onClick={() => onChangeUserMode('unverified')}
              className={`py-1.5 px-2 rounded-lg text-center font-bold transition-all ${
                userMode === 'unverified'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Unverified
            </button>
            <button
              onClick={() => onChangeUserMode('guest')}
              className={`py-1.5 px-2 rounded-lg text-center font-bold transition-all ${
                userMode === 'guest'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Guest (Anon)
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Controls RLS policies for creating rooms, uploading video reels, and posting broadcast chat messages in the native mobile simulator.
          </p>
        </div>

        {/* Security & Badges Section */}
        <div className="mt-3 space-y-2 pb-6">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Verified Fan Benefits in TedzTV Mobile:
            </h4>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
              <li>Direct live stream chat with priority broadcast highlights</li>
              <li>Ability to create and moderate community fan rooms</li>
              <li>Upload 1080p sports reels & stadium highlights to Supabase CDN</li>
              <li>Verified badge displayed across iOS & Android platforms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
