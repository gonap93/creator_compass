'use client';

import { useState, useMemo, ChangeEvent, useEffect, useCallback } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Users, UserPlus, Activity, Percent, ExternalLink } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { ProfileCard } from '@/app/components/ProfileCard';
import { TikTokProfile, TikTokVideo, fetchTikTokProfile, fetchTikTokVideos } from '@/lib/utils/tiktokUtils';
import { InstagramProfile, InstagramPost, fetchInstagramProfile, fetchInstagramPosts } from '@/lib/utils/instagramUtils';
import { Loader2 } from 'lucide-react';
import { TikTokVideoPreview } from '@/app/components/TikTokVideoPreview';
import { InstagramPostPreview } from '@/app/components/InstagramPostPreview';
import Image from 'next/image';

// Types
interface ChartData {
  id: string;
  er: number;
}

interface InteractionData {
  name: string;
  value: number;
}

interface ScatterDataPoint {
  x: number;
  y: number;
}

// Add AccountSnapshot type
interface AccountSnapshot {
  platform: 'instagram' | 'tiktok';
  username: string;
  followers: number;
  following: number;
  posts: (InstagramPost | TikTokVideo)[];
}

// Helper functions
const interactions = (p: InstagramPost | TikTokVideo) => (p.likes ?? 0) + (p.comments ?? 0) + ('shares' in p ? (p.shares ?? 0) : 0);
const erByFollowers = (p: InstagramPost | TikTokVideo, followers: number) => +(interactions(p) / followers * 100).toFixed(2);
const erByViews = (v: TikTokVideo) => v.stats?.playCount ? +(interactions(v) / v.stats.playCount * 100).toFixed(2) : null;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Helper for allowed sort keys
type SortableKey = 'id' | 'date' | 'likes' | 'comments' | 'shares' | 'views';

