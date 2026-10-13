import React, { useState } from 'react';
import { 
  Users, MessageSquare, Plus, Search, ShieldCheck, Flame, 
  Sparkles, Lock, ArrowRight, Filter 
} from 'lucide-react';
import { TeamRoom, UserProfile } from '../../types';

interface RoomsTabProps {
  rooms: TeamRoom[];
  currentUser: UserProfile;
  onSelectRoom: (room: TeamRoom) => void;
  onCreateRoomClick: () => void;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  currentUser,
  onSelectRoom,
  onCreateRoomClick,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'team' | 'community'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('All');

  const sports = ['All', 'NFL', 'NBA', 'Soccer / Football', 'MLB', 'Multi-Sport'];

  const filteredRooms = rooms.filter((room) => {
    const matchesTab = activeTab === 'all' || room.type === activeTab;
    const matchesSport = selectedSport === 'All' || room.sport.toLowerCase().includes(selectedSport.toLowerCase());
    const matchesSearch = 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSport && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] text-slate-100 overflow-y-auto no-scrollbar">
      {/* Rooms Top Header */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              <span>🏟️ Fan Rooms & Hubs</span>
            </h1>
            <p className="text-[11px] text-slate-400">Official Team Rooms & Community Lounges</p>
          </div>
          <button
            onClick={onCreateRoomClick}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 active:scale-95 transition-all text-xs font-bold text-white shadow-md shadow-red-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Room</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams, rivalries, topics..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Tab Filter: All / Team / Community */}
        <div className="flex items-center justify-between gap-1 text-xs mb-2">
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Rooms ({rooms.length})
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === 'team' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Official Teams
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === 'community' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Community
            </button>
          </div>
        </div>

        {/* Sports Chip Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all ${
                selectedSport === sport
                  ? 'bg-red-600/20 border border-red-500 text-red-300 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms List */}
      <div className="p-3 space-y-3 pb-8">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-slate-800/80 p-6">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-300">No rooms found</h3>
            <p className="text-xs text-slate-500 mt-1">Try another search keyword or switch sports.</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className="bg-slate-900/90 hover:bg-slate-850 rounded-xl border border-slate-800/90 overflow-hidden cursor-pointer transition-all hover:border-slate-700 active:scale-[0.99] group shadow-sm"
            >
              {/* Room Banner */}
              <div 
                className="h-20 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url(${room.bannerUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-black/30" />
                
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    room.type === 'team'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  }`}>
                    {room.type === 'team' ? 'Official Team Room' : 'Community Lounge'}
                  </span>
                  <span className="text-[10px] bg-black/60 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded-full border border-white/10">
                    {room.sport}
                  </span>
                </div>

                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-black/70 backdrop-blur-sm text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {room.activeOnline.toLocaleString()} live
                </div>
              </div>

              {/* Room Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1 bg-slate-950 rounded-lg border border-slate-800 flex-shrink-0">
                      {room.iconUrl}
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                        <span>{room.name}</span>
                        {room.isVerifiedHost && (
                          <span title="Verified Host">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                          </span>
                        )}
                      </h2>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-500" />
                          {(room.memberCount / 1000).toFixed(1)}k members
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {room.description}
                </p>

                {/* Hot Topic Pill */}
                {room.featuredTopic && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center gap-2 text-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-300 truncate">
                      <strong className="text-slate-400 font-semibold">Active: </strong>{room.featuredTopic}
                    </span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {room.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
