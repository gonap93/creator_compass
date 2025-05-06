import { NextRequest, NextResponse } from 'next/server';
import { makeApiRequest } from '@/lib/utils/apiUtils';
import { TikTokVideo } from '@/lib/utils/tiktokUtils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    console.log(`Scraping TikTok posts for username: ${username}`);
    const result = await makeApiRequest<TikTokVideo[]>(
      'tiktok/scrape-posts',
      'POST',
      { username }
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error.error },
        { status: result.error.status }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error parsing request:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
} 