export default function CompetitorInsights() {
  const [platform, setPlatform] = useState<'instagram' | 'tiktok'>('instagram');
  const [username, setUsername] = useState('');
  const [data, setData] = useState<AccountSnapshot | null>(null);
  const [profile, setProfile] = useState<TikTokProfile | InstagramProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldLoadData, setShouldLoadData] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKey; direction: 'asc' | 'desc' }>({
    key: 'likes',
    direction: 'desc',
  });

  const handlePlatformChange = useCallback((value: 'instagram' | 'tiktok') => {
    setPlatform(value);
    setUsername('');
    setData(null);
    setProfile(null);
    setError(null);
    setShouldLoadData(false);
    sessionStorage.setItem('competitorPlatform', value);
    sessionStorage.removeItem('competitorUsername');
  }, []);

  const handleUsernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setShouldLoadData(false);
  }, []);

  const handleLoadData = useCallback(async () => {
    if (!username || loading) return;
    
    setLoading(true);
    setIsDataLoading(true);
    setError(null);

    try {
      // First try to fetch profile data from the API
      let profileData: TikTokProfile | InstagramProfile;
      try {
        if (platform === 'tiktok') {
          profileData = await fetchTikTokProfile(username);
        } else {
          profileData = await fetchInstagramProfile(username);
        }
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile from API, attempting to scrape:', error);
        // If API fails, try to scrape the data
        const response = await fetch(`/api/${platform}/scrape-posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        profileData = await response.json();
        setProfile(profileData);
      }
      
      // Fetch posts/videos data
      let postsData: (InstagramPost | TikTokVideo)[];
      if (platform === 'tiktok') {
        postsData = await fetchTikTokVideos(username);
      } else {
        postsData = await fetchInstagramPosts(username);
      }

      setData({
        platform,
        username,
        followers: 'fans' in profileData ? profileData.fans : profileData.followers_count,
        following: 'following' in profileData ? profileData.following : profileData.following_count,
        posts: postsData,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
      setIsDataLoading(false);
      setShouldLoadData(false);
      setIsInitialLoad(false);
    }
  }, [username, platform, loading]);

  // Load saved username and platform from session storage on component mount
  useEffect(() => {
    const savedUsername = sessionStorage.getItem('competitorUsername');
    const savedPlatform = sessionStorage.getItem('competitorPlatform') as 'instagram' | 'tiktok' | null;
    
    if (savedUsername) {
      setUsername(savedUsername);
    }
    
    if (savedPlatform) {
      setPlatform(savedPlatform);
    }

    // If we have both saved values, trigger data loading
    if (savedUsername && savedPlatform) {
      setShouldLoadData(true);
    } else {
      setIsInitialLoad(false);
    }
  }, []);

  // Save username to session storage when it changes
  useEffect(() => {
    if (username && !isInitialLoad) {
      sessionStorage.setItem('competitorUsername', username);
    }
  }, [username, isInitialLoad]);

  // Load data when shouldLoadData is true
  useEffect(() => {
    if (shouldLoadData && username && platform && !loading) {
      handleLoadData();
    }
  }, [shouldLoadData, username, platform, handleLoadData, loading]);

  const handleSort = (key: SortableKey) => {
    if (key === 'views' && data?.platform !== 'tiktok') return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedPosts = useMemo(() => {
    if (!data?.posts) return data?.posts || [];
    return [...data.posts].sort((a: InstagramPost | TikTokVideo, b: InstagramPost | TikTokVideo) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;

      if (data.platform === 'tiktok') {
        const videoA = a as TikTokVideo;
        const videoB = b as TikTokVideo;
        if (sortConfig.key === 'views') {
          aValue = videoA.stats?.playCount ?? videoA.views ?? 0;
          bValue = videoB.stats?.playCount ?? videoB.views ?? 0;
        } else {
          aValue = videoA[sortConfig.key as keyof TikTokVideo] as number;
          bValue = videoB[sortConfig.key as keyof TikTokVideo] as number;
        }
      } else {
        const postA = a as InstagramPost;
        const postB = b as InstagramPost;
        aValue = postA[sortConfig.key as keyof InstagramPost] as number;
        bValue = postB[sortConfig.key as keyof InstagramPost] as number;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data?.posts, sortConfig, data?.platform]);

  const topPostsByER = useMemo<ChartData[]>(() => {
    if (!data) return [];
    return data.posts
      .map((post: InstagramPost | TikTokVideo) => ({
        id: post.id,
        er: erByFollowers(post, data.followers)
      }))
      .sort((a: ChartData, b: ChartData) => b.er - a.er)
      .slice(0, 10);
  }, [data]);

  const interactionData = useMemo<InteractionData[]>(() => {
    if (!data) return [];
    const totalInteractions = data.posts.reduce((sum: number, post: InstagramPost | TikTokVideo) => sum + interactions(post), 0);
    return [
      { name: 'Likes', value: data.posts.reduce((sum: number, post: InstagramPost | TikTokVideo) => sum + (post.likes ?? 0), 0) / totalInteractions * 100 },
      { name: 'Comments', value: data.posts.reduce((sum: number, post: InstagramPost | TikTokVideo) => sum + (post.comments ?? 0), 0) / totalInteractions * 100 },
      { name: 'Shares', value: data.posts.reduce((sum: number, post: InstagramPost | TikTokVideo) => sum + ('shares' in post ? (post.shares ?? 0) : 0), 0) / totalInteractions * 100 }
    ];
  }, [data]);

  const scatterData = useMemo<ScatterDataPoint[]>(() => {
    if (!data || data.platform !== 'tiktok') return [];
    return data.posts.map((post: InstagramPost | TikTokVideo) => {
      const video = post as TikTokVideo;
      return {
        x: video.stats?.playCount ?? video.views ?? 0,
        y: erByViews(video) || 0
      };
    });
  }, [data]);

  const quickInsights = useMemo(() => {
    if (!data) return [];
    const insights: string[] = [];
    const maxERPost = data.posts.reduce((max: { post: InstagramPost | TikTokVideo; er: number }, post: InstagramPost | TikTokVideo) => {
      const er = erByFollowers(post, data.followers);
      return er > max.er ? { post, er } : max;
    }, { post: data.posts[0], er: 0 });
    const totalInteractions = data.posts.reduce((sum: number, post: InstagramPost | TikTokVideo) => sum + interactions(post), 0);
    const maxPostInteractions = interactions(maxERPost.post);
    const percentage = ((maxPostInteractions / totalInteractions) * 100).toFixed(1);
    insights.push(`Post #${maxERPost.post.id} has the highest engagement rate at ${maxERPost.er}%`);
    insights.push(`This post captures ${percentage}% of all interactions`);
    return insights;
  }, [data]);

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Loading {platform === 'tiktok' ? 'TikTok' : 'Instagram'} account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background p-4 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={platform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={username}
            onChange={handleUsernameChange}
            className="flex-1"
            placeholder="Enter username"
          />
          <Button onClick={() => setShouldLoadData(true)} disabled={loading || !username}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load data'}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-500/10 border-red-500/20">
          <p className="text-red-500">{error}</p>
        </Card>
      )}

      {/* Profile Card */}
      <ProfileCard 
        profile={profile} 
        platform={platform === 'tiktok' ? 'TikTok' : 'Instagram'} 
        loading={loading} 
      />

      {data && (
        <>
          {/* Tabs */}
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="w-full flex mb-4">
              <TabsTrigger value="account" className="flex-1">Account Insights</TabsTrigger>
              <TabsTrigger value="rankings" className="flex-1">Video Rankings</TabsTrigger>
              <TabsTrigger value="grid" className="flex-1">Video Grid</TabsTrigger>
            </TabsList>

            {/* Account Insights Tab */}
            <TabsContent value="account">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="text-2xl font-bold">{(data.followers ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Following</p>
                      <p className="text-2xl font-bold">{(data.following ?? 0).toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Follower/Following Ratio</p>
                      <p className="text-2xl font-bold">{(data.followers / data.following).toFixed(1)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Engagement Rate</p>
                      <p className="text-2xl font-bold">
                        {(data.posts.reduce((sum, post) => sum + erByFollowers(post, data.followers), 0) / data.posts.length).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Top 10 Posts by Engagement Rate</h3>
                  <BarChart width={800} height={300} data={topPostsByER}>
                    <XAxis dataKey="id" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Engagement Rate']} />
                    <Bar dataKey="er" fill="#8884d8" />
                  </BarChart>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Interaction Split</h3>
                  <PieChart width={800} height={300}>
                    <Pie
                      data={interactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {interactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </Card>

                {data.platform === 'tiktok' && (
                  <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Views vs Engagement Rate</h3>
                    <ScatterChart width={800} height={300}>
                      <XAxis type="number" dataKey="x" name="views" />
                      <YAxis type="number" dataKey="y" name="er" />
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Engagement Rate']} />
                      <Scatter data={scatterData} fill="#8884d8" />
                    </ScatterChart>
                  </Card>
                )}
              </div>

              {/* Quick Insights */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {quickInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </Card>
            </TabsContent>

            {/* Video Rankings Tab */}
            <TabsContent value="rankings">
              <Card className="p-6 bg-[#1a1a1a] border-[#333]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Top Performing {platform === 'tiktok' ? 'Videos' : 'Posts'}</h2>
                  <Select
                    value={sortConfig.key === 'likes' ? 'likes' : 'comments'}
                    onValueChange={(value: 'likes' | 'comments') => handleSort(value as SortableKey)}
                  >
                    <SelectTrigger className="w-[180px] bg-[#333] border-[#444] text-white">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-[#333] text-white">
                      <SelectItem value="likes">Likes</SelectItem>
                      <SelectItem value="comments">Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  {sortedPosts.slice(0, 5).map((post) => (
                    platform === 'tiktok' ? (
                      <div key={post.id} className="flex items-center space-x-4 p-4 bg-[#333] rounded-lg">
                        <div className="w-12 h-12 relative flex-shrink-0">
                          {((post as TikTokVideo).thumbnail_url || (post as TikTokVideo).video?.cover) ? (
                            <Image
                              src={(post as TikTokVideo).thumbnail_url || (post as TikTokVideo).video?.cover || ''}
                              alt={(post as TikTokVideo).caption || 'TikTok video'}
                              fill
                              className="object-cover rounded"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium line-clamp-2 text-white">{(post as TikTokVideo).caption}</p>
                          <p className="text-sm text-gray-400">
                            {(() => {
                              const publishDate = (post as TikTokVideo).publish_date;
                              return publishDate ? new Date(publishDate).toLocaleDateString() : 'No date available';
                            })()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            {sortConfig.key === 'likes'
                              ? ((post as TikTokVideo).stats?.diggCount || (post as TikTokVideo).likes || 0).toLocaleString()
                              : ((post as TikTokVideo).stats?.commentCount || (post as TikTokVideo).comments || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            {sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div key={post.id} className="flex items-center space-x-4 p-4 bg-[#333] rounded-lg">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          {((post as InstagramPost).thumbnail_url || (post as InstagramPost).image_url) ? (
                            <Image
                              src={(post as InstagramPost).thumbnail_url || (post as InstagramPost).image_url || ''}
                              alt={(post as InstagramPost).caption || `Instagram post ${(post as InstagramPost).id}`}
                              fill
                              className="object-cover rounded"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium line-clamp-2 text-white">{(post as InstagramPost).caption}</p>
                          <p className="text-sm text-gray-400">
                            {typeof (post as InstagramPost).timestamp === 'string' && (post as InstagramPost).timestamp
                              ? new Date((post as InstagramPost).timestamp ? (post as InstagramPost).timestamp : '').toLocaleDateString()
                              : 'No date available'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">
                            {sortConfig.key === 'likes'
                              ? ((post as InstagramPost).likes || 0).toLocaleString()
                              : ((post as InstagramPost).comments || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            {sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}
                          </p>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Video Grid Tab */}
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platform === 'tiktok'
                  ? data.posts.map((post) => <TikTokVideoPreview key={post.id} video={post as TikTokVideo} />)
                  : data.posts.map((post) => <InstagramPostPreview key={post.id} post={post as InstagramPost} />)
                }
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 