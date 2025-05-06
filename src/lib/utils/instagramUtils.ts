export interface InstagramProfile {
  username: string;
  full_name: string;
  biography: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  avatar_url: string;
  is_private: boolean;
}

export interface InstagramPost {
  id: string;
  username: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  image_url: string;
  permalink: string;
  timestamp: string;
  likes: number;
  comments: number;
  thumbnail_url?: string;
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchInstagramProfile(username: string): Promise<InstagramProfile> {
  console.log(`Fetching Instagram profile for: ${username}`);
  const response = await fetch(`/api/instagram/profile?username=${encodeURIComponent(username)}`);
  return handleApiResponse<InstagramProfile>(response);
}


export async function fetchInstagramPosts(username: string): Promise<InstagramPost[]> {
  console.log(`Fetching Instagram posts for: ${username}`);
  const response = await fetch(`/api/instagram/posts?username=${encodeURIComponent(username)}`);
  return handleApiResponse<InstagramPost[]>(response);
} 