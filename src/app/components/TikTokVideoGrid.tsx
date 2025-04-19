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
              src={video.video.cover}
              alt={video.description}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(video.createTime * 1000), { addSuffix: true })}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Views</p>
                <p className="font-semibold">{video.stats.playCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Likes</p>
                <p className="font-semibold">{video.stats.diggCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Comments</p>
                <p className="font-semibold">{video.stats.commentCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Shares</p>
                <p className="font-semibold">{video.stats.shareCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 