import React, { useState } from 'react';
import { 
  Tv, MessageSquare, Video, User, Smartphone, Wifi, 
  Battery, Sparkles, ChevronRight, Share2, Info 
} from 'lucide-react';
import { BroadcastStream, ChatMessage, FanReel, TeamRoom, UserProfile } from '../../types';
import { LiveBroadcastTab } from './LiveBroadcastTab';
import { RoomsTab } from './RoomsTab';
import { ReelsTab } from './ReelsTab';
import { ProfileTab } from './ProfileTab';
import { RoomDetailModal } from './RoomDetailModal';
import { UploadModal } from './UploadModal';

interface MobileSimulatorProps {
  stream: BroadcastStream;
  currentUser: UserProfile;
  initialMessages: ChatMessage[];
  rooms: TeamRoom[];
  reels: FanReel[];
  onOpenShareModal: (title: string, link: string) => void;
  onUploadReel: (reel: FanReel) => void;
  userMode: 'verified' | 'unverified' | 'guest';
  onChangeUserMode: (mode: 'verified' | 'unverified' | 'guest') => void;
}

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  stream,
  currentUser,
  initialMessages,
  rooms,
  reels,
  onOpenShareModal,
  onUploadReel,
  userMode,
  onChangeUserMode,
}) => {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'rooms' | 'reels' | 'profile'>('broadcast');
  const [selectedRoom, setSelectedRoom] = useState<TeamRoom | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android'>('ios');

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Device Toolbar Controls */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setDeviceType('ios')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              deviceType === 'ios' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            iPhone 16 Pro
          </button>
          <button
            onClick={() => setDeviceType('android')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              deviceType === 'android' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pixel 9 Pro
          </button>
        </div>

        <div className="flex items-center gap-1 text-[11px] bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-slate-300">Expo Go Simulator</span>
        </div>
      </div>

      {/* Phone Hardware Mockup Frame */}
      <div className={`relative w-[370px] sm:w-[395px] h-[780px] bg-black rounded-[50px] p-3 shadow-2xl ring-1 ring-white/10 border-4 ${
        deviceType === 'ios' ? 'border-slate-800' : 'border-slate-700'
      } shadow-cyan-950/20 flex flex-col overflow-hidden`}>
        
        {/* Dynamic Island / Camera Notch */}
        {deviceType === 'ios' ? (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5 border border-white/5 shadow-md">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-bold text-white tracking-wider">LIVE</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full z-40 border border-slate-800" />
        )}

        {/* Screen Status Bar */}
        <div className="w-full h-8 pt-1.5 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-200 z-30 select-none bg-black">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <span className="text-[10px] font-bold">5G</span>
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Inner Phone Viewport Area */}
        <div className="relative flex-1 rounded-[38px] overflow-hidden bg-[#090d16] flex flex-col border border-white/5">
          {/* Active Tab Screen */}
          <div className="flex-1 overflow-hidden relative">
            {activeTab === 'broadcast' && (
              <LiveBroadcastTab
                stream={stream}
                currentUser={currentUser}
                initialMessages={initialMessages}
                onOpenShareModal={onOpenShareModal}
              />
            )}

            {activeTab === 'rooms' && (
              <RoomsTab
                rooms={rooms}
                currentUser={currentUser}
                onSelectRoom={(r) => setSelectedRoom(r)}
                onCreateRoomClick={() => {
                  if (!currentUser.isVerified) {
                    alert('Community Room creation requires Verified Fan status (Supabase is_verified = true).');
                  } else {
                    setSelectedRoom(rooms[0]);
                  }
                }}
              />
            )}

            {activeTab === 'reels' && (
              <ReelsTab
                reels={reels}
                currentUser={currentUser}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenShareModal={onOpenShareModal}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileTab
                currentUser={currentUser}
                userMode={userMode}
                onChangeUserMode={onChangeUserMode}
              />
            )}
          </div>

          {/* Expo Router Native Bottom Tab Bar (`app/(tabs)/_layout.tsx`) */}
          <div className="h-16 bg-[#070b13]/95 backdrop-blur-md border-t border-slate-800/90 px-3 flex items-center justify-around z-30 select-none">
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-all ${
                activeTab === 'broadcast' ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Tv className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <span className="text-[10px] font-bold">Tedz Live</span>
            </button>

            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-all ${
                activeTab === 'rooms' ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] font-bold">Rooms</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-all ${
                activeTab === 'reels' ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="text-[10px] font-bold">Fan Reels</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-all ${
                activeTab === 'profile' ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <User className="w-5 h-5" />
                {currentUser.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </div>
              <span className="text-[10px] font-bold">Profile</span>
            </button>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-full bg-[#070b13] pb-1 pt-0.5 flex justify-center">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Room Detail Modal if selected */}
      <RoomDetailModal
        room={selectedRoom}
        currentUser={currentUser}
        onClose={() => setSelectedRoom(null)}
        onOpenShareModal={onOpenShareModal}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        currentUser={currentUser}
        onClose={() => setIsUploadOpen(false)}
        onSuccessUpload={onUploadReel}
      />
    </div>
  );
};
