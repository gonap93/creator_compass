import { InstagramPost } from '@/lib/utils/instagramUtils';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface InstagramPostPreviewProps {
  post: InstagramPost;
}

export function InstagramPostPreview({ post }: InstagramPostPreviewProps) {
  const imageUrl = post.thumbnail_url || post.image_url;
  
  if (!imageUrl) {
    console.warn('No image URL found for Instagram post:', post.id);
  }

  return (
    <Card className="p-6 bg-[#1a1a1a] border-[#333]">
      <CardHeader className="p-0 mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.caption || `Instagram post ${post.id}`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">No img</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">@{post.username}</p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-square w-full mb-4">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.caption || `Instagram post ${post.id}`}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        <p className="text-white line-clamp-2">{post.caption}</p>
      </CardContent>
      <CardFooter className="p-0 mt-4 flex items-center">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{post.likes?.toLocaleString() || '0'} likes</span>
          <span>{post.comments?.toLocaleString() || '0'} comments</span>
        </div>
        {post.permalink && (
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto font-semibold text-[#4CAF50] text-sm hover:underline whitespace-nowrap flex flex-col items-center"
          >
            View on<br />Instagram
          </a>
        )}
      </CardFooter>
    </Card>
  );
} 