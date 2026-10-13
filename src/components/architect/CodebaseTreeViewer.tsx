import React, { useState } from 'react';
import { 
  Folder, FileCode, Check, Copy, ChevronRight, FileText, 
  Terminal, Layers, Sparkles 
} from 'lucide-react';

interface CodeFile {
  path: string;
  name: string;
  language: string;
  content: string;
}

export const CodebaseTreeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('mobile/lib/supabase.ts');
  const [copied, setCopied] = useState(false);

  const files: CodeFile[] = [
    {
      path: 'mobile/lib/supabase.ts',
      name: 'supabase.ts (Native Client)',
      language: 'typescript',
      content: `import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Safe encrypted persistent storage adapter for React Native / Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJh...';

// Shared with existing web Lovable Supabase project! Zero duplicate backend.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});`,
    },
    {
      path: 'mobile/app/_layout.tsx',
      name: '_layout.tsx (Root Stack)',
      language: 'typescript',
      content: `import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#090d16' },
          headerTintColor: '#ffffff',
          contentStyle: { backgroundColor: '#090d16' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="rooms/[id]" options={{ presentation: 'card', title: 'Fan Room' }} />
        <Stack.Screen name="broadcast/live" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="auth/sign-in" options={{ presentation: 'modal', title: 'Sign In' }} />
      </Stack>
    </SafeAreaProvider>
  );
}`,
    },
    {
      path: 'mobile/app/(tabs)/_layout.tsx',
      name: '(tabs)/_layout.tsx (Tab Bar)',
      language: 'typescript',
      content: `import { Tabs } from 'expo-router';
import { Tv, MessageSquare, Video, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#070b13',
          borderTopColor: '#1e293b',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#ef4444',
        tabBarInactiveTintColor: '#94a3b8',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tedz Live',
          tabBarIcon: ({ color, size }) => <Tv color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Fan Reels',
          tabBarIcon: ({ color, size }) => <Video color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}`,
    },
    {
      path: 'mobile/app/(tabs)/index.tsx',
      name: 'index.tsx (Live Stream Screen)',
      language: 'typescript',
      content: `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { supabase } from '../../lib/supabase';

export default function LiveStreamScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  // Native hardware-accelerated stream
  const player = useVideoPlayer(
    process.env.EXPO_PUBLIC_TEDZ_LIVE_STREAM_URL || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    (p) => {
      p.loop = true;
      p.play();
    }
  );

  useEffect(() => {
    // Listen to real-time chat messages via existing Supabase realtime channel
    const channel = supabase
      .channel('broadcast:live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <View style={styles.container}>
      <VideoView player={player} style={styles.videoPlayer} allowsFullscreen />
      <View style={styles.chatHeader}>
        <Text style={styles.headerText}>⚡ Live TedzTV Fan Chat</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageRow}>
            <Text style={styles.username}>{item.display_name}: </Text>
            <Text style={styles.messageContent}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  videoPlayer: { width: '100%', aspectRatio: 16 / 9 },
  chatHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  headerText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  messageRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 6 },
  username: { color: '#ef4444', fontWeight: 'bold' },
  messageContent: { color: '#e2e8f0', flex: 1 },
});`,
    },
  ];

  const currentFile = files.find((f) => f.path === selectedFile) || files[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-red-950/60 text-red-400 border border-red-500/30 px-2 py-0.5 rounded">
                EXPO ROUTER CODEBASE
              </span>
              <span className="text-xs text-slate-400 font-mono">mobile/ DIRECTORY</span>
            </div>
            <h2 className="text-lg font-black text-white">
              Target React Native & Expo Router Source Code Explorer
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Explore the exact native TypeScript source files ready for the <code className="text-slate-300">mobile-app</code> branch. Includes Supabase SecureStore persistence, Expo Router stack layouts, and native video player hooks.
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all self-start"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Current File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File Tree Sidebar */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>mobile/</span>
          </div>

          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = file.path === selectedFile;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-600/20 text-white border border-red-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-red-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl border border-slate-800 p-4 shadow-lg overflow-hidden flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs">
            <span className="font-mono text-cyan-400">{currentFile.path}</span>
            <span className="text-[10px] text-slate-500 uppercase font-mono">{currentFile.language}</span>
          </div>

          <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-2 leading-relaxed max-h-[500px]">
            {currentFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
