import { SupabaseBucketDef, SupabaseTableDef } from '../types';

export const REPOSITORY_AUDIT = {
  currentFramework: 'Vite 8.3 + React 19 + TypeScript + Tailwind CSS (Lovable / Web SPA)',
  targetFramework: 'React Native 0.76+ / Expo SDK 52+ with Expo Router v4',
  backendArchitecture: 'Supabase (Auth, PostgreSQL DB, Realtime Channels, Storage)',
  safeguardsStatus: {
    preserveWebRepo: 'Active: Web code remains pristine and untouched in main/production branch.',
    branchStrategy: 'Isolate native app inside branch `mobile-app` or workspace directory `mobile/`.',
    noDuplicateDb: 'Verified: Mobile client will connect directly to existing Supabase project via existing Project URL & anon key.',
    noDuplicateExpoOrg: 'Verified: Linked to existing TedzTV Expo organization (`@tedztv`) via eas.json.',
    noSecretsExposed: 'Verified: Only public keys (`EXPO_PUBLIC_*`) embedded in client builds; service role keys restricted to backend/edge functions.',
  },
};

export const FEATURE_REUSE_ANALYSIS = [
  {
    category: 'Backend & Data Layer',
    feature: 'Supabase Database Schema & Tables',
    verdict: '100% Directly Reused',
    action: 'Preserve all existing tables (`profiles`, `rooms`, `chat_messages`, `broadcasts`, `reels`, `likes`, `comments`). No schema changes needed.',
    complexity: 'Zero backend migration',
  },
  {
    category: 'Security & Access',
    feature: 'Row-Level Security (RLS) & Policies',
    verdict: '100% Directly Reused',
    action: 'Preserve existing PostgreSQL policies. Native client authenticates with same JWT token, respecting identical role/verified checks.',
    complexity: 'Directly compatible',
  },
  {
    category: 'Authentication',
    feature: 'Supabase Email Auth & Verified Fan Status',
    verdict: '90% Shared Logic / 10% Native UI',
    action: 'Share `@supabase/supabase-js` auth methods. Replace web localStorage with `expo-secure-store` for safe encrypted session persistence.',
    complexity: 'Plug-and-play with SecureStore adapter',
  },
  {
    category: 'Realtime & Chat',
    feature: 'Live Broadcast Chat & Room Channels',
    verdict: '95% Shared Logic / 5% Native State',
    action: 'Directly reuse `supabase.channel("room:${id}").on("postgres_changes", ...)` logic with React hooks. Replaces HTML DOM lists with RN `FlatList`.',
    complexity: 'High performance native list rendering',
  },
  {
    category: 'Live Broadcast',
    feature: 'TedzTV Live Stream Player',
    verdict: 'React Native Implementation Required',
    action: 'Replace Web `<video>` / HLS.js with `expo-video` or `expo-av` for hardware-accelerated low-latency native streaming, picture-in-picture, and audio focus.',
    complexity: 'Native video player migration',
  },
  {
    category: 'Media & Uploads',
    feature: 'Fan Reels, Photo Uploads & Storage',
    verdict: 'React Native Implementation Required',
    action: 'Replace `<input type="file">` with `expo-image-picker` and `expo-file-system`. Stream multipart uploads into existing Supabase buckets (`fan-media`, `reels-video`).',
    complexity: 'Native camera & file picker integration',
  },
  {
    category: 'Navigation & Shell',
    feature: 'App Routing & Mobile Shell',
    verdict: 'React Native Implementation Required',
    action: 'Migrate React Router / web URLs to Expo Router file-based routing (`app/(tabs)/index.tsx`, `app/rooms/[id].tsx`, `app/reels.tsx`).',
    complexity: 'Standard Expo Router v4 setup',
  },
  {
    category: 'Push & Alerts',
    feature: 'Game Alerts & Stream Notifications',
    verdict: 'New Mobile Native Capability',
    action: 'Implement `expo-notifications` for real-time game start pushes, room mentions, and live broadcaster alerts via APNs (iOS) & FCM (Android).',
    complexity: 'EAS Credentials configuration',
  },
];

