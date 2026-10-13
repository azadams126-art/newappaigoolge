import React, { useState } from 'react';
import { 
  Smartphone, Terminal, Copy, Check, GitBranch, Shield, 
  ExternalLink, Layers, Cpu, Globe 
} from 'lucide-react';
import { EXPO_ORG_LINKAGE_PLAN } from '../../data/architectureData';

export const ExpoConfigViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'app_json' | 'eas_json' | 'linkage_steps' | 'branching'>('app_json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const appJsonCode = `{
  "expo": {
    "name": "TedzTV",
    "slug": "tedztv-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "tedztv",
    "userInterfaceStyle": "dark",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#090d16"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.tedztv.app",
      "infoPlist": {
        "NSCameraUsageDescription": "TedzTV needs camera access so fans can record live stadium reactions and fan reels.",
        "NSPhotoLibraryUsageDescription": "TedzTV needs photo library access to upload sports highlights to community rooms.",
        "NSMicrophoneUsageDescription": "TedzTV needs microphone access for live fan commentary."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#090d16"
      },
      "package": "com.tedztv.app",
      "permissions": [
        "CAMERA",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "RECORD_AUDIO"
      ]
    },
    "plugins": [
      "expo-router",
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": true
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#e11d48"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "YOUR_EXISTING_TEDZ_TV_EAS_PROJECT_ID"
      }
    },
    "owner": "tedztv"
  }
}`;

  const easJsonCode = `{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "development",
        "EXPO_PUBLIC_SUPABASE_URL": "https://xyzcompany.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "eyJh..."
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "channel": "production",
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "azadams126@gmail.com",
        "ascAppId": "TEDZTV_APP_STORE_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}`;

  const branchingStrategyCode = `# SAFEGUARDED GIT REPOSITORY STRATEGY
# Production web app remains intact on 'main' or 'production' branch

# 1. Ensure you are on the primary branch and clean
git checkout main
git status

# 2. Create the dedicated mobile branch
git checkout -b mobile-app

# 3. Create the isolated mobile workspace directory
mkdir -p mobile
cd mobile

# 4. Initialize Expo Router v4 template inside 'mobile/'
npx create-expo-app@latest . --template blank-typescript

# 5. Install mobile dependencies
npx expo install @supabase/supabase-js expo-secure-store expo-router \\
  expo-video expo-image-picker expo-notifications react-native-safe-area-context

# 6. Authenticate with your existing Tedz TV Expo organization
npx eas login
npx eas init --id YOUR_EXISTING_PROJECT_ID

# 7. Commit changes ONLY to the mobile-app branch
git add mobile/
git commit -m "feat(mobile): initialize TedzTV native Expo app linking existing Supabase backend"
git push -u origin mobile-app

# NOTICE: The website on branch 'main' remains completely untouched!`;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono bg-amber-950/60 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
            EXPO ORGANIZATION INTEGRATION
          </span>
          <span className="text-xs text-slate-400 font-mono">ORG: @TEDZTV</span>
        </div>
        <h2 className="text-lg font-black text-white">
          Expo App Configuration & EAS Linking Protocol
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Configuration ensuring the React Native mobile client links to your existing Tedz TV Expo organization, retains your bundle identifiers (<code className="text-slate-300">com.tedztv.app</code>), and enforces strict branching safeguards.
        </p>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('app_json')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'app_json'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            app.json (Expo Native Config)
          </button>
          <button
            onClick={() => setActiveTab('eas_json')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'eas_json'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            eas.json (Build & Submit Profiles)
          </button>
          <button
            onClick={() => setActiveTab('linkage_steps')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'linkage_steps'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Expo Org Linkage Workflow
          </button>
          <button
            onClick={() => setActiveTab('branching')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'branching'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Git Branching Safeguards
          </button>
        </div>
      </div>

      {/* Content Panels */}
      {activeTab === 'app_json' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 relative shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">mobile/app.json</span>
            <button
              onClick={() => handleCopy(appJsonCode, 'app_json')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg"
            >
              {copiedKey === 'app_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'app_json' ? 'Copied' : 'Copy app.json'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-2 leading-relaxed">
            {appJsonCode}
          </pre>
        </div>
      )}

      {activeTab === 'eas_json' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 relative shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">mobile/eas.json</span>
            <button
              onClick={() => handleCopy(easJsonCode, 'eas_json')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg"
            >
              {copiedKey === 'eas_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'eas_json' ? 'Copied' : 'Copy eas.json'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-2 leading-relaxed">
            {easJsonCode}
          </pre>
        </div>
      )}

      {activeTab === 'linkage_steps' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Linking to Existing Tedz TV Expo Organization
          </h3>
          <p className="text-xs text-slate-400">
            Follow this 5-step checklist so the mobile app automatically publishes under your organization without creating a duplicate project:
          </p>

          <div className="space-y-3">
            {EXPO_ORG_LINKAGE_PLAN.linkingSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs">
            <strong>Key Safeguard:</strong> In <code className="text-white">app.json</code>, the field <code className="text-white">"owner": "tedztv"</code> and <code className="text-white">"slug": "tedztv-mobile"</code> explicitly ensure all EAS builds, push credentials, and OTA updates belong to your existing verified Expo team.
          </div>
        </div>
      )}

      {activeTab === 'branching' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 relative shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
            <span className="font-mono text-slate-400">terminal / git branch setup</span>
            <button
              onClick={() => handleCopy(branchingStrategyCode, 'branching')}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg"
            >
              {copiedKey === 'branching' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'branching' ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 leading-relaxed">
            {branchingStrategyCode}
          </pre>
        </div>
      )}
    </div>
  );
};
