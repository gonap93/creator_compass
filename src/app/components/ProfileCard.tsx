import { Card } from '@/app/components/ui/card';
import Image from 'next/image';
import { TikTokProfile } from '@/lib/utils/tiktokUtils';
import { InstagramProfile } from '@/lib/utils/instagramUtils';

interface ProfileCardProps {
  profile: TikTokProfile | InstagramProfile | null;
  platform: 'TikTok' | 'Instagram';
  loading?: boolean;
}

export function ProfileCard({ profile, platform, loading = false }: ProfileCardProps) {
  if (loading || !profile) {
    return (
      <Card className="p-6 bg-[#1a1a1a] border-[#333]">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-[#333] animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-[#333] rounded animate-pulse" />
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 w-16 bg-[#333] rounded animate-pulse mx-auto" />
              <div className="h-4 w-16 bg-[#333] rounded animate-pulse mx-auto mt-2" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
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
            {('fans' in profile ? profile.fans : profile.followers_count || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {('following' in profile ? profile.following : profile.following_count || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">Following</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {('heart' in profile ? (profile.heart || 0) : (profile.posts_count || 0)).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">{'heart' in profile ? 'Likes' : 'Posts'}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {('video' in profile ? (profile.video || 0).toLocaleString() : 
              ('is_private' in profile ? (profile.is_private ? 'Private' : 'Public') : 'N/A'))}
          </p>
          <p className="text-sm text-gray-400">{'video' in profile ? 'Videos' : 'Account'}</p>
        </div>
      </div>
    </Card>
  );
} 