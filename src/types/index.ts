export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  favoriteTeam: string;
  favoriteSport: string;
  isVerified: boolean;
  fanRepScore: number;
  badge: string;
  bio: string;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
}

export interface BroadcastStream {
  id: string;
  title: string;
  sport: string;
  matchup: string;
  liveStatus: 'LIVE' | 'UPCOMING' | 'ENDED';
  viewerCount: number;
  streamUrl: string;
  thumbnailUrl: string;
  hosts: string[];
  homeTeam: { name: string; score: number; logo: string; abbr: string };
  awayTeam: { name: string; score: number; logo: string; abbr: string };
  quarterOrHalf: string;
  clock: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  badge?: string;
  teamTag?: string;
  content: string;
  timestamp: string;
  reactions?: Record<string, number>;
}

export interface TeamRoom {
  id: string;
  name: string;
  sport: string;
  type: 'team' | 'community';
  description: string;
  bannerUrl: string;
  iconUrl: string;
  memberCount: number;
  activeOnline: number;
  isVerifiedHost: boolean;
  featuredTopic: string;
  tags: string[];
  recentMessages: ChatMessage[];
}

export interface FanReel {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string[];
  teamTag: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: ReelComment[];
}

export interface ReelComment {
  id: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  content: string;
  timestamp: string;
  likes: number;
}

export interface SupabaseTableDef {
  name: string;
  description: string;
  purpose: string;
  keyColumns: { name: string; type: string; notes: string }[];
  rlsPolicies: string[];
}

export interface SupabaseBucketDef {
  name: string;
  isPublic: boolean;
  maxFileSize: string;
  allowedTypes: string[];
  policies: string[];
}
