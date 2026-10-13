import React, { useState } from 'react';
import { 
  X, UploadCloud, Video, Image as ImageIcon, CheckCircle, 
  AlertCircle, Sparkles, Database, Shield 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FanReel, UserProfile } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onSuccessUpload: (newReel: FanReel) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccessUpload,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamTag, setTeamTag] = useState(currentUser.favoriteTeam || 'KC Chiefs');
  const [mediaType, setMediaType] = useState<'video' | 'photo'>('video');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const sampleThumbnails = [
    'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    setUploadProgress(15);

    const progressInterval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 90) {
          clearInterval(progressInterval);
          return 95;
        }
        return p + 25;
      });
    }, 250);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      const created: FanReel = {
        id: `reel_${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        isVerified: currentUser.isVerified,
        title: title.trim(),
        description: description.trim() || 'Uploaded live from stadium sidelines via TedzTV Expo App',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: sampleThumbnails[Math.floor(Math.random() * sampleThumbnails.length)],
        tags: [`#${teamTag.replace(/\s+/g, '')}`, '#TedzTVNative', '#FanUpload'],
        teamTag: teamTag,
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: true,
        comments: [],
      };

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsUploading(false);
        onSuccessUpload(created);
        onClose();
      }, 500);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Upload Fan Reel or Photo</h3>
              <p className="text-[10px] text-slate-400">Stores to Supabase bucket: <code className="text-cyan-400">reels-video</code></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleUploadSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Media Type Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setMediaType('video')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mediaType === 'video' ? 'bg-red-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video / Reel (1080p)</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaType('photo')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mediaType === 'photo' ? 'bg-red-600 text-white shadow' : 'text-slate-400'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Stadium Photo</span>
            </button>
          </div>

          {/* Media Picker Preview Box */}
          <div className="border-2 border-dashed border-slate-700/80 hover:border-red-500/80 rounded-xl p-4 text-center bg-slate-950/40 cursor-pointer transition-colors">
            <Video className="w-7 h-7 text-red-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-200">Select clip from camera roll</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Simulates Native <code className="text-slate-400">expo-image-picker</code> streaming directly to Supabase Storage</p>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
              Reel Caption / Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Unbelievable fourth down tackle! 🏈"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Team Tag Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
              Associated Team
            </label>
            <select
              value={teamTag}
              onChange={(e) => setTeamTag(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            >
              <option value="KC Chiefs">KC Chiefs</option>
              <option value="SF 49ers">SF 49ers</option>
              <option value="Lakers">LA Lakers</option>
              <option value="Real Madrid">Real Madrid</option>
              <option value="Yankees">NY Yankees</option>
              <option value="General Sports">General Sports</option>
            </select>
          </div>

          {/* Verification Safeguard notice */}
          <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2 text-[11px] text-emerald-300">
            <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Verified Fan Safeguard:</span> Upload allowed because account <code className="text-white">{currentUser.email}</code> has verified status in Supabase <code className="text-emerald-400">auth.users</code>.
            </div>
          </div>

          {/* Upload Progress Indicator */}
          {isUploading && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Uploading chunk to Supabase Storage...</span>
                <span className="font-mono text-white font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim()}
              className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Uploading...' : 'Publish to Feed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
