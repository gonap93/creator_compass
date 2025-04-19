'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { updateUserProfile, getUserProfile } from '@/lib/firebase/profileUtils';

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    color: '#E4405F',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    color: '#FFFFFF',
  },
];

export default function SocialMediaPlatforms() {
  const { user } = useAuth();
  const [usernames, setUsernames] = useState<Record<string, string>>({
    instagram: '',
    tiktok: '',
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({
    instagram: false,
    tiktok: false,
  });
  const [connectionStatus, setConnectionStatus] = useState<Record<string, { success: boolean; message: string }>>({
    instagram: { success: false, message: '' },
    tiktok: { success: false, message: '' },
  });

  // Load existing social media handles
  useEffect(() => {
    const loadSocialMedia = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserProfile(user.uid);
        if (profile?.socialMedia) {
          setUsernames(prev => ({
            ...prev,
            ...profile.socialMedia
          }));
          
          // Set connection status for existing connections
          const newStatus: Record<string, { success: boolean; message: string }> = {};
          Object.entries(profile.socialMedia).forEach(([platform, username]) => {
            if (username) {
              newStatus[platform] = {
                success: true,
                message: `Connected to ${platforms.find(p => p.id === platform)?.name}`
              };
            }
          });
          setConnectionStatus(prev => ({
            ...prev,
            ...newStatus
          }));
        }
      } catch (error) {
        console.error('Error loading social media handles:', error);
      }
    };

    loadSocialMedia();
  }, [user]);

  const handleUsernameChange = (platformId: string, value: string) => {
    setUsernames(prev => ({
      ...prev,
      [platformId]: value,
    }));
    
    // Reset connection status when username changes
    setConnectionStatus(prev => ({
      ...prev,
      [platformId]: { success: false, message: '' }
    }));
  };

  const scrapeVideos = async (username: string): Promise<void> => {
    try {
      const response = await fetch('/api/tiktok/scrape-videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape videos');
      }

      console.log('Successfully scraped videos for:', username);
    } catch (error) {
      console.error('Error scraping videos:', error);
      throw error;
    }
  };

  const handleConnect = async (platformId: string) => {
    const username = usernames[platformId];
    if (!user || !username) return;

    setLoading(prev => ({ ...prev, [platformId]: true }));
    setConnectionStatus(prev => ({
      ...prev,
      [platformId]: { success: false, message: '' }
    }));

    try {
      // Get current profile to preserve existing social media handles
      const currentProfile = await getUserProfile(user.uid);
      
      // Update the user's profile in Firestore with the merged social media handles
      await updateUserProfile(user.uid, {
        socialMedia: {
          ...(currentProfile?.socialMedia || {}),
          [platformId]: username
        }
      });

      // If connecting TikTok, also scrape videos
      if (platformId === 'tiktok') {
        await scrapeVideos(username);
      }

      // Set successful connection status
      setConnectionStatus(prev => ({
        ...prev,
        [platformId]: { 
          success: true, 
          message: `Successfully connected to ${platforms.find(p => p.id === platformId)?.name}`
        }
      }));
    } catch (error) {
      console.error('Error connecting platform:', error);
      setConnectionStatus(prev => ({
        ...prev,
        [platformId]: { 
          success: false, 
          message: `Failed to connect to ${platforms.find(p => p.id === platformId)?.name}`
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [platformId]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map((platform) => (
        <div
          key={platform.id}
          className="flex flex-col gap-3 p-4 rounded-lg bg-[#0a0a0a] border border-[#4CAF50]/20"
        >
          <div className="flex items-center gap-3" style={{ color: platform.color }}>
            {platform.icon}
            <span className="text-white font-medium">{platform.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Enter ${platform.name} username`}
                value={usernames[platform.id]}
                onChange={(e) => handleUsernameChange(platform.id, e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#4CAF50]"
                disabled={loading[platform.id]}
              />
              <button
                onClick={() => handleConnect(platform.id)}
                disabled={!usernames[platform.id] || loading[platform.id]}
                className="px-4 py-2 rounded-md bg-[#4CAF50] text-white font-medium hover:bg-[#45a049] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading[platform.id] ? 'Connecting...' : connectionStatus[platform.id]?.success ? 'Connected' : 'Conectar'}
              </button>
            </div>
            {connectionStatus[platform.id]?.message && (
              <p className={`text-sm ${connectionStatus[platform.id]?.success ? 'text-green-500' : 'text-red-500'}`}>
                {connectionStatus[platform.id]?.message}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 