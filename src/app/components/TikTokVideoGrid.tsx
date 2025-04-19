import { TikTokVideo } from '@/lib/utils/tiktokUtils';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface TikTokVideoGridProps {
  videos: TikTokVideo[];
}

export function TikTokVideoGrid({ videos }: TikTokVideoGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id} className="p-4">
          <div className="aspect-video relative mb-4">
            <img
              src={video.video?.cover || video.thumbnail_url || ''}
              alt={video.description || 'TikTok video'}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 line-clamp-2">{video.description || video.caption || 'No description'}</p>
            <p className="text-xs text-gray-500">
              {video.createTime 
                ? formatDistanceToNow(new Date(video.createTime * 1000), { addSuffix: true })
                : video.publish_date 
                  ? formatDistanceToNow(new Date(video.publish_date), { addSuffix: true })
                  : 'No date available'
              }
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Views</p>
                <p className="font-semibold">{(video.stats?.playCount || video.views || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Likes</p>
                <p className="font-semibold">{(video.stats?.diggCount || video.likes || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Comments</p>
                <p className="font-semibold">{(video.stats?.commentCount || video.comments || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Shares</p>
                <p className="font-semibold">{(video.stats?.shareCount || video.shares || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 