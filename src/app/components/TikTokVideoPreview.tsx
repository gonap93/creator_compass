import { useState } from 'react';
import { TikTokVideo } from '@/lib/utils/tiktokUtils';
import { Card } from '@/app/components/ui/card';
import { Play } from 'lucide-react';

interface TikTokVideoPreviewProps {
  video: TikTokVideo;
}

export function TikTokVideoPreview({ video }: TikTokVideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from the URL
  const getVideoId = (url: string) => {
    const matches = url.match(/video\/(\d+)/);
    return matches ? matches[1] : null;
  };

  const videoId = getVideoId(video.video_url);

  return (
    <Card className="overflow-hidden bg-[#1a1a1a] border-[#333]">
      <div className="relative w-full" style={{ paddingTop: '177.77%' }}> {/* 9:16 aspect ratio (177.77% = 16/9 * 100) */}
        {isPlaying ? (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${videoId}?autoplay=1`}
            className="absolute top-0 left-0 w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full group">
            <img
              src={video.thumbnail_url}
              alt={video.caption}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Play className="w-12 h-12 text-white" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-medium line-clamp-2 mb-2 text-white">{video.caption}</p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center">
            <p className="font-bold text-white">{video.views.toLocaleString()}</p>
            <p className="text-gray-400">Views</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-white">{video.likes.toLocaleString()}</p>
            <p className="text-gray-400">Likes</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-white">{video.comments.toLocaleString()}</p>
            <p className="text-gray-400">Comments</p>
          </div>
        </div>
      </div>
    </Card>
  );
} 