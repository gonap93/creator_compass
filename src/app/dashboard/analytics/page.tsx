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
import { PlatformSelector } from '@/app/components/PlatformSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { InstagramProfile, InstagramPost, fetchInstagramProfile, fetchInstagramPosts } from '@/lib/utils/instagramUtils';
import { InstagramPostPreview } from '@/app/components/InstagramPostPreview';
import Image from 'next/image';

type Platform = 'TikTok' | 'Instagram';

const isTikTokVideo = (item: any): item is TikTokVideo => {
  return 'publish_date' in item;
};

const isInstagramPost = (item: any): item is InstagramPost => {
  return 'timestamp' in item;
};

const getMetricValue = (item: TikTokVideo | InstagramPost, metric: 'views' | 'likes' | 'comments'): number => {
  if ('stats' in item || 'views' in item) { // TikTokVideo
    const video = item as TikTokVideo;
    switch (metric) {
      case 'views':
        return video.stats?.playCount || video.views || 0;
      case 'likes':
        return video.stats?.diggCount || video.likes || 0;
      case 'comments':
        return video.stats?.commentCount || video.comments || 0;
      default:
        return 0;
    }
  } else { // InstagramPost
    const post = item as InstagramPost;
    switch (metric) {
      case 'views':
        return 0; // Instagram doesn't have views
      case 'likes':
        return post.likes;
      case 'comments':
        return post.comments;
      default:
        return 0;
    }
  }
};

