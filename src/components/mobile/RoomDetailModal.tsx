import React, { useState } from 'react';
import { 
  X, Users, Send, ShieldCheck, Share2, Flame, Bell, Info 
} from 'lucide-react';
import { ChatMessage, TeamRoom, UserProfile } from '../../types';

interface RoomDetailModalProps {
  room: TeamRoom | null;
  currentUser: UserProfile;
  onClose: () => void;
  onOpenShareModal: (title: string, link: string) => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  currentUser,
  onClose,
  onOpenShareModal,
}) => {
  if (!room) return null;

  const [messages, setMessages] = useState<ChatMessage[]>(
    room.recentMessages.length > 0 
      ? room.recentMessages 
      : [
          {
            id: 'init_1',
            userId: 'mod_1',
            username: 'tedz_mod',
            displayName: 'Room Host',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            isVerified: true,
            badge: 'Verified Mod',
            teamTag: room.name.split(' ')[0],
            content: `Welcome to the official ${room.name} lounge! Keep discussions respectful & game on!`,
            timestamp: '1h ago',
          },
          {
            id: 'init_2',
            userId: 'fan_2',
            username: 'superfan_99',
            displayName: 'Gameday Legend',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            isVerified: false,
            teamTag: room.name.split(' ')[0],
            content: 'Ready for this weekend matchup! Who is starting at flex?',
            timestamp: '15m ago',
          }
        ]
  );
  const [inputText, setInputText] = useState('');
  const [isJoined, setIsJoined] = useState(true);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      isVerified: currentUser.isVerified,
      badge: currentUser.badge,
      teamTag: room.sport,
      content: inputText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md h-[90vh] sm:h-[82vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="relative">
          <div 
            className="h-28 w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${room.bannerUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-black/60" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-slate-300 hover:text-white border border-white/10 z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenShareModal(room.name, `tedztv://room/${room.id}`)}
              className="absolute top-3 right-12 p-1.5 rounded-full bg-black/60 text-slate-300 hover:text-white border border-white/10 z-10"
              title="Share room"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-1.5 bg-slate-950/80 rounded-xl border border-slate-700/80 backdrop-blur-md">
                  {room.iconUrl}
                </span>
                <div>
                  <h2 className="text-base font-black text-white flex items-center gap-1.5 drop-shadow">
                    <span>{room.name}</span>
                    {room.isVerifiedHost && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
                  </h2>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span>{room.sport}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{room.activeOnline.toLocaleString()} active now</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsJoined(!isJoined)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isJoined
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/30'
                }`}
              >
                {isJoined ? 'Joined' : '+ Join'}
              </button>
            </div>
          </div>
        </div>

        {/* Pinned Info Bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 truncate">
            <Flame className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate text-slate-200"><strong>Topic: </strong>{room.featuredTopic}</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {room.type.toUpperCase()}
          </span>
        </div>

        {/* Room Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5">
              <img
                src={msg.avatarUrl}
                alt={msg.displayName}
                className="w-7 h-7 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-slate-200">{msg.displayName}</span>
                  {msg.isVerified && <ShieldCheck className="w-3 h-3 text-cyan-400" />}
                  {msg.teamTag && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300">
                      {msg.teamTag}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 ml-auto">{msg.timestamp}</span>
                </div>
                <p className="text-slate-300 mt-1 leading-relaxed bg-slate-800/40 p-2.5 rounded-lg border border-slate-800/80">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send message to ${room.name}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-8 h-8 rounded-full bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-all hover:bg-red-500 shadow-md shadow-red-600/30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
