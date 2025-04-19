export interface TikTokProfile {
  username: string;
  verified: boolean;
  private_account: boolean;
  region: string;
  following: number;
  friends: number;
  fans: number;
  heart: number;
  video: number;
  avatar_url?: string;
}

export interface TikTokVideo {
  id: string;
  description?: string;
  caption?: string;
  createTime?: number;
  publish_date?: string;
  video?: {
    cover: string;
  };
  thumbnail_url?: string;
  video_url?: string;
  stats?: {
    playCount: number;
    diggCount: number;
    commentCount: number;
    shareCount: number;
  };
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchTikTokProfile(username: string): Promise<TikTokProfile> {
  console.log(`Fetching TikTok profile for: ${username}`);
  const response = await fetch(`/api/tiktok/profile?username=${encodeURIComponent(username)}`);
  return handleApiResponse<TikTokProfile>(response);
}

export async function fetchTikTokVideos(username: string): Promise<TikTokVideo[]> {
  console.log(`Fetching TikTok videos for: ${username}`);
  const response = await fetch(`/api/tiktok/videos?username=${encodeURIComponent(username)}`);
  return handleApiResponse<TikTokVideo[]>(response);
} 