// Animation variants for content transitions
const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 20 : -20,
    opacity: 0
  })
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return 'No date available';
  }
};

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('TikTok');
  const [profile, setProfile] = useState<TikTokProfile | InstagramProfile | null>(null);
  const [tiktokVideos, setTiktokVideos] = useState<TikTokVideo[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'likes' | 'comments'>('views');
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [direction, setDirection] = useState(0);

  // Handle platform change with direction
  const handlePlatformChange = (newPlatform: Platform) => {
    const isMovingToTikTok = newPlatform === 'TikTok' && selectedPlatform === 'Instagram';
    setDirection(isMovingToTikTok ? -1 : 1);
    setSelectedPlatform(newPlatform);
    setLoading(true); // Set loading state when changing platforms
    setProfile(null); // Reset profile when changing platforms
    setTiktokVideos([]); // Reset TikTok videos when changing platforms
    setInstagramPosts([]); // Reset Instagram posts when changing platforms
  };

  const sortedVideos = [...tiktokVideos].sort((a, b) => {
    const aValue = getMetricValue(a, selectedMetric);
    const bValue = getMetricValue(b, selectedMetric);
    return bValue - aValue;
  });

  useEffect(() => {
    let isMounted = true;
    console.log('[Analytics] Auth state:', { user, authLoading });
    
    const fetchData = async () => {
      if (authLoading) {
        console.log('[Analytics] Still loading auth state...');
        return;
      }

      if (!user) {
        console.log('[Analytics] No user found, showing sign in message');
        if (isMounted) {
          setError('Please sign in to view your analytics');
          setLoading(false);
        }
        return;
      }

      console.log('[Analytics] User authenticated:', user.uid);

      try {
        const profile = await getUserProfile(user.uid);
        console.log('[Analytics] User profile:', profile);
        if (!isMounted) return;
        
        setUserProfile(profile);
        setError(null);
        
        if (selectedPlatform === 'TikTok') {
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

          if (!isMounted) return;

          console.log('[Analytics] TikTok data fetched:', {
            profile: profileData,
            videos: videosData
          });

          setProfile(profileData);
          setTiktokVideos(videosData as TikTokVideo[]);
        } else if (selectedPlatform === 'Instagram') {
          if (!profile?.socialMedia?.instagram) {
            console.log('[Analytics] No Instagram account connected');
            setError('Please connect your Instagram account in the profile page');
            setLoading(false);
            return;
          }

          console.log('[Analytics] Found Instagram username:', profile.socialMedia.instagram);

          // Fetch Instagram data
          const instagramUsername = profile.socialMedia.instagram;
          console.log('[Analytics] Fetching Instagram data for:', instagramUsername);
          
          const [profileData, postsData] = await Promise.all([
            fetchInstagramProfile(instagramUsername),
            fetchInstagramPosts(instagramUsername)
          ]);

          if (!isMounted) return;

          console.log('[Analytics] Instagram data fetched:', {
            profile: profileData,
            posts: postsData
          });

          // Log each post's image URLs
          postsData.forEach((post, index) => {
            console.log(`[Analytics] Post ${index + 1} image URLs:`, {
              id: post.id,
              username: post.username,
              image_url: post.image_url,
              thumbnail_url: post.thumbnail_url,
              media_type: post.media_type
            });
          });

          setProfile(profileData);
          setInstagramPosts(postsData as InstagramPost[]);
        }
      } catch (err) {
        console.error('[Analytics] Error fetching data:', err);
        if (isMounted) {
          setError(`Failed to fetch ${selectedPlatform} data. Please try again later.`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, selectedPlatform]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Fixed Header with Platform Selector */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a] backdrop-blur-sm mb-8 -mx-4 px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            key={selectedPlatform}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-4xl font-bold">
              {selectedPlatform} Analytics
            </h1>
            <p className="text-gray-400 mt-1">Track your {selectedPlatform} performance and engagement</p>
          </motion.div>
          <PlatformSelector 
            selectedPlatform={selectedPlatform}
            onPlatformChange={handlePlatformChange}
          />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            >
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </motion.div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 bg-[#1a1a1a] border-[#333] mb-6">
                <p className="text-red-500">{error}</p>
              </Card>
            </motion.div>
          )}

          {/* Platform Content */}
          <motion.div
            key={selectedPlatform}
            custom={direction}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {selectedPlatform === 'TikTok' && profile && !loading && (
              <div className="space-y-6">
                {/* Profile Section */}
                <Card className="p-6 bg-[#1a1a1a] border-[#333]">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-[#333] overflow-hidden relative">
                      {profile.avatar_url ? (
                        <Image 
                          src={profile.avatar_url} 
                          alt={`@${profile.username}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl text-white">@{profile.username[0].toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">@{profile.username}</h1>
                      {'region' in profile && (
                        <p className="text-gray-400">{profile.region}</p>
                      )}
                      {'full_name' in profile && (
                        <p className="text-gray-400">{profile.full_name}</p>
                      )}
                      {'biography' in profile && (
                        <p className="mt-2 text-gray-400 line-clamp-2">{profile.biography}</p>
                      )}
                      {'verified' in profile && profile.verified && (
                        <p className="mt-2 text-[#4CAF50]">Verified Account</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {('fans' in profile ? profile.fans : profile.followers_count).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {('following' in profile ? profile.following : profile.following_count).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {('heart' in profile ? profile.heart.toLocaleString() : profile.posts_count.toLocaleString())}
                      </p>
                      <p className="text-sm text-gray-400">{'heart' in profile ? 'Likes' : 'Posts'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {('video' in profile ? profile.video.toLocaleString() : 
                          ('is_private' in profile ? (profile.is_private ? 'Private' : 'Public') : 'N/A'))}
                      </p>
                      <p className="text-sm text-gray-400">{'video' in profile ? 'Videos' : 'Account'}</p>
                    </div>
                  </div>
                </Card>

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
                                {(() => {
                                  if ('publish_date' in video && video.publish_date) {
                                    return new Date(video.publish_date).toLocaleDateString();
                                  } else if ('timestamp' in video && typeof video.timestamp === 'string') {
                                    return new Date(video.timestamp).toLocaleDateString();
                                  }
                                  return 'No date available';
                                })()}
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
                      {tiktokVideos.map((video) => (
                        <TikTokVideoPreview key={video.id} video={video} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {selectedPlatform === 'Instagram' && profile && !loading && (
              <div className="space-y-6">
                {/* Profile Section */}
                <Card className="p-6 bg-[#1a1a1a] border-[#333]">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-[#333] overflow-hidden relative">
                      {profile.avatar_url ? (
                        <Image 
                          src={profile.avatar_url} 
                          alt={`@${profile.username}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl text-white">@{profile.username[0].toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">@{profile.username}</h1>
                      <p className="text-gray-400">{(profile as InstagramProfile).full_name}</p>
                      <p className="mt-2 text-gray-400 line-clamp-2">{(profile as InstagramProfile).biography}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile ? (profile as InstagramProfile).followers_count.toLocaleString() : '0'}</p>
                      <p className="text-sm text-gray-400">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile ? (profile as InstagramProfile).following_count.toLocaleString() : '0'}</p>
                      <p className="text-sm text-gray-400">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile ? (profile as InstagramProfile).posts_count.toLocaleString() : '0'}</p>
                      <p className="text-sm text-gray-400">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{profile ? ((profile as InstagramProfile).is_private ? 'Private' : 'Public') : 'N/A'}</p>
                      <p className="text-sm text-gray-400">Account</p>
                    </div>
                  </div>
                </Card>

                {/* Posts Section */}
                <Tabs defaultValue="ranking" className="w-full space-y-6">
                  <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a] border border-[#333]">
                    <TabsTrigger value="ranking" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Post Rankings</TabsTrigger>
                    <TabsTrigger value="grid" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">Post Grid</TabsTrigger>
                  </TabsList>

                  <TabsContent value="ranking">
                    <Card className="p-6 bg-[#1a1a1a] border-[#333]">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-white">Top Performing Posts</h2>
                        <Select
                          value={selectedMetric}
                          onValueChange={(value: 'views' | 'likes' | 'comments') => setSelectedMetric(value)}
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
                        {selectedPlatform === 'Instagram' && instagramPosts.slice(0, 5).map((post: InstagramPost) => {
                          console.log('Instagram post data:', post);
                          const imageUrl = post.thumbnail_url || post.image_url;
                          console.log('Using image URL:', imageUrl);
                          
                          return (
                          <div key={post.id} className="flex items-center space-x-4 p-4 bg-[#333] rounded-lg">
                            <div className="w-16 h-16 relative flex-shrink-0">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={post.caption || `Instagram post ${post.id}`}
                                  fill
                                  className="object-cover rounded"
                                  sizes="64px"
                                  priority
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium line-clamp-2 text-white">{post.caption}</p>
                              <p className="text-sm text-gray-400">
                                {post?.timestamp ? formatDate(post.timestamp) : 'No date available'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-white">
                                {selectedMetric === 'likes' 
                                  ? (post.likes || 0).toLocaleString()
                                  : (post.comments || 0).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-400">
                                {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {instagramPosts.map((post) => (
                        <InstagramPostPreview key={post.id} post={post} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}