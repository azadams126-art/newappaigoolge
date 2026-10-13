import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, 
  Send, Sparkles, CheckCircle, Tag, Plus 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FanReel, ReelComment, UserProfile } from '../../types';

interface ReelsTabProps {
  reels: FanReel[];
  currentUser: UserProfile;
  onOpenUpload: () => void;
  onOpenShareModal: (title: string, link: string) => void;
}

export const ReelsTab: React.FC<ReelsTabProps> = ({
  reels,
  currentUser,
  onOpenUpload,
  onOpenShareModal,
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reelsState, setReelsState] = useState<FanReel[]>(reels);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const currentReel = reelsState[activeReelIndex] || reelsState[0];

  const handleToggleLike = (reelId: string) => {
    setReelsState((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const nextLiked = !r.isLiked;
          if (nextLiked) {
            confetti({
              particleCount: 20,
              spread: 45,
              origin: { y: 0.6, x: 0.8 },
            });
          }
          return {
            ...r,
            isLiked: nextLiked,
            likesCount: nextLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: ReelComment = {
      id: `comm_${Date.now()}`,
      username: currentUser.username,
      avatarUrl: currentUser.avatarUrl,
      isVerified: currentUser.isVerified,
      content: newComment.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    setReelsState((prev) =>
      prev.map((r) => {
        if (r.id === currentReel.id) {
          return {
            ...r,
            commentsCount: r.commentsCount + 1,
            comments: [added, ...r.comments],
          };
        }
        return r;
      })
    );

    setNewComment('');
  };

  return (
    <div className="relative h-full w-full bg-black text-white flex flex-col overflow-hidden select-none">
      {/* Top Header Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-slate-200">
          <span>⚡ TedzTV Fan Reels</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-600/40"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Reel Canvas */}
      <div 
        className="flex-1 relative bg-slate-950 flex items-center justify-center cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <img
          src={currentReel.thumbnailUrl}
          alt={currentReel.title}
          className="w-full h-full object-cover"
        />

        {/* Video Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

        {/* Pause indicator */}
        {!isPlaying && (
          <div className="absolute p-4 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
            <Play className="w-8 h-8 fill-white" />
          </div>
        )}

        {/* Right Action Icons Column */}
        <div 
          className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Creator Avatar with Follow Plus */}
          <div className="relative group">
            <img
              src={currentReel.avatarUrl}
              alt={currentReel.displayName}
              className="w-10 h-10 rounded-full border-2 border-red-500 object-cover shadow-lg"
            />
            {currentReel.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-black rounded-full p-0.5">
                <CheckCircle className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleToggleLike(currentReel.id)}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-125 ${
                currentReel.isLiked
                  ? 'bg-red-600/80 text-white shadow-lg shadow-red-600/50'
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
              {currentReel.likesCount}
            </span>
          </div>

          {/* Comment Drawer Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowComments(true)}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 active:scale-110"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
              {currentReel.commentsCount}
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onOpenShareModal(currentReel.title, `tedztv://reels/${currentReel.id}`)}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 active:scale-110"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-bold text-white mt-1 drop-shadow">
              {currentReel.sharesCount}
            </span>
          </div>
        </div>

        {/* Bottom Reel Details */}
        <div 
          className="absolute left-3 right-16 bottom-5 z-20 text-left pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs font-black text-white hover:underline">
              @{currentReel.username}
            </span>
            {currentReel.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            )}
            <span className="text-[10px] bg-red-600/80 text-white font-bold px-2 py-0.5 rounded-full">
              {currentReel.teamTag}
            </span>
          </div>

          <h3 className="text-xs font-bold text-slate-100 leading-snug drop-shadow">
            {currentReel.title}
          </h3>

          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed drop-shadow">
            {currentReel.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {currentReel.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-red-400 font-semibold drop-shadow">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Video switcher pagination pills */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-20">
          {reelsState.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveReelIndex(idx);
              }}
              className={`h-1 rounded-full transition-all ${
                activeReelIndex === idx ? 'w-6 bg-red-500' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide-Up Comments Drawer */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-slate-900 border-t border-slate-800 rounded-t-2xl z-40 flex flex-col shadow-2xl animate-in slide-in-from-bottom">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-red-400" />
              <h4 className="text-xs font-bold text-white">Comments ({currentReel.comments.length})</h4>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="text-xs text-slate-400 hover:text-white p-1"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {currentReel.comments.length === 0 ? (
              <p className="text-center text-slate-500 py-6">Be the first fan to comment on this clip!</p>
            ) : (
              currentReel.comments.map((comm) => (
                <div key={comm.id} className="flex items-start gap-2">
                  <img
                    src={comm.avatarUrl}
                    alt={comm.username}
                    className="w-6 h-6 rounded-full object-cover border border-slate-700 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-200">{comm.username}</span>
                      {comm.isVerified && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                      <span className="text-[10px] text-slate-500 ml-auto">{comm.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{comm.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment as verified fan..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="w-7 h-7 rounded-full bg-red-600 disabled:bg-slate-800 text-white flex items-center justify-center"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