export const SUPABASE_TABLES_RETENTION: SupabaseTableDef[] = [
  {
    name: 'profiles',
    description: 'Stores user fan identity, verified badge status, favorite teams, rep score, and bio.',
    purpose: 'Core identity across web and mobile. Retains verified status and tier.',
    keyColumns: [
      { name: 'id', type: 'uuid PRIMARY KEY (auth.users.id)', notes: 'Foreign key to auth.users' },
      { name: 'username', type: 'text UNIQUE', notes: 'Public handle' },
      { name: 'display_name', type: 'text', notes: 'Display name' },
      { name: 'avatar_url', type: 'text', notes: 'Link to avatars storage bucket' },
      { name: 'is_verified', type: 'boolean DEFAULT false', notes: 'Verified fan status flag' },
      { name: 'fan_rep_score', type: 'integer DEFAULT 0', notes: 'Reputation earned from community participation' },
      { name: 'favorite_team', type: 'text', notes: 'Primary team allegiance' },
      { name: 'created_at', type: 'timestamptz DEFAULT now()', notes: 'Account creation' },
    ],
    rlsPolicies: [
      'SELECT: Public read for all verified and public profiles.',
      'INSERT: auth.uid() = id on user sign up trigger.',
      'UPDATE: auth.uid() = id (users can only update their own profile).',
      'ADMIN UPDATE: Service role or TedzTV mods can modify `is_verified`.',
    ],
  },
  {
    name: 'rooms',
    description: 'Team rooms (e.g. Chiefs Kingdom, Lakers) and user-created community fan lounges.',
    purpose: 'Houses live chat rooms, pinned topics, and fan participant counts.',
    keyColumns: [
      { name: 'id', type: 'text PRIMARY KEY', notes: 'Room slug or UUID' },
      { name: 'name', type: 'text', notes: 'Room title' },
      { name: 'type', type: 'text CHECK (type IN (\'team\', \'community\'))', notes: 'Team official vs user lounge' },
      { name: 'sport', type: 'text', notes: 'Sport category (NFL, NBA, MLB, etc.)' },
      { name: 'banner_url', type: 'text', notes: 'Header image link' },
      { name: 'icon_url', type: 'text', notes: 'Emoji icon or SVG' },
      { name: 'creator_id', type: 'uuid REFERENCES profiles(id)', notes: 'Null for official team rooms' },
      { name: 'is_verified_host', type: 'boolean DEFAULT false', notes: 'Host badge flag' },
    ],
    rlsPolicies: [
      'SELECT: Public read for all authenticated users.',
      'INSERT: Verified fans (`is_verified = true`) can create community rooms.',
      'UPDATE: Room creator or admin.',
    ],
  },
  {
    name: 'room_messages',
    description: 'Real-time chat messages inside team and community rooms.',
    purpose: 'Powers active discussions, game threads, and member interactions.',
    keyColumns: [
      { name: 'id', type: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()', notes: 'Message ID' },
      { name: 'room_id', type: 'text REFERENCES rooms(id) ON DELETE CASCADE', notes: 'Target room' },
      { name: 'user_id', type: 'uuid REFERENCES profiles(id)', notes: 'Author reference' },
      { name: 'content', type: 'text NOT NULL', notes: 'Message body' },
      { name: 'media_url', type: 'text', notes: 'Optional photo/gif' },
      { name: 'created_at', type: 'timestamptz DEFAULT now()', notes: 'Order timestamp' },
    ],
    rlsPolicies: [
      'SELECT: Authenticated users can read messages in rooms they belong to.',
      'INSERT: Verified users or confirmed email accounts can insert messages.',
      'DELETE: Message owner or room moderator.',
    ],
  },
  {
    name: 'broadcasts',
    description: 'TedzTV Live streaming events, watch party matchups, live scores, and host lineup.',
    purpose: 'Powers the flagship live watch party and video stream in mobile.',
    keyColumns: [
      { name: 'id', type: 'text PRIMARY KEY', notes: 'Broadcast slug' },
      { name: 'title', type: 'text', notes: 'Event title' },
      { name: 'stream_url', type: 'text', notes: 'HLS/DASH/MP4 stream endpoint' },
      { name: 'live_status', type: 'text CHECK (live_status IN (\'LIVE\', \'UPCOMING\', \'ENDED\'))', notes: 'Stream state' },
      { name: 'viewer_count', type: 'integer DEFAULT 0', notes: 'Concurrent viewers counter' },
      { name: 'home_team', type: 'jsonb', notes: 'Home team score, logo, name' },
      { name: 'away_team', type: 'jsonb', notes: 'Away team score, logo, name' },
      { name: 'clock_info', type: 'text', notes: 'Current game quarter & clock' },
    ],
    rlsPolicies: [
      'SELECT: Public read for all viewers.',
      'INSERT/UPDATE: Restricted to TedzTV broadcasters & admin roles.',
    ],
  },
  {
    name: 'fan_reels',
    description: 'User-uploaded sports highlights, stadium reactions, and vertical video clips.',
    purpose: 'Powers mobile reels feed, algorithmic fan discoverability, likes, and shares.',
    keyColumns: [
      { name: 'id', type: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()', notes: 'Reel ID' },
      { name: 'user_id', type: 'uuid REFERENCES profiles(id)', notes: 'Creator' },
      { name: 'title', type: 'text NOT NULL', notes: 'Caption & title' },
      { name: 'video_url', type: 'text NOT NULL', notes: 'URL in reels-video storage bucket' },
      { name: 'thumbnail_url', type: 'text', notes: 'Poster thumbnail image' },
      { name: 'team_tag', type: 'text', notes: 'Associated sports team' },
      { name: 'likes_count', type: 'integer DEFAULT 0', notes: 'Cached like count' },
      { name: 'comments_count', type: 'integer DEFAULT 0', notes: 'Cached comments count' },
      { name: 'created_at', type: 'timestamptz DEFAULT now()', notes: 'Published date' },
    ],
    rlsPolicies: [
      'SELECT: Public read for all published reels.',
      'INSERT: Verified email users can upload reels.',
      'UPDATE: Creator can edit description; likes/comments update via triggers.',
      'DELETE: Creator or admin.',
    ],
  },
  {
    name: 'likes & comments',
    description: 'Interactions across community posts, reels, and broadcasts.',
    purpose: 'Stores social engagement graphs without duplicate records.',
    keyColumns: [
      { name: 'id', type: 'uuid PRIMARY KEY', notes: 'Unique ID' },
      { name: 'target_type', type: 'text (\'reel\', \'post\', \'comment\')', notes: 'Polymorphic target' },
      { name: 'target_id', type: 'uuid', notes: 'Target entity ID' },
      { name: 'user_id', type: 'uuid REFERENCES profiles(id)', notes: 'Author' },
    ],
    rlsPolicies: [
      'SELECT: Public read.',
      'INSERT: Authenticated user (UNIQUE on target_id + user_id).',
      'DELETE: auth.uid() = user_id.',
    ],
  },
];

export const SUPABASE_STORAGE_BUCKETS: SupabaseBucketDef[] = [
  {
    name: 'avatars',
    isPublic: true,
    maxFileSize: '5MB',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    policies: [
      'Public read: Allow GET for anyone.',
      'User upload: Authenticated users can upload to `avatars/{user_id}/*`.',
    ],
  },
  {
    name: 'fan-media',
    isPublic: true,
    maxFileSize: '25MB',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    policies: [
      'Public read: Allow GET for anyone.',
      'Verified fan upload: Authenticated users with verified emails can insert photos into room chats and fan posts.',
    ],
  },
  {
    name: 'reels-video',
    isPublic: true,
    maxFileSize: '100MB',
    allowedTypes: ['video/mp4', 'video/quicktime', 'video/webm'],
    policies: [
      'Public read: Stream delivery via Supabase CDN.',
      'Creator upload: Verified users can write objects to `reels-video/{user_id}/*`.',
    ],
  },
  {
    name: 'broadcast-assets',
    isPublic: true,
    maxFileSize: '50MB',
    allowedTypes: ['image/*', 'video/*'],
    policies: [
      'Public read.',
      'Admin only write: TedzTV studio hosts & production team.',
    ],
  },
];

export const REQUIRED_ENV_VARS = [
  {
    variable: 'EXPO_PUBLIC_SUPABASE_URL',
    purpose: 'Existing Supabase project endpoint (e.g., https://xyzcompany.supabase.co)',
    exposure: 'Public (embedded into mobile client bundle)',
    notes: 'Directly mirrors VITE_SUPABASE_URL from Lovable web app.',
  },
  {
    variable: 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    purpose: 'Existing Supabase anonymous client API key',
    exposure: 'Public (safe for client side under PostgreSQL RLS)',
    notes: 'Directly mirrors VITE_SUPABASE_ANON_KEY. Zero new keys needed.',
  },
  {
    variable: 'EXPO_PUBLIC_TEDZ_LIVE_STREAM_URL',
    purpose: 'TedzTV low-latency HLS/DASH broadcast stream CDN source',
    exposure: 'Public',
    notes: 'Configured in app settings or loaded dynamically from `broadcasts` table.',
  },
  {
    variable: 'EXPO_PUBLIC_EAS_PROJECT_ID',
    purpose: 'Expo Application Services project identifier linking to Tedz TV Org',
    exposure: 'Public',
    notes: 'Generated via `eas init` in the Tedz TV Expo organization.',
  },
  {
    variable: 'EXPO_PUBLIC_APP_SCHEME',
    purpose: 'Custom URI scheme for deep linking (`tedztv://`)',
    exposure: 'Public',
    notes: 'Enables opening mobile app directly from room invite links and broadcast alerts.',
  },
];

export const EXPO_ORG_LINKAGE_PLAN = {
  organizationName: 'Tedz TV',
  easProjectSlug: 'tedztv-mobile',
  bundleIdentifierIos: 'com.tedztv.app',
  packageAndroid: 'com.tedztv.app',
  deepLinkingScheme: 'tedztv',
  universalLinks: ['tedztv.com', 'app.tedztv.com'],
  linkingSteps: [
    'Step 1: Install EAS CLI (`npm install -g eas-cli`) and authenticate (`eas login`).',
    'Step 2: Run `eas init --id <existing-project-id>` or select existing Tedz TV organization from interactive prompt.',
    'Step 3: Keep existing Supabase credentials in EAS Secrets (`eas secret:create`) for production builds.',
    'Step 4: Configure `eas.json` build profiles (development, preview, production) targeting iOS TestFlight and Google Play Internal Track.',
    'Step 5: Configure Push Notification credentials (Apple APNs key and Google Firebase Cloud Messaging v1).',
  ],
};
