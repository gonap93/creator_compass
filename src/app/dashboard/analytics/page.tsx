'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { TikTokProfile, TikTokVideo, fetchTikTokProfile, fetchTikTokVideos } from '@/lib/utils/tiktokUtils';
import { getUserProfile, UserProfile } from '@/lib/firebase/profileUtils';
import { TikTokVideoPreview } from '@/app/components/TikTokVideoPreview';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<TikTokProfile | null>(null);
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'comments'>('views');
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    console.log('[Analytics] Auth state:', { user, authLoading });
    
    const fetchData = async () => {
      if (authLoading) {
        console.log('[Analytics] Still loading auth state...');
        return;
      }

      if (!user) {
        console.log('[Analytics] No user found, showing sign in message');
        setError('Please sign in to view your TikTok analytics');
        setLoading(false);
        return;
      }

      console.log('[Analytics] User authenticated:', user.uid);

      try {
        const profile = await getUserProfile(user.uid);
        console.log('[Analytics] User profile:', profile);
        setUserProfile(profile);
        
        if (!profile?.socialMedia?.tiktok) {
          console.log('[Analytics] No TikTok account connected');
          setError('Please connect your TikTok account in the profile page');
          setLoading(false);
          return;
        }

        console.log('[Analytics] Found TikTok username:', profile.socialMedia.tiktok);

        // Fetch TikTok data
        const tiktokUsername = profile.socialMedia.tiktok;
        const [profileData, videosData] = await Promise.all([
          fetchTikTokProfile(tiktokUsername),
          fetchTikTokVideos(tiktokUsername)
        ]);

        console.log('[Analytics] TikTok data fetched:', {
          profile: profileData,
          videos: videosData
        });

        setProfile(profileData);
        setVideos(videosData);
      } catch (err) {
        console.error('[Analytics] Error fetching data:', err);
        setError('Failed to fetch TikTok data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 text-center">
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    );
  }

  const getMetricValue = (video: TikTokVideo, metric: 'views' | 'likes' | 'comments') => {
    switch (metric) {
      case 'views':
        return video.stats?.playCount ?? video.views ?? 0;
      case 'likes':
        return video.stats?.diggCount ?? video.likes ?? 0;
      case 'comments':
        return video.stats?.commentCount ?? video.comments ?? 0;
      default:
        return 0;
    }
  };

  const sortedVideos = [...videos].sort((a, b) => {
    const aValue = getMetricValue(a, selectedMetric);
    const bValue = getMetricValue(b, selectedMetric);
    return bValue - aValue;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          TikTok Analytics
        </h1>
        <p className="text-gray-400 mt-1">Track your TikTok performance and engagement</p>
      </div>
      
      {/* Profile Section */}
      {profile && (
        <Card className="p-6 bg-[#1a1a1a] border-[#333] mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#333] overflow-hidden">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={`@${profile.username}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl text-white">@{profile.username[0].toUpperCase()}</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">@{profile.username}</h1>
              <p className="text-gray-400">{profile.region}</p>
              {profile.verified && (
                <p className="mt-2 text-[#4CAF50]">Verified Account</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{profile.fans.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{profile.following.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{profile.heart.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Likes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{profile.video.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Videos</p>
            </div>
          </div>
        </Card>
      )}

      {/* Videos Section */}
      <Tabs defaultValue="ranking" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a] border border-[#333]">
          <TabsTrigger value="ranking" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Video Rankings</TabsTrigger>
          <TabsTrigger value="grid" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Video Grid</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking">
          <Card className="p-6 bg-[#1a1a1a] border-[#333]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Top Performing Videos</h2>
              <Select
                value={selectedMetric}
                onValueChange={(value: 'views' | 'likes' | 'comments') => setSelectedMetric(value)}
              >
                <SelectTrigger className="w-[180px] bg-[#333] border-[#444] text-white">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                  <SelectItem value="views">Views</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                  <SelectItem value="comments">Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {sortedVideos.slice(0, 5).map((video) => (
                <div key={video.id} className="flex items-center space-x-4 p-4 bg-[#333] rounded-lg">
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={video.thumbnail_url}
                      alt={video.caption}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium line-clamp-2 text-white">{video.caption}</p>
                    <p className="text-sm text-gray-400">
                      {video.publish_date ? new Date(video.publish_date).toLocaleDateString() : 'No date available'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {getMetricValue(video, selectedMetric).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <TikTokVideoPreview key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}