import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Users, Flame, Trophy, Sparkles, Send, 
  Share2, Radio, CheckCircle, Shield, Award, BarChart3, Maximize2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BroadcastStream, ChatMessage, UserProfile } from '../../types';

interface LiveBroadcastTabProps {
  stream: BroadcastStream;
  currentUser: UserProfile;
  initialMessages: ChatMessage[];
  onOpenShareModal: (title: string, link: string) => void;
}

export const LiveBroadcastTab: React.FC<LiveBroadcastTabProps> = ({
  stream,
  currentUser,
  initialMessages,
  onOpenShareModal,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [audioTrack, setAudioTrack] = useState<'commentary' | 'stadium'>('commentary');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState({ mahomes: 68, purdy: 32 });
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Periodic incoming messages simulation
  useEffect(() => {
    const sampleIncoming = [
      { user: 'chiefs_kingdom_vip', verified: true, team: 'KC Chiefs', text: 'Touchdown Chiefs! Unbelievable catch! 🏈🔥' },
      { user: 'bay_area_red99', verified: false, team: 'SF 49ers', text: 'Huge defensive hold coming up right now!' },
      { user: 'tedz_producer', verified: true, team: 'TedzTV', text: '🎙️ Live fan call-in opening in 2 minutes on the stream!' },
      { user: 'sports_junkie_ca', verified: true, team: 'KC Chiefs', text: 'That pass protection was immaculate 💯' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      const incoming = sampleIncoming[index % sampleIncoming.length];
      index++;
      setMessages((prev) => [
        ...prev,
        {
          id: `sim_${Date.now()}`,
          userId: `sim_u_${index}`,
          username: incoming.user,
          displayName: incoming.user,
          avatarUrl: `https://images.unsplash.com/photo-${1535713875000 + (index * 70)}?w=100&auto=format&fit=crop&q=80`,
          isVerified: incoming.verified,
          badge: incoming.verified ? 'Verified Fan' : undefined,
          teamTag: incoming.team,
          content: incoming.text,
          timestamp: 'Just now',
        },
      ]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: `m_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatarUrl: currentUser.avatarUrl,
      isVerified: currentUser.isVerified,
      badge: currentUser.badge,
      teamTag: currentUser.favoriteTeam.includes('Chiefs') ? 'KC Chiefs' : 'TedzTV Fan',
      content: inputMessage.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Trigger subtle reaction
    triggerFloatingReaction('🔥');
  };

  const triggerFloatingReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 70) + 15;
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);

    if (emoji === '🏆') {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2200);
  };

  const handleVote = (option: 'mahomes' | 'purdy') => {
    if (pollVoted) return;
    setPollVoted(option);
    if (option === 'mahomes') {
      setPollVotes((p) => ({ ...p, mahomes: p.mahomes + 1 }));
    } else {
      setPollVotes((p) => ({ ...p, purdy: p.purdy + 1 }));
    }
    triggerFloatingReaction('🏆');
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-100 overflow-hidden select-none">
      {/* Broadcast Video Player Section */}
      <div className="relative w-full aspect-video bg-black flex-shrink-0 group overflow-hidden border-b border-slate-800">
        {/* Stream Graphic / Video Mock */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ backgroundImage: `url(${stream.thumbnailUrl})` }}
        >
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70" />
        </div>

        {/* Live Status Header Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse">
              <Radio className="w-3 h-3" />
              LIVE
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
              <Users className="w-3 h-3 text-red-400" />
              {stream.viewerCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenShareModal(stream.title, 'tedztv://broadcast/' + stream.id)}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 hover:text-white border border-white/10"
              title="Share broadcast"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 hover:text-white border border-white/10"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Live Score Bug in Stream */}
        <div className="absolute top-10 left-2.5 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-amber-400">{stream.homeTeam.abbr}</span>
            <span className="text-sm font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded text-white">{stream.homeTeam.score}</span>
          </div>
          <span className="text-xs text-slate-400 font-bold">vs</span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded text-white">{stream.awayTeam.score}</span>
            <span className="text-sm font-black text-red-400">{stream.awayTeam.abbr}</span>
          </div>
          <div className="h-3 w-px bg-slate-700 mx-0.5" />
          <span className="text-[11px] font-mono font-semibold text-emerald-400">{stream.quarterOrHalf} {stream.clock}</span>
        </div>

        {/* Center Live Play / Pause Feedback */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && (
            <div className="p-4 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white">
              <Play className="w-8 h-8 fill-white" />
            </div>
          )}
        </div>

        {/* Floating animated reactions inside player */}
        <div className="absolute inset-x-0 bottom-12 top-0 pointer-events-none overflow-hidden z-20">
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="absolute text-2xl transition-all duration-1000 animate-bounce"
              style={{
                left: `${item.left}%`,
                bottom: '10px',
                animation: 'fadeFloat 2s ease-out forwards',
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* Stream Bottom Bar Overlay */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between z-10 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded bg-black/50 text-white hover:bg-black/70"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <span className="font-semibold text-white drop-shadow truncate max-w-[190px]">
              {stream.title}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Audio Track Selector */}
            <div className="flex bg-black/60 backdrop-blur-sm rounded-lg p-0.5 border border-white/10 text-[10px]">
              <button
                onClick={() => setAudioTrack('commentary')}
                className={`px-1.5 py-0.5 rounded ${audioTrack === 'commentary' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Tedz Audio
              </button>
              <button
                onClick={() => setAudioTrack('stadium')}
                className={`px-1.5 py-0.5 rounded ${audioTrack === 'stadium' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Crowd FX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Reaction Action Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Hype Tap:
        </span>
        <div className="flex items-center gap-2">
          {['🔥', '🏆', '🐐', '💥', '🏈', '💯'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => triggerFloatingReaction(emoji)}
              className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-125 transition-all flex items-center justify-center text-sm border border-slate-700/60 shadow-sm"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Broadcast Poll / Announcement Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/30 border-b border-slate-800/80 px-3 py-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>LIVE FAN POLL</span>
          </div>
          <span className="text-[10px] text-slate-400">Total: {pollVotes.mahomes + pollVotes.purdy} fans</span>
        </div>
        <p className="text-xs text-slate-200 font-medium mb-1.5">Who seals the game in the final two minutes?</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleVote('mahomes')}
            disabled={pollVoted !== null}
            className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${
              pollVoted === 'mahomes'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>Mahomes (KC)</span>
              <span className="font-mono text-[11px] text-amber-400">{Math.round((pollVotes.mahomes / (pollVotes.mahomes + pollVotes.purdy)) * 100)}%</span>
            </div>
          </button>
          <button
            onClick={() => handleVote('purdy')}
            disabled={pollVoted !== null}
            className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${
              pollVoted === 'purdy'
                ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>Purdy (SF)</span>
              <span className="font-mono text-[11px] text-red-400">{Math.round((pollVotes.purdy / (pollVotes.mahomes + pollVotes.purdy)) * 100)}%</span>
            </div>
          </button>
        </div>
      </div>

      {/* Realtime Chat Message Stream (Simulates Supabase Realtime Channel) */}
      <div 
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-2.5 text-xs font-normal"
      >
        <div className="text-center py-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            Connected to TedzTV Supabase Live Channel
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2 group animate-fadeIn">
            <img
              src={msg.avatarUrl}
              alt={msg.displayName}
              className="w-7 h-7 rounded-full object-cover border border-slate-700 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-200 truncate">
                  {msg.displayName}
                </span>

                {msg.isVerified && (
                  <span title="Verified Fan">
                    <CheckCircle className="w-3 h-3 text-cyan-400 fill-cyan-400/20 flex-shrink-0" />
                  </span>
                )}

                {msg.teamTag && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                    msg.teamTag.includes('Chiefs') 
                      ? 'bg-amber-900/40 text-amber-300 border border-amber-700/40' 
                      : msg.teamTag.includes('49ers')
                      ? 'bg-red-900/40 text-red-300 border border-red-700/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {msg.teamTag}
                  </span>
                )}

                {msg.badge && (
                  <span className="text-[9px] text-amber-400/90 font-medium">
                    • {msg.badge}
                  </span>
                )}

                <span className="text-[10px] text-slate-500 ml-auto flex-shrink-0">
                  {msg.timestamp}
                </span>
              </div>
              <p className="text-slate-300 mt-0.5 leading-relaxed break-words">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 bg-slate-900 border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Chat as ${currentUser.displayName}...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-8 h-8 rounded-full bg-red-600 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-all hover:bg-red-500 flex-shrink-0 shadow-md shadow-red-600/30